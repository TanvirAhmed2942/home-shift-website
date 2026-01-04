/**
 * Mapbox Public Token
 * 
 * This token is used ONLY for map rendering in UI components (MapboxGL maps).
 * Public tokens are safe to expose in frontend code for map display.
 * 
 * IMPORTANT: Business logic (distance calculations, routing, driver allocation)
 * should NEVER use this token directly. Instead, use the backend APIs:
 * - /api/calculate-distance
 * - /api/journey/estimate
 * - /api/allocate-driver
 * 
 * The backend handles all Mapbox API calls using the token from environment variables.
 */
export const MAPBOX_PUBLIC_TOKEN = "pk.eyJ1IjoiYW5kcmVpMTEwMSIsImEiOiJjbWpweDV0cmYxajk1M2RzZGQ3aDdybHYyIn0.gqZQOuoUB_hMg7OPxJ-YGQ";