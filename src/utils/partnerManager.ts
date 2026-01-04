/**
 * Partner & Fleet Owner Management System
 * Handles partner accounts, sub-drivers, availability, insurance, and bank accounts
 */

import { jobStatusManager, DriverProfile, AvailabilitySchedule, BankAccountDetails, InsuranceDetails, NotificationPreferences, Job } from './jobStatusManager';

class PartnerManager {
  // ==================== PARTNER SYSTEM (Fleet Owners & Sub-Drivers) ====================

  // Get driver profile
  getDriverProfile(driverId: string): DriverProfile | undefined {
    return jobStatusManager['driverProfiles'].get(driverId);
  }

  // Get all driver profiles
  getAllDriverProfiles(): DriverProfile[] {
    return Array.from(jobStatusManager['driverProfiles'].values());
  }

  // Get all partners (fleet owners)
  getAllPartners(): DriverProfile[] {
    return Array.from(jobStatusManager['driverProfiles'].values()).filter(d => d.isPartner);
  }

  // Get sub-drivers for a partner
  getSubDrivers(partnerId: string): DriverProfile[] {
    const partner = jobStatusManager['driverProfiles'].get(partnerId);
    if (!partner || !partner.isPartner || !partner.subDrivers) return [];
    
    return partner.subDrivers
      .map(id => jobStatusManager['driverProfiles'].get(id))
      .filter(d => d !== undefined) as DriverProfile[];
  }

  // Add sub-driver to partner
  addSubDriver(
    partnerId: string,
    subDriver: Omit<DriverProfile, 'id' | 'partnerId' | 'partnerName' | 'joinedDate'>
  ): DriverProfile | null {
    const partner = jobStatusManager['driverProfiles'].get(partnerId);
    if (!partner || !partner.isPartner) return null;

    const subDriverId = `DRV${Date.now()}`;
    const newSubDriver: DriverProfile = {
      ...subDriver,
      id: subDriverId,
      partnerId: partnerId,
      partnerName: partner.name,
      joinedDate: new Date().toISOString(),
      isPartner: false,
    };

    // Add to profiles
    jobStatusManager['driverProfiles'].set(subDriverId, newSubDriver);

    // Update partner's subDrivers array
    if (!partner.subDrivers) {
      partner.subDrivers = [];
    }
    partner.subDrivers.push(subDriverId);
    jobStatusManager['driverProfiles'].set(partnerId, partner);

    jobStatusManager['emit']('sub_driver_added', { partner, subDriver: newSubDriver });
    return newSubDriver;
  }

  // Remove sub-driver from partner
  removeSubDriver(partnerId: string, subDriverId: string): boolean {
    const partner = jobStatusManager['driverProfiles'].get(partnerId);
    if (!partner || !partner.isPartner || !partner.subDrivers) return false;

    // Remove from partner's subDrivers array
    partner.subDrivers = partner.subDrivers.filter(id => id !== subDriverId);
    jobStatusManager['driverProfiles'].set(partnerId, partner);

    // Optionally: Remove driver profile entirely or just mark as inactive
    jobStatusManager['driverProfiles'].delete(subDriverId);

    jobStatusManager['emit']('sub_driver_removed', { partnerId, subDriverId });
    return true;
  }

  // Assign job to sub-driver (Partner assigns to their sub-driver)
  assignJobToSubDriver(
    jobId: string,
    partnerId: string,
    subDriverId: string
  ): boolean {
    const partner = jobStatusManager['driverProfiles'].get(partnerId);
    const subDriver = jobStatusManager['driverProfiles'].get(subDriverId);
    
    if (!partner || !subDriver || subDriver.partnerId !== partnerId) return false;

    const job = jobStatusManager['jobs'].get(jobId);
    if (!job) return false;

    // Assign job to sub-driver
    job.driverId = subDriverId;
    job.driverName = subDriver.name;
    job.driverUsername = subDriver.username;
    job.driverPhone = subDriver.phone;
    job.status = 'assigned';
    job.assignedAt = new Date().toISOString();

    jobStatusManager['jobs'].set(jobId, job);
    jobStatusManager['emit']('job_assigned_to_sub_driver', { job, partner, subDriver });

    // Notify sub-driver
    jobStatusManager.addNotification(subDriverId, {
      id: `notif_${Date.now()}`,
      type: 'job_assigned',
      title: 'New Job from Partner',
      message: `${partner.name} assigned you: ${job.title}`,
      timestamp: new Date().toISOString(),
      read: false,
      jobId: job.id,
    });

    return true;
  }

  // Get jobs assigned to partner's sub-drivers
  getPartnerJobs(partnerId: string): Job[] {
    const partner = jobStatusManager['driverProfiles'].get(partnerId);
    if (!partner || !partner.isPartner || !partner.subDrivers) return [];

    return jobStatusManager.getAllJobs().filter(job => 
      job.driverId && partner.subDrivers?.includes(job.driverId)
    );
  }

  // Calculate partner earnings from sub-drivers
  calculatePartnerEarnings(partnerId: string): {
    totalEarnings: number;
    totalJobs: number;
    subDriverBreakdown: Array<{
      driverId: string;
      driverName: string;
      earnings: number;
      partnerCut: number;
      jobs: number;
    }>;
  } {
    const partner = jobStatusManager['driverProfiles'].get(partnerId);
    if (!partner || !partner.isPartner || !partner.subDrivers) {
      return { totalEarnings: 0, totalJobs: 0, subDriverBreakdown: [] };
    }

    const revenueSplit = partner.partnerRevenueSplit || 15; // Default 15%
    let totalEarnings = 0;
    let totalJobs = 0;
    const subDriverBreakdown: Array<{
      driverId: string;
      driverName: string;
      earnings: number;
      partnerCut: number;
      jobs: number;
    }> = [];

    partner.subDrivers.forEach(subDriverId => {
      const subDriver = jobStatusManager['driverProfiles'].get(subDriverId);
      if (!subDriver) return;

      const jobs = jobStatusManager.getDriverJobs(subDriverId).filter(j => j.status === 'completed');
      const earnings = jobs.reduce((sum, job) => sum + job.driverPrice, 0);
      const partnerCut = earnings * (revenueSplit / 100);

      totalEarnings += partnerCut;
      totalJobs += jobs.length;

      subDriverBreakdown.push({
        driverId: subDriverId,
        driverName: subDriver.name,
        earnings,
        partnerCut,
        jobs: jobs.length,
      });
    });

    return { totalEarnings, totalJobs, subDriverBreakdown };
  }

  // ==================== AVAILABILITY SYSTEM ====================

  // Update driver availability
  updateDriverAvailability(driverId: string, isAvailable: boolean): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver) return false;

    driver.isAvailable = isAvailable;
    jobStatusManager['driverProfiles'].set(driverId, driver);
    jobStatusManager['emit']('driver_availability_changed', { driverId, isAvailable });
    return true;
  }

  // Set driver availability schedule
  setAvailabilitySchedule(driverId: string, schedule: AvailabilitySchedule): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver) return false;

    driver.availabilitySchedule = schedule;
    jobStatusManager['driverProfiles'].set(driverId, driver);
    jobStatusManager['emit']('availability_schedule_updated', { driverId, schedule });
    return true;
  }

  // Add unavailable date
  addUnavailableDate(driverId: string, date: string): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver) return false;

    if (!driver.unavailableDates) {
      driver.unavailableDates = [];
    }
    if (!driver.unavailableDates.includes(date)) {
      driver.unavailableDates.push(date);
    }
    jobStatusManager['driverProfiles'].set(driverId, driver);
    return true;
  }

  // Remove unavailable date
  removeUnavailableDate(driverId: string, date: string): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver || !driver.unavailableDates) return false;

    driver.unavailableDates = driver.unavailableDates.filter(d => d !== date);
    jobStatusManager['driverProfiles'].set(driverId, driver);
    return true;
  }

  // Check if driver is available on a specific date
  isDriverAvailable(driverId: string, date: string): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver || !driver.isAvailable) return false;
    
    // Check unavailable dates
    if (driver.unavailableDates?.includes(date)) return false;

    // Could also check schedule here
    return true;
  }

  // Get available drivers for a job
  getAvailableDriversForJob(jobDate: string, vehicleType?: string): DriverProfile[] {
    return Array.from(jobStatusManager['driverProfiles'].values()).filter(driver => {
      if (!driver.isAvailable) return false;
      if (driver.unavailableDates?.includes(jobDate)) return false;
      if (vehicleType && driver.vehicleType !== vehicleType) return false;
      return true;
    });
  }

  // ==================== BANK ACCOUNT MANAGEMENT ====================

  // Add/Update bank account
  updateBankAccount(driverId: string, bankAccount: BankAccountDetails): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver) return false;

    driver.bankAccount = bankAccount;
    jobStatusManager['driverProfiles'].set(driverId, driver);
    jobStatusManager['emit']('bank_account_updated', { driverId, bankAccount });
    return true;
  }

  // Verify bank account (Admin only)
  verifyBankAccount(driverId: string): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver || !driver.bankAccount) return false;

    driver.bankAccount.verified = true;
    driver.bankAccount.verifiedAt = new Date().toISOString();
    jobStatusManager['driverProfiles'].set(driverId, driver);
    
    // Notify driver
    jobStatusManager.addNotification(driverId, {
      id: `notif_${Date.now()}`,
      type: 'message',
      title: '✅ Bank Account Verified',
      message: 'Your bank account has been verified. You can now receive payouts.',
      timestamp: new Date().toISOString(),
      read: false,
    });

    return true;
  }

  // ==================== INSURANCE MANAGEMENT ====================

  // Add/Update insurance
  updateInsurance(driverId: string, insurance: InsuranceDetails): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver) return false;

    driver.insurance = insurance;
    jobStatusManager['driverProfiles'].set(driverId, driver);
    jobStatusManager['emit']('insurance_updated', { driverId, insurance });
    return true;
  }

  // Verify insurance (Admin only)
  verifyInsurance(driverId: string, adminUsername: string): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver || !driver.insurance) return false;

    driver.insurance.verified = true;
    driver.insurance.verifiedBy = adminUsername;
    driver.insurance.verifiedAt = new Date().toISOString();
    jobStatusManager['driverProfiles'].set(driverId, driver);
    
    // Notify driver
    jobStatusManager.addNotification(driverId, {
      id: `notif_${Date.now()}`,
      type: 'message',
      title: '✅ Insurance Verified',
      message: 'Your insurance has been verified by admin.',
      timestamp: new Date().toISOString(),
      read: false,
    });

    return true;
  }

  // Get drivers with expiring insurance
  getDriversWithExpiringInsurance(daysThreshold: number = 30): DriverProfile[] {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

    return Array.from(jobStatusManager['driverProfiles'].values()).filter(driver => {
      if (!driver.insurance) return false;
      const expiryDate = new Date(driver.insurance.expiryDate);
      return expiryDate <= thresholdDate;
    });
  }

  // ==================== NOTIFICATION PREFERENCES ====================

  // Update notification preferences
  updateNotificationPreferences(
    driverId: string,
    preferences: NotificationPreferences
  ): boolean {
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (!driver) return false;

    driver.notificationPreferences = preferences;
    jobStatusManager['driverProfiles'].set(driverId, driver);
    jobStatusManager['emit']('notification_preferences_updated', { driverId, preferences });
    return true;
  }
}

// Singleton instance
export const partnerManager = new PartnerManager();
