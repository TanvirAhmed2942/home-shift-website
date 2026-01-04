import { adminPricingManager, PricingRule } from './adminPricingManager';

// ==========================================
// SHARED CONSTANTS (Exported for UI usage)
// ==========================================

export const GLOBAL_VOLUME_MARGIN = 1.1; // 10% safety margin
export const PRICE_PER_CUBIC_METER = 15.00; // Base price per cubic meter

export const VEHICLE_TYPES = [
  {
    id: 'small',
    name: 'Small Van',
    icon: '🚙', 
    minVolume: 0,
    maxVolume: 5,
    baseFee: 40,
    pricePerMile: 1.5,
    pricePerCubicMeter: 15,
    minimumCharge: 60,
    crew1Man: 40,
    crew2Men: 60,
    crew3Men: 90
  },
  {
    id: 'medium',
    name: 'Medium Van',
    icon: '🚐',
    minVolume: 5,
    maxVolume: 10,
    baseFee: 60,
    pricePerMile: 1.8,
    pricePerCubicMeter: 15,
    minimumCharge: 80,
    crew1Man: 50,
    crew2Men: 75,
    crew3Men: 110
  },
  {
    id: 'large',
    name: 'Large Van',
    icon: '🚚',
    minVolume: 10,
    maxVolume: 18,
    baseFee: 80,
    pricePerMile: 2.2,
    pricePerCubicMeter: 15,
    minimumCharge: 100,
    crew1Man: 60,
    crew2Men: 90,
    crew3Men: 130
  },
  {
    id: 'luton',
    name: 'Luton Van',
    icon: '🚛',
    minVolume: 18,
    maxVolume: 25,
    baseFee: 100,
    pricePerMile: 2.5,
    pricePerCubicMeter: 15,
    minimumCharge: 120,
    crew1Man: 70,
    crew2Men: 100,
    crew3Men: 150
  },
];

export const EXTRAS_CATALOG = [
  { id: 'assembly', name: 'Assembly Service', price: 30, type: 'flat' },
  { id: 'disassembly', name: 'Disassembly Service', price: 30, type: 'flat' },
  { id: 'packaging', name: 'Packaging Materials', price: 50, type: 'flat' },
  { id: 'piano', name: 'Piano Moving (Upright)', price: 120, type: 'flat' },
  { id: 'flights', name: 'Stairs (Per Flight)', price: 15, type: 'per_floor' },
  { id: 'long_carry', name: 'Long Carry (25m+)', price: 20, type: 'flat' },
];

// ==========================================
// ITEM DATA FOR VOLUME CALCULATION
// ==========================================

export const ITEM_DATA: Record<string, number> = {
  // Boxes
  'Small box': 0.03,
  'Medium box': 0.05,
  'Large box': 0.08,
  'Extra large box': 0.10,
  'Wardrobe box': 0.15,
  
  // Living Room
  'Armchair': 0.40,
  'Recliner chair': 0.60,
  '2-seat sofa': 1.20,
  '3-seat sofa': 1.80,
  '4-seat sofa': 2.20,
  'Corner sofa (small)': 2.20,
  'Corner sofa (large)': 3.00,
  'Sofa bed': 2.00,
  'Coffee table': 0.30,
  'TV stand (small)': 0.40,
  'TV stand (large)': 0.70,
  'Bookcase (small)': 0.60,
  'Bookcase (large)': 1.20,
  'TV up to 40"': 0.20,
  'TV 40–60"': 0.30,
  'TV 60"+': 0.40,

  // Bedroom
  'Single mattress': 0.40,
  'Double mattress': 0.60,
  'King mattress': 0.80,
  'Single bed frame': 0.60,
  'Double bed frame': 1.00,
  'King bed frame': 1.20,
  'Bedside table': 0.25,
  'Chest of drawers (small)': 0.60,
  'Chest of drawers (large)': 1.00,
  'Wardrobe 1 door': 0.80,
  'Wardrobe 2 doors': 1.20,
  'Wardrobe 3 doors': 1.80,
  
  // Kitchen
  'Fridge (under counter)': 0.60,
  'Fridge freezer': 1.00,
  'American fridge': 1.50,
  'Washing machine': 0.60,
  'Tumble dryer': 0.60,
  'Dishwasher': 0.60,
  'Cooker': 0.70,
  'Microwave': 0.15,
  'Kitchen table': 0.80,
  'Chair': 0.20,

  // Misc
  'Bicycle': 0.30,
  'Suitcase': 0.20,
  'Vacuum cleaner': 0.15,
  'Ironing board': 0.10,
  'Mirror': 0.15,
  'Rug': 0.20,
  'Lamp': 0.10,
  'Plant': 0.20,
  'Golf clubs': 0.30,
  'Pram/Pushchair': 0.40,
};

// ==========================================
// PRICING ENGINE TYPES & LOGIC
// ==========================================

export interface QuoteRequest {
  serviceType: string;
  pickup: {
    address: string;
    postcode: string;
    lat?: number;
    lng?: number;
    hasLift: boolean;
    floor: number;
    floorNumber?: number; // For 5th floor+
    hasStairs: boolean;
    stairFlights: number; // 1-5+
    carryDistance: 'under10m' | '10-25m' | '25-50m' | '50m+';
    parkingRestrictions: {
      limitedParking: boolean;
      paidParking: boolean;
      loadingBayOnly: boolean;
    };
    accessNotes: string;
  };
  dropoff: {
    address: string;
    postcode: string;
    lat?: number;
    lng?: number;
    hasLift: boolean;
    floor: number;
    floorNumber?: number; // For 5th floor+
    hasStairs: boolean;
    stairFlights: number; // 1-5+
    carryDistance: 'under10m' | '10-25m' | '25-50m' | '50m+';
    parkingRestrictions: {
      limitedParking: boolean;
      paidParking: boolean;
      loadingBayOnly: boolean;
    };
    accessNotes: string;
  };
  date: Date;
  items: any[]; // In a real app, strict type
  selectedVehicle?: 'small' | 'medium' | 'large' | 'luton';
  extras: {
    assembly: boolean;
    disassembly: boolean;
    packaging: boolean;
    helpers: number;
  };
  customer?: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  distance?: number; // Manual override for admin calculator
}

export interface QuoteBreakdown {
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  volumePrice: number; // New field
  vehicleSurcharge: number;
  stairsSurcharge: number;
  extrasPrice: number;
  congestionZone: number;
  vat: number;
  total: number;
  deposit: number;
}

export interface QuoteResponse {
  quoteId: string;
  breakdown: QuoteBreakdown;
  estimatedDuration: string;
  recommendedVehicle: string;
  distance: number; // miles
  expiryDate: Date;
  totalVolume: number;
}

// Simulate backend calculation delay
const SIMULATED_DELAY = 600;

export class PricingEngine {
  
  static async calculateQuote(request: QuoteRequest): Promise<QuoteResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

    const rules = adminPricingManager.getRules(request.serviceType);
    
    // 0. Calculate Volume
    let totalVolume = 0;
    if (request.items && request.items.length > 0) {
      request.items.forEach(item => {
        const itemVolume = ITEM_DATA[item.name] || 0.1; // Default to 0.1 if unknown
        totalVolume += itemVolume * (item.quantity || 1);
      });
    }
    // Add safety margin
    totalVolume = totalVolume * GLOBAL_VOLUME_MARGIN;

    // 1. Calculate Distance
    let mockDistance = request.distance;
    if (mockDistance === undefined) {
      mockDistance = Math.max(
        rules.minDistance,
        (request.pickup.postcode.length + request.dropoff.postcode.length) * 1.5
      );
    }

    // 2. Base Price Calculation
    const basePrice = rules.basePrice;

    // 3. Distance Pricing
    const distancePrice = mockDistance * rules.pricePerMile;
    
    // 3b. Volume Pricing (Cubic Meter Charge)
    // Only apply volume charge if the volume exceeds a minimum threshold (e.g. 2 cubic meters)
    // or if it's a specific service type like 'furniture'
    let volumePrice = 0;
    if (totalVolume > 0) {
        // Use the rate from the vehicle type if possible, or fallback to global constant
        // But we don't know the vehicle yet. Let's start with base rate.
        volumePrice = totalVolume * PRICE_PER_CUBIC_METER;
    }

    // 4. Vehicle Selection & Surcharge
    // Determine vehicle based on volume if not provided
    let vehicleType = request.selectedVehicle;
    if (!vehicleType) {
      if (totalVolume <= 5) vehicleType = 'small';
      else if (totalVolume <= 10) vehicleType = 'medium';
      else if (totalVolume <= 18) vehicleType = 'large';
      else vehicleType = 'luton';
    }
    
    // Find the specific vehicle definition to get its specific cubic meter price if needed
    const vehicleDef = VEHICLE_TYPES.find(v => v.id === vehicleType);
    if (vehicleDef && vehicleDef.pricePerCubicMeter) {
        // Recalculate volume price based on vehicle specific rate if it differs
        volumePrice = totalVolume * vehicleDef.pricePerCubicMeter;
    }
    
    const vehicleMultiplier = rules.vanTypeMultiplier[vehicleType || 'medium'];
    
    // The basePrice covers the basic service.
    // distancePrice covers the fuel/travel.
    // vehicleSurcharge adjusts for the size of the van (operational cost).
    const vehicleSurcharge = (basePrice + distancePrice) * (vehicleMultiplier - 1);

    // 5. Stairs Surcharge - Enhanced with stairFlights
    let stairsSurcharge = 0;
    
    // Pickup stairs
    if (request.pickup.hasStairs || (!request.pickup.hasLift && request.pickup.floor > 0)) {
      const flights = request.pickup.hasStairs ? request.pickup.stairFlights : request.pickup.floor;
      stairsSurcharge += flights * rules.stairsPricePerFlight;
    }
    
    // Dropoff stairs
    if (request.dropoff.hasStairs || (!request.dropoff.hasLift && request.dropoff.floor > 0)) {
      const flights = request.dropoff.hasStairs ? request.dropoff.stairFlights : request.dropoff.floor;
      stairsSurcharge += flights * rules.stairsPricePerFlight;
    }

    // 5b. Long Carry Distance Surcharge
    let carryDistanceSurcharge = 0;
    const carryPricing = {
      'under10m': 0,
      '10-25m': 15,
      '25-50m': 30,
      '50m+': 50
    };
    carryDistanceSurcharge += carryPricing[request.pickup.carryDistance] || 0;
    carryDistanceSurcharge += carryPricing[request.dropoff.carryDistance] || 0;

    // 5c. Parking Restrictions Surcharge
    let parkingSurcharge = 0;
    if (request.pickup.parkingRestrictions.paidParking || request.dropoff.parkingRestrictions.paidParking) {
      parkingSurcharge += 20;
    }
    if (request.pickup.parkingRestrictions.loadingBayOnly || request.dropoff.parkingRestrictions.loadingBayOnly) {
      parkingSurcharge += 15;
    }

    // 6. Helpers & Extras
    let extrasPrice = 0;
    if (request.extras.helpers > 1) {
      // Assuming 1 driver included. Extra helpers cost money.
      // E.g., £40 per extra helper
      extrasPrice += (request.extras.helpers - 1) * 40;
    }
    if (request.extras.assembly) extrasPrice += 30;
    if (request.extras.disassembly) extrasPrice += 30;
    if (request.extras.packaging) extrasPrice += 50;

    // 7. Congestion/ULEZ (Mocked random chance based on postcode)
    let congestionZone = 0;
    if (request.pickup.postcode.toUpperCase().startsWith('W1') || request.dropoff.postcode.toUpperCase().startsWith('W1')) {
      congestionZone += rules.congestionCharge;
    }

    // 8. Weekend Multiplier
    const isWeekend = request.date.getDay() === 0 || request.date.getDay() === 6;
    
    // TOTAL CALCULATION
    // Note: volumePrice is NOT always additive in simple van quotes because the vehicle size implies the volume capacity.
    // However, for "Man & Van" or "Furniture" where volume is key, we might add it.
    // For this implementation, we will treat volumePrice as an additional factor if the user selected specific item list.
    // To avoid double charging (Vehicle Size vs Volume), we can either:
    // A) Base price on Vehicle Size ONLY (standard Van Hire model)
    // B) Base price on Volume ONLY (shipping model)
    // C) Hybrid: Base Van Price + Excess Volume charge
    
    // User requested "PRET PE CUBIC METERS" (Price per cubic meters).
    // So we will ADD the volume price component to the total.
    
    let subtotal = basePrice + distancePrice + volumePrice + vehicleSurcharge + stairsSurcharge + extrasPrice + congestionZone + carryDistanceSurcharge + parkingSurcharge;
    
    if (isWeekend) {
      subtotal *= rules.weekendMultiplier;
    }

    // Ensure minimum price
    if (subtotal < rules.minPrice) {
      subtotal = rules.minPrice;
    }

    // Final Totals
    const vat = subtotal * 0.2; // 20% VAT
    const total = subtotal + vat;
    const deposit = total * 0.2; // 20% Deposit

    return {
      quoteId: `QT-${Date.now().toString(36).toUpperCase()}`,
      breakdown: {
        basePrice,
        distancePrice,
        timePrice: 0, 
        volumePrice, // Added to breakdown
        vehicleSurcharge,
        stairsSurcharge,
        extrasPrice,
        congestionZone,
        vat,
        total,
        deposit
      },
      estimatedDuration: `${Math.ceil(mockDistance / 20) + 1} hours`, // Mock duration
      recommendedVehicle: vehicleType || 'medium',
      distance: mockDistance,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      totalVolume
    };
  }
}
