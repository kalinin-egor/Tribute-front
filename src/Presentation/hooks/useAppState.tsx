import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './useTelegram';
import tributeApiService from '../../Data/api';
import { DashboardResponse } from '../../Domain/types';

export interface AppState {
  isLoading: boolean;
  isOnboarded: boolean;
  dashboardData: DashboardResponse | null;
  error: string | null;
}

export const useAppState = () => {
  const { isReady } = useTelegram();
  const navigate = useNavigate();
  
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isOnboarded: false,
    dashboardData: null,
    error: null,
  });

  const checkDashboard = useCallback(async () => {
    if (!isReady) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Try to get dashboard data
      const dashboardData = await tributeApiService.getDashboard();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isOnboarded: true,
        dashboardData,
        error: null,
      }));

      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Dashboard check failed:', error);
      
      // If user is not onboarded (404), redirect to monetization page
      if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isOnboarded: false,
          error: null,
        }));
        
        navigate('/monetization');
      } else {
        // Other errors
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'An error occurred',
        }));
      }
    }
  }, [isReady, navigate]);

  const onboardUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await tributeApiService.onboard();
      
      // After successful onboarding, check dashboard again
      await checkDashboard();
      
    } catch (error: any) {
      console.error('Onboarding failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Onboarding failed',
      }));
    }
  }, [checkDashboard]);

  const refreshDashboard = useCallback(async () => {
    if (state.isOnboarded) {
      await checkDashboard();
    }
  }, [state.isOnboarded, checkDashboard]);

  useEffect(() => {
    if (isReady) {
      checkDashboard();
    }
  }, [isReady, checkDashboard]);

  return {
    ...state,
    checkDashboard,
    onboardUser,
    refreshDashboard,
  };
}; 