/**
 * API Gateway Manager
 * Third-party integrations with authentication, rate limiting, and documentation
 */

export interface APIKey {
  id: string;
  key: string;
  partnerId: string;
  name: string;
  environment: 'production' | 'sandbox';
  permissions: string[]; // e.g., ['jobs:read', 'jobs:write', 'quotes:create']
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  status: 'active' | 'revoked' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  totalRequests: number;
}

export interface APIRequest {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requestBody?: any;
  responseCode: number;
  responseTime: number; // ms
  ip: string;
  userAgent: string;
  timestamp: Date;
  error?: string;
}

export interface RateLimitBucket {
  apiKeyId: string;
  minuteRequests: { timestamp: Date; count: number }[];
  dayRequests: number;
  lastReset: Date;
}

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  requiredPermissions: string[];
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  exampleRequest?: any;
  exampleResponse?: any;
}

// ==================== API ENDPOINTS ====================

const API_ENDPOINTS: APIEndpoint[] = [
  {
    path: '/api/v1/quotes',
    method: 'POST',
    description: 'Create a new quote request',
    requiredPermissions: ['quotes:create'],
    parameters: [
      { name: 'pickupAddress', type: 'string', required: true, description: 'Full pickup address' },
      { name: 'deliveryAddress', type: 'string', required: true, description: 'Full delivery address' },
      { name: 'items', type: 'array', required: true, description: 'List of items to move' },
      { name: 'scheduledDate', type: 'string', required: false, description: 'ISO date string' },
    ],
    exampleRequest: {
      pickupAddress: '123 Main St, London',
      deliveryAddress: '456 Oak Ave, Manchester',
      items: [{ name: 'Sofa', category: 'furniture', volume: 2.5 }],
      scheduledDate: '2024-12-20T10:00:00Z',
    },
    exampleResponse: {
      quoteId: 'QT-ABC123',
      totalPrice: 450,
      estimatedDuration: 180,
      vehicleType: 'medium_van',
    },
  },
  {
    path: '/api/v1/quotes/:id',
    method: 'GET',
    description: 'Get quote details by ID',
    requiredPermissions: ['quotes:read'],
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Quote ID' },
    ],
  },
  {
    path: '/api/v1/jobs',
    method: 'POST',
    description: 'Create a new job (booking)',
    requiredPermissions: ['jobs:create'],
    parameters: [
      { name: 'quoteId', type: 'string', required: true, description: 'Quote ID to convert to job' },
      { name: 'customerName', type: 'string', required: true, description: 'Customer full name' },
      { name: 'customerEmail', type: 'string', required: true, description: 'Customer email' },
      { name: 'customerPhone', type: 'string', required: true, description: 'Customer phone number' },
    ],
  },
  {
    path: '/api/v1/jobs/:id',
    method: 'GET',
    description: 'Get job details by ID',
    requiredPermissions: ['jobs:read'],
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Job ID' },
    ],
  },
  {
    path: '/api/v1/jobs/:id/status',
    method: 'PUT',
    description: 'Update job status',
    requiredPermissions: ['jobs:write'],
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Job ID' },
      { name: 'status', type: 'string', required: true, description: 'New status' },
    ],
  },
  {
    path: '/api/v1/drivers',
    method: 'GET',
    description: 'List all drivers',
    requiredPermissions: ['drivers:read'],
    parameters: [
      { name: 'status', type: 'string', required: false, description: 'Filter by status' },
      { name: 'limit', type: 'number', required: false, description: 'Results per page' },
    ],
  },
  {
    path: '/api/v1/webhooks',
    method: 'POST',
    description: 'Register a webhook endpoint',
    requiredPermissions: ['webhooks:create'],
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'Webhook URL' },
      { name: 'events', type: 'array', required: true, description: 'Event types to subscribe to' },
    ],
  },
];

// ==================== API KEY MANAGEMENT ====================

export function getAllAPIKeys(): APIKey[] {
  const stored = localStorage.getItem('api_keys');
  return stored ? JSON.parse(stored) : [];
}

export function getAPIKey(key: string): APIKey | undefined {
  return getAllAPIKeys().find(k => k.key === key && k.status === 'active');
}

export function createAPIKey(data: {
  partnerId: string;
  name: string;
  environment: APIKey['environment'];
  permissions: string[];
  rateLimit?: Partial<APIKey['rateLimit']>;
  expiresAt?: Date;
}): APIKey {
  const key = generateSecureAPIKey();

  const apiKey: APIKey = {
    id: `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    key,
    partnerId: data.partnerId,
    name: data.name,
    environment: data.environment,
    permissions: data.permissions,
    rateLimit: {
      requestsPerMinute: data.rateLimit?.requestsPerMinute || 60,
      requestsPerDay: data.rateLimit?.requestsPerDay || 10000,
    },
    status: 'active',
    createdAt: new Date(),
    expiresAt: data.expiresAt,
    totalRequests: 0,
  };

  const keys = getAllAPIKeys();
  keys.push(apiKey);
  localStorage.setItem('api_keys', JSON.stringify(keys));

  return apiKey;
}

function generateSecureAPIKey(): string {
  const prefix = 'smh';
  const env = 'live'; // or 'test'
  const random = Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
  
  return `${prefix}_${env}_${random}`;
}

export function revokeAPIKey(keyId: string): void {
  const keys = getAllAPIKeys();
  const key = keys.find(k => k.id === keyId);
  
  if (key) {
    key.status = 'revoked';
    localStorage.setItem('api_keys', JSON.stringify(keys));
  }
}

// ==================== AUTHENTICATION ====================

export function authenticateRequest(apiKey: string): { valid: boolean; key?: APIKey; error?: string } {
  const key = getAPIKey(apiKey);

  if (!key) {
    return { valid: false, error: 'Invalid API key' };
  }

  if (key.status !== 'active') {
    return { valid: false, error: 'API key is revoked or expired' };
  }

  if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
    key.status = 'expired';
    const keys = getAllAPIKeys();
    localStorage.setItem('api_keys', JSON.stringify(keys));
    return { valid: false, error: 'API key has expired' };
  }

  return { valid: true, key };
}

export function checkPermission(apiKey: APIKey, requiredPermission: string): boolean {
  return apiKey.permissions.includes(requiredPermission) || apiKey.permissions.includes('*');
}

// ==================== RATE LIMITING ====================

export function checkRateLimit(apiKeyId: string): { allowed: boolean; retryAfter?: number } {
  const buckets = getRateLimitBuckets();
  let bucket = buckets.find(b => b.apiKeyId === apiKeyId);

  if (!bucket) {
    bucket = {
      apiKeyId,
      minuteRequests: [],
      dayRequests: 0,
      lastReset: new Date(),
    };
    buckets.push(bucket);
  }

  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Clean old entries
  bucket.minuteRequests = bucket.minuteRequests.filter(
    r => new Date(r.timestamp) > oneMinuteAgo
  );

  // Reset daily counter if needed
  if (new Date(bucket.lastReset) < oneDayAgo) {
    bucket.dayRequests = 0;
    bucket.lastReset = now;
  }

  const key = getAllAPIKeys().find(k => k.id === apiKeyId);
  if (!key) return { allowed: false };

  // Check limits
  const minuteCount = bucket.minuteRequests.reduce((sum, r) => sum + r.count, 0);
  
  if (minuteCount >= key.rateLimit.requestsPerMinute) {
    const oldestRequest = bucket.minuteRequests[0];
    const retryAfter = 60 - Math.floor((now.getTime() - new Date(oldestRequest.timestamp).getTime()) / 1000);
    return { allowed: false, retryAfter };
  }

  if (bucket.dayRequests >= key.rateLimit.requestsPerDay) {
    return { allowed: false, retryAfter: 86400 }; // 24 hours
  }

  // Increment counters
  bucket.minuteRequests.push({ timestamp: now, count: 1 });
  bucket.dayRequests++;

  saveRateLimitBuckets(buckets);

  return { allowed: true };
}

function getRateLimitBuckets(): RateLimitBucket[] {
  const stored = localStorage.getItem('rate_limit_buckets');
  return stored ? JSON.parse(stored) : [];
}

function saveRateLimitBuckets(buckets: RateLimitBucket[]): void {
  localStorage.setItem('rate_limit_buckets', JSON.stringify(buckets));
}

// ==================== REQUEST HANDLING ====================

export function handleAPIRequest(
  apiKey: string,
  endpoint: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
): { status: number; data?: any; error?: string; headers?: Record<string, string> } {
  // 1. Authenticate
  const auth = authenticateRequest(apiKey);
  if (!auth.valid || !auth.key) {
    return { status: 401, error: auth.error };
  }

  // 2. Check rate limit
  const rateLimit = checkRateLimit(auth.key.id);
  if (!rateLimit.allowed) {
    return {
      status: 429,
      error: 'Rate limit exceeded',
      headers: {
        'X-RateLimit-Limit': auth.key.rateLimit.requestsPerMinute.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimit.retryAfter?.toString() || '60',
      },
    };
  }

  // 3. Find endpoint
  const apiEndpoint = API_ENDPOINTS.find(
    e => e.path === endpoint && e.method === method
  );

  if (!apiEndpoint) {
    logRequest(auth.key.id, endpoint, method, body, 404, 0);
    return { status: 404, error: 'Endpoint not found' };
  }

  // 4. Check permissions
  const hasPermission = apiEndpoint.requiredPermissions.every(perm =>
    checkPermission(auth.key, perm)
  );

  if (!hasPermission) {
    logRequest(auth.key.id, endpoint, method, body, 403, 0);
    return { status: 403, error: 'Insufficient permissions' };
  }

  // 5. Execute request
  const startTime = Date.now();
  const result = executeEndpoint(apiEndpoint, body);
  const responseTime = Date.now() - startTime;

  // 6. Log request
  logRequest(auth.key.id, endpoint, method, body, result.status, responseTime);

  // 7. Update API key stats
  updateAPIKeyStats(auth.key.id);

  return result;
}

function executeEndpoint(endpoint: APIEndpoint, body?: any): { status: number; data?: any; error?: string } {
  // Mock implementation - in production, this would call actual services
  
  try {
    switch (endpoint.path) {
      case '/api/v1/quotes':
        if (endpoint.method === 'POST') {
          return {
            status: 201,
            data: {
              quoteId: `QT-${Date.now().toString(36).toUpperCase()}`,
              totalPrice: 450,
              estimatedDuration: 180,
              vehicleType: 'medium_van',
              createdAt: new Date().toISOString(),
            },
          };
        }
        break;

      case '/api/v1/jobs':
        if (endpoint.method === 'POST') {
          return {
            status: 201,
            data: {
              jobId: `SMH-${Date.now().toString(36).toUpperCase()}`,
              reference: `SMH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              status: 'pending',
              createdAt: new Date().toISOString(),
            },
          };
        }
        break;

      case '/api/v1/drivers':
        if (endpoint.method === 'GET') {
          const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
          return {
            status: 200,
            data: {
              drivers: drivers.slice(0, 10),
              total: drivers.length,
              page: 1,
              perPage: 10,
            },
          };
        }
        break;

      default:
        return { status: 501, error: 'Not implemented' };
    }

    return { status: 200, data: { message: 'Success' } };
  } catch (error: any) {
    return { status: 500, error: error.message };
  }
}

function logRequest(
  apiKeyId: string,
  endpoint: string,
  method: string,
  requestBody: any,
  responseCode: number,
  responseTime: number,
  error?: string
): void {
  const request: APIRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    apiKeyId,
    endpoint,
    method: method as APIRequest['method'],
    requestBody,
    responseCode,
    responseTime,
    ip: '0.0.0.0',
    userAgent: 'API Client',
    timestamp: new Date(),
    error,
  };

  const requests = getAllAPIRequests();
  requests.push(request);

  // Keep only last 10000 requests
  if (requests.length > 10000) {
    requests.splice(0, requests.length - 10000);
  }

  localStorage.setItem('api_requests', JSON.stringify(requests));
}

function updateAPIKeyStats(apiKeyId: string): void {
  const keys = getAllAPIKeys();
  const key = keys.find(k => k.id === apiKeyId);

  if (key) {
    key.totalRequests++;
    key.lastUsedAt = new Date();
    localStorage.setItem('api_keys', JSON.stringify(keys));
  }
}

export function getAllAPIRequests(): APIRequest[] {
  const stored = localStorage.getItem('api_requests');
  return stored ? JSON.parse(stored) : [];
}

export function getAPIRequests(apiKeyId: string, limit: number = 100): APIRequest[] {
  return getAllAPIRequests()
    .filter(r => r.apiKeyId === apiKeyId)
    .slice(-limit);
}

// ==================== ANALYTICS ====================

export function getAPIAnalytics(apiKeyId?: string, days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let requests = getAllAPIRequests().filter(
    r => new Date(r.timestamp) >= startDate
  );

  if (apiKeyId) {
    requests = requests.filter(r => r.apiKeyId === apiKeyId);
  }

  const totalRequests = requests.length;
  const successfulRequests = requests.filter(r => r.responseCode < 400).length;
  const errorRequests = requests.filter(r => r.responseCode >= 400).length;
  const averageResponseTime = requests.reduce((sum, r) => sum + r.responseTime, 0) / (totalRequests || 1);

  const endpointBreakdown = requests.reduce((acc, r) => {
    const key = `${r.method} ${r.endpoint}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCodeBreakdown = requests.reduce((acc, r) => {
    acc[r.responseCode] = (acc[r.responseCode] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return {
    totalRequests,
    successfulRequests,
    errorRequests,
    successRate: (successfulRequests / (totalRequests || 1)) * 100,
    averageResponseTime: Math.round(averageResponseTime),
    endpointBreakdown,
    statusCodeBreakdown,
  };
}

// ==================== DOCUMENTATION ====================

export function getAPIDocumentation(): {
  version: string;
  baseUrl: string;
  authentication: any;
  endpoints: APIEndpoint[];
  rateLimits: any;
} {
  return {
    version: '1.0.0',
    baseUrl: 'https://api.shiftmyhome.com',
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Include your API key in the X-API-Key header of all requests',
    },
    endpoints: API_ENDPOINTS,
    rateLimits: {
      default: {
        requestsPerMinute: 60,
        requestsPerDay: 10000,
      },
      description: 'Rate limits apply per API key. Contact support for higher limits.',
    },
  };
}

export function generateSDKCode(language: 'javascript' | 'python' | 'php' | 'curl'): string {
  const examples: Record<string, string> = {
    javascript: `
// ShiftMyHome API Client
const SMH = require('shiftmyhome-sdk');

const client = new SMH.Client({
  apiKey: 'your_api_key_here',
  environment: 'production'
});

// Create a quote
const quote = await client.quotes.create({
  pickupAddress: '123 Main St, London',
  deliveryAddress: '456 Oak Ave, Manchester',
  items: [{ name: 'Sofa', category: 'furniture', volume: 2.5 }]
});

console.log(quote);
`,
    python: `
# ShiftMyHome API Client
from shiftmyhome import Client

client = Client(
    api_key='your_api_key_here',
    environment='production'
)

# Create a quote
quote = client.quotes.create(
    pickup_address='123 Main St, London',
    delivery_address='456 Oak Ave, Manchester',
    items=[{'name': 'Sofa', 'category': 'furniture', 'volume': 2.5}]
)

print(quote)
`,
    php: `
<?php
// ShiftMyHome API Client
require 'vendor/autoload.php';

use ShiftMyHome\\Client;

$client = new Client([
    'api_key' => 'your_api_key_here',
    'environment' => 'production'
]);

// Create a quote
$quote = $client->quotes->create([
    'pickup_address' => '123 Main St, London',
    'delivery_address' => '456 Oak Ave, Manchester',
    'items' => [['name' => 'Sofa', 'category' => 'furniture', 'volume' => 2.5]]
]);

print_r($quote);
?>
`,
    curl: `
# ShiftMyHome API - cURL Example
curl -X POST https://api.shiftmyhome.com/v1/quotes \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pickupAddress": "123 Main St, London",
    "deliveryAddress": "456 Oak Ave, Manchester",
    "items": [{"name": "Sofa", "category": "furniture", "volume": 2.5}]
  }'
`,
  };

  return examples[language] || examples.curl;
}
