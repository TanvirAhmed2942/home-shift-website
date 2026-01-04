import React, { useState } from 'react';
import { Package, Plus, Minus, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  category: string;
  volume: number;
  icon: string;
}

interface ItemSelectorProps {
  selectedItems: { itemId: string; quantity: number }[];
  onChange: (items: { itemId: string; quantity: number }[]) => void;
  totalVolume?: number;
}

// Curated list of most common items for website (full library in admin)
const COMMON_ITEMS: Item[] = [
  // Boxes
  { id: '2', name: 'Medium box', category: 'Boxes', volume: 0.05, icon: '📦' },
  { id: '3', name: 'Large box', category: 'Boxes', volume: 0.08, icon: '📦' },
  { id: '4', name: 'Extra large box', category: 'Boxes', volume: 0.10, icon: '📦' },
  
  // Living Room
  { id: '9', name: 'Armchair', category: 'Living Room', volume: 0.41, icon: '🪑' },
  { id: '11', name: '2-seat sofa', category: 'Living Room', volume: 1.22, icon: '🛋️' },
  { id: '12', name: '3-seat sofa', category: 'Living Room', volume: 1.84, icon: '🛋️' },
  { id: '20', name: 'Coffee table', category: 'Living Room', volume: 0.31, icon: '🪑' },
  { id: '30', name: 'TV up to 40"', category: 'Living Room', volume: 0.20, icon: '📺' },
  { id: '25', name: 'Bookcase (small)', category: 'Living Room', volume: 0.61, icon: '📚' },
  
  // Bedroom
  { id: '34', name: 'Double mattress', category: 'Bedroom', volume: 0.61, icon: '🛏️' },
  { id: '38', name: 'Double bed frame', category: 'Bedroom', volume: 1.02, icon: '🛏️' },
  { id: '43', name: 'Bedside table', category: 'Bedroom', volume: 0.26, icon: '🪑' },
  { id: '48', name: 'Wardrobe 2 doors', category: 'Bedroom', volume: 1.22, icon: '🚪' },
  { id: '44', name: 'Chest of drawers', category: 'Bedroom', volume: 0.61, icon: '🗄️' },
  
  // Kitchen
  { id: '56', name: 'Fridge freezer', category: 'Kitchen', volume: 1.02, icon: '🧊' },
  { id: '59', name: 'Washing machine', category: 'Kitchen', volume: 0.61, icon: '🌀' },
  { id: '64', name: 'Microwave', category: 'Kitchen', volume: 0.15, icon: '📻' },
  
  // Dining
  { id: '70', name: 'Dining table (6 seats)', category: 'Dining', volume: 1.22, icon: '🍽️' },
  { id: '72', name: 'Dining chair', category: 'Dining', volume: 0.20, icon: '🪑' },
];

const CATEGORIES = ['All', 'Boxes', 'Living Room', 'Bedroom', 'Kitchen', 'Dining'];

export function ItemSelector({ selectedItems, onChange, totalVolume }: ItemSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = COMMON_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addItem = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing) {
      onChange(selectedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      onChange([...selectedItems, { itemId, quantity: 1 }]);
    }
  };

  const removeItem = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing && existing.quantity > 1) {
      onChange(selectedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i)));
    } else {
      onChange(selectedItems.filter((i) => i.itemId !== itemId));
    }
  };

  const deleteItem = (itemId: string) => {
    onChange(selectedItems.filter((i) => i.itemId !== itemId));
  };

  // Calculate total volume
  const calculatedVolume = selectedItems.reduce((total, selectedItem) => {
    const item = COMMON_ITEMS.find((i) => i.id === selectedItem.itemId);
    return total + (item ? item.volume * selectedItem.quantity : 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Header with total */}
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-900">
          Select Your Items <span className="text-red-500">*</span>
        </label>
        {selectedItems.length > 0 && (
          <div className="text-sm">
            <span className="text-slate-600">Total volume: </span>
            <span className="font-bold text-blue-600">{calculatedVolume.toFixed(2)} m³</span>
          </div>
        )}
      </div>

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-blue-900">
              Selected Items ({selectedItems.length})
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {isOpen ? 'Hide' : 'Add More'}
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <div className="space-y-2">
            {selectedItems.map((selectedItem) => {
              const item = COMMON_ITEMS.find((i) => i.id === selectedItem.itemId);
              if (!item) return null;
              return (
                <div
                  key={selectedItem.itemId}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        {item.volume.toFixed(2)} m³ each • {(item.volume * selectedItem.quantity).toFixed(2)} m³ total
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-900 w-8 text-center">{selectedItem.quantity}</span>
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Items Button (if no items selected yet) */}
      {selectedItems.length === 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-blue-600 font-medium"
        >
          <Package className="w-5 h-5" />
          Click to select items
        </button>
      )}

      {/* Items Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-slate-900">Select Items</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45 text-slate-600" />
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredItems.map((item) => {
                  const selected = selectedItems.find((i) => i.itemId === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => !selected && addItem(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-sm truncate">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.category}</div>
                          <div className="text-xs font-bold text-blue-600 mt-1">{item.volume.toFixed(2)} m³</div>
                        </div>
                      </div>

                      {selected ? (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-slate-900 px-3">{selected.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addItem(item.id);
                            }}
                            className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Add Item
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No items found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Total Volume:</div>
                <div className="text-2xl font-bold text-blue-600">{calculatedVolume.toFixed(2)} m³</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Done ({selectedItems.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
