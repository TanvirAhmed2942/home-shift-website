/**
 * LOYALTY & REFERRAL SYSTEM
 * Complete rewards program with points, tiers, referrals, and coupons
 */

// ==================== TYPES ====================

export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyAccount {
  userId: string;
  points: number;
  tier: RewardTier;
  totalSpent: number;
  bookingsCount: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  referralEarnings: number;
  createdAt: Date;
  lastActivity: Date;
}

export interface ReferralReward {
  code: string;
  referrer: string;
  referee: string;
  status: 'pending' | 'completed';
  referrerReward: number;
  refereeDiscount: number;
  bookingId?: string;
  completedAt?: Date;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free-service' | 'upgrade' | 'voucher';
  value: number;
  icon: string;
}

// ==================== TIER CONFIGURATION ====================

const TIER_CONFIG = {
  bronze: {
    name: 'Bronze',
    minSpent: 0,
    pointsMultiplier: 1,
    benefits: ['1 point per £1 spent', 'Exclusive offers'],
    color: '#CD7F32',
    icon: '🥉',
  },
  silver: {
    name: 'Silver',
    minSpent: 500,
    pointsMultiplier: 1.5,
    benefits: ['1.5 points per £1', 'Priority support', '5% discount'],
    color: '#C0C0C0',
    icon: '🥈',
  },
  gold: {
    name: 'Gold',
    minSpent: 2000,
    pointsMultiplier: 2,
    benefits: ['2 points per £1', 'Free insurance', '10% discount'],
    color: '#FFD700',
    icon: '🥇',
  },
  platinum: {
    name: 'Platinum',
    minSpent: 5000,
    pointsMultiplier: 3,
    benefits: ['3 points per £1', 'VIP support', '15% discount', 'Free upgrades'],
    color: '#E5E4E2',
    icon: '💎',
  },
};

// ==================== REWARD CATALOG ====================

const REWARD_CATALOG: LoyaltyReward[] = [
  { id: 'r1', name: '£5 Discount', description: 'Get £5 off your next booking', pointsCost: 500, type: 'discount', value: 5, icon: '💷' },
  { id: 'r2', name: '£10 Discount', description: 'Get £10 off your next booking', pointsCost: 900, type: 'discount', value: 10, icon: '💷' },
  { id: 'r3', name: '£25 Discount', description: 'Get £25 off your next booking', pointsCost: 2000, type: 'discount', value: 25, icon: '💷' },
  { id: 'r4', name: 'Free Packing Service', description: 'Complimentary packing for one room', pointsCost: 1500, type: 'free-service', value: 0, icon: '📦' },
  { id: 'r5', name: 'Vehicle Upgrade', description: 'Upgrade to next size vehicle free', pointsCost: 1000, type: 'upgrade', value: 0, icon: '🚚' },
  { id: 'r6', name: '£50 Amazon Voucher', description: 'Amazon gift card', pointsCost: 5000, type: 'voucher', value: 50, icon: '🎁' },
];

// ==================== LOYALTY MANAGER ====================

class LoyaltyRewardManager {
  private accounts: Map<string, LoyaltyAccount> = new Map();
  private referrals: Map<string, ReferralReward> = new Map();
  private coupons: Map<string, Coupon> = new Map();

  // ==================== ACCOUNT MANAGEMENT ====================

  createAccount(userId: string): LoyaltyAccount {
    const account: LoyaltyAccount = {
      userId,
      points: 0,
      tier: 'bronze',
      totalSpent: 0,
      bookingsCount: 0,
      referralCode: this.generateReferralCode(userId),
      referralsCount: 0,
      referralEarnings: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.accounts.set(userId, account);
    return account;
  }

  getAccount(userId: string): LoyaltyAccount {
    let account = this.accounts.get(userId);
    if (!account) {
      account = this.createAccount(userId);
    }
    return account;
  }

  // ==================== EARN POINTS ====================

  earnPoints(userId: string, amount: number, source: string = 'purchase'): number {
    const account = this.getAccount(userId);
    const multiplier = TIER_CONFIG[account.tier].pointsMultiplier;
    const pointsEarned = Math.floor(amount * multiplier);

    account.points += pointsEarned;
    account.totalSpent += amount;
    account.bookingsCount += 1;
    account.lastActivity = new Date();

    // Check for tier upgrade
    this.updateTier(account);

    console.log(`[Loyalty] User ${userId} earned ${pointsEarned} points (${source})`);
    return pointsEarned;
  }

  // ==================== REDEEM POINTS ====================

  redeemReward(userId: string, rewardId: string): { success: boolean; couponCode?: string } {
    const account = this.getAccount(userId);
    const reward = REWARD_CATALOG.find(r => r.id === rewardId);

    if (!reward) {
      return { success: false };
    }

    if (account.points < reward.pointsCost) {
      return { success: false };
    }

    // Deduct points
    account.points -= reward.pointsCost;

    // Generate coupon
    const couponCode = this.generateCoupon(reward);

    console.log(`[Loyalty] User ${userId} redeemed ${reward.name} for ${reward.pointsCost} points`);
    return { success: true, couponCode };
  }

  // ==================== TIER MANAGEMENT ====================

  private updateTier(account: LoyaltyAccount): void {
    const oldTier = account.tier;
    
    if (account.totalSpent >= TIER_CONFIG.platinum.minSpent) {
      account.tier = 'platinum';
    } else if (account.totalSpent >= TIER_CONFIG.gold.minSpent) {
      account.tier = 'gold';
    } else if (account.totalSpent >= TIER_CONFIG.silver.minSpent) {
      account.tier = 'silver';
    } else {
      account.tier = 'bronze';
    }

    if (oldTier !== account.tier) {
      console.log(`[Loyalty] User ${account.userId} upgraded to ${account.tier}`);
    }
  }

  getTierInfo(tier: RewardTier) {
    return TIER_CONFIG[tier];
  }

  getNextTier(currentTier: RewardTier): { tier: RewardTier; required: number } | null {
    const tiers: RewardTier[] = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    
    if (currentIndex === tiers.length - 1) return null;
    
    const nextTier = tiers[currentIndex + 1];
    return {
      tier: nextTier,
      required: TIER_CONFIG[nextTier].minSpent,
    };
  }

  // ==================== REFERRAL SYSTEM ====================

  private generateReferralCode(userId: string): string {
    return `${userId.substring(0, 4).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  applyReferralCode(refereeUserId: string, referralCode: string): boolean {
    // Find referrer
    let referrerAccount: LoyaltyAccount | null = null;
    for (const account of this.accounts.values()) {
      if (account.referralCode === referralCode) {
        referrerAccount = account;
        break;
      }
    }

    if (!referrerAccount) return false;

    // Create referral record
    const referral: ReferralReward = {
      code: referralCode,
      referrer: referrerAccount.userId,
      referee: refereeUserId,
      status: 'pending',
      referrerReward: 20, // £20 for referrer
      refereeDiscount: 15, // 15% for referee
    };

    this.referrals.set(`${referrerAccount.userId}-${refereeUserId}`, referral);

    // Update referee account
    const refereeAccount = this.getAccount(refereeUserId);
    refereeAccount.referredBy = referrerAccount.userId;

    console.log(`[Referral] ${refereeUserId} used code ${referralCode}`);
    return true;
  }

  completeReferral(refereeUserId: string, bookingId: string, amount: number): void {
    const refereeAccount = this.getAccount(refereeUserId);
    if (!refereeAccount.referredBy) return;

    const key = `${refereeAccount.referredBy}-${refereeUserId}`;
    const referral = this.referrals.get(key);
    if (!referral || referral.status === 'completed') return;

    // Complete referral
    referral.status = 'completed';
    referral.bookingId = bookingId;
    referral.completedAt = new Date();

    // Reward referrer
    const referrerAccount = this.getAccount(referral.referrer);
    referrerAccount.points += referral.referrerReward * 100; // Convert £ to points
    referrerAccount.referralsCount += 1;
    referrerAccount.referralEarnings += referral.referrerReward;

    console.log(`[Referral] Completed: ${referral.referrer} earned £${referral.referrerReward}`);
  }

  getReferralStats(userId: string) {
    const account = this.getAccount(userId);
    return {
      code: account.referralCode,
      count: account.referralsCount,
      earnings: account.referralEarnings,
    };
  }

  // ==================== COUPON MANAGEMENT ====================

  private generateCoupon(reward: LoyaltyReward): string {
    const code = `REWARD${Date.now().toString(36).toUpperCase()}`;
    
    const coupon: Coupon = {
      code,
      type: reward.type === 'discount' ? 'fixed' : 'percentage',
      value: reward.value,
      usageLimit: 1,
      usageCount: 0,
      isActive: true,
      description: reward.description,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    };

    this.coupons.set(code, coupon);
    return code;
  }

  createPromoCoupon(
    code: string,
    type: 'percentage' | 'fixed',
    value: number,
    options?: Partial<Coupon>
  ): void {
    const coupon: Coupon = {
      code,
      type,
      value,
      usageLimit: options?.usageLimit || 1000,
      usageCount: 0,
      isActive: true,
      description: options?.description || `Get ${type === 'percentage' ? value + '%' : '£' + value} off`,
      minSpend: options?.minSpend,
      maxDiscount: options?.maxDiscount,
      expiryDate: options?.expiryDate,
    };

    this.coupons.set(code, coupon);
  }

  validateCoupon(code: string): { valid: boolean; discount?: number; message?: string } {
    const coupon = this.coupons.get(code.toUpperCase());

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon is no longer active' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'This coupon has reached its usage limit' };
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return { valid: false, message: 'This coupon has expired' };
    }

    return { valid: true, discount: coupon.value };
  }

  applyCoupon(code: string, orderAmount: number): number {
    const validation = this.validateCoupon(code);
    if (!validation.valid) return 0;

    const coupon = this.coupons.get(code.toUpperCase())!;

    // Check minimum spend
    if (coupon.minSpend && orderAmount < coupon.minSpend) {
      return 0;
    }

    let discount = 0;

    if (coupon.type === 'percentage') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }

    // Use coupon
    coupon.usageCount += 1;

    return discount;
  }

  // ==================== REWARDS CATALOG ====================

  getAvailableRewards(userId: string): LoyaltyReward[] {
    const account = this.getAccount(userId);
    return REWARD_CATALOG.map(reward => ({
      ...reward,
      canAfford: account.points >= reward.pointsCost,
    } as any));
  }

  // ==================== SEED DATA ====================

  seedData(userId: string): void {
    // Create account with some progress
    const account = this.createAccount(userId);
    account.points = 2500;
    account.totalSpent = 1200;
    account.bookingsCount = 8;
    account.referralsCount = 2;
    account.referralEarnings = 40;
    this.updateTier(account);

    // Create sample coupons
    this.createPromoCoupon('SHIFT15', 'percentage', 15, {
      description: 'Get 15% off your first booking',
      minSpend: 50,
    });

    this.createPromoCoupon('WELCOME50', 'fixed', 50, {
      description: 'Get £50 off orders over £300',
      minSpend: 300,
    });
  }
}

// ==================== SINGLETON ====================

export const loyaltyRewardManager = new LoyaltyRewardManager();

// ==================== EXPORT CATALOG ====================

export const rewardCatalog = REWARD_CATALOG;
export const tierConfig = TIER_CONFIG;
