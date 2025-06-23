import { UserResponse, DashboardResponse } from '../../Domain/types';

export class UserService {
  static isUserVerified(user: UserResponse): boolean {
    return user.is_verified;
  }

  static isUserOnboarded(user: UserResponse): boolean {
    return user.is_onboarded;
  }

  static canUserPublishSubscription(user: UserResponse): boolean {
    return user.is_verified && !user.is_sub_published;
  }

  static getUserEarnings(user: UserResponse): number {
    return user.earned;
  }

  static canAccessDashboard(dashboardData: DashboardResponse | null): boolean {
    return dashboardData !== null;
  }

  static canSetupPayouts(dashboardData: DashboardResponse): boolean {
    return dashboardData['is-verified'] && dashboardData.earn > 0;
  }

  static getVerificationStatus(dashboardData: DashboardResponse): {
    isVerified: boolean;
    needsVerification: boolean;
  } {
    return {
      isVerified: dashboardData['is-verified'],
      needsVerification: !dashboardData['is-verified']
    };
  }
} 