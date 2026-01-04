import React, { useState } from 'react';
import { Package, Search, Plus, Edit2, Trash2, Save, X, Download, AlertTriangle, Users, Box, Check } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  category: string;
  volume: number;
  isHeavy: boolean;
  requires2Men: boolean;
  isActive: boolean;
}

const INITIAL_ITEMS: Item[] = [
  // BOXES & CONTAINERS
  { id: '1', name: 'Small box', category: 'Boxes & Containers', volume: 0.03, isHeavy: false, requires2Men: false, isActive: true },
  { id: '2', name: 'Medium box', category: 'Boxes & Containers', volume: 0.05, isHeavy: false, requires2Men: false, isActive: true },
  { id: '3', name: 'Large box', category: 'Boxes & Containers', volume: 0.08, isHeavy: false, requires2Men: false, isActive: true },
  { id: '4', name: 'Extra large box', category: 'Boxes & Containers', volume: 0.10, isHeavy: false, requires2Men: false, isActive: true },
  { id: '5', name: 'Wardrobe box', category: 'Boxes & Containers', volume: 0.15, isHeavy: false, requires2Men: false, isActive: true },
  { id: '6', name: 'Plastic crate', category: 'Boxes & Containers', volume: 0.06, isHeavy: false, requires2Men: false, isActive: true },
  { id: '7', name: 'Archive box', category: 'Boxes & Containers', volume: 0.07, isHeavy: false, requires2Men: false, isActive: true },
  { id: '8', name: 'Storage bin', category: 'Boxes & Containers', volume: 0.10, isHeavy: false, requires2Men: false, isActive: true },

  // LIVING ROOM
  { id: '9', name: 'Armchair', category: 'Living Room', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '10', name: 'Recliner chair', category: 'Living Room', volume: 0.60, isHeavy: false, requires2Men: false, isActive: true },
  { id: '11', name: '2-seat sofa', category: 'Living Room', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },
  { id: '12', name: '3-seat sofa', category: 'Living Room', volume: 1.80, isHeavy: false, requires2Men: true, isActive: true },
  { id: '13', name: '4-seat sofa', category: 'Living Room', volume: 2.20, isHeavy: true, requires2Men: true, isActive: true },
  { id: '14', name: 'Corner sofa (small)', category: 'Living Room', volume: 2.20, isHeavy: true, requires2Men: true, isActive: true },
  { id: '15', name: 'Corner sofa (large)', category: 'Living Room', volume: 3.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '16', name: 'Sofa bed', category: 'Living Room', volume: 2.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '17', name: 'Chaise longue', category: 'Living Room', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },
  { id: '18', name: 'Footstool', category: 'Living Room', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '19', name: 'Pouffe', category: 'Living Room', volume: 0.25, isHeavy: false, requires2Men: false, isActive: true },
  { id: '20', name: 'Coffee table', category: 'Living Room', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '21', name: 'Side table', category: 'Living Room', volume: 0.25, isHeavy: false, requires2Men: false, isActive: true },
  { id: '22', name: 'Nest of tables', category: 'Living Room', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '23', name: 'TV stand (small)', category: 'Living Room', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '24', name: 'TV stand (large)', category: 'Living Room', volume: 0.70, isHeavy: false, requires2Men: false, isActive: true },
  { id: '25', name: 'Bookcase (small)', category: 'Living Room', volume: 0.60, isHeavy: false, requires2Men: false, isActive: true },
  { id: '26', name: 'Bookcase (medium)', category: 'Living Room', volume: 0.90, isHeavy: false, requires2Men: true, isActive: true },
  { id: '27', name: 'Bookcase (large)', category: 'Living Room', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },
  { id: '28', name: 'Display cabinet', category: 'Living Room', volume: 1.50, isHeavy: false, requires2Men: true, isActive: true },
  { id: '29', name: 'Wall unit', category: 'Living Room', volume: 2.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '30', name: 'TV up to 40"', category: 'Living Room', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '31', name: 'TV 40–60"', category: 'Living Room', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '32', name: 'TV 60"+', category: 'Living Room', volume: 0.40, isHeavy: false, requires2Men: true, isActive: true },

  // BEDROOM
  { id: '33', name: 'Single mattress', category: 'Bedroom', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '34', name: 'Double mattress', category: 'Bedroom', volume: 0.60, isHeavy: false, requires2Men: true, isActive: true },
  { id: '35', name: 'King mattress', category: 'Bedroom', volume: 0.80, isHeavy: false, requires2Men: true, isActive: true },
  { id: '36', name: 'Super king mattress', category: 'Bedroom', volume: 1.00, isHeavy: false, requires2Men: true, isActive: true },
  { id: '37', name: 'Single bed frame', category: 'Bedroom', volume: 0.60, isHeavy: false, requires2Men: false, isActive: true },
  { id: '38', name: 'Double bed frame', category: 'Bedroom', volume: 1.00, isHeavy: false, requires2Men: true, isActive: true },
  { id: '39', name: 'King bed frame', category: 'Bedroom', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },
  { id: '40', name: 'Bed with mattress (double)', category: 'Bedroom', volume: 1.40, isHeavy: true, requires2Men: true, isActive: true },
  { id: '41', name: 'Bunk bed', category: 'Bedroom', volume: 1.80, isHeavy: true, requires2Men: true, isActive: true },
  { id: '42', name: 'Cot / crib', category: 'Bedroom', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '43', name: 'Bedside table', category: 'Bedroom', volume: 0.25, isHeavy: false, requires2Men: false, isActive: true },
  { id: '44', name: 'Chest of drawers (small)', category: 'Bedroom', volume: 0.60, isHeavy: false, requires2Men: false, isActive: true },
  { id: '45', name: 'Chest of drawers (large)', category: 'Bedroom', volume: 1.00, isHeavy: false, requires2Men: true, isActive: true },
  { id: '46', name: 'Dressing table', category: 'Bedroom', volume: 0.80, isHeavy: false, requires2Men: false, isActive: true },
  { id: '47', name: 'Wardrobe 1 door', category: 'Bedroom', volume: 0.80, isHeavy: false, requires2Men: false, isActive: true },
  { id: '48', name: 'Wardrobe 2 doors', category: 'Bedroom', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },
  { id: '49', name: 'Wardrobe 3 doors', category: 'Bedroom', volume: 1.80, isHeavy: true, requires2Men: true, isActive: true },
  { id: '50', name: 'Wardrobe 4 doors', category: 'Bedroom', volume: 2.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '51', name: 'Sliding wardrobe', category: 'Bedroom', volume: 2.80, isHeavy: true, requires2Men: true, isActive: true },
  { id: '52', name: 'Shoe rack', category: 'Bedroom', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '53', name: 'Clothes rail', category: 'Bedroom', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '54', name: 'Mirror (large)', category: 'Bedroom', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },

  // KITCHEN
  { id: '55', name: 'Fridge (under counter)', category: 'Kitchen', volume: 0.60, isHeavy: true, requires2Men: true, isActive: true },
  { id: '56', name: 'Fridge freezer', category: 'Kitchen', volume: 1.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '57', name: 'American fridge', category: 'Kitchen', volume: 1.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '58', name: 'Chest freezer', category: 'Kitchen', volume: 0.80, isHeavy: true, requires2Men: true, isActive: true },
  { id: '59', name: 'Washing machine', category: 'Kitchen', volume: 0.60, isHeavy: true, requires2Men: true, isActive: true },
  { id: '60', name: 'Tumble dryer', category: 'Kitchen', volume: 0.60, isHeavy: true, requires2Men: true, isActive: true },
  { id: '61', name: 'Dishwasher', category: 'Kitchen', volume: 0.60, isHeavy: true, requires2Men: true, isActive: true },
  { id: '62', name: 'Cooker', category: 'Kitchen', volume: 0.70, isHeavy: true, requires2Men: true, isActive: true },
  { id: '63', name: 'Oven', category: 'Kitchen', volume: 0.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '64', name: 'Microwave', category: 'Kitchen', volume: 0.15, isHeavy: false, requires2Men: false, isActive: true },
  { id: '65', name: 'Kitchen unit (single)', category: 'Kitchen', volume: 0.50, isHeavy: false, requires2Men: false, isActive: true },
  { id: '66', name: 'Kitchen unit (double)', category: 'Kitchen', volume: 0.80, isHeavy: false, requires2Men: true, isActive: true },
  { id: '67', name: 'Kitchen island', category: 'Kitchen', volume: 1.20, isHeavy: true, requires2Men: true, isActive: true },
  { id: '68', name: 'Bin', category: 'Kitchen', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },

  // DINING
  { id: '69', name: 'Dining table (2–4 seats)', category: 'Dining', volume: 0.80, isHeavy: false, requires2Men: true, isActive: true },
  { id: '70', name: 'Dining table (6 seats)', category: 'Dining', volume: 1.20, isHeavy: true, requires2Men: true, isActive: true },
  { id: '71', name: 'Dining table (8+ seats)', category: 'Dining', volume: 1.80, isHeavy: true, requires2Men: true, isActive: true },
  { id: '72', name: 'Dining chair', category: 'Dining', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '73', name: 'Bench', category: 'Dining', volume: 0.50, isHeavy: false, requires2Men: false, isActive: true },
  { id: '74', name: 'Sideboard (small)', category: 'Dining', volume: 0.80, isHeavy: false, requires2Men: false, isActive: true },
  { id: '75', name: 'Sideboard (large)', category: 'Dining', volume: 1.40, isHeavy: true, requires2Men: true, isActive: true },
  { id: '76', name: 'China cabinet', category: 'Dining', volume: 1.60, isHeavy: true, requires2Men: true, isActive: true },

  // OFFICE / COMMERCIAL
  { id: '77', name: 'Office desk', category: 'Office / Commercial', volume: 0.80, isHeavy: false, requires2Men: false, isActive: true },
  { id: '78', name: 'Large office desk', category: 'Office / Commercial', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },
  { id: '79', name: 'Office chair', category: 'Office / Commercial', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '80', name: 'Filing cabinet (2 drawer)', category: 'Office / Commercial', volume: 0.60, isHeavy: true, requires2Men: false, isActive: true },
  { id: '81', name: 'Filing cabinet (4 drawer)', category: 'Office / Commercial', volume: 0.90, isHeavy: true, requires2Men: true, isActive: true },
  { id: '82', name: 'Bookshelf', category: 'Office / Commercial', volume: 0.80, isHeavy: false, requires2Men: false, isActive: true },
  { id: '83', name: 'Printer (small)', category: 'Office / Commercial', volume: 0.25, isHeavy: false, requires2Men: false, isActive: true },
  { id: '84', name: 'Printer (large)', category: 'Office / Commercial', volume: 0.60, isHeavy: true, requires2Men: false, isActive: true },
  { id: '85', name: 'Photocopier', category: 'Office / Commercial', volume: 0.80, isHeavy: true, requires2Men: true, isActive: true },
  { id: '86', name: 'Server rack', category: 'Office / Commercial', volume: 1.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '87', name: 'Shop counter', category: 'Office / Commercial', volume: 1.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '88', name: 'Shelving unit', category: 'Office / Commercial', volume: 1.20, isHeavy: false, requires2Men: true, isActive: true },

  // GARAGE / OUTDOOR
  { id: '89', name: 'Bicycle', category: 'Garage / Outdoor', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '90', name: 'E-bike', category: 'Garage / Outdoor', volume: 0.35, isHeavy: false, requires2Men: false, isActive: true },
  { id: '91', name: 'Motorbike', category: 'Garage / Outdoor', volume: 1.20, isHeavy: true, requires2Men: true, isActive: true },
  { id: '92', name: 'Scooter', category: 'Garage / Outdoor', volume: 0.60, isHeavy: false, requires2Men: false, isActive: true },
  { id: '93', name: 'Lawn mower', category: 'Garage / Outdoor', volume: 0.60, isHeavy: true, requires2Men: false, isActive: true },
  { id: '94', name: 'Strimmer', category: 'Garage / Outdoor', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '95', name: 'Tool chest', category: 'Garage / Outdoor', volume: 0.50, isHeavy: true, requires2Men: false, isActive: true },
  { id: '96', name: 'Workbench', category: 'Garage / Outdoor', volume: 1.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '97', name: 'Ladder', category: 'Garage / Outdoor', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '98', name: 'Wheelbarrow', category: 'Garage / Outdoor', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '99', name: 'BBQ (small)', category: 'Garage / Outdoor', volume: 0.60, isHeavy: false, requires2Men: false, isActive: true },
  { id: '100', name: 'BBQ (large)', category: 'Garage / Outdoor', volume: 1.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '101', name: 'Garden table', category: 'Garage / Outdoor', volume: 0.80, isHeavy: false, requires2Men: false, isActive: true },
  { id: '102', name: 'Garden chair', category: 'Garage / Outdoor', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '103', name: 'Shed contents (small)', category: 'Garage / Outdoor', volume: 2.00, isHeavy: false, requires2Men: true, isActive: true },

  // MISC / SPECIAL
  { id: '104', name: 'Suitcase', category: 'Misc / Special', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '105', name: 'Sports equipment', category: 'Misc / Special', volume: 0.40, isHeavy: false, requires2Men: false, isActive: true },
  { id: '106', name: 'Carpet / rug', category: 'Misc / Special', volume: 0.30, isHeavy: false, requires2Men: false, isActive: true },
  { id: '107', name: 'Painting / artwork', category: 'Misc / Special', volume: 0.15, isHeavy: false, requires2Men: false, isActive: true },
  { id: '108', name: 'Mirror (boxed)', category: 'Misc / Special', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '109', name: 'Musical instrument (guitar)', category: 'Misc / Special', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '110', name: 'Drum kit', category: 'Misc / Special', volume: 0.80, isHeavy: false, requires2Men: true, isActive: true },
  { id: '111', name: 'Piano (upright)', category: 'Misc / Special', volume: 2.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '112', name: 'Pool table', category: 'Misc / Special', volume: 2.00, isHeavy: true, requires2Men: true, isActive: true },
  { id: '113', name: 'Safe (small)', category: 'Misc / Special', volume: 0.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '114', name: 'Safe (large)', category: 'Misc / Special', volume: 1.50, isHeavy: true, requires2Men: true, isActive: true },
  { id: '115', name: 'Pallet (standard)', category: 'Misc / Special', volume: 1.20, isHeavy: false, requires2Men: false, isActive: true },
];

// Global adjustment: +2% on all volumes to account for imperfect packing
const ADJUSTED_ITEMS = INITIAL_ITEMS.map(item => ({
  ...item,
  volume: parseFloat((item.volume * 1.02).toFixed(2))
}));

export function ItemsLibrary() {
  const [items, setItems] = useState<Item[]>(ADJUSTED_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    'All',
    'Boxes & Containers',
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Dining',
    'Office / Commercial',
    'Garage / Outdoor',
    'Misc / Special',
  ];

  const categoryIcons: { [key: string]: string } = {
    'Boxes & Containers': '📦',
    'Living Room': '🛋️',
    'Bedroom': '🛏️',
    'Kitchen': '🍽️',
    'Dining': '🍽️',
    'Office / Commercial': '🏢',
    'Garage / Outdoor': '🚲',
    'Misc / Special': '🎮',
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalVolume = filteredItems.reduce((sum, item) => sum + item.volume, 0);
  const heavyItemsCount = filteredItems.filter((item) => item.isHeavy).length;
  const requires2MenCount = filteredItems.filter((item) => item.requires2Men).length;

  // Handle edit
  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const saveEdit = () => {
    if (editingItem) {
      setItems(items.map((item) => (item.id === editingItem.id ? editingItem : item)));
      setEditingId(null);
      setEditingItem(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  // Handle delete
  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Handle add new item
  const addNewItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: 'New Item',
      category: 'Boxes & Containers',
      volume: 0.10,
      isHeavy: false,
      requires2Men: false,
      isActive: true,
    };
    setItems([newItem, ...items]);
    setShowAddModal(false);
    startEdit(newItem);
  };

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'items-library.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Items Library</h2>
          <p className="text-slate-600 mt-1">Comprehensive database of items for residential & commercial moves</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={addNewItem}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Items</p>
              <p className="text-2xl font-bold text-blue-900">{filteredItems.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Total Volume</p>
              <p className="text-2xl font-bold text-purple-900">{totalVolume.toFixed(2)} m³</p>
            </div>
            <Box className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Heavy Items</p>
              <p className="text-2xl font-bold text-orange-900">{heavyItemsCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-700">2-Man Required</p>
              <p className="text-2xl font-bold text-cyan-900">{requires2MenCount}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : `${categoryIcons[cat] || ''} ${cat}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Volume (m³)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Heavy
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2-Man
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  {editingId === item.id && editingItem ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        >
                          {categories.slice(1).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="0.01"
                          value={editingItem.volume}
                          onChange={(e) => setEditingItem({ ...editingItem, volume: parseFloat(e.target.value) })}
                          className="w-24 px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={editingItem.isHeavy}
                          onChange={(e) => setEditingItem({ ...editingItem, isHeavy: e.target.checked })}
                          className="w-5 h-5 rounded text-blue-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={editingItem.requires2Men}
                          onChange={(e) => setEditingItem({ ...editingItem, requires2Men: e.target.checked })}
                          className="w-5 h-5 rounded text-blue-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={editingItem.isActive}
                          onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                          className="w-5 h-5 rounded text-blue-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          {categoryIcons[item.category]} {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">{item.volume.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {item.isHeavy ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            <AlertTriangle className="w-3 h-3" />
                            Heavy
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.requires2Men ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                            <Users className="w-3 h-3" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Check className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <X className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No items found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}