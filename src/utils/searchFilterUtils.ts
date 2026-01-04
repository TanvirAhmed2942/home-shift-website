/**
 * SEARCH & FILTER UTILITIES
 * Advanced filtering and sorting for jobs, users, documents, etc.
 */

import { SearchFilters } from '../components/AdvancedSearch';

// ==================== TYPES ====================

export interface Filterable {
  [key: string]: any;
}

// ==================== SEARCH FUNCTIONS ====================

/**
 * Filter array of items based on search filters
 */
export function applyFilters<T extends Filterable>(
  items: T[],
  filters: SearchFilters,
  searchFields: string[] = []
): T[] {
  let filtered = [...items];

  // 1. Text Search (search in multiple fields)
  if (filters.searchQuery && searchFields.length > 0) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((item) =>
      searchFields.some((field) => {
        const value = getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(query);
      })
    );
  }

  // 2. Status Filter
  if (filters.status.length > 0) {
    filtered = filtered.filter((item) =>
      filters.status.includes(item.status)
    );
  }

  // 3. Date Range Filter
  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt || item.scheduledDate);
      const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const to = filters.dateTo ? new Date(filters.dateTo) : null;

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      return true;
    });
  }

  // 4. Price Range Filter
  if (filters.priceMin || filters.priceMax) {
    filtered = filtered.filter((item) => {
      const price = parseFloat(item.price || item.amount || item.total || 0);
      const min = filters.priceMin ? parseFloat(filters.priceMin) : 0;
      const max = filters.priceMax ? parseFloat(filters.priceMax) : Infinity;

      return price >= min && price <= max;
    });
  }

  // 5. Service Type Filter
  if (filters.serviceType.length > 0) {
    filtered = filtered.filter((item) =>
      filters.serviceType.includes(item.serviceType || item.service)
    );
  }

  // 6. Vehicle Type Filter
  if (filters.vehicleType.length > 0) {
    filtered = filtered.filter((item) =>
      filters.vehicleType.includes(item.vehicleType || item.vehicle)
    );
  }

  // 7. Location Filter
  if (filters.location) {
    const locationQuery = filters.location.toLowerCase();
    filtered = filtered.filter((item) => {
      const pickup = (item.pickupAddress || '').toLowerCase();
      const delivery = (item.deliveryAddress || '').toLowerCase();
      const location = (item.location || '').toLowerCase();

      return (
        pickup.includes(locationQuery) ||
        delivery.includes(locationQuery) ||
        location.includes(locationQuery)
      );
    });
  }

  return filtered;
}

/**
 * Sort array of items
 */
export function applySorting<T extends Filterable>(
  items: T[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): T[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    let valueA = getNestedValue(a, sortBy);
    let valueB = getNestedValue(b, sortBy);

    // Handle dates
    if (sortBy === 'date' || sortBy.includes('Date') || sortBy.includes('At')) {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    // Handle numbers
    if (typeof valueA === 'number' || typeof valueB === 'number') {
      valueA = parseFloat(valueA) || 0;
      valueB = parseFloat(valueB) || 0;
    }

    // Handle strings
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    // Compare
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Apply both filters and sorting
 */
export function filterAndSort<T extends Filterable>(
  items: T[],
  filters: SearchFilters,
  searchFields: string[] = []
): T[] {
  let result = applyFilters(items, filters, searchFields);
  result = applySorting(result, filters.sortBy, filters.sortOrder);
  return result;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get nested object value by path (e.g., "user.profile.name")
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Highlight search matches in text
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>');
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export data to CSV
 */
export function exportToCSV<T extends Filterable>(
  data: T[],
  filename: string = 'export.csv',
  fields: string[] = []
): void {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Use provided fields or all keys from first item
  const headers = fields.length > 0 ? fields : Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data rows
    ...data.map((item) =>
      headers.map((header) => {
        const value = getNestedValue(item, header);
        // Escape commas and quotes
        const escaped = String(value || '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    ),
  ].join('\n');

  // Download
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export data to JSON
 */
export function exportToJSON<T extends Filterable>(
  data: T[],
  filename: string = 'export.json'
): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Generate PDF report (simplified mock)
 */
export function exportToPDF<T extends Filterable>(
  data: T[],
  filename: string = 'export.pdf',
  title: string = 'Export Report'
): void {
  // In production, use a library like jsPDF or html2pdf
  console.log('PDF Export:', { data, filename, title });
  alert('PDF export functionality would be implemented with jsPDF library in production');
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==================== SAVED SEARCHES ====================

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}

class SavedSearchManager {
  private key = 'shiftmyhome_saved_searches';

  getSavedSearches(): SavedSearch[] {
    const saved = localStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : [];
  }

  saveSearch(name: string, filters: SearchFilters): void {
    const searches = this.getSavedSearches();
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      filters,
      createdAt: new Date(),
    };
    searches.push(newSearch);
    localStorage.setItem(this.key, JSON.stringify(searches));
  }

  deleteSearch(id: string): void {
    const searches = this.getSavedSearches().filter(s => s.id !== id);
    localStorage.setItem(this.key, JSON.stringify(searches));
  }

  loadSearch(id: string): SearchFilters | null {
    const search = this.getSavedSearches().find(s => s.id === id);
    return search?.filters || null;
  }
}

export const savedSearchManager = new SavedSearchManager();

// ==================== QUICK FILTERS ====================

export const quickFilters = {
  today: (): Partial<SearchFilters> => {
    const today = new Date().toISOString().split('T')[0];
    return {
      dateFrom: today,
      dateTo: today,
    };
  },

  thisWeek: (): Partial<SearchFilters> => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      dateFrom: monday.toISOString().split('T')[0],
      dateTo: sunday.toISOString().split('T')[0],
    };
  },

  thisMonth: (): Partial<SearchFilters> => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      dateFrom: firstDay.toISOString().split('T')[0],
      dateTo: lastDay.toISOString().split('T')[0],
    };
  },

  pending: (): Partial<SearchFilters> => ({
    status: ['pending'],
  }),

  active: (): Partial<SearchFilters> => ({
    status: ['confirmed', 'in-progress'],
  }),

  completed: (): Partial<SearchFilters> => ({
    status: ['completed'],
  }),

  highValue: (): Partial<SearchFilters> => ({
    priceMin: '500',
  }),
};

// ==================== STATISTICS ====================

export function calculateFilterStats<T extends Filterable>(
  items: T[],
  field: string
): Record<string, number> {
  const stats: Record<string, number> = {};

  items.forEach((item) => {
    const value = getNestedValue(item, field);
    if (value) {
      stats[value] = (stats[value] || 0) + 1;
    }
  });

  return stats;
}

export function calculatePriceStats<T extends Filterable>(
  items: T[],
  priceField: string = 'price'
): {
  total: number;
  average: number;
  min: number;
  max: number;
  count: number;
} {
  if (items.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0, count: 0 };
  }

  const prices = items.map(item => parseFloat(getNestedValue(item, priceField) || 0));

  return {
    total: prices.reduce((sum, price) => sum + price, 0),
    average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    min: Math.min(...prices),
    max: Math.max(...prices),
    count: items.length,
  };
}
