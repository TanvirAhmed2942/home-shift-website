/**
 * Weather Integration & Alerts System
 * Real-time weather API, adverse conditions warnings, rescheduling, weather-based pricing
 */

export interface WeatherData {
  location: string;
  temperature: number; // Celsius
  feelsLike: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'snow' | 'storm' | 'fog';
  description: string;
  humidity: number; // Percentage
  windSpeed: number; // km/h
  visibility: number; // km
  precipitation: number; // mm
  uvIndex: number;
  timestamp: Date;
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  condition: string;
  description: string;
  startTime: Date;
  endTime: Date;
  affectedAreas: string[];
  recommendations: string[];
}

export interface WeatherImpactAssessment {
  jobId: string;
  scheduledDate: Date;
  pickupLocation: string;
  deliveryLocation: string;
  weather: WeatherData;
  alerts: WeatherAlert[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  canProceed: boolean;
  recommendations: string[];
  suggestedReschedule?: Date[];
  pricingAdjustment: number; // Percentage
}

/**
 * Fetch weather data (integrate with OpenWeatherMap, WeatherAPI, etc.)
 */
export async function fetchWeatherData(location: string, date?: Date): Promise<WeatherData> {
  // Mock implementation - in production, call actual weather API
  // Example: OpenWeatherMap API, WeatherAPI.com, etc.
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock data (replace with actual API call)
  const conditions: WeatherData['condition'][] = ['clear', 'cloudy', 'rain', 'heavy_rain', 'snow', 'storm', 'fog'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    location,
    temperature: 15 + Math.random() * 15,
    feelsLike: 15 + Math.random() * 15,
    condition: randomCondition,
    description: getConditionDescription(randomCondition),
    humidity: 40 + Math.random() * 40,
    windSpeed: 5 + Math.random() * 25,
    visibility: 5 + Math.random() * 15,
    precipitation: randomCondition.includes('rain') ? Math.random() * 20 : 0,
    uvIndex: Math.floor(Math.random() * 11),
    timestamp: date || new Date(),
  };
}

/**
 * Get condition description
 */
function getConditionDescription(condition: WeatherData['condition']): string {
  const descriptions: Record<WeatherData['condition'], string> = {
    clear: 'Clear skies',
    cloudy: 'Partly cloudy',
    rain: 'Light rain',
    heavy_rain: 'Heavy rain',
    snow: 'Snowing',
    storm: 'Thunderstorm',
    fog: 'Foggy conditions',
  };
  return descriptions[condition];
}

/**
 * Check for weather alerts
 */
export async function checkWeatherAlerts(location: string, date: Date): Promise<WeatherAlert[]> {
  // Mock implementation - in production, call actual weather alert API
  const weatherData = await fetchWeatherData(location, date);
  const alerts: WeatherAlert[] = [];
  
  // Generate alerts based on conditions
  if (weatherData.condition === 'heavy_rain' || weatherData.condition === 'storm') {
    alerts.push({
      id: `alert-${Date.now()}`,
      type: 'warning',
      severity: 'high',
      condition: 'Heavy Rain',
      description: 'Heavy rainfall expected. Road conditions may be hazardous.',
      startTime: date,
      endTime: new Date(date.getTime() + 6 * 60 * 60 * 1000),
      affectedAreas: [location],
      recommendations: [
        'Drive with extra caution',
        'Allow extra time for travel',
        'Ensure all items are waterproof covered',
        'Consider rescheduling if possible',
      ],
    });
  }
  
  if (weatherData.condition === 'snow') {
    alerts.push({
      id: `alert-${Date.now()}-2`,
      type: 'warning',
      severity: 'extreme',
      condition: 'Snow',
      description: 'Snowfall expected. Roads may be icy and dangerous.',
      startTime: date,
      endTime: new Date(date.getTime() + 12 * 60 * 60 * 1000),
      affectedAreas: [location],
      recommendations: [
        'Strongly consider rescheduling',
        'Ensure vehicle has winter tires',
        'Carry emergency supplies',
        'Monitor weather updates',
      ],
    });
  }
  
  if (weatherData.windSpeed > 50) {
    alerts.push({
      id: `alert-${Date.now()}-3`,
      type: 'advisory',
      severity: 'moderate',
      condition: 'High Winds',
      description: 'Strong winds expected. Driving large vehicles may be difficult.',
      startTime: date,
      endTime: new Date(date.getTime() + 4 * 60 * 60 * 1000),
      affectedAreas: [location],
      recommendations: [
        'Secure all items properly',
        'Drive carefully, especially with large vans',
        'Avoid exposed routes if possible',
      ],
    });
  }
  
  return alerts;
}

/**
 * Assess weather impact on job
 */
export async function assessWeatherImpact(
  jobId: string,
  scheduledDate: Date,
  pickupLocation: string,
  deliveryLocation: string
): Promise<WeatherImpactAssessment> {
  // Fetch weather for both locations
  const [pickupWeather, deliveryWeather] = await Promise.all([
    fetchWeatherData(pickupLocation, scheduledDate),
    fetchWeatherData(deliveryLocation, scheduledDate),
  ]);
  
  // Check for alerts
  const [pickupAlerts, deliveryAlerts] = await Promise.all([
    checkWeatherAlerts(pickupLocation, scheduledDate),
    checkWeatherAlerts(deliveryLocation, scheduledDate),
  ]);
  
  // Use worse weather condition
  const weather = pickupWeather.condition === 'clear' ? deliveryWeather : pickupWeather;
  const alerts = [...pickupAlerts, ...deliveryAlerts];
  
  // Calculate risk level
  const riskLevel = calculateRiskLevel(weather, alerts);
  const canProceed = riskLevel !== 'extreme';
  
  // Generate recommendations
  const recommendations = generateRecommendations(weather, alerts, riskLevel);
  
  // Suggest reschedule dates if risky
  const suggestedReschedule = riskLevel === 'high' || riskLevel === 'extreme'
    ? generateRescheduleSuggestions(scheduledDate)
    : undefined;
  
  // Calculate pricing adjustment
  const pricingAdjustment = calculateWeatherPricingAdjustment(weather, riskLevel);
  
  return {
    jobId,
    scheduledDate,
    pickupLocation,
    deliveryLocation,
    weather,
    alerts,
    riskLevel,
    canProceed,
    recommendations,
    suggestedReschedule,
    pricingAdjustment,
  };
}

/**
 * Calculate risk level
 */
function calculateRiskLevel(weather: WeatherData, alerts: WeatherAlert[]): WeatherImpactAssessment['riskLevel'] {
  // Check for extreme alerts
  if (alerts.some(a => a.severity === 'extreme')) return 'extreme';
  
  // Extreme weather conditions
  if (weather.condition === 'storm' || weather.condition === 'snow') return 'extreme';
  
  // High risk conditions
  if (weather.condition === 'heavy_rain' || weather.windSpeed > 60 || weather.visibility < 2) return 'high';
  
  // Medium risk
  if (weather.condition === 'rain' || weather.windSpeed > 40 || weather.visibility < 5) return 'medium';
  
  return 'low';
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  weather: WeatherData,
  alerts: WeatherAlert[],
  riskLevel: WeatherImpactAssessment['riskLevel']
): string[] {
  const recommendations: string[] = [];
  
  if (riskLevel === 'extreme') {
    recommendations.push('⚠️ STRONGLY RECOMMEND RESCHEDULING - Dangerous conditions expected');
  }
  
  if (weather.condition.includes('rain')) {
    recommendations.push('🌧️ Ensure all items are covered with waterproof materials');
    recommendations.push('📦 Pack electronics and sensitive items in plastic');
  }
  
  if (weather.condition === 'snow') {
    recommendations.push('❄️ Vehicle must have winter tires');
    recommendations.push('⏰ Allow double the normal travel time');
  }
  
  if (weather.windSpeed > 40) {
    recommendations.push('💨 Secure all items extra carefully');
    recommendations.push('🚗 Drive at reduced speed, especially with large vehicles');
  }
  
  if (weather.visibility < 5) {
    recommendations.push('🌫️ Use fog lights and drive with extreme caution');
    recommendations.push('📍 Allow extra time for navigation');
  }
  
  // Add alert recommendations
  alerts.forEach(alert => {
    recommendations.push(...alert.recommendations.map(r => `⚡ ${r}`));
  });
  
  return recommendations;
}

/**
 * Generate reschedule suggestions
 */
function generateRescheduleSuggestions(originalDate: Date): Date[] {
  const suggestions: Date[] = [];
  
  // Suggest +1, +2, +3 days
  for (let i = 1; i <= 3; i++) {
    const newDate = new Date(originalDate);
    newDate.setDate(newDate.getDate() + i);
    suggestions.push(newDate);
  }
  
  return suggestions;
}

/**
 * Calculate weather-based pricing adjustment
 */
function calculateWeatherPricingAdjustment(
  weather: WeatherData,
  riskLevel: WeatherImpactAssessment['riskLevel']
): number {
  let adjustment = 0;
  
  // Base adjustment on risk level
  const riskAdjustments: Record<WeatherImpactAssessment['riskLevel'], number> = {
    low: 0,
    medium: 5,
    high: 10,
    extreme: 20, // 20% premium for extreme conditions
  };
  
  adjustment += riskAdjustments[riskLevel];
  
  // Additional adjustments for specific conditions
  if (weather.condition === 'snow') adjustment += 15;
  if (weather.condition === 'heavy_rain') adjustment += 10;
  if (weather.windSpeed > 60) adjustment += 5;
  
  return adjustment;
}

/**
 * Send weather alert notification
 */
export function sendWeatherAlertNotification(
  userId: string,
  jobReference: string,
  impact: WeatherImpactAssessment
): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'weather_alert',
    title: `Weather Alert for Job ${jobReference}`,
    message: `${impact.weather.condition} expected on ${impact.scheduledDate.toLocaleDateString()}. Risk level: ${impact.riskLevel}`,
    timestamp: new Date(),
    read: false,
    data: { jobReference, impact },
  });
  
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

/**
 * Auto-check weather for upcoming jobs (run daily)
 */
export async function autoCheckWeatherForUpcomingJobs(): Promise<void> {
  // Get all jobs in next 7 days
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  const now = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  
  for (const job of jobs) {
    const jobDate = new Date(job.date);
    
    if (jobDate >= now && jobDate <= sevenDaysLater && job.status !== 'completed' && job.status !== 'cancelled') {
      try {
        const impact = await assessWeatherImpact(
          job.reference,
          jobDate,
          job.pickupAddress,
          job.deliveryAddress
        );
        
        // Send alert if high or extreme risk
        if (impact.riskLevel === 'high' || impact.riskLevel === 'extreme') {
          sendWeatherAlertNotification(job.customerId, job.reference, impact);
          
          // Also notify driver if assigned
          if (job.driverId) {
            sendWeatherAlertNotification(job.driverId, job.reference, impact);
          }
        }
      } catch (error) {
        console.error('Error checking weather for job:', job.reference, error);
      }
    }
  }
}

/**
 * Get weather icon
 */
export function getWeatherIcon(condition: WeatherData['condition']): string {
  const icons: Record<WeatherData['condition'], string> = {
    clear: '☀️',
    cloudy: '⛅',
    rain: '🌧️',
    heavy_rain: '⛈️',
    snow: '❄️',
    storm: '⚡',
    fog: '🌫️',
  };
  return icons[condition];
}
