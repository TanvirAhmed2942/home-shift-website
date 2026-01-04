/**
 * Storage Solutions Manager
 * Complete warehouse & storage system for customer items
 */

export interface StorageWarehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  totalCapacity: number; // cubic meters
  usedCapacity: number;
  availableCapacity: number;
  features: ('climate_controlled' | 'security_24_7' | 'cctv' | 'fire_protection' | 'pest_control')[];
  pricing: {
    perCubicMeter: number; // monthly
    insuranceRate: number; // % of item value
    accessFee: number; // per visit
  };
  operatingHours: {
    weekday: { open: string; close: string };
    weekend: { open: string; close: string };
  };
  status: 'active' | 'full' | 'maintenance';
}

export interface StorageItem {
  id: string;
  qrCode: string;
  name: string;
  description: string;
  category: 'furniture' | 'boxes' | 'appliances' | 'vehicles' | 'documents' | 'art' | 'other';
  dimensions: {
    length: number; // cm
    width: number;
    height: number;
  };
  volume: number; // cubic meters
  estimatedValue: number; // £
  condition: string;
  photos: string[];
  requiresClimateControl: boolean;
  fragile: boolean;
  hazardous: boolean;
}

export interface StorageBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  warehouseId: string;
  warehouseName: string;
  items: StorageItem[];
  totalVolume: number; // cubic meters
  totalValue: number; // £
  startDate: Date;
  endDate?: Date; // undefined = indefinite
  status: 'active' | 'expired' | 'cancelled' | 'pending_pickup';
  pricing: {
    monthlyRate: number;
    insuranceFee: number;
    setupFee: number;
    totalMonthly: number;
  };
  insurance: {
    enabled: boolean;
    coverage: number;
    premium: number; // monthly
  };
  accessHistory: {
    date: Date;
    type: 'drop_off' | 'pickup' | 'visit';
    itemsAccessed: string[];
    notes: string;
  }[];
  invoices: string[]; // invoice IDs
  createdAt: Date;
  lastBillingDate?: Date;
  nextBillingDate?: Date;
}

export interface StorageAccessRequest {
  id: string;
  bookingId: string;
  customerId: string;
  warehouseId: string;
  scheduledDate: Date;
  type: 'visit' | 'partial_pickup' | 'full_pickup' | 'add_items';
  itemsToAccess: string[]; // item IDs
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  approvedBy?: string;
  notes: string;
  createdAt: Date;
}

// ==================== WAREHOUSE MANAGEMENT ====================

const STORAGE_WAREHOUSES: StorageWarehouse[] = [
  {
    id: 'WH001',
    name: 'ShiftMyHome Central Storage',
    location: 'London',
    address: '123 Storage Lane, London E1 6AN',
    totalCapacity: 500, // 500 cubic meters
    usedCapacity: 0,
    availableCapacity: 500,
    features: ['climate_controlled', 'security_24_7', 'cctv', 'fire_protection', 'pest_control'],
    pricing: {
      perCubicMeter: 15, // £15/m³/month
      insuranceRate: 0.5, // 0.5% of item value monthly
      accessFee: 10, // £10 per visit
    },
    operatingHours: {
      weekday: { open: '08:00', close: '20:00' },
      weekend: { open: '09:00', close: '17:00' },
    },
    status: 'active',
  },
  {
    id: 'WH002',
    name: 'ShiftMyHome North Storage',
    location: 'Manchester',
    address: '456 Warehouse Road, Manchester M1 1AD',
    totalCapacity: 300,
    usedCapacity: 0,
    availableCapacity: 300,
    features: ['security_24_7', 'cctv', 'fire_protection'],
    pricing: {
      perCubicMeter: 12, // £12/m³/month (cheaper, no climate control)
      insuranceRate: 0.5,
      accessFee: 10,
    },
    operatingHours: {
      weekday: { open: '08:00', close: '18:00' },
      weekend: { open: '10:00', close: '16:00' },
    },
    status: 'active',
  },
  {
    id: 'WH003',
    name: 'ShiftMyHome Premium Vault',
    location: 'London',
    address: '789 Secure Drive, London SW1A 1AA',
    totalCapacity: 200,
    usedCapacity: 0,
    availableCapacity: 200,
    features: ['climate_controlled', 'security_24_7', 'cctv', 'fire_protection', 'pest_control'],
    pricing: {
      perCubicMeter: 25, // £25/m³/month (premium)
      insuranceRate: 0.3, // lower insurance rate (better security)
      accessFee: 5,
    },
    operatingHours: {
      weekday: { open: '24/7', close: '24/7' },
      weekend: { open: '24/7', close: '24/7' },
    },
    status: 'active',
  },
];

// ==================== STORAGE OPERATIONS ====================

export function getAllWarehouses(): StorageWarehouse[] {
  const stored = localStorage.getItem('storage_warehouses');
  if (!stored) {
    localStorage.setItem('storage_warehouses', JSON.stringify(STORAGE_WAREHOUSES));
    return STORAGE_WAREHOUSES;
  }
  return JSON.parse(stored);
}

export function getWarehouse(warehouseId: string): StorageWarehouse | undefined {
  const warehouses = getAllWarehouses();
  return warehouses.find(w => w.id === warehouseId);
}

export function getAvailableWarehouses(requiredVolume: number): StorageWarehouse[] {
  const warehouses = getAllWarehouses();
  return warehouses.filter(
    w => w.status === 'active' && w.availableCapacity >= requiredVolume
  );
}

export function updateWarehouseCapacity(warehouseId: string, usedVolume: number): void {
  const warehouses = getAllWarehouses();
  const warehouse = warehouses.find(w => w.id === warehouseId);
  if (warehouse) {
    warehouse.usedCapacity += usedVolume;
    warehouse.availableCapacity = warehouse.totalCapacity - warehouse.usedCapacity;
    
    // Mark as full if < 5% capacity available
    if (warehouse.availableCapacity < warehouse.totalCapacity * 0.05) {
      warehouse.status = 'full';
    }
    
    localStorage.setItem('storage_warehouses', JSON.stringify(warehouses));
  }
}

// ==================== ITEM MANAGEMENT ====================

export function generateQRCode(itemId: string): string {
  // Generate unique QR code for item tracking
  return `SMH-ITEM-${itemId}-${Date.now().toString(36).toUpperCase()}`;
}

export function calculateItemVolume(dimensions: { length: number; width: number; height: number }): number {
  // Convert cm to meters and calculate volume
  return (dimensions.length / 100) * (dimensions.width / 100) * (dimensions.height / 100);
}

export function createStorageItem(data: Omit<StorageItem, 'id' | 'qrCode' | 'volume'>): StorageItem {
  const id = `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const volume = calculateItemVolume(data.dimensions);
  
  return {
    id,
    qrCode: generateQRCode(id),
    volume,
    ...data,
  };
}

// ==================== BOOKING MANAGEMENT ====================

export function createStorageBooking(data: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  warehouseId: string;
  items: StorageItem[];
  startDate: Date;
  endDate?: Date;
  enableInsurance: boolean;
}): StorageBooking {
  const warehouse = getWarehouse(data.warehouseId);
  if (!warehouse) {
    throw new Error('Warehouse not found');
  }

  const totalVolume = data.items.reduce((sum, item) => sum + item.volume, 0);
  const totalValue = data.items.reduce((sum, item) => sum + item.estimatedValue, 0);

  // Check capacity
  if (totalVolume > warehouse.availableCapacity) {
    throw new Error('Insufficient warehouse capacity');
  }

  // Calculate pricing
  const monthlyRate = totalVolume * warehouse.pricing.perCubicMeter;
  const setupFee = 50; // One-time setup fee
  const insuranceFee = data.enableInsurance 
    ? (totalValue * warehouse.pricing.insuranceRate / 100) 
    : 0;
  const totalMonthly = monthlyRate + insuranceFee;

  const bookingNumber = `STOR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  const now = new Date();
  const nextBillingDate = new Date(now);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const booking: StorageBooking = {
    id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    bookingNumber,
    customerId: data.customerId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    warehouseId: data.warehouseId,
    warehouseName: warehouse.name,
    items: data.items,
    totalVolume,
    totalValue,
    startDate: data.startDate,
    endDate: data.endDate,
    status: 'active',
    pricing: {
      monthlyRate,
      insuranceFee,
      setupFee,
      totalMonthly,
    },
    insurance: {
      enabled: data.enableInsurance,
      coverage: totalValue,
      premium: insuranceFee,
    },
    accessHistory: [
      {
        date: data.startDate,
        type: 'drop_off',
        itemsAccessed: data.items.map(i => i.id),
        notes: 'Initial storage drop-off',
      },
    ],
    invoices: [],
    createdAt: now,
    lastBillingDate: now,
    nextBillingDate,
  };

  // Save booking
  const bookings = getAllStorageBookings();
  bookings.push(booking);
  localStorage.setItem('storage_bookings', JSON.stringify(bookings));

  // Update warehouse capacity
  updateWarehouseCapacity(data.warehouseId, totalVolume);

  // Generate initial invoice
  generateStorageInvoice(booking, 'setup');

  // Send confirmation email
  sendStorageConfirmationEmail(booking);

  return booking;
}

export function getAllStorageBookings(): StorageBooking[] {
  const stored = localStorage.getItem('storage_bookings');
  return stored ? JSON.parse(stored) : [];
}

export function getCustomerStorageBookings(customerId: string): StorageBooking[] {
  return getAllStorageBookings().filter(b => b.customerId === customerId);
}

export function getStorageBooking(bookingId: string): StorageBooking | undefined {
  return getAllStorageBookings().find(b => b.id === bookingId);
}

export function getStorageBookingByNumber(bookingNumber: string): StorageBooking | undefined {
  return getAllStorageBookings().find(b => b.bookingNumber === bookingNumber);
}

// ==================== ACCESS REQUESTS ====================

export function createAccessRequest(data: {
  bookingId: string;
  customerId: string;
  scheduledDate: Date;
  type: StorageAccessRequest['type'];
  itemsToAccess: string[];
  notes: string;
}): StorageAccessRequest {
  const booking = getStorageBooking(data.bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const request: StorageAccessRequest = {
    id: `access-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    bookingId: data.bookingId,
    customerId: data.customerId,
    warehouseId: booking.warehouseId,
    scheduledDate: data.scheduledDate,
    type: data.type,
    itemsToAccess: data.itemsToAccess,
    status: 'pending',
    notes: data.notes,
    createdAt: new Date(),
  };

  const requests = getAllAccessRequests();
  requests.push(request);
  localStorage.setItem('storage_access_requests', JSON.stringify(requests));

  // Send notification to admin
  sendAccessRequestNotification(request);

  return request;
}

export function getAllAccessRequests(): StorageAccessRequest[] {
  const stored = localStorage.getItem('storage_access_requests');
  return stored ? JSON.parse(stored) : [];
}

export function approveAccessRequest(requestId: string, approvedBy: string): void {
  const requests = getAllAccessRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (request) {
    request.status = 'approved';
    request.approvedBy = approvedBy;
    localStorage.setItem('storage_access_requests', JSON.stringify(requests));
    
    // Send confirmation to customer
    sendAccessApprovalEmail(request);
  }
}

export function completeAccessRequest(requestId: string): void {
  const requests = getAllAccessRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (request) {
    request.status = 'completed';
    localStorage.setItem('storage_access_requests', JSON.stringify(requests));
    
    // Update booking access history
    const bookings = getAllStorageBookings();
    const booking = bookings.find(b => b.id === request.bookingId);
    
    if (booking) {
      booking.accessHistory.push({
        date: new Date(),
        type: request.type,
        itemsAccessed: request.itemsToAccess,
        notes: request.notes,
      });
      
      // If full pickup, mark booking as pending_pickup
      if (request.type === 'full_pickup') {
        booking.status = 'pending_pickup';
      }
      
      localStorage.setItem('storage_bookings', JSON.stringify(bookings));
    }
    
    // Charge access fee
    const warehouse = getWarehouse(request.warehouseId);
    if (warehouse && request.type !== 'add_items') {
      generateAccessFeeInvoice(request, warehouse.pricing.accessFee);
    }
  }
}

// ==================== BILLING & INVOICING ====================

export function generateStorageInvoice(booking: StorageBooking, type: 'setup' | 'monthly'): string {
  const { createInvoiceFromStorageBooking } = require('./invoiceGenerator');
  
  const items = type === 'setup' 
    ? [
        { description: 'Storage Setup Fee', quantity: 1, unitPrice: booking.pricing.setupFee },
        { description: `Storage (${booking.totalVolume.toFixed(2)}m³) - First Month`, quantity: 1, unitPrice: booking.pricing.monthlyRate },
        ...(booking.insurance.enabled ? [{ description: 'Insurance Premium - First Month', quantity: 1, unitPrice: booking.pricing.insuranceFee }] : []),
      ]
    : [
        { description: `Storage (${booking.totalVolume.toFixed(2)}m³) - Monthly`, quantity: 1, unitPrice: booking.pricing.monthlyRate },
        ...(booking.insurance.enabled ? [{ description: 'Insurance Premium - Monthly', quantity: 1, unitPrice: booking.pricing.insuranceFee }] : []),
      ];
  
  const invoice = createInvoiceFromStorageBooking(booking, items, type);
  
  // Add invoice ID to booking
  const bookings = getAllStorageBookings();
  const bookingIndex = bookings.findIndex(b => b.id === booking.id);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].invoices.push(invoice.id);
    localStorage.setItem('storage_bookings', JSON.stringify(bookings));
  }
  
  return invoice.id;
}

export function generateAccessFeeInvoice(request: StorageAccessRequest, accessFee: number): void {
  const booking = getStorageBooking(request.bookingId);
  if (!booking) return;
  
  const { createInvoiceFromStorageBooking } = require('./invoiceGenerator');
  
  const items = [
    { description: `Warehouse Access Fee - ${request.type}`, quantity: 1, unitPrice: accessFee },
  ];
  
  createInvoiceFromStorageBooking(booking, items, 'access');
}

export function processMonthlyBilling(): void {
  const bookings = getAllStorageBookings();
  const now = new Date();
  
  bookings.forEach(booking => {
    if (booking.status !== 'active') return;
    
    const nextBilling = new Date(booking.nextBillingDate || now);
    
    if (now >= nextBilling) {
      // Generate monthly invoice
      generateStorageInvoice(booking, 'monthly');
      
      // Update billing dates
      booking.lastBillingDate = now;
      const nextDate = new Date(now);
      nextDate.setMonth(nextDate.getMonth() + 1);
      booking.nextBillingDate = nextDate;
      
      // Check if endDate reached
      if (booking.endDate && now >= new Date(booking.endDate)) {
        booking.status = 'expired';
        sendStorageExpiryNotification(booking);
      }
    }
  });
  
  localStorage.setItem('storage_bookings', JSON.stringify(bookings));
}

// ==================== ANALYTICS ====================

export function getStorageAnalytics(warehouseId?: string) {
  const bookings = warehouseId 
    ? getAllStorageBookings().filter(b => b.warehouseId === warehouseId)
    : getAllStorageBookings();
  
  const activeBookings = bookings.filter(b => b.status === 'active');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.pricing.totalMonthly, 0);
  const totalVolume = activeBookings.reduce((sum, b) => sum + b.totalVolume, 0);
  const totalValue = activeBookings.reduce((sum, b) => sum + b.totalValue, 0);
  
  const categoryBreakdown = activeBookings.reduce((acc, booking) => {
    booking.items.forEach(item => {
      acc[item.category] = (acc[item.category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalBookings: bookings.length,
    activeBookings: activeBookings.length,
    totalRevenue,
    monthlyRecurringRevenue: totalRevenue,
    totalVolumeUsed: totalVolume,
    totalInsuredValue: totalValue,
    averageBookingValue: activeBookings.length > 0 ? totalRevenue / activeBookings.length : 0,
    categoryBreakdown,
  };
}

export function calculateStorageStats() {
  const warehouses = getAllWarehouses();
  const bookings = getAllStorageBookings();
  
  return {
    totalWarehouses: warehouses.length,
    activeWarehouses: warehouses.filter(w => w.status === 'active').length,
    totalCapacity: warehouses.reduce((sum, w) => sum + w.totalCapacity, 0),
    usedCapacity: warehouses.reduce((sum, w) => sum + w.usedCapacity, 0),
    occupancyRate: (warehouses.reduce((sum, w) => sum + w.usedCapacity, 0) / warehouses.reduce((sum, w) => sum + w.totalCapacity, 0)) * 100,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    monthlyRevenue: getStorageAnalytics().monthlyRecurringRevenue,
  };
}

// ==================== NOTIFICATIONS ====================

function sendStorageConfirmationEmail(booking: StorageBooking): void {
  console.log(`📧 Storage confirmation sent to ${booking.customerEmail}`);
  console.log(`Booking Number: ${booking.bookingNumber}`);
  console.log(`Items: ${booking.items.length}`);
  console.log(`Monthly Cost: £${booking.pricing.totalMonthly.toFixed(2)}`);
}

function sendAccessRequestNotification(request: StorageAccessRequest): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'admin',
    type: 'storage_access_request',
    title: 'New Storage Access Request',
    message: `Customer requested ${request.type} access for ${new Date(request.scheduledDate).toLocaleDateString()}`,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

function sendAccessApprovalEmail(request: StorageAccessRequest): void {
  console.log(`✅ Access request approved for ${new Date(request.scheduledDate).toLocaleDateString()}`);
}

function sendStorageExpiryNotification(booking: StorageBooking): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: booking.customerId,
    type: 'storage_expiry',
    title: 'Storage Period Expired',
    message: `Your storage booking ${booking.bookingNumber} has expired. Please arrange pickup.`,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

// ==================== HELPER FUNCTIONS ====================

export function searchStorageBookings(query: string): StorageBooking[] {
  const bookings = getAllStorageBookings();
  const lowerQuery = query.toLowerCase();
  
  return bookings.filter(
    b =>
      b.bookingNumber.toLowerCase().includes(lowerQuery) ||
      b.customerName.toLowerCase().includes(lowerQuery) ||
      b.customerEmail.toLowerCase().includes(lowerQuery) ||
      b.items.some(item => item.name.toLowerCase().includes(lowerQuery))
  );
}

export function getItemByQRCode(qrCode: string): { booking: StorageBooking; item: StorageItem } | null {
  const bookings = getAllStorageBookings();
  
  for (const booking of bookings) {
    const item = booking.items.find(i => i.qrCode === qrCode);
    if (item) {
      return { booking, item };
    }
  }
  
  return null;
}

export function downloadQRCodeLabels(bookingId: string): void {
  const booking = getStorageBooking(bookingId);
  if (!booking) return;
  
  console.log(`📋 Generating QR code labels for ${booking.items.length} items...`);
  
  // In production, this would generate PDF with QR codes
  booking.items.forEach((item, index) => {
    console.log(`Label ${index + 1}:`);
    console.log(`  QR Code: ${item.qrCode}`);
    console.log(`  Item: ${item.name}`);
    console.log(`  Booking: ${booking.bookingNumber}`);
  });
  
  alert(`QR labels generated for ${booking.items.length} items. Download started.`);
}
