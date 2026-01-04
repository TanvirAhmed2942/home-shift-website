/**
 * Storage Billing Manager
 * Wrapper for storage monthly billing process
 */

import { processMonthlyBilling } from './storageManager';

/**
 * Process monthly storage billing
 * Called daily by integrationManager
 */
export function processMonthlyStorageBilling(): void {
  console.log('💰 Processing monthly storage billing...');
  processMonthlyBilling();
  console.log('✅ Storage billing completed');
}
