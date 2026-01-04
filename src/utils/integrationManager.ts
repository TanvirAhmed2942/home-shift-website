/**
 * Integration Manager - Central Integration Hub
 * Connects all new systems with existing platform and Supabase
 */

import { createInvoiceFromJob, saveInvoice, getAllInvoices, calculateInvoiceStats } from './invoiceGenerator';
import { initializeLanguage, getCurrentLanguage } from './i18nManager';
import { calculateCarbonFootprint, calculateSustainabilityMetrics, calculateGlobalSustainabilityMetrics } from './environmentalImpactTracker';
import { assessWeatherImpact, autoCheckWeatherForUpcomingJobs } from './weatherIntegration';
import { getVerificationStatus, saveVerificationStatus } from './kycVerification';
import { generateDailyRoute, getDriverRoute } from './routeOptimization';
import { checkAbandonedQuotes, winBackInactiveCustomers, getAllCampaigns } from './marketingCRM';
import { getCustomerClaims, getAllClaims, calculateClaimStats } from './insuranceClaimsManager';
import { getUserDisputes, getAllDisputes, calculateDisputeStats, autoEscalateDisputes as autoEscalateDisputesFunction } from './disputeResolutionManager';
import { processMonthlyStorageBilling } from './storageBillingManager';
import { processScheduledJobs, getCustomerRecurringSchedules } from './recurringJobsManager';

/**
 * Initialize all integrated systems on app startup
 */
export function initializeIntegrations(userId?: string): void {
  console.log('🚀 Initializing all system integrations...');
  
  // Initialize language system
  if (userId) {
    initializeLanguage(userId);
  }
  
  // Run automated marketing checks
  runAutomatedMarketingChecks();
  
  // Initialize job completion hooks
  setupJobCompletionHooks();
  
  // Initialize weather monitoring
  startWeatherMonitoring();
  
  console.log('✅ All integrations initialized successfully');
}

/**
 * Hook into job completion to trigger invoice, carbon tracking, etc.
 */
export function setupJobCompletionHooks(): void {
  // Listen for job completion events
  window.addEventListener('jobCompleted', async (event: any) => {
    const { job, customer } = event.detail;
    
    console.log('📋 Processing job completion integrations for:', job.reference);
    
    try {
      // 1. Generate invoice automatically
      const invoice = createInvoiceFromJob(job, customer);
      saveInvoice(invoice);
      console.log('✅ Invoice generated:', invoice.invoiceNumber);
      
      // 2. Calculate carbon footprint
      const carbonFootprint = calculateCarbonFootprint(
        job.id,
        job.reference,
        job.vehicleType || 'medium_van',
        job.distance || 10,
        job.isElectric || false,
        job.isHybrid || false
      );
      console.log('🌍 Carbon footprint calculated:', carbonFootprint.co2Emissions, 'kg CO2');
      
      // 3. Trigger customer feedback request (via marketing system)
      setTimeout(() => {
        sendFeedbackRequest(customer.id, job.reference);
      }, 2 * 60 * 60 * 1000); // 2 hours after completion
      
      // 4. Update customer trust score
      updateCustomerTrustScore(customer.id, 'job_completed');
      
    } catch (error) {
      console.error('Error in job completion integrations:', error);
    }
  });
}

/**
 * Hook into booking creation to check weather, insurance, verification
 */
export async function processBookingIntegrations(booking: any): Promise<{
  success: boolean;
  warnings: string[];
  requirements: string[];
}> {
  const warnings: string[] = [];
  const requirements: string[] = [];
  
  try {
    // 1. Check customer verification status
    const verification = getVerificationStatus(booking.customerId);
    if (!verification.emailVerified) {
      requirements.push('Email verification required before booking');
    }
    
    if (booking.totalPrice > 500 && !verification.phoneVerified) {
      warnings.push('Phone verification recommended for bookings over £500');
    }
    
    if (booking.totalPrice > 1000 && !verification.idVerified) {
      requirements.push('ID verification required for bookings over £1000');
    }
    
    // 2. Check weather conditions
    if (booking.date) {
      const weatherImpact = await assessWeatherImpact(
        booking.id,
        new Date(booking.date),
        booking.pickupAddress,
        booking.deliveryAddress
      );
      
      if (weatherImpact.riskLevel === 'high' || weatherImpact.riskLevel === 'extreme') {
        warnings.push(`Weather warning: ${weatherImpact.weather.condition} expected. Consider rescheduling.`);
        
        // Apply weather pricing adjustment
        booking.weatherAdjustment = weatherImpact.pricingAdjustment;
        booking.totalPrice = booking.totalPrice * (1 + weatherImpact.pricingAdjustment / 100);
      }
    }
    
    // 3. Suggest insurance based on job value
    if (booking.totalPrice > 500 && !booking.insurancePlan) {
      warnings.push('Insurance recommended for this booking value');
    }
    
    return {
      success: requirements.length === 0,
      warnings,
      requirements,
    };
    
  } catch (error) {
    console.error('Error in booking integrations:', error);
    return {
      success: false,
      warnings: ['Error checking booking requirements'],
      requirements: [],
    };
  }
}

/**
 * Daily automated checks for weather, marketing, route optimization, storage billing
 */
export function runDailyAutomatedTasks(): void {
  console.log('🤖 Running daily automated tasks...');
  
  // 1. Weather checks for upcoming jobs
  checkUpcomingJobsWeather();
  
  // 2. Generate optimized routes for drivers
  generateDriverRoutes();
  
  // 3. Run marketing automation
  runAutomatedMarketingChecks();
  
  // 4. Check for overdue invoices
  checkOverdueInvoices();
  
  // 5. Auto-escalate old disputes
  autoEscalateDisputes();
  
  // 6. Process monthly storage billing
  processStorageBilling();
  
  console.log('✅ Daily tasks completed');
}

/**
 * Check weather for upcoming jobs (next 7 days)
 */
async function checkUpcomingJobsWeather(): Promise<void> {
  try {
    await autoCheckWeatherForUpcomingJobs();
    console.log('✅ Weather checks completed');
  } catch (error) {
    console.error('Error checking weather:', error);
  }
}

/**
 * Generate optimized routes for all drivers with jobs today
 */
async function generateDriverRoutes(): Promise<void> {
  try {
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const today = new Date();
    
    for (const driver of drivers) {
      const route = await generateDailyRoute(driver.id, today);
      if (route) {
        console.log(`✅ Route generated for ${driver.name}: ${route.totalDistance}km, £${route.fuelCost.toFixed(2)} fuel`);
      }
    }
  } catch (error) {
    console.error('Error generating routes:', error);
  }
}

/**
 * Run automated marketing checks
 */
function runAutomatedMarketingChecks(): void {
  try {
    // Check for abandoned quotes
    checkAbandonedQuotes();
    
    // Check for inactive customers to win back
    winBackInactiveCustomers();
    
    console.log('✅ Marketing automation completed');
  } catch (error) {
    console.error('Error in marketing automation:', error);
  }
}

/**
 * Check for overdue invoices and send reminders
 */
function checkOverdueInvoices(): void {
  try {
    const invoices = getAllInvoices();
    const now = new Date();
    
    invoices.forEach((invoice: any) => {
      if (invoice.status === 'sent') {
        const dueDate = new Date(invoice.dueDate);
        if (now > dueDate) {
          // Mark as overdue
          invoice.status = 'overdue';
          
          // Send reminder notification
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          notifications.push({
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: invoice.customer.id,
            type: 'invoice_overdue',
            title: `Invoice ${invoice.invoiceNumber} Overdue`,
            message: `Your invoice of £${invoice.total.toFixed(2)} is now overdue. Please make payment.`,
            timestamp: new Date(),
            read: false,
          });
          localStorage.setItem('notifications', JSON.stringify(notifications));
        }
      }
    });
    
    console.log('✅ Invoice checks completed');
  } catch (error) {
    console.error('Error checking invoices:', error);
  }
}

/**
 * Auto-escalate disputes that are unresolved for 7+ days
 */
function autoEscalateDisputes(): void {
  try {
    autoEscalateDisputesFunction();
    console.log('✅ Dispute escalation completed');
  } catch (error) {
    console.error('Error escalating disputes:', error);
  }
}

/**
 * Process monthly storage billing
 */
function processStorageBilling(): void {
  try {
    processMonthlyStorageBilling();
    console.log('✅ Storage billing processed');
  } catch (error) {
    console.error('Error processing storage billing:', error);
  }
}

/**
 * Send feedback request notification
 */
function sendFeedbackRequest(customerId: string, jobReference: string): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: customerId,
    type: 'feedback_request',
    title: 'How was your move?',
    message: `Please rate your experience for job ${jobReference}. Your feedback helps us improve!`,
    timestamp: new Date(),
    read: false,
    actionUrl: `/feedback/${jobReference}`,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

/**
 * Update customer trust score based on actions
 */
function updateCustomerTrustScore(customerId: string, action: string): void {
  const verification = getVerificationStatus(customerId);
  
  // Bonus points for completing jobs
  if (action === 'job_completed') {
    verification.trustScore = Math.min(100, verification.trustScore + 2);
  }
  
  // Save updated verification
  saveVerificationStatus(verification);
}

/**
 * Start weather monitoring interval
 */
function startWeatherMonitoring(): void {
  // Check weather every 6 hours
  const sixHours = 6 * 60 * 60 * 1000;
  
  setInterval(() => {
    checkUpcomingJobsWeather();
  }, sixHours);
}

/**
 * Process recurring jobs (check daily)
 */
export function processRecurringJobs(): void {
  try {
    processScheduledJobs();
    console.log('✅ Recurring jobs processed');
  } catch (error) {
    console.error('Error processing recurring jobs:', error);
  }
}

/**
 * Get integrated dashboard statistics
 */
export function getIntegratedDashboardStats(userId: string, userType: 'customer' | 'driver' | 'admin') {
  const stats: any = {
    verification: getVerificationStatus(userId),
    language: getCurrentLanguage(),
  };
  
  if (userType === 'customer') {
    // Customer-specific stats
    stats.sustainability = calculateSustainabilityMetrics(userId);
    stats.invoices = getAllInvoices().filter(inv => inv.customer.id === userId); // Replaced getCustomerInvoices logic inline if simple or imported
    stats.claims = getCustomerClaims(userId);
    stats.disputes = getUserDisputes(userId);
    stats.recurringSchedules = getCustomerRecurringSchedules(userId);
  }
  
  if (userType === 'driver') {
    // Driver-specific stats
    const today = new Date();
    stats.todayRoute = getDriverRoute(userId, today);
  }
  
  if (userType === 'admin') {
    // Admin-specific stats
    stats.globalSustainability = calculateGlobalSustainabilityMetrics();
    stats.invoiceStats = calculateInvoiceStats(getAllInvoices());
    stats.claimStats = calculateClaimStats(getAllClaims());
    stats.disputeStats = calculateDisputeStats(getAllDisputes());
    stats.campaigns = getAllCampaigns();
  }
  
  return stats;
}

/**
 * Supabase Integration Hook (ready for backend)
 */
export async function syncWithSupabase(entity: string, data: any, operation: 'create' | 'update' | 'delete'): Promise<void> {
  // Placeholder for Supabase integration
  // When Supabase is connected, this will sync data to the cloud
  
  console.log(`📡 Supabase sync: ${operation} ${entity}`, data);
  
  /*
  // Example Supabase integration:
  const { supabase } = await import('./supabaseClient');
  
  switch (operation) {
    case 'create':
      await supabase.from(entity).insert(data);
      break;
    case 'update':
      await supabase.from(entity).update(data).eq('id', data.id);
      break;
    case 'delete':
      await supabase.from(entity).delete().eq('id', data.id);
      break;
  }
  */
}

/**
 * Real-time sync listener (for Supabase realtime)
 */
export function setupRealtimeSync(): void {
  // Placeholder for Supabase realtime subscriptions
  console.log('🔄 Setting up realtime sync...');
  
  /*
  // Example Supabase realtime:
  const { supabase } = await import('./supabaseClient');
  
  supabase
    .channel('db-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'jobs' },
      (payload) => {
        console.log('Job updated:', payload);
        // Update local state
      }
    )
    .subscribe();
  */
}

/**
 * Export for scheduled tasks (cron job simulation)
 */
export function setupScheduledTasks(): void {
  // Run daily tasks every 24 hours
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  setInterval(() => {
    runDailyAutomatedTasks();
  }, oneDayMs);
  
  // Run recurring jobs check every hour
  const oneHourMs = 60 * 60 * 1000;
  
  setInterval(() => {
    processRecurringJobs();
  }, oneHourMs);
  
  console.log('⏰ Scheduled tasks initialized');
}
