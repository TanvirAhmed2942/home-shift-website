/**
 * Environmental Impact Tracking System
 * Carbon footprint calculation, eco-vehicle badges, carbon offset options, sustainability dashboard
 */

export interface CarbonFootprint {
  jobId: string;
  jobReference: string;
  date: Date;
  
  // Vehicle details
  vehicleType: string;
  isElectric: boolean;
  isHybrid: boolean;
  
  // Journey details
  distance: number; // km
  fuelConsumed: number; // liters (or kWh for electric)
  
  // Carbon emissions
  co2Emissions: number; // kg CO2
  co2PerKm: number; // kg CO2 per km
  
  // Comparison
  comparedToAverage: number; // Percentage difference
  treesRequired: number; // Trees needed to offset
  
  // Offset
  offsetPurchased: boolean;
  offsetCost?: number;
  offsetCertificateId?: string;
}

export interface EcoVehicle {
  id: string;
  type: 'electric' | 'hybrid' | 'euro6_diesel' | 'standard';
  name: string;
  emissionFactor: number; // kg CO2 per km
  fuelType: string;
  badge: {
    name: string;
    color: string;
    icon: string;
  };
}

export interface CarbonOffset {
  id: string;
  customerId: string;
  customerName: string;
  amount: number; // kg CO2
  cost: number; // GBP
  project: string;
  certificateNumber: string;
  purchaseDate: Date;
  status: 'pending' | 'completed' | 'verified';
}

export interface SustainabilityMetrics {
  totalJobs: number;
  totalDistance: number; // km
  totalCO2: number; // kg
  totalOffset: number; // kg
  netCO2: number; // kg
  
  ecoVehicleJobs: number;
  ecoVehiclePercentage: number;
  
  avgCO2PerJob: number;
  avgCO2PerKm: number;
  
  treesEquivalent: number;
  comparedToIndustryAvg: number; // Percentage
}

// Emission factors (kg CO2 per km)
export const EMISSION_FACTORS: Record<string, number> = {
  electric: 0, // Zero emissions
  hybrid: 0.08,
  euro6_diesel: 0.15,
  small_van: 0.18,
  medium_van: 0.22,
  large_van: 0.28,
  luton_van: 0.35,
  motorcycle: 0.09,
};

// Eco vehicle registry
export const ECO_VEHICLES: EcoVehicle[] = [
  {
    id: 'ev-1',
    type: 'electric',
    name: 'Electric Van',
    emissionFactor: 0,
    fuelType: 'Electric',
    badge: {
      name: '100% Electric',
      color: '#10b981',
      icon: '⚡',
    },
  },
  {
    id: 'hybrid-1',
    type: 'hybrid',
    name: 'Hybrid Van',
    emissionFactor: 0.08,
    fuelType: 'Hybrid',
    badge: {
      name: 'Hybrid',
      color: '#3b82f6',
      icon: '🔋',
    },
  },
  {
    id: 'euro6-1',
    type: 'euro6_diesel',
    name: 'Euro 6 Diesel',
    emissionFactor: 0.15,
    fuelType: 'Euro 6 Diesel',
    badge: {
      name: 'Euro 6',
      color: '#f59e0b',
      icon: '🌱',
    },
  },
];

/**
 * Calculate carbon footprint for a job
 */
export function calculateCarbonFootprint(
  jobId: string,
  jobReference: string,
  vehicleType: string,
  distance: number,
  isElectric: boolean = false,
  isHybrid: boolean = false
): CarbonFootprint {
  // Get emission factor
  let emissionFactor: number;
  if (isElectric) {
    emissionFactor = EMISSION_FACTORS.electric;
  } else if (isHybrid) {
    emissionFactor = EMISSION_FACTORS.hybrid;
  } else {
    emissionFactor = EMISSION_FACTORS[vehicleType] || EMISSION_FACTORS.medium_van;
  }
  
  // Calculate emissions
  const co2Emissions = distance * emissionFactor;
  const co2PerKm = emissionFactor;
  
  // Calculate fuel consumed (estimate)
  const fuelEfficiency = isElectric ? 0 : (isHybrid ? 12 : 10); // km per liter
  const fuelConsumed = isElectric ? (distance * 0.2) : (distance / fuelEfficiency); // kWh or liters
  
  // Compare to industry average (assume 0.25 kg CO2/km)
  const industryAvg = distance * 0.25;
  const comparedToAverage = ((co2Emissions - industryAvg) / industryAvg) * 100;
  
  // Trees required to offset (1 tree absorbs ~21 kg CO2 per year)
  const treesRequired = Math.ceil(co2Emissions / 21);
  
  const footprint: CarbonFootprint = {
    jobId,
    jobReference,
    date: new Date(),
    vehicleType,
    isElectric,
    isHybrid,
    distance,
    fuelConsumed,
    co2Emissions,
    co2PerKm,
    comparedToAverage,
    treesRequired,
    offsetPurchased: false,
  };
  
  saveCarbonFootprint(footprint);
  return footprint;
}

/**
 * Purchase carbon offset
 */
export function purchaseCarbonOffset(
  customerId: string,
  customerName: string,
  co2Amount: number,
  project: string = 'Reforestation Project - Amazon Rainforest'
): CarbonOffset {
  // Carbon offset cost: £0.02 per kg CO2 (market rate)
  const costPerKg = 0.02;
  const cost = co2Amount * costPerKg;
  
  const offset: CarbonOffset = {
    id: `offset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerId,
    customerName,
    amount: co2Amount,
    cost,
    project,
    certificateNumber: `CARBON-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    purchaseDate: new Date(),
    status: 'completed',
  };
  
  saveCarbonOffset(offset);
  return offset;
}

/**
 * Get eco vehicle badge
 */
export function getEcoVehicleBadge(vehicleType: string, isElectric: boolean, isHybrid: boolean): EcoVehicle['badge'] | null {
  if (isElectric) {
    return ECO_VEHICLES.find(v => v.type === 'electric')?.badge || null;
  }
  if (isHybrid) {
    return ECO_VEHICLES.find(v => v.type === 'hybrid')?.badge || null;
  }
  if (vehicleType.includes('euro6')) {
    return ECO_VEHICLES.find(v => v.type === 'euro6_diesel')?.badge || null;
  }
  return null;
}

/**
 * Calculate sustainability metrics for a customer
 */
export function calculateSustainabilityMetrics(customerId: string): SustainabilityMetrics {
  const footprints = getAllCarbonFootprints().filter(f => {
    // Get job and check customer
    const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
    const job = jobs.find((j: any) => j.reference === f.jobReference);
    return job && job.customerId === customerId;
  });
  
  const offsets = getAllCarbonOffsets().filter(o => o.customerId === customerId);
  
  const totalJobs = footprints.length;
  const totalDistance = footprints.reduce((sum, f) => sum + f.distance, 0);
  const totalCO2 = footprints.reduce((sum, f) => sum + f.co2Emissions, 0);
  const totalOffset = offsets.reduce((sum, o) => sum + o.amount, 0);
  const netCO2 = totalCO2 - totalOffset;
  
  const ecoVehicleJobs = footprints.filter(f => f.isElectric || f.isHybrid).length;
  const ecoVehiclePercentage = totalJobs > 0 ? (ecoVehicleJobs / totalJobs) * 100 : 0;
  
  const avgCO2PerJob = totalJobs > 0 ? totalCO2 / totalJobs : 0;
  const avgCO2PerKm = totalDistance > 0 ? totalCO2 / totalDistance : 0;
  
  const treesEquivalent = Math.ceil(netCO2 / 21);
  
  // Industry average is 0.25 kg CO2/km
  const industryAvgTotal = totalDistance * 0.25;
  const comparedToIndustryAvg = industryAvgTotal > 0 
    ? ((totalCO2 - industryAvgTotal) / industryAvgTotal) * 100 
    : 0;
  
  return {
    totalJobs,
    totalDistance,
    totalCO2,
    totalOffset,
    netCO2,
    ecoVehicleJobs,
    ecoVehiclePercentage,
    avgCO2PerJob,
    avgCO2PerKm,
    treesEquivalent,
    comparedToIndustryAvg,
  };
}

/**
 * Calculate global sustainability metrics
 */
export function calculateGlobalSustainabilityMetrics(): SustainabilityMetrics {
  const footprints = getAllCarbonFootprints();
  const offsets = getAllCarbonOffsets();
  
  const totalJobs = footprints.length;
  const totalDistance = footprints.reduce((sum, f) => sum + f.distance, 0);
  const totalCO2 = footprints.reduce((sum, f) => sum + f.co2Emissions, 0);
  const totalOffset = offsets.reduce((sum, o) => sum + o.amount, 0);
  const netCO2 = totalCO2 - totalOffset;
  
  const ecoVehicleJobs = footprints.filter(f => f.isElectric || f.isHybrid).length;
  const ecoVehiclePercentage = totalJobs > 0 ? (ecoVehicleJobs / totalJobs) * 100 : 0;
  
  const avgCO2PerJob = totalJobs > 0 ? totalCO2 / totalJobs : 0;
  const avgCO2PerKm = totalDistance > 0 ? totalCO2 / totalDistance : 0;
  
  const treesEquivalent = Math.ceil(netCO2 / 21);
  
  const industryAvgTotal = totalDistance * 0.25;
  const comparedToIndustryAvg = industryAvgTotal > 0 
    ? ((totalCO2 - industryAvgTotal) / industryAvgTotal) * 100 
    : 0;
  
  return {
    totalJobs,
    totalDistance,
    totalCO2,
    totalOffset,
    netCO2,
    ecoVehicleJobs,
    ecoVehiclePercentage,
    avgCO2PerJob,
    avgCO2PerKm,
    treesEquivalent,
    comparedToIndustryAvg,
  };
}

/**
 * Generate carbon offset certificate HTML
 */
export function generateCarbonOffsetCertificate(offset: CarbonOffset): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: #f0f9ff; }
        .certificate { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border: 8px solid #10b981; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 36px; color: #10b981; margin: 20px 0; }
        .content { margin: 30px 0; line-height: 2; }
        .highlight { color: #10b981; font-weight: bold; font-size: 24px; }
        .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <h1 class="title">🌍 Carbon Offset Certificate</h1>
          <p>Certificate No: ${offset.certificateNumber}</p>
        </div>
        <div class="content">
          <p>This certifies that</p>
          <p style="text-align: center; font-size: 28px; margin: 20px 0;"><strong>${offset.customerName}</strong></p>
          <p>has offset</p>
          <p style="text-align: center;" class="highlight">${offset.amount.toFixed(2)} kg CO2</p>
          <p>through support of the <strong>${offset.project}</strong></p>
          <p>This contribution helps combat climate change and supports sustainable development.</p>
        </div>
        <div class="footer">
          <p><strong>ShiftMyHome Environmental Initiative</strong></p>
          <p>Date: ${offset.purchaseDate.toLocaleDateString()}</p>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">Thank you for choosing eco-friendly moving services!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Download carbon offset certificate
 */
export function downloadCarbonOffsetCertificate(offset: CarbonOffset): void {
  const html = generateCarbonOffsetCertificate(offset);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  }
}

/**
 * Storage functions
 */
function saveCarbonFootprint(footprint: CarbonFootprint): void {
  const footprints = getAllCarbonFootprints();
  const index = footprints.findIndex(f => f.jobId === footprint.jobId);
  if (index >= 0) {
    footprints[index] = footprint;
  } else {
    footprints.push(footprint);
  }
  localStorage.setItem('carbon_footprints', JSON.stringify(footprints));
}

export function getAllCarbonFootprints(): CarbonFootprint[] {
  const stored = localStorage.getItem('carbon_footprints');
  return stored ? JSON.parse(stored) : [];
}

function saveCarbonOffset(offset: CarbonOffset): void {
  const offsets = getAllCarbonOffsets();
  offsets.push(offset);
  localStorage.setItem('carbon_offsets', JSON.stringify(offsets));
}

export function getAllCarbonOffsets(): CarbonOffset[] {
  const stored = localStorage.getItem('carbon_offsets');
  return stored ? JSON.parse(stored) : [];
}
