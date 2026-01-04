import { projectId, publicAnonKey } from './supabase/info';
import { MAPBOX_PUBLIC_TOKEN } from './mapboxConfig';

/**
 * Fetch system configuration from backend
 * Returns Mapbox token for map rendering (client-side usage only)
 * Note: Business logic (distance calculations, routing) should use backend APIs
 */
export const fetchSystemConfig = async () => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-94f26792/config`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`Backend config endpoint returned status ${response.status}, using fallback token for map rendering`);
      return { mapboxToken: MAPBOX_PUBLIC_TOKEN };
    }
    
    const data = await response.json();
    console.log('✅ Successfully fetched config from backend');
    return data;
  } catch (error) {
    console.warn('Backend config endpoint not available, using fallback token for map rendering');
    return { mapboxToken: MAPBOX_PUBLIC_TOKEN };
  }
};