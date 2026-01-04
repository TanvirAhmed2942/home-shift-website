import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Plus,
  Minus,
  FileText,
  Armchair,
  CheckCircle,
  DollarSign,
  Eye,
  Building2,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Navigation,
  Ruler,
} from "lucide-react";

interface FurnitureFormProps {
  onShowTerms: () => void;
  onViewPricing: () => void;
}

export function FurnitureForm({
  onShowTerms,
  onViewPricing,
}: FurnitureFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupAddress: "",
    pickupPostcode: "",
    pickupFloor: "ground",
    pickupHasLift: "no",
    dropoffAddress: "",
    dropoffPostcode: "",
    dropoffFloor: "ground",
    dropoffHasLift: "no",
    date: "",
    timeSlot: "",
    homeAvailability: "all-day", // New: when you're home
    assemblyRequired: false,
    disassemblyRequired: false,
    disassemblyCount: 0,
    assemblyCount: 0,
    notes: "",
    agreeToTerms: false,
  });

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {}
  );
  const [activeTab, setActiveTab] = useState("sofas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [showItemsSection, setShowItemsSection] = useState(true);
  const [showLocationInfo, setShowLocationInfo] = useState(true);
  const [distance, setDistance] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const quoteReference =
    "SMH-FUR-" + Math.random().toString(36).substr(2, 8).toUpperCase();

  // Categorized furniture items
  const itemCategories = {
    sofas: {
      name: "Sofas & Seating",
      icon: "🛋️",
      items: [
        { id: "sofa_2seat", name: "2-Seater Sofa" },
        { id: "sofa_3seat", name: "3-Seater Sofa" },
        { id: "sofa_corner", name: "Corner Sofa (L-shaped)" },
        { id: "sofa_bed", name: "Sofa Bed" },
        { id: "armchair", name: "Armchair" },
        { id: "recliner", name: "Recliner Chair" },
        { id: "loveseat", name: "Loveseat" },
        { id: "chaise", name: "Chaise Lounge" },
        { id: "bean_bag", name: "Bean Bag" },
      ],
    },
    beds: {
      name: "Beds & Mattresses",
      icon: "🛏️",
      items: [
        { id: "bed_single", name: "Single Bed Frame" },
        { id: "bed_double", name: "Double Bed Frame" },
        { id: "bed_king", name: "King Size Bed Frame" },
        { id: "bed_queen", name: "Queen Size Bed Frame" },
        { id: "bunk_bed", name: "Bunk Bed" },
        { id: "mattress_single", name: "Single Mattress" },
        { id: "mattress_double", name: "Double Mattress" },
        { id: "mattress_king", name: "King Size Mattress" },
        { id: "mattress_queen", name: "Queen Size Mattress" },
        { id: "headboard", name: "Headboard" },
      ],
    },
    storage: {
      name: "Wardrobes & Storage",
      icon: "🚪",
      items: [
        { id: "wardrobe_single", name: "Single Wardrobe" },
        { id: "wardrobe_double", name: "Double Wardrobe" },
        { id: "wardrobe_triple", name: "Triple Wardrobe" },
        { id: "wardrobe_sliding", name: "Sliding Door Wardrobe" },
        { id: "chest_drawers_3", name: "3-Drawer Chest" },
        { id: "chest_drawers_5", name: "5-Drawer Chest" },
        { id: "chest_drawers_tall", name: "Tall Boy Chest" },
        { id: "dresser", name: "Dresser/Sideboard" },
        { id: "ottoman_storage", name: "Storage Ottoman" },
      ],
    },
    tables: {
      name: "Tables & Desks",
      icon: "🍽️",
      items: [
        { id: "dining_table_small", name: "Dining Table (2-4 person)" },
        { id: "dining_table", name: "Dining Table (4-6 person)" },
        { id: "dining_table_large", name: "Dining Table (6-8+ person)" },
        { id: "coffee_table", name: "Coffee Table" },
        { id: "side_table", name: "Side Table" },
        { id: "console_table", name: "Console Table" },
        { id: "desk_small", name: "Small Desk" },
        { id: "desk_large", name: "Large Desk/Executive Desk" },
        { id: "desk_corner", name: "Corner Desk" },
      ],
    },
    chairs: {
      name: "Chairs",
      icon: "🪑",
      items: [
        { id: "dining_chair", name: "Dining Chair" },
        { id: "office_chair", name: "Office Chair" },
        { id: "bar_stool", name: "Bar Stool" },
        { id: "gaming_chair", name: "Gaming Chair" },
        { id: "accent_chair", name: "Accent Chair" },
      ],
    },
    shelving: {
      name: "Shelving & Cabinets",
      icon: "📚",
      items: [
        { id: "bookshelf_small", name: "Small Bookshelf (3-4 shelves)" },
        { id: "bookshelf_large", name: "Large Bookshelf (5+ shelves)" },
        { id: "display_cabinet", name: "Display Cabinet/China Cabinet" },
        { id: "tv_stand", name: "TV Stand" },
        { id: "tv_unit", name: "TV Unit/Entertainment Center" },
        { id: "filing_cabinet", name: "Filing Cabinet" },
        { id: "shoe_cabinet", name: "Shoe Cabinet" },
      ],
    },
    other: {
      name: "Other Items",
      icon: "📦",
      items: [
        { id: "mirror_large", name: "Large Mirror" },
        { id: "mirror_standing", name: "Standing Mirror" },
        { id: "bedside_table", name: "Bedside Table" },
        { id: "dressing_table", name: "Dressing Table" },
        { id: "bench", name: "Bench" },
        { id: "piano", name: "Piano/Keyboard" },
        { id: "gym_equipment", name: "Gym Equipment" },
        { id: "appliance_large", name: "Large Appliance" },
      ],
    },
  };

  const updateItemCount = (itemId: string, delta: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms & Conditions");
      return;
    }
    setShowQuote(true);
    setTimeout(() => {
      alert(
        "Thank you! Your furniture delivery quote request has been submitted. Reference: " +
          quoteReference
      );
      setShowQuote(false);
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const getTotalItems = () =>
    Object.values(selectedItems).reduce((sum, count) => sum + count, 0);

  const getFilteredItems = () => {
    const currentCategory =
      itemCategories[activeTab as keyof typeof itemCategories];
    if (!searchQuery) return currentCategory.items;
    return currentCategory.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  if (showQuote) {
    return (
      <section
        id="booking"
        className="py-12 lg:py-24 px-4 bg-gradient-to-br from-white via-purple-50 to-pink-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200/50">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Quote Request Submitted!
              </h3>
              <div className="inline-block bg-purple-50 border border-purple-200 rounded-xl px-6 py-3 mb-6">
                <p className="text-sm text-slate-600">Your Reference Number</p>
                <p className="text-2xl font-bold text-purple-600">
                  {quoteReference}
                </p>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                We'll contact you shortly with a detailed quote for your
                furniture delivery.
              </p>
              <button
                onClick={() => setShowQuote(false)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="booking"
      className="py-12 lg:py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Professional Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl">
              <Armchair className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-slate-900">
                Furniture & Items
              </h2>
              <p className="text-slate-600 text-base lg:text-lg">
                Safe delivery & assembly service
              </p>
            </div>
          </div>
          <p className="text-slate-600 text-base lg:text-xl max-w-2xl mx-auto">
            Professional furniture delivery with optional assembly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-12 border border-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* Customer Details */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm">
                      1
                    </div>
                    Your Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name *"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email *"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone *"
                    className="mt-4 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  />
                </div>

                {/* Select Furniture - Collapsible with Tabs */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowItemsSection(!showItemsSection)}
                    className="w-full flex items-center justify-between mb-4 lg:mb-6"
                  >
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm">
                        2
                      </div>
                      Select Furniture Items ({getTotalItems()})
                    </h3>
                    {showItemsSection ? (
                      <ChevronUp className="w-6 h-6 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-600" />
                    )}
                  </button>

                  {showItemsSection && (
                    <div className="space-y-4">
                      {/* Tab Navigation */}
                      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                        {Object.entries(itemCategories).map(
                          ([key, category]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setActiveTab(key)}
                              className={`px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base ${
                                activeTab === key
                                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              <span className="mr-2">{category.icon}</span>
                              <span className="hidden sm:inline">
                                {category.name}
                              </span>
                            </button>
                          )
                        )}
                      </div>

                      {/* Search Box */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for furniture items..."
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        />
                      </div>

                      {/* Items Grid */}
                      <div className="grid md:grid-cols-2 gap-3 lg:gap-4 max-h-96 overflow-y-auto p-2">
                        {getFilteredItems().map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 hover:border-purple-400 transition-all"
                          >
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateItemCount(item.id, -1)}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-red-50 hover:border-red-300 transition-all"
                              >
                                <Minus className="w-4 h-4 mx-auto" />
                              </button>
                              <div className="w-10 text-center font-bold text-purple-600">
                                {selectedItems[item.id] || 0}
                              </div>
                              <button
                                type="button"
                                onClick={() => updateItemCount(item.id, 1)}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-green-50 hover:border-green-300 transition-all"
                              >
                                <Plus className="w-4 h-4 mx-auto" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Addresses with Floor & Lift */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm">
                      3
                    </div>
                    Pickup & Delivery Address
                  </h3>
                  <div className="space-y-4">
                    {/* Pickup Address */}
                    <div className="p-4 lg:p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          Pickup Address (Store/Seller)
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              name="pickupAddress"
                              value={formData.pickupAddress}
                              onChange={handleChange}
                              required
                              placeholder="Full address *"
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />
                          </div>
                          <input
                            type="text"
                            name="pickupPostcode"
                            value={formData.pickupPostcode}
                            onChange={handleChange}
                            required
                            placeholder="Postcode *"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Floor Level
                            </label>
                            <select
                              name="pickupFloor"
                              value={formData.pickupFloor}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            >
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
                            <select
                              name="pickupHasLift"
                              value={formData.pickupHasLift}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            >
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
                        <span className="font-semibold text-slate-900">
                          Delivery Address
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              name="dropoffAddress"
                              value={formData.dropoffAddress}
                              onChange={handleChange}
                              required
                              placeholder="Full address *"
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            />
                          </div>
                          <input
                            type="text"
                            name="dropoffPostcode"
                            value={formData.dropoffPostcode}
                            onChange={handleChange}
                            required
                            placeholder="Postcode *"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Floor Level
                            </label>
                            <select
                              name="dropoffFloor"
                              value={formData.dropoffFloor}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            >
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
                            <select
                              name="dropoffHasLift"
                              value={formData.dropoffHasLift}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                            >
                              <option value="no">No Lift</option>
                              <option value="yes">Yes - Lift Available</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Date & Home Availability */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm">
                      4
                    </div>
                    Delivery Date & Time
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Time Slot
                        </label>
                        <select
                          name="timeSlot"
                          value={formData.timeSlot}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        >
                          <option value="">Select time slot</option>
                          <option value="morning">Morning (7-11 AM)</option>
                          <option value="midday">Midday (11 AM-3 PM)</option>
                          <option value="afternoon">Afternoon (3-7 PM)</option>
                        </select>
                      </div>
                    </div>

                    {/* When will you be home? */}
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <label className="block text-sm font-medium text-slate-900 mb-3">
                        <Clock className="w-4 h-4 inline mr-1" />
                        When will you be home to receive delivery?
                      </label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <label
                          className={`cursor-pointer rounded-lg border-2 p-3 transition-all text-center ${
                            formData.homeAvailability === "all-day"
                              ? "border-purple-500 bg-purple-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="homeAvailability"
                            value="all-day"
                            checked={formData.homeAvailability === "all-day"}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="font-semibold text-sm">All Day</div>
                          <div className="text-xs text-slate-600">
                            Flexible timing
                          </div>
                        </label>
                        <label
                          className={`cursor-pointer rounded-lg border-2 p-3 transition-all text-center ${
                            formData.homeAvailability === "morning-only"
                              ? "border-purple-500 bg-purple-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="homeAvailability"
                            value="morning-only"
                            checked={
                              formData.homeAvailability === "morning-only"
                            }
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="font-semibold text-sm">
                            Morning Only
                          </div>
                          <div className="text-xs text-slate-600">
                            Before 12 PM
                          </div>
                        </label>
                        <label
                          className={`cursor-pointer rounded-lg border-2 p-3 transition-all text-center ${
                            formData.homeAvailability === "afternoon-only"
                              ? "border-purple-500 bg-purple-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="homeAvailability"
                            value="afternoon-only"
                            checked={
                              formData.homeAvailability === "afternoon-only"
                            }
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="font-semibold text-sm">
                            Afternoon Only
                          </div>
                          <div className="text-xs text-slate-600">
                            After 12 PM
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm">
                      5
                    </div>
                    Additional Services
                  </h3>
                  <div className="space-y-4">
                    {/* Disassembly Service */}
                    <div className="p-4 border-2 border-slate-200 rounded-xl hover:border-red-300 transition-all">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="disassemblyRequired"
                          checked={formData.disassemblyRequired}
                          onChange={handleChange}
                          className="w-5 h-5 rounded text-red-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm lg:text-base">
                            🔧 Disassembly Service (at Pickup)
                          </div>
                          <div className="text-sm text-slate-600">
                            Take apart furniture before moving
                          </div>
                        </div>
                      </label>

                      {/* Counter for disassembly items */}
                      {formData.disassemblyRequired && (
                        <div className="mt-3 pl-8 flex items-center gap-3">
                          <span className="text-sm text-slate-700">
                            How many items to disassemble?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  disassemblyCount: Math.max(
                                    0,
                                    prev.disassemblyCount - 1
                                  ),
                                }))
                              }
                              className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >
                              -
                            </button>
                            <span className="font-bold w-6 text-center">
                              {formData.disassemblyCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  disassemblyCount: prev.disassemblyCount + 1,
                                }))
                              }
                              className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Assembly Service */}
                    <div className="p-4 border-2 border-slate-200 rounded-xl hover:border-green-300 transition-all">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="assemblyRequired"
                          checked={formData.assemblyRequired}
                          onChange={handleChange}
                          className="w-5 h-5 rounded text-green-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm lg:text-base">
                            🛠️ Assembly Service (at Delivery)
                          </div>
                          <div className="text-sm text-slate-600">
                            Reassemble furniture at new home
                          </div>
                        </div>
                      </label>

                      {/* Counter for assembly items */}
                      {formData.assemblyRequired && (
                        <div className="mt-3 pl-8 flex items-center gap-3">
                          <span className="text-sm text-slate-700">
                            How many items to assemble?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  assemblyCount: Math.max(
                                    0,
                                    prev.assemblyCount - 1
                                  ),
                                }))
                              }
                              className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >
                              -
                            </button>
                            <span className="font-bold w-6 text-center">
                              {formData.assemblyCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  assemblyCount: prev.assemblyCount + 1,
                                }))
                              }
                              className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any special instructions or parking restrictions?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                />

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded text-purple-600"
                  />
                  <label className="text-sm text-slate-700">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={onShowTerms}
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Terms & Conditions
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold"
                >
                  Get Furniture Quote
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">Booking Summary</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-slate-600">Service</span>
                  <span className="font-semibold">Furniture Delivery</span>
                </div>
                {formData.pickupPostcode && formData.dropoffPostcode && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Est. Distance</span>
                    <span className="font-semibold">{distance} miles</span>
                  </div>
                )}
                {getTotalItems() > 0 && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Items</span>
                    <span className="font-semibold">{getTotalItems()}</span>
                  </div>
                )}
                {(formData.assemblyRequired ||
                  formData.disassemblyRequired) && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Extra Services</span>
                    <span className="font-semibold text-green-600">
                      Included
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                <p className="text-xs text-center text-slate-600 leading-relaxed">
                  ✓ Professional handling
                  <br />
                  ✓ Blankets & straps provided
                  <br />
                  ✓ Fully insured
                  <br />✓ Assembly experts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
