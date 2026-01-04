import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const BASE_PATH = "/make-server-94f26792";

// Get Mapbox token from environment (server-side only for API calls)
const getMapboxToken = (): string => {
  const token = Deno.env.get('NEXT_PUBLIC_MAPBOX_TOKEN');
  if (!token) {
    console.error('⚠️ NEXT_PUBLIC_MAPBOX_TOKEN not found in environment variables');
    throw new Error('Mapbox token not configured');
  }
  return token;
};

// Health check endpoint
app.get(`${BASE_PATH}/health`, (c) => {
  return c.json({ status: "ok" });
});

// ================= CONFIG API =================
app.get(`${BASE_PATH}/config`, (c) => {
  try {
    const token = getMapboxToken();
    return c.json({
      mapboxToken: token,
    });
  } catch (error) {
    console.error('Config endpoint error:', error);
    return c.json({ error: 'Mapbox token not configured' }, 500);
  }
});

// ================= MAPBOX INTEGRATION APIs =================

// Calculate distance and duration between two points using Mapbox Directions API
app.post(`${BASE_PATH}/api/calculate-distance`, async (c) => {
  try {
    const { origin, destination } = await c.req.json();
    
    if (!origin?.lng || !origin?.lat || !destination?.lng || !destination?.lat) {
      return c.json({ error: 'Invalid coordinates provided' }, 400);
    }

    const token = getMapboxToken();
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${token}&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return c.json({ error: 'No route found' }, 404);
    }

    const route = data.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    // Convert to miles and minutes
    const distanceMiles = distanceMeters * 0.000621371;
    const durationMinutes = durationSeconds / 60;

    return c.json({
      success: true,
      distanceMiles: parseFloat(distanceMiles.toFixed(1)),
      durationMinutes: Math.round(durationMinutes),
      geometry: route.geometry,
    });

  } catch (error) {
    console.error('Error calculating distance:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Calculate journey estimate (multi-stop route optimization)
app.post(`${BASE_PATH}/api/journey/estimate`, async (c) => {
  try {
    const { waypoints } = await c.req.json();
    
    if (!waypoints || waypoints.length < 2) {
      return c.json({ error: 'At least 2 waypoints required' }, 400);
    }

    const token = getMapboxToken();
    
    // Build coordinates string
    const coords = waypoints.map((wp: any) => `${wp.lng},${wp.lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${token}&geometries=geojson&overview=full`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return c.json({ error: 'No route found' }, 404);
    }

    const route = data.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    // Convert to miles and minutes
    const distanceMiles = distanceMeters * 0.000621371;
    const durationMinutes = durationSeconds / 60;

    return c.json({
      success: true,
      totalDistanceMiles: parseFloat(distanceMiles.toFixed(1)),
      totalDurationMinutes: Math.round(durationMinutes),
      geometry: route.geometry,
      legs: route.legs.map((leg: any) => ({
        distanceMiles: parseFloat((leg.distance * 0.000621371).toFixed(1)),
        durationMinutes: Math.round(leg.duration / 60),
      })),
    });

  } catch (error) {
    console.error('Error calculating journey estimate:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Driver allocation logic - find nearest available driver
app.post(`${BASE_PATH}/api/allocate-driver`, async (c) => {
  try {
    const { jobLocation, availableDrivers } = await c.req.json();
    
    if (!jobLocation?.lng || !jobLocation?.lat) {
      return c.json({ error: 'Invalid job location' }, 400);
    }

    if (!availableDrivers || availableDrivers.length === 0) {
      return c.json({ error: 'No available drivers' }, 404);
    }

    const token = getMapboxToken();
    
    // Use Mapbox Matrix API to calculate distances from all drivers to job
    const allPoints = [jobLocation, ...availableDrivers.map((d: any) => ({ lng: d.lng, lat: d.lat }))];
    const coords = allPoints.map(p => `${p.lng},${p.lat}`).join(';');
    
    // Source is job (index 0), destinations are drivers (indices 1+)
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?sources=0&annotations=distance,duration&access_token=${token}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.durations || !data.durations[0]) {
      return c.json({ error: 'Could not calculate driver distances' }, 500);
    }

    // Find nearest driver
    const durations = data.durations[0]; // First row (from job to all drivers)
    const distances = data.distances[0];
    
    let nearestDriverIndex = -1;
    let minDuration = Infinity;
    
    for (let i = 1; i < durations.length; i++) { // Skip index 0 (job to itself)
      if (durations[i] < minDuration) {
        minDuration = durations[i];
        nearestDriverIndex = i - 1; // Adjust for driver array index
      }
    }

    if (nearestDriverIndex === -1) {
      return c.json({ error: 'No suitable driver found' }, 404);
    }

    const nearestDriver = availableDrivers[nearestDriverIndex];
    const etaMinutes = Math.round(durations[nearestDriverIndex + 1] / 60);
    const distanceMiles = parseFloat((distances[nearestDriverIndex + 1] * 0.000621371).toFixed(1));

    return c.json({
      success: true,
      driver: nearestDriver,
      etaMinutes,
      distanceMiles,
    });

  } catch (error) {
    console.error('Error allocating driver:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ================= JOBS API =================

// GET all jobs
app.get(`${BASE_PATH}/jobs`, async (c) => {
  try {
    const jobs = await kv.getByPrefix('job:');
    // Also fetch interests to merge? 
    // For now, let's keep interests separate or embedded. 
    // Embedded is easier: Job has 'interestedDrivers' array.
    return c.json(jobs);
  } catch (e) {
    console.error("Error fetching jobs:", e);
    return c.json({ error: e.message }, 500);
  }
});

// CREATE a job
app.post(`${BASE_PATH}/jobs`, async (c) => {
  try {
    const job = await c.req.json();
    if (!job.id) return c.json({ error: 'Job ID missing' }, 400);
    
    // Save to KV
    await kv.set(`job:${job.id}`, job);
    return c.json({ success: true, job });
  } catch (e) {
    console.error("Error creating job:", e);
    return c.json({ error: e.message }, 500);
  }
});

// UPDATE a job (partial update)
app.put(`${BASE_PATH}/jobs/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    // Get existing to merge
    const existing = await kv.get(`job:${id}`);
    if (!existing) {
      return c.json({ error: 'Job not found' }, 404);
    }

    const updatedJob = { ...existing, ...updates };
    await kv.set(`job:${id}`, updatedJob);
    
    return c.json({ success: true, job: updatedJob });
  } catch (e) {
    console.error("Error updating job:", e);
    return c.json({ error: e.message }, 500);
  }
});

// DELETE a job
app.delete(`${BASE_PATH}/jobs/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`job:${id}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ================= SMS NOTIFICATIONS (TWILIO) =================

app.post(`${BASE_PATH}/send-sms`, async (c) => {
  try {
    const { to, message } = await c.req.json();
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
      return c.json({ success: true, mock: true, warning: "Twilio credentials missing" });
    }

    // Call Twilio API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'To': to,
          'From': fromNumber,
          'Body': message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio Error:", errorText);
      throw new Error(`Twilio API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json({ success: true, sid: data.sid });

  } catch (e) {
    console.error("Error sending SMS:", e);
    return c.json({ error: e.message }, 500);
  }
});

// ================= INTERESTS API =================
// Manage driver interests separately or as part of job.
// Let's support a separate endpoint for cleaner separation if needed, 
// but modifying the job object is often atomic and safer.
// For now, we assume the frontend updates the job object to include interests.

Deno.serve(app.fetch);