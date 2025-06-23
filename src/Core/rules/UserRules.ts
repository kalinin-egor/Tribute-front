import { UserResponse, DashboardResponse } from '../../Domain/types';

export class UserRules {
  static canAccessDashboard(user: UserResponse): boolean {
    return user.is_onboarded;
  }

  static canSetupPayouts(user: UserResponse): boolean {
    return user.is_verified && user.earned > 0;
  }

  static canPublishSubscription(user: UserResponse): boolean {
    return user.is_verified && !user.is_sub_published;
  }

  static canAddChannel(user: UserResponse): boolean {
    return user.is_onboarded;
  }

  static needsVerification(user: UserResponse): boolean {
    return !user.is_verified;
  }

  static canReceivePayments(user: UserResponse): boolean {
    return user.is_verified;
  }

  static getMinimumEarningsForPayout(): number {
    return 10; // Минимальная сумма для выплаты в USD
  }

  static canRequestPayout(earned: number): boolean {
    return earned >= this.getMinimumEarningsForPayout();
  }

  static getDashboardAccessRules(dashboardData: DashboardResponse | null): {
    canAccess: boolean;
    needsOnboarding: boolean;
    needsVerification: boolean;
  } {
    if (!dashboardData) {
      return {
        canAccess: false,
        needsOnboarding: true,
        needsVerification: false
      };
    }

    return {
      canAccess: true,
      needsOnboarding: false,
      needsVerification: !dashboardData['is-verified']
    };
  }
} 