/**
 * White Label Solution Manager
 * B2B partnerships with custom branding
 */

export interface WhiteLabelPartner {
  id: string;
  companyName: string;
  slug: string; // URL slug: partner.shiftmyhome.com or custom domain
  customDomain?: string;
  status: 'active' | 'pending' | 'suspended';
  tier: 'basic' | 'professional' | 'enterprise';
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    favicon: string;
    companyName: string;
    tagline: string;
    footerText: string;
  };
  features: {
    customDomain: boolean;
    removeBranding: boolean;
    customEmail: boolean;
    whiteLabel API: boolean;
    dedicatedSupport: boolean;
    customReports: boolean;
    bulkBooking: boolean;
    corporateDiscount: number; // percentage
  };
  billing: {
    model: 'commission' | 'subscription' | 'hybrid';
    commissionRate?: number; // percentage
    monthlyFee?: number;
    setupFee: number;
  };
  limits: {
    monthlyJobs?: number;
    users?: number;
    storage?: number; // GB
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  apiKey: string;
  webhookUrl?: string;
  createdAt: Date;
  lastActiveAt: Date;
  totalJobs: number;
  totalRevenue: number;
}

export interface WhiteLabelTheme {
  partnerId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logo: {
    light: string;
    dark: string;
    favicon: string;
  };
  customCSS?: string;
}

// ==================== PARTNER TIERS ====================

const PARTNER_TIERS = {
  basic: {
    name: 'Basic Partner',
    setupFee: 0,
    monthlyFee: 99,
    commissionRate: 20,
    features: {
      customDomain: false,
      removeBranding: false,
      customEmail: false,
      whiteLabelAPI: false,
      dedicatedSupport: false,
      customReports: false,
      bulkBooking: true,
      corporateDiscount: 5,
    },
    limits: {
      monthlyJobs: 50,
      users: 5,
      storage: 10,
    },
  },
  professional: {
    name: 'Professional Partner',
    setupFee: 499,
    monthlyFee: 299,
    commissionRate: 15,
    features: {
      customDomain: true,
      removeBranding: true,
      customEmail: true,
      whiteLabelAPI: true,
      dedicatedSupport: true,
      customReports: true,
      bulkBooking: true,
      corporateDiscount: 10,
    },
    limits: {
      monthlyJobs: 200,
      users: 20,
      storage: 50,
    },
  },
  enterprise: {
    name: 'Enterprise Partner',
    setupFee: 2000,
    monthlyFee: 999,
    commissionRate: 10,
    features: {
      customDomain: true,
      removeBranding: true,
      customEmail: true,
      whiteLabelAPI: true,
      dedicatedSupport: true,
      customReports: true,
      bulkBooking: true,
      corporateDiscount: 15,
    },
    limits: {
      monthlyJobs: undefined, // unlimited
      users: undefined,
      storage: 500,
    },
  },
};

// ==================== PARTNER MANAGEMENT ====================

export function getAllPartners(): WhiteLabelPartner[] {
  const stored = localStorage.getItem('whitelabel_partners');
  return stored ? JSON.parse(stored) : [];
}

export function getPartner(partnerId: string): WhiteLabelPartner | undefined {
  return getAllPartners().find(p => p.id === partnerId);
}

export function getPartnerBySlug(slug: string): WhiteLabelPartner | undefined {
  return getAllPartners().find(p => p.slug === slug || p.customDomain === slug);
}

export function createPartner(data: {
  companyName: string;
  slug: string;
  tier: WhiteLabelPartner['tier'];
  contact: WhiteLabelPartner['contact'];
  customDomain?: string;
}): WhiteLabelPartner {
  const tierConfig = PARTNER_TIERS[data.tier];

  const partner: WhiteLabelPartner = {
    id: `partner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    companyName: data.companyName,
    slug: data.slug,
    customDomain: data.customDomain,
    status: 'pending',
    tier: data.tier,
    branding: {
      logo: '/default-logo.png',
      primaryColor: '#7C3AED',
      secondaryColor: '#EC4899',
      accentColor: '#F59E0B',
      favicon: '/favicon.ico',
      companyName: data.companyName,
      tagline: 'Your trusted moving partner',
      footerText: `© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.`,
    },
    features: tierConfig.features,
    billing: {
      model: 'hybrid',
      commissionRate: tierConfig.commissionRate,
      monthlyFee: tierConfig.monthlyFee,
      setupFee: tierConfig.setupFee,
    },
    limits: tierConfig.limits,
    contact: data.contact,
    apiKey: generateAPIKey(),
    createdAt: new Date(),
    lastActiveAt: new Date(),
    totalJobs: 0,
    totalRevenue: 0,
  };

  const partners = getAllPartners();
  partners.push(partner);
  localStorage.setItem('whitelabel_partners', JSON.stringify(partners));

  // Create default theme
  createPartnerTheme(partner.id);

  return partner;
}

export function updatePartner(partnerId: string, updates: Partial<WhiteLabelPartner>): void {
  const partners = getAllPartners();
  const index = partners.findIndex(p => p.id === partnerId);

  if (index !== -1) {
    partners[index] = { ...partners[index], ...updates };
    partners[index].lastActiveAt = new Date();
    localStorage.setItem('whitelabel_partners', JSON.stringify(partners));
  }
}

export function updatePartnerBranding(partnerId: string, branding: Partial<WhiteLabelPartner['branding']>): void {
  const partner = getPartner(partnerId);
  if (!partner) return;

  partner.branding = { ...partner.branding, ...branding };
  updatePartner(partnerId, { branding: partner.branding });

  // Update theme
  updatePartnerTheme(partnerId, {
    colors: {
      primary: branding.primaryColor || partner.branding.primaryColor,
      secondary: branding.secondaryColor || partner.branding.secondaryColor,
      accent: branding.accentColor || partner.branding.accentColor,
      background: '#FFFFFF',
      text: '#1F2937',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  });
}

function generateAPIKey(): string {
  return `wl_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 16)}`;
}

export function regenerateAPIKey(partnerId: string): string {
  const newKey = generateAPIKey();
  updatePartner(partnerId, { apiKey: newKey });
  return newKey;
}

// ==================== THEME MANAGEMENT ====================

export function createPartnerTheme(partnerId: string): WhiteLabelTheme {
  const partner = getPartner(partnerId);
  if (!partner) throw new Error('Partner not found');

  const theme: WhiteLabelTheme = {
    partnerId,
    colors: {
      primary: partner.branding.primaryColor,
      secondary: partner.branding.secondaryColor,
      accent: partner.branding.accentColor,
      background: '#FFFFFF',
      text: '#1F2937',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    logo: {
      light: partner.branding.logo,
      dark: partner.branding.logo,
      favicon: partner.branding.favicon,
    },
  };

  const themes = getAllThemes();
  themes.push(theme);
  localStorage.setItem('whitelabel_themes', JSON.stringify(themes));

  return theme;
}

export function getAllThemes(): WhiteLabelTheme[] {
  const stored = localStorage.getItem('whitelabel_themes');
  return stored ? JSON.parse(stored) : [];
}

export function getPartnerTheme(partnerId: string): WhiteLabelTheme | undefined {
  return getAllThemes().find(t => t.partnerId === partnerId);
}

export function updatePartnerTheme(partnerId: string, updates: Partial<WhiteLabelTheme>): void {
  const themes = getAllThemes();
  const index = themes.findIndex(t => t.partnerId === partnerId);

  if (index !== -1) {
    themes[index] = { ...themes[index], ...updates };
    localStorage.setItem('whitelabel_themes', JSON.stringify(themes));
  }
}

export function applyPartnerTheme(partnerId: string): void {
  const theme = getPartnerTheme(partnerId);
  if (!theme) return;

  // Apply CSS variables
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Update favicon
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = theme.logo.favicon;
  }

  // Inject custom CSS if provided
  if (theme.customCSS) {
    const style = document.createElement('style');
    style.innerHTML = theme.customCSS;
    document.head.appendChild(style);
  }
}

// ==================== ANALYTICS & REPORTING ====================

export function getPartnerAnalytics(partnerId: string, days: number = 30) {
  const partner = getPartner(partnerId);
  if (!partner) return null;

  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]')
    .filter((j: any) => j.partnerId === partnerId);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const periodJobs = jobs.filter((j: any) => 
    new Date(j.createdAt) >= startDate
  );

  const totalRevenue = periodJobs.reduce((sum: number, j: any) => sum + (j.totalPrice || 0), 0);
  const commission = totalRevenue * ((partner.billing.commissionRate || 0) / 100);
  const monthlyFee = partner.billing.monthlyFee || 0;
  const totalEarnings = commission - monthlyFee;

  return {
    period: `Last ${days} days`,
    totalJobs: periodJobs.length,
    totalRevenue,
    commission,
    monthlyFee,
    netEarnings: totalEarnings,
    averageJobValue: totalRevenue / (periodJobs.length || 1),
    utilizationRate: partner.limits.monthlyJobs 
      ? (periodJobs.length / partner.limits.monthlyJobs) * 100
      : 100,
    topServices: getTopServices(periodJobs),
    customerSatisfaction: calculateAverageRating(periodJobs),
  };
}

function getTopServices(jobs: any[]) {
  const serviceCounts: Record<string, number> = {};
  jobs.forEach(job => {
    serviceCounts[job.serviceType] = (serviceCounts[job.serviceType] || 0) + 1;
  });

  return Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([service, count]) => ({ service, count }));
}

function calculateAverageRating(jobs: any[]): number {
  const ratedJobs = jobs.filter(j => j.rating);
  if (ratedJobs.length === 0) return 0;
  
  const total = ratedJobs.reduce((sum, j) => sum + (j.rating || 0), 0);
  return total / ratedJobs.length;
}

export function generatePartnerReport(partnerId: string, format: 'json' | 'csv' | 'pdf') {
  const analytics = getPartnerAnalytics(partnerId, 30);
  const partner = getPartner(partnerId);

  if (!analytics || !partner) return null;

  const report = {
    partner: {
      name: partner.companyName,
      tier: partner.tier,
      status: partner.status,
    },
    period: analytics.period,
    summary: {
      totalJobs: analytics.totalJobs,
      totalRevenue: `£${analytics.totalRevenue.toFixed(2)}`,
      commission: `£${analytics.commission.toFixed(2)}`,
      netEarnings: `£${analytics.netEarnings.toFixed(2)}`,
      averageJobValue: `£${analytics.averageJobValue.toFixed(2)}`,
      customerSatisfaction: `${analytics.customerSatisfaction.toFixed(1)}/5`,
    },
    topServices: analytics.topServices,
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return convertToCSV(report);
  } else if (format === 'pdf') {
    return generatePDF(report);
  }

  return report;
}

function convertToCSV(data: any): string {
  // Simple CSV conversion
  return JSON.stringify(data);
}

function generatePDF(data: any): void {
  console.log('📄 Generating PDF report:', data);
  alert('PDF report downloaded!');
}

// ==================== WEBHOOKS ====================

export function sendWebhook(partnerId: string, event: string, data: any): void {
  const partner = getPartner(partnerId);
  if (!partner || !partner.webhookUrl) return;

  const payload = {
    event,
    partnerId,
    timestamp: new Date().toISOString(),
    data,
  };

  console.log(`🔔 Webhook sent to ${partner.webhookUrl}:`, payload);

  // In production, send HTTP POST request
  /*
  fetch(partner.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': partner.apiKey,
    },
    body: JSON.stringify(payload),
  });
  */
}

// ==================== PARTNER PORTAL ====================

export function validateAPIKey(apiKey: string): WhiteLabelPartner | null {
  const partner = getAllPartners().find(p => p.apiKey === apiKey && p.status === 'active');
  return partner || null;
}

export function trackPartnerJob(partnerId: string, jobId: string, revenue: number): void {
  const partner = getPartner(partnerId);
  if (!partner) return;

  partner.totalJobs++;
  partner.totalRevenue += revenue;
  partner.lastActiveAt = new Date();

  updatePartner(partnerId, {
    totalJobs: partner.totalJobs,
    totalRevenue: partner.totalRevenue,
  });

  // Send webhook
  sendWebhook(partnerId, 'job.completed', {
    jobId,
    revenue,
    commission: revenue * ((partner.billing.commissionRate || 0) / 100),
  });
}

// ==================== GLOBAL ANALYTICS ====================

export function getWhiteLabelAnalytics() {
  const partners = getAllPartners();
  const activePartners = partners.filter(p => p.status === 'active');

  const totalRevenue = partners.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalJobs = partners.reduce((sum, p) => sum + p.totalJobs, 0);

  return {
    totalPartners: partners.length,
    activePartners: activePartners.length,
    pendingPartners: partners.filter(p => p.status === 'pending').length,
    totalRevenue,
    totalJobs,
    averageRevenuePerPartner: totalRevenue / (partners.length || 1),
    tierBreakdown: {
      basic: partners.filter(p => p.tier === 'basic').length,
      professional: partners.filter(p => p.tier === 'professional').length,
      enterprise: partners.filter(p => p.tier === 'enterprise').length,
    },
  };
}
