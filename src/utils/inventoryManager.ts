/**
 * Inventory Management System
 * Complete tracking for moving items and storage inventory
 */

import { generateQRCode } from './storageManager';

export interface InventoryItem {
  id: string;
  qrCode: string;
  barcode?: string;
  name: string;
  description: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  estimatedValue: number;
  actualValue?: number;
  photos: string[];
  dimensions: { length: number; width: number; height: number; unit: 'cm' | 'inch' };
  weight?: number; // kg
  fragile: boolean;
  customsValue?: number;
  serialNumber?: string;
  location: {
    type: 'in_transit' | 'in_storage' | 'delivered' | 'origin';
    jobId?: string;
    storageBookingId?: string;
    warehouse?: string;
    zone?: string;
    shelf?: string;
  };
  status: 'pending' | 'packed' | 'in_transit' | 'stored' | 'delivered' | 'missing' | 'damaged';
  tags: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  history: InventoryEvent[];
}

export interface InventoryEvent {
  id: string;
  itemId: string;
  type: 'created' | 'packed' | 'moved' | 'stored' | 'delivered' | 'damaged' | 'lost' | 'found' | 'updated';
  description: string;
  performedBy: string;
  location?: string;
  timestamp: Date;
  photos?: string[];
  metadata?: any;
}

export interface InventoryManifest {
  id: string;
  jobId?: string;
  storageBookingId?: string;
  type: 'moving' | 'storage' | 'customs';
  customerId: string;
  customerName: string;
  items: string[]; // item IDs
  totalItems: number;
  totalValue: number;
  totalWeight: number;
  status: 'draft' | 'finalized' | 'in_transit' | 'completed';
  createdBy: string;
  createdAt: Date;
  finalizedAt?: Date;
  signatures: {
    customer?: { name: string; signature: string; timestamp: Date };
    driver?: { name: string; signature: string; timestamp: Date };
    recipient?: { name: string; signature: string; timestamp: Date };
  };
}

// ==================== ITEM MANAGEMENT ====================

export function getAllInventoryItems(): InventoryItem[] {
  const stored = localStorage.getItem('inventory_items');
  return stored ? JSON.parse(stored) : [];
}

export function getInventoryItem(itemId: string): InventoryItem | undefined {
  return getAllInventoryItems().find(i => i.id === itemId);
}

export function getItemByQRCode(qrCode: string): InventoryItem | undefined {
  return getAllInventoryItems().find(i => i.qrCode === qrCode);
}

export function getItemByBarcode(barcode: string): InventoryItem | undefined {
  return getAllInventoryItems().find(i => i.barcode === barcode);
}

export function createInventoryItem(data: Omit<InventoryItem, 'id' | 'qrCode' | 'createdAt' | 'updatedAt' | 'history'>): InventoryItem {
  const id = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const qrCode = generateQRCode(id);

  const item: InventoryItem = {
    id,
    qrCode,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: [],
  };

  // Add creation event
  addInventoryEvent(item.id, {
    type: 'created',
    description: `Item "${item.name}" added to inventory`,
    performedBy: 'system',
  });

  const items = getAllInventoryItems();
  items.push(item);
  localStorage.setItem('inventory_items', JSON.stringify(items));

  return item;
}

export function updateInventoryItem(itemId: string, updates: Partial<InventoryItem>): void {
  const items = getAllInventoryItems();
  const index = items.findIndex(i => i.id === itemId);

  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date() };
    localStorage.setItem('inventory_items', JSON.stringify(items));

    addInventoryEvent(itemId, {
      type: 'updated',
      description: 'Item details updated',
      performedBy: 'system',
      metadata: updates,
    });
  }
}

export function deleteInventoryItem(itemId: string): void {
  const items = getAllInventoryItems().filter(i => i.id !== itemId);
  localStorage.setItem('inventory_items', JSON.stringify(items));
}

// ==================== ITEM TRACKING ====================

export function updateItemLocation(itemId: string, location: InventoryItem['location'], performedBy: string): void {
  const item = getInventoryItem(itemId);
  if (!item) return;

  updateInventoryItem(itemId, { location });

  addInventoryEvent(itemId, {
    type: 'moved',
    description: `Item moved to ${location.type}`,
    performedBy,
    location: JSON.stringify(location),
  });
}

export function updateItemStatus(itemId: string, status: InventoryItem['status'], performedBy: string, notes?: string): void {
  const item = getInventoryItem(itemId);
  if (!item) return;

  updateInventoryItem(itemId, { status, notes: notes || item.notes });

  addInventoryEvent(itemId, {
    type: status === 'damaged' ? 'damaged' : status === 'missing' ? 'lost' : 'updated',
    description: `Item status changed to ${status}`,
    performedBy,
    metadata: { notes },
  });
}

export function markItemAsPacked(itemId: string, performedBy: string): void {
  updateItemStatus(itemId, 'packed', performedBy, 'Item securely packed and ready for transport');
}

export function markItemAsDelivered(itemId: string, performedBy: string, recipientSignature?: string): void {
  updateItemStatus(itemId, 'delivered', performedBy, 'Item successfully delivered');
  
  const item = getInventoryItem(itemId);
  if (item) {
    updateItemLocation(itemId, {
      type: 'delivered',
      jobId: item.location.jobId,
    }, performedBy);
  }
}

export function reportItemDamage(itemId: string, reportedBy: string, description: string, photos: string[]): void {
  const item = getInventoryItem(itemId);
  if (!item) return;

  updateInventoryItem(itemId, { 
    status: 'damaged',
    condition: 'damaged',
    notes: `${item.notes}\n\nDamage Report: ${description}`
  });

  addInventoryEvent(itemId, {
    type: 'damaged',
    description,
    performedBy: reportedBy,
    photos,
  });

  // Create automatic insurance claim if item is valuable
  if (item.estimatedValue > 100) {
    createAutomaticClaim(item, description, photos);
  }
}

function createAutomaticClaim(item: InventoryItem, description: string, photos: string[]): void {
  const { createClaim } = require('./insuranceClaimsManager');
  
  createClaim({
    jobReference: item.location.jobId || 'N/A',
    customerId: 'auto',
    type: 'damage',
    description: `Automatic claim for damaged item: ${item.name}. ${description}`,
    damagedItems: [{ name: item.name, value: item.estimatedValue }],
    requestedAmount: item.estimatedValue * 0.8, // 80% of value
    photos,
  });

  console.log(`🛡️ Automatic insurance claim created for ${item.name}`);
}

// ==================== EVENT MANAGEMENT ====================

export function addInventoryEvent(itemId: string, event: Omit<InventoryEvent, 'id' | 'itemId' | 'timestamp'>): void {
  const item = getInventoryItem(itemId);
  if (!item) return;

  const fullEvent: InventoryEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    itemId,
    timestamp: new Date(),
    ...event,
  };

  item.history.push(fullEvent);
  updateInventoryItem(itemId, { history: item.history });
}

export function getItemHistory(itemId: string): InventoryEvent[] {
  const item = getInventoryItem(itemId);
  return item?.history || [];
}

// ==================== MANIFEST MANAGEMENT ====================

export function getAllManifests(): InventoryManifest[] {
  const stored = localStorage.getItem('inventory_manifests');
  return stored ? JSON.parse(stored) : [];
}

export function getManifest(manifestId: string): InventoryManifest | undefined {
  return getAllManifests().find(m => m.id === manifestId);
}

export function createManifest(data: Omit<InventoryManifest, 'id' | 'createdAt' | 'signatures' | 'totalItems' | 'totalValue' | 'totalWeight'>): InventoryManifest {
  const items = data.items.map(id => getInventoryItem(id)).filter(Boolean) as InventoryItem[];

  const manifest: InventoryManifest = {
    id: `manifest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    totalItems: items.length,
    totalValue: items.reduce((sum, item) => sum + item.estimatedValue, 0),
    totalWeight: items.reduce((sum, item) => sum + (item.weight || 0), 0),
    createdAt: new Date(),
    signatures: {},
  };

  const manifests = getAllManifests();
  manifests.push(manifest);
  localStorage.setItem('inventory_manifests', JSON.stringify(manifests));

  return manifest;
}

export function addSignatureToManifest(manifestId: string, role: 'customer' | 'driver' | 'recipient', signature: { name: string; signature: string }): void {
  const manifests = getAllManifests();
  const manifest = manifests.find(m => m.id === manifestId);

  if (manifest) {
    manifest.signatures[role] = {
      ...signature,
      timestamp: new Date(),
    };

    localStorage.setItem('inventory_manifests', JSON.stringify(manifests));
  }
}

export function finalizeManifest(manifestId: string): void {
  const manifests = getAllManifests();
  const manifest = manifests.find(m => m.id === manifestId);

  if (manifest) {
    manifest.status = 'finalized';
    manifest.finalizedAt = new Date();
    localStorage.setItem('inventory_manifests', JSON.stringify(manifests));
  }
}

// ==================== SEARCH & FILTER ====================

export function searchInventory(query: string): InventoryItem[] {
  const lowerQuery = query.toLowerCase();
  return getAllInventoryItems().filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.qrCode.toLowerCase().includes(lowerQuery) ||
    item.barcode?.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterInventoryByStatus(status: InventoryItem['status']): InventoryItem[] {
  return getAllInventoryItems().filter(item => item.status === status);
}

export function filterInventoryByLocation(locationType: InventoryItem['location']['type']): InventoryItem[] {
  return getAllInventoryItems().filter(item => item.location.type === locationType);
}

export function filterInventoryByJob(jobId: string): InventoryItem[] {
  return getAllInventoryItems().filter(item => item.location.jobId === jobId);
}

export function filterInventoryByStorage(storageBookingId: string): InventoryItem[] {
  return getAllInventoryItems().filter(item => item.location.storageBookingId === storageBookingId);
}

// ==================== ANALYTICS ====================

export function getInventoryAnalytics() {
  const items = getAllInventoryItems();

  const statusBreakdown = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationBreakdown = items.reduce((acc, item) => {
    acc[item.location.type] = (acc[item.location.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);
  const damagedValue = items
    .filter(item => item.status === 'damaged')
    .reduce((sum, item) => sum + item.estimatedValue, 0);

  return {
    totalItems: items.length,
    totalValue,
    statusBreakdown,
    locationBreakdown,
    damagedItems: items.filter(i => i.status === 'damaged').length,
    missingItems: items.filter(i => i.status === 'missing').length,
    damagedValue,
    damageRate: (items.filter(i => i.status === 'damaged').length / (items.length || 1)) * 100,
  };
}

// ==================== BULK OPERATIONS ====================

export function bulkUpdateStatus(itemIds: string[], status: InventoryItem['status'], performedBy: string): void {
  itemIds.forEach(itemId => {
    updateItemStatus(itemId, status, performedBy);
  });
}

export function bulkUpdateLocation(itemIds: string[], location: InventoryItem['location'], performedBy: string): void {
  itemIds.forEach(itemId => {
    updateItemLocation(itemId, location, performedBy);
  });
}

export function generateInventoryReport(filters?: {
  status?: InventoryItem['status'];
  location?: InventoryItem['location']['type'];
  dateFrom?: Date;
  dateTo?: Date;
}): any {
  let items = getAllInventoryItems();

  if (filters) {
    if (filters.status) {
      items = items.filter(i => i.status === filters.status);
    }
    if (filters.location) {
      items = items.filter(i => i.location.type === filters.location);
    }
    if (filters.dateFrom) {
      items = items.filter(i => new Date(i.createdAt) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      items = items.filter(i => new Date(i.createdAt) <= filters.dateTo!);
    }
  }

  return {
    summary: {
      totalItems: items.length,
      totalValue: items.reduce((sum, i) => sum + i.estimatedValue, 0),
      totalWeight: items.reduce((sum, i) => sum + (i.weight || 0), 0),
    },
    items: items.map(item => ({
      qrCode: item.qrCode,
      name: item.name,
      status: item.status,
      location: item.location.type,
      value: item.estimatedValue,
      condition: item.condition,
    })),
    generatedAt: new Date(),
  };
}

// ==================== QR CODE SCANNING ====================

export function scanQRCode(qrCode: string): { success: boolean; item?: InventoryItem; error?: string } {
  const item = getItemByQRCode(qrCode);

  if (!item) {
    return { success: false, error: 'Item not found' };
  }

  // Log scan event
  addInventoryEvent(item.id, {
    type: 'updated',
    description: 'Item scanned',
    performedBy: 'scanner',
  });

  return { success: true, item };
}

export function downloadAllQRCodes(jobId?: string, storageBookingId?: string): void {
  let items = getAllInventoryItems();

  if (jobId) {
    items = items.filter(i => i.location.jobId === jobId);
  }
  if (storageBookingId) {
    items = items.filter(i => i.location.storageBookingId === storageBookingId);
  }

  console.log(`📋 Generating ${items.length} QR code labels...`);
  console.log('QR Codes:', items.map(i => ({ name: i.name, qr: i.qrCode })));

  alert(`${items.length} QR code labels generated!`);
}
