import { useState, useEffect, useCallback, useRef } from 'react';
import { useTelegram } from './useTelegram';
import tributeApiService, { NotFoundError } from '../../Data/api';
import { DashboardResponse, OnboardResponse } from '../../Domain/types';

export interface AppState {
  isLoading: boolean;
  isOnboarded: boolean;
  dashboardData: DashboardResponse | null;
  error: string | null;
}

export const useAppState = () => {
  const { isReady, webApp, user } = useTelegram();
  const hasCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);
  
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isOnboarded: false,
    dashboardData: null,
    error: null,
  });

  const checkDashboard = useCallback(async () => {
    if (!isReady || hasCheckedRef.current || isCheckingRef.current) {
      return;
    }

    hasCheckedRef.current = true;
    isCheckingRef.current = true;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const dashboardData = await tributeApiService.getDashboard();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isOnboarded: true,
        dashboardData,
        error: null,
      }));
      
    } catch (error: any) {
      if (
        error instanceof NotFoundError || 
        error.message?.includes('404') || 
        error.message?.toLowerCase().includes('not found') ||
        error.message?.toLowerCase().includes('onboarding')
      ) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isOnboarded: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'An error occurred',
        }));
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [isReady]);

  const onboardUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await tributeApiService.createUser();
      const onboardResponse = await tributeApiService.onboard();
      
      const { user } = onboardResponse;

      const dashboardData: DashboardResponse = {
        earn: user.earned,
        'is-verified': user.is_verified,
        'is-sub-published': user.is_sub_published,
        'channels-and-groups': [],
        subscriptions: [],
        'payments-history': [],
      };

      setState({
        isLoading: false,
        isOnboarded: true,
        dashboardData,
        error: null,
      });
      
    } catch (error: any) {
      console.error('Onboarding/User creation failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Onboarding failed',
      }));
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    hasCheckedRef.current = false;
    await checkDashboard();
  }, [checkDashboard]);

  useEffect(() => {
    if (isReady) {
      checkDashboard();
    }
  }, [isReady, checkDashboard]);

  return {
    ...state,
    onboardUser,
    refreshDashboard,
  };
}; 