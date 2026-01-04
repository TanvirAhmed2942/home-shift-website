import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Home, CheckCircle, Eye, Clock, Navigation, Ruler, Building2, Truck, Search, Minus, Plus, ChevronUp, ChevronDown, DollarSign, FileText } from 'lucide-react';
import { ItemSelector } from '../ItemSelector';
import { calculateQuote, VEHICLE_TYPES, getRecommendedCrewSize } from '../../../utils/pricingEngine';

// Full items library (would be loaded from API in production)
const ITEMS_LIBRARY = [
  // Boxes & Containers
  { id: '1', name: 'Small box', category: 'Boxes & Containers', volume: 0.03, isHeavy: false, requires2Men: false, isActive: true },
  { id: '2', name: 'Medium box', category: 'Boxes & Containers', volume: 0.05, isHeavy: false, requires2Men: false, isActive: true },
  { id: '3', name: 'Large box', category: 'Boxes & Containers', volume: 0.08, isHeavy: false, requires2Men: false, isActive: true },
  { id: '4', name: 'Extra large box', category: 'Boxes & Containers', volume: 0.10, isHeavy: false, requires2Men: false, isActive: true },
  { id: '5', name: 'Wardrobe box', category: 'Boxes & Containers', volume: 0.31, isHeavy: false, requires2Men: false, isActive: true },
  
  // Living Room
  { id: '9', name: 'Armchair', category: 'Living Room', volume: 0.41, isHeavy: false, requires2Men: true, isActive: true },
  { id: '11', name: '2-seat sofa', category: 'Living Room', volume: 1.22, isHeavy: false, requires2Men: true, isActive: true },
  { id: '12', name: '3-seat sofa', category: 'Living Room', volume: 1.84, isHeavy: false, requires2Men: true, isActive: true },
  { id: '20', name: 'Coffee table', category: 'Living Room', volume: 0.31, isHeavy: false, requires2Men: false, isActive: true },
  { id: '30', name: 'TV up to 40"', category: 'Living Room', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
  { id: '25', name: 'Bookcase (small)', category: 'Living Room', volume: 0.61, isHeavy: false, requires2Men: true, isActive: true },
  
  // Bedroom
  { id: '34', name: 'Double mattress', category: 'Bedroom', volume: 0.61, isHeavy: false, requires2Men: true, isActive: true },
  { id: '38', name: 'Double bed frame', category: 'Bedroom', volume: 1.02, isHeavy: false, requires2Men: true, isActive: true },
  { id: '43', name: 'Bedside table', category: 'Bedroom', volume: 0.26, isHeavy: false, requires2Men: false, isActive: true },
  { id: '48', name: 'Wardrobe 2 doors', category: 'Bedroom', volume: 1.22, isHeavy: false, requires2Men: true, isActive: true },
  { id: '44', name: 'Chest of drawers', category: 'Bedroom', volume: 0.61, isHeavy: false, requires2Men: true, isActive: true },
  
  // Kitchen
  { id: '56', name: 'Fridge freezer', category: 'Kitchen', volume: 1.02, isHeavy: true, requires2Men: true, isActive: true },
  { id: '59', name: 'Washing machine', category: 'Kitchen', volume: 0.61, isHeavy: true, requires2Men: true, isActive: true },
  { id: '64', name: 'Microwave', category: 'Kitchen', volume: 0.15, isHeavy: false, requires2Men: false, isActive: true },
  
  // Dining
  { id: '70', name: 'Dining table (6 seats)', category: 'Dining', volume: 1.22, isHeavy: true, requires2Men: true, isActive: true },
  { id: '72', name: 'Dining chair', category: 'Dining', volume: 0.20, isHeavy: false, requires2Men: false, isActive: true },
];

interface HouseMoveFormProps {
  onShowTerms: () => void;
  onViewPricing: () => void;
}

export function HouseMoveForm({ onShowTerms, onViewPricing }: HouseMoveFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupAddress: '',
    pickupPostcode: '',
    pickupFloor: 'ground',
    pickupHasLift: 'no',
    dropoffAddress: '',
    dropoffPostcode: '',
    dropoffFloor: 'ground',
    dropoffHasLift: 'no',
    date: '',
    time: '',
    hasDate: 'yes',
    propertySize: '',
    packingHelp: false,
    storageNeeded: false,
    assemblyRequired: false,
    disassemblyRequired: false,
    disassemblyCount: 0,
    assemblyCount: 0,
    homeAvailability: 'all-day',
    notes: '',
    agreeToTerms: false,
  });

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState('bedrooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(true);
  const [showInventory, setShowInventory] = useState(true);
  const [distance, setDistance] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const quoteReference = 'SMH-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  const propertyTypes = [
    {
      category: 'House',
      options: [
        { value: 'house-1bed', label: '1 Bedroom House' },
        { value: 'house-2bed', label: '2 Bedroom House' },
        { value: 'house-3bed', label: '3 Bedroom House' },
        { value: 'house-4bed', label: '4 Bedroom House' },
        { value: 'house-5bed', label: '5+ Bedroom House' }
      ]
    },
    {
      category: 'Flat',
      options: [
        { value: 'flat-studio', label: 'Studio Flat' },
        { value: 'flat-1bed', label: '1 Bedroom Flat' },
        { value: 'flat-2bed', label: '2 Bedroom Flat' },
        { value: 'flat-3bed', label: '3 Bedroom Flat' },
        { value: 'flat-4bed', label: '4+ Bedroom Flat' }
      ]
    },
    {
      category: 'Other',
      options: [
        { value: 'office', label: 'Office Space' },
        { value: 'storage', label: 'Storage Unit' },
        { value: 'flatshare', label: 'Flatshare/Single Room' }
      ]
    }
  ];

  const itemCategories = {
    bedrooms: {
      name: 'Bedrooms',
      icon: '🛏️',
      items: [
        { id: 'bed_single', name: 'Single Bed' },
        { id: 'bed_double', name: 'Double Bed' },
        { id: 'bed_king', name: 'King Size Bed' },
        { id: 'bed_queen', name: 'Queen Size Bed' },
        { id: 'bunk_bed', name: 'Bunk Bed' },
        { id: 'mattress_single', name: 'Single Mattress' },
        { id: 'mattress_double', name: 'Double Mattress' },
        { id: 'mattress_king', name: 'King Mattress' },
        { id: 'wardrobe_single', name: 'Single Wardrobe' },
        { id: 'wardrobe_double', name: 'Double Wardrobe' },
        { id: 'wardrobe_triple', name: 'Triple Wardrobe' },
        { id: 'chest_drawers', name: 'Chest of Drawers' },
        { id: 'bedside_table', name: 'Bedside Table' },
        { id: 'dressing_table', name: 'Dressing Table' },
        { id: 'mirror_standing', name: 'Standing Mirror' },
        { id: 'clothes_rail', name: 'Clothes Rail' }
      ]
    },
    living: {
      name: 'Living Room',
      icon: '🛋️',
      items: [
        { id: 'sofa_2seat', name: '2-Seater Sofa' },
        { id: 'sofa_3seat', name: '3-Seater Sofa' },
        { id: 'sofa_corner', name: 'Corner Sofa' },
        { id: 'sofa_bed', name: 'Sofa Bed' },
        { id: 'armchair', name: 'Armchair' },
        { id: 'recliner', name: 'Recliner Chair' },
        { id: 'coffee_table', name: 'Coffee Table' },
        { id: 'side_table', name: 'Side Table' },
        { id: 'tv_stand', name: 'TV Stand' },
        { id: 'tv_unit', name: 'TV Unit/Cabinet' },
        { id: 'tv_small', name: 'Small TV (up to 40")' },
        { id: 'tv_large', name: 'Large TV (40-60")' },
        { id: 'tv_xlarge', name: 'Extra Large TV (60"+)' },
        { id: 'bookshelf', name: 'Bookshelf' },
        { id: 'display_cabinet', name: 'Display Cabinet' },
        { id: 'console_table', name: 'Console Table' },
        { id: 'ottoman', name: 'Ottoman' },
        { id: 'floor_lamp', name: 'Floor Lamp' },
        { id: 'rug_large', name: 'Large Rug' }
      ]
    },
    kitchen: {
      name: 'Kitchen & Dining',
      icon: '🍽️',
      items: [
        { id: 'dining_table_small', name: 'Dining Table (2-4 seats)' },
        { id: 'dining_table', name: 'Dining Table (4-6 seats)' },
        { id: 'dining_table_large', name: 'Dining Table (6-8+ seats)' },
        { id: 'dining_chairs', name: 'Dining Chair' },
        { id: 'bar_stool', name: 'Bar Stool' },
        { id: 'fridge', name: 'Refrigerator' },
        { id: 'fridge_freezer', name: 'Fridge Freezer' },
        { id: 'freezer', name: 'Chest Freezer' },
        { id: 'washing_machine', name: 'Washing Machine' },
        { id: 'dryer', name: 'Tumble Dryer' },
        { id: 'dishwasher', name: 'Dishwasher' },
        { id: 'cooker', name: 'Cooker/Oven' },
        { id: 'microwave', name: 'Microwave' },
        { id: 'kitchen_cabinet', name: 'Kitchen Cabinet' },
        { id: 'kitchen_trolley', name: 'Kitchen Trolley' },
        { id: 'wine_rack', name: 'Wine Rack' }
      ]
    },
    bathroom: {
      name: 'Bathroom',
      icon: '🚿',
      items: [
        { id: 'bathroom_cabinet', name: 'Bathroom Cabinet' },
        { id: 'mirror_large', name: 'Large Mirror' },
        { id: 'mirror_small', name: 'Small Mirror' },
        { id: 'laundry_basket', name: 'Laundry Basket' },
        { id: 'bathroom_shelf', name: 'Bathroom Shelf Unit' },
        { id: 'towel_rail', name: 'Towel Rail/Ladder' }
      ]
    },
    garden: {
      name: 'Garden & Outdoor',
      icon: '🌳',
      items: [
        { id: 'garden_table', name: 'Garden Table' },
        { id: 'garden_chair', name: 'Garden Chair' },
        { id: 'garden_bench', name: 'Garden Bench' },
        { id: 'sun_lounger', name: 'Sun Lounger' },
        { id: 'parasol', name: 'Parasol/Umbrella' },
        { id: 'bbq', name: 'BBQ Grill' },
        { id: 'garden_heater', name: 'Patio Heater' },
        { id: 'plant_pot_large', name: 'Large Plant Pot' },
        { id: 'plant_pot_small', name: 'Small Plant Pot' },
        { id: 'garden_shed', name: 'Garden Shed (small)' },
        { id: 'lawnmower', name: 'Lawnmower' },
        { id: 'garden_tools', name: 'Garden Tools Box' },
        { id: 'bike', name: 'Bicycle' },
        { id: 'trampoline', name: 'Trampoline' },
        { id: 'playhouse', name: 'Children\'s Playhouse' }
      ]
    },
    office: {
      name: 'Office & Study',
      icon: '💼',
      items: [
        { id: 'desk_small', name: 'Small Desk' },
        { id: 'desk_large', name: 'Large Desk' },
        { id: 'office_chair', name: 'Office Chair' },
        { id: 'filing_cabinet', name: 'Filing Cabinet' },
        { id: 'bookcase', name: 'Bookcase' },
        { id: 'printer', name: 'Printer' },
        { id: 'computer_desktop', name: 'Desktop Computer' },
        { id: 'monitor', name: 'Monitor' },
        { id: 'desk_lamp', name: 'Desk Lamp' }
      ]
    },
    boxes: {
      name: 'Boxes & Others',
      icon: '📦',
      items: [
        { id: 'small_box', name: 'Small Box' },
        { id: 'medium_box', name: 'Medium Box' },
        { id: 'large_box', name: 'Large Box' },
        { id: 'wardrobe_box', name: 'Wardrobe Box (hanging)' },
        { id: 'suitcase', name: 'Suitcase' },
        { id: 'bag', name: 'Bag/Holdall' },
        { id: 'vacuum', name: 'Vacuum Cleaner' },
        { id: 'ironing_board', name: 'Ironing Board' },
        { id: 'fan', name: 'Fan' },
        { id: 'heater', name: 'Electric Heater' },
        { id: 'exercise_equipment', name: 'Exercise Equipment' },
        { id: 'musical_instrument', name: 'Musical Instrument' },
        { id: 'artwork', name: 'Artwork/Painting' },
        { id: 'mirror_wall', name: 'Wall Mirror' }
      ]
    }
  };

  // Calculate distance when postcodes are entered
  useEffect(() => {
    if (formData.pickupPostcode && formData.dropoffPostcode) {
      // Simulate distance calculation (in real app, use Google Maps API)
      const randomDistance = Math.floor(Math.random() * 50) + 10; // 10-60 miles
      setDistance(randomDistance);
      setEstimatedTime(Math.floor(randomDistance * 1.5 + 20)); // Rough estimate in minutes
    }
  }, [formData.pickupPostcode, formData.dropoffPostcode]);

  const updateItemCount = (itemId: string, delta: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setShowQuote(true);
    setTimeout(() => {
      alert('Thank you! Your house move booking has been submitted. Reference: ' + quoteReference);
      setShowQuote(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getTotalItems = () => Object.values(selectedItems).reduce((sum, count) => sum + count, 0);

  const getFilteredItems = () => {
    const currentCategory = itemCategories[activeTab as keyof typeof itemCategories];
    if (!searchQuery) return currentCategory.items;
    return currentCategory.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (showQuote) {
    return (
      <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200/50">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Quote Request Submitted!</h3>
              <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 mb-6">
                <p className="text-sm text-slate-600">Your Reference Number</p>
                <p className="text-2xl font-bold text-blue-600">{quoteReference}</p>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                We'll contact you shortly with a detailed quote for your house move.
              </p>
              <button onClick={() => setShowQuote(false)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-12 lg:py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Professional Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
              <Home className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-slate-900">House Move</h2>
              <p className="text-slate-600 text-base lg:text-lg">Complete home relocation service</p>
            </div>
          </div>
          <p className="text-slate-600 text-base lg:text-xl max-w-2xl mx-auto">
            Fill out the details below to get your personalized quote
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-12 border border-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* Customer Details */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm">1</div>
                    Your Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone *" className="mt-4 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                </div>

                {/* Property Type - Organized Dropdown */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm">2</div>
                    Property Type
                  </h3>
                  <select 
                    name="propertySize" 
                    value={formData.propertySize} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="">Select your property type *</option>
                    {propertyTypes.map((category) => (
                      <optgroup key={category.category} label={category.category}>
                        {category.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Addresses with Floor & Lift */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm">3</div>
                    Moving From & To
                  </h3>
                  <div className="space-y-4">
                    {/* Pickup Address */}
                    <div className="p-4 lg:p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">Collection Address</span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} required placeholder="Full address *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                          </div>
                          <input type="text" name="pickupPostcode" value={formData.pickupPostcode} onChange={handleChange} required placeholder="Postcode *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Floor Level</label>
                            <select name="pickupFloor" value={formData.pickupFloor} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                              <option value="ground">Ground Floor</option>
                              <option value="1">1st Floor</option>
                              <option value="2">2nd Floor</option>
                              <option value="3">3rd Floor</option>
                              <option value="4">4th Floor</option>
                              <option value="5">5th Floor</option>
                              <option value="6">6th Floor+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              <Building2 className="w-4 h-4 inline mr-1" />
                              Lift Available?
                            </label>
                            <select name="pickupHasLift" value={formData.pickupHasLift} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                              <option value="no">No Lift</option>
                              <option value="yes">Yes - Lift Available</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="p-4 lg:p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-slate-900">Delivery Address</span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input type="text" name="dropoffAddress" value={formData.dropoffAddress} onChange={handleChange} required placeholder="Full address *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none" />
                          </div>
                          <input type="text" name="dropoffPostcode" value={formData.dropoffPostcode} onChange={handleChange} required placeholder="Postcode *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Floor Level</label>
                            <select name="dropoffFloor" value={formData.dropoffFloor} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none">
                              <option value="ground">Ground Floor</option>
                              <option value="1">1st Floor</option>
                              <option value="2">2nd Floor</option>
                              <option value="3">3rd Floor</option>
                              <option value="4">4th Floor</option>
                              <option value="5">5th Floor</option>
                              <option value="6">6th Floor+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              <Building2 className="w-4 h-4 inline mr-1" />
                              Lift Available?
                            </label>
                            <select name="dropoffHasLift" value={formData.dropoffHasLift} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none">
                              <option value="no">No Lift</option>
                              <option value="yes">Yes - Lift Available</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moving Date */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm">4</div>
                    Estimated Move Date
                  </h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${formData.hasDate === 'yes' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                        <input type="radio" name="hasDate" value="yes" checked={formData.hasDate === 'yes'} onChange={handleChange} className="sr-only" />
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-sm lg:text-base">Select a date</span>
                        </div>
                      </label>
                      <label className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${formData.hasDate === 'no' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                        <input type="radio" name="hasDate" value="no" checked={formData.hasDate === 'no'} onChange={handleChange} className="sr-only" />
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-sm lg:text-base">Don't have a date yet</span>
                        </div>
                      </label>
                    </div>

                    {formData.hasDate === 'yes' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required={formData.hasDate === 'yes'} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                        <select name="time" value={formData.time} onChange={handleChange} required={formData.hasDate === 'yes'} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                          <option value="">Select time slot</option>
                          <option value="morning">Morning (7-11 AM)</option>
                          <option value="midday">Midday (11 AM-3 PM)</option>
                          <option value="afternoon">Afternoon (3-7 PM)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Services */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm">5</div>
                    Additional Services
                  </h3>
                  <div className="space-y-4">
                    {/* Packing Service */}
                    <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                      <input 
                        type="checkbox" 
                        name="packingHelp" 
                        checked={formData.packingHelp} 
                        onChange={handleChange} 
                        className="w-5 h-5 rounded text-blue-600" 
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm lg:text-base">📦 Packing Service</div>
                        <div className="text-sm text-slate-600">We pack your boxes for you</div>
                      </div>
                    </label>

                    {/* Assembly Service */}
                    <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                      <input 
                        type="checkbox" 
                        name="assemblyRequired" 
                        checked={formData.assemblyRequired} 
                        onChange={handleChange} 
                        className="w-5 h-5 rounded text-blue-600" 
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm lg:text-base">🛠️ Furniture Assembly</div>
                        <div className="text-sm text-slate-600">Disassembly and reassembly</div>
                      </div>
                    </label>

                    {/* Storage */}
                    <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                      <input 
                        type="checkbox" 
                        name="storageNeeded" 
                        checked={formData.storageNeeded} 
                        onChange={handleChange} 
                        className="w-5 h-5 rounded text-blue-600" 
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm lg:text-base">🏢 Storage Required</div>
                        <div className="text-sm text-slate-600">Secure storage facility</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Inventory (Optional) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowInventory(!showInventory)}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm">6</div>
                      Items List (Optional)
                    </h3>
                    {showInventory ? <ChevronUp className="w-6 h-6 text-slate-600" /> : <ChevronDown className="w-6 h-6 text-slate-600" />}
                  </button>

                  {showInventory && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 mb-4">
                        Adding items helps us provide a more accurate quote. You can skip this if you prefer a rough estimate.
                      </p>
                      <ItemSelector 
                        selectedItems={Object.entries(selectedItems).map(([id, quantity]) => ({ itemId: id, quantity }))}
                        onChange={(items) => {
                          const newItems: { [key: string]: number } = {};
                          items.forEach(i => newItems[i.itemId] = i.quantity);
                          setSelectedItems(newItems);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Notes */}
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any special instructions, parking restrictions, or fragile items?" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none" />

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-blue-600" />
                  <label className="text-sm text-slate-700">
                    I agree to the <button type="button" onClick={onShowTerms} className="text-blue-600 hover:underline font-medium">Terms & Conditions</button> and <button type="button" className="text-blue-600 hover:underline font-medium">Privacy Policy</button>
                  </label>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold flex items-center justify-center gap-2">
                  Get My Free Quote
                  <Truck className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Move Summary</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-slate-600">Service</span>
                  <span className="font-semibold">House Move</span>
                </div>
                {formData.propertySize && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Property</span>
                    <span className="font-semibold capitalize">{formData.propertySize.replace('-', ' ')}</span>
                  </div>
                )}
                {formData.pickupPostcode && formData.dropoffPostcode && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Est. Distance</span>
                    <span className="font-semibold">{distance} miles</span>
                  </div>
                )}
                {estimatedTime > 0 && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Est. Time</span>
                    <span className="font-semibold">~{Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m</span>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-center text-slate-600 leading-relaxed">
                  ✓ Licensed & Insured<br />
                  ✓ Trusted by 10k+ Customers<br />
                  ✓ Free Cancellation<br />
                  ✓ No Hidden Fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
