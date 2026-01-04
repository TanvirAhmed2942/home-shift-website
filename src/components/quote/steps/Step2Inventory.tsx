import React from "react";
import { motion } from "motion/react";
import {
  Box,
  Truck,
  Sofa,
  ArrowRight,
  ArrowLeft,
  Bike,
  ShoppingBag,
  Package,
  Home,
  Leaf,
  Hammer,
  Trash2,
  Recycle,
} from "lucide-react";
import { QuoteRequest } from "../../../utils/pricingEngine";

interface StepProps {
  serviceType: string;
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Configuration for different service types
const INVENTORY_CONFIG: Record<
  string,
  {
    title: string;
    subtitle: string;
    options: Array<{
      id: string;
      title: string;
      subtitle: string;
      description: string;
      icon: any;
      vehicle: string;
    }>;
  }
> = {
  motorbike: {
    title: "What motorcycle are we moving?",
    subtitle: "Select the type of bike to ensure we send the right van.",
    options: [
      {
        id: "scooter",
        title: "Scooter / Moped",
        subtitle: "Fits in Small Van",
        description: "Small engine bikes, vespas, and mopeds.",
        icon: Bike,
        vehicle: "small",
      },
      {
        id: "standard",
        title: "Standard Motorcycle",
        subtitle: "Fits in Medium Van",
        description: "Street bikes, sports bikes, and naked bikes.",
        icon: Bike,
        vehicle: "medium",
      },
      {
        id: "large-bike",
        title: "Cruiser / Adventure",
        subtitle: "Fits in Large Van",
        description: "Goldwings, Harleys, and large adventure bikes.",
        icon: Bike,
        vehicle: "large",
      },
      {
        id: "multiple-bikes",
        title: "Multiple Bikes / Quad",
        subtitle: "Requires Luton Van",
        description: "Moving 2+ bikes or a quad bike.",
        icon: Truck,
        vehicle: "luton",
      },
    ],
  },
  clearance: {
    title: "What needs clearing?",
    subtitle: "Select the type of clearance required.",
    options: [
      {
        id: "house-clearance",
        title: "House Clearance",
        subtitle: "Furniture & Household",
        description: "Full house or single room clearance.",
        icon: Home,
        vehicle: "luton",
      },
      {
        id: "garden-clearance",
        title: "Garden Clearance",
        subtitle: "Green Waste & Debris",
        description: "Branches, leaves, soil, and old garden furniture.",
        icon: Leaf,
        vehicle: "large",
      },
      {
        id: "builders-waste",
        title: "Builders Waste",
        subtitle: "Rubble & Construction",
        description: "Heavy waste, bricks, wood, and plaster.",
        icon: Hammer,
        vehicle: "luton",
      },
      {
        id: "junk-removal",
        title: "Junk Removal",
        subtitle: "General Household Junk",
        description: "Old odds and ends, garage clutter.",
        icon: Trash2,
        vehicle: "medium",
      },
      {
        id: "general-waste",
        title: "General Waste",
        subtitle: "Mixed Waste",
        description: "Bagged waste and miscellaneous items.",
        icon: Recycle,
        vehicle: "medium",
      },
    ],
  },
  "store-pickup": {
    title: "What are you picking up?",
    subtitle: "Select the approximate size of your order.",
    options: [
      {
        id: "small-load",
        title: "Small Order",
        subtitle: "Fits in Small Van",
        description: "Few boxes, small electronics, or flat-pack items.",
        icon: ShoppingBag,
        vehicle: "small",
      },
      {
        id: "medium-load",
        title: "Medium Order",
        subtitle: "Fits in Medium Van",
        description: "Sofa, mattress, or large appliance.",
        icon: ShoppingBag,
        vehicle: "medium",
      },
      {
        id: "large-load",
        title: "Large Order",
        subtitle: "Fits in Large Van",
        description: "Full kitchen, multiple large appliances, or garden set.",
        icon: Truck,
        vehicle: "large",
      },
      {
        id: "bulk-load",
        title: "Bulk / Construction",
        subtitle: "Requires Luton Van",
        description: "Large quantity of building materials or pallets.",
        icon: Truck,
        vehicle: "luton",
      },
    ],
  },
  furniture: {
    title: "How much furniture?",
    subtitle: "Select the option that best describes your load.",
    options: [
      {
        id: "single-item",
        title: "Single Large Item",
        subtitle: "Fits in Small Van",
        description: "One sofa, bed, or wardrobe.",
        icon: Sofa,
        vehicle: "small",
      },
      {
        id: "few-items",
        title: "Few Items",
        subtitle: "Fits in Medium Van",
        description: "Sofa set, bed + mattress, and a few boxes.",
        icon: Sofa,
        vehicle: "medium",
      },
      {
        id: "room-full",
        title: "Room Full",
        subtitle: "Fits in Large Van",
        description: "Contents of a full living room or bedroom.",
        icon: Truck,
        vehicle: "large",
      },
      {
        id: "multiple-rooms",
        title: "Multiple Rooms",
        subtitle: "Requires Luton Van",
        description: "Furniture from 2+ rooms.",
        icon: Truck,
        vehicle: "luton",
      },
    ],
  },
  default: {
    title: "What are you moving?",
    subtitle: "Select the option that best describes your load size.",
    options: [
      {
        id: "small",
        title: "Studio / Single Item",
        subtitle: "Fits in Small Van",
        description:
          "Perfect for students or moving a few boxes and suitcases.",
        icon: Box,
        vehicle: "small",
      },
      {
        id: "medium",
        title: "1 Bedroom Flat",
        subtitle: "Fits in Medium Van",
        description:
          "Ideal for couples or light 1-bed moves without major appliances.",
        icon: Truck,
        vehicle: "medium",
      },
      {
        id: "large",
        title: "2 Bedroom Flat",
        subtitle: "Fits in Large Van",
        description:
          "Standard move. Fits sofa, bed, wardrobe, and 20-30 boxes.",
        icon: Truck,
        vehicle: "large",
      },
      {
        id: "luton",
        title: "3+ Bed House / Office",
        subtitle: "Requires Luton Van",
        description: "Large move with tail lift required for heavy furniture.",
        icon: Sofa,
        vehicle: "luton",
      },
    ],
  },
};

export function Step2Inventory({
  serviceType,
  data,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  // Determine which config to use
  const config = INVENTORY_CONFIG[serviceType] || INVENTORY_CONFIG["default"];

  // Fallback to default if 'other' or 'man-van' or 'house-move' maps to default
  const activeConfig =
    serviceType === "man-van" ||
    serviceType === "house-move" ||
    serviceType === "other"
      ? INVENTORY_CONFIG["default"]
      : config;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {activeConfig.title}
        </h2>
        <p className="text-slate-600">{activeConfig.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {activeConfig.options.map((option) => {
          const isSelected = data.selectedVehicle === option.vehicle;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={() =>
                onChange({ selectedVehicle: option.vehicle as any })
              }
              className={`text-left p-6 rounded-2xl border-2 transition-all group hover:shadow-md ${
                isSelected
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-slate-200 hover:border-blue-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    className={`font-bold text-lg mb-1 ${
                      isSelected ? "text-blue-900" : "text-slate-900"
                    }`}
                  >
                    {option.title}
                  </h3>
                  <div className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 mb-2">
                    {option.subtitle}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Manual Item List Toggle (Visual Only for MVP) */}
      {/* <div className="mt-8 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-500 mb-4">Need to be more specific?</p>
        <button className="text-blue-600 font-bold hover:underline cursor-pointer">
          + Enter itemized inventory list
        </button>
      </div> */}

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.selectedVehicle}
          className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer ${
            data.selectedVehicle
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Next Step
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
