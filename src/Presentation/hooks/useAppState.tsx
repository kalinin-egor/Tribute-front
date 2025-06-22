import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './useTelegram';
import tributeApiService, { NotFoundError } from '../../Data/api';
import { DashboardResponse } from '../../Domain/types';

export interface AppState {
  isLoading: boolean;
  isOnboarded: boolean;
  dashboardData: DashboardResponse | null;
  error: string | null;
}

export const useAppState = () => {
  const { isReady, webApp, user } = useTelegram();
  const navigate = useNavigate();
  const hasCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);
  
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isOnboarded: false,
    dashboardData: null,
    error: null,
  });

  const checkDashboard = useCallback(async () => {
    console.log('checkDashboard called, isReady:', isReady, 'hasChecked:', hasCheckedRef.current, 'isChecking:', isCheckingRef.current);
    if (!isReady || hasCheckedRef.current || isCheckingRef.current) {
      console.log('Telegram not ready yet, already checked, or currently checking');
      return;
    }

    hasCheckedRef.current = true;
    isCheckingRef.current = true;

    try {
      console.log('Starting dashboard check...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Try to get dashboard data
      const dashboardData = await tributeApiService.getDashboard();
      console.log('Dashboard data received:', dashboardData);
      
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
      console.log('Error details:', {
        name: error.name,
        message: error.message,
        isNotFoundError: error instanceof NotFoundError,
        includes404: error.message?.includes('404'),
        includesNotFound: error.message?.includes('Not Found')
      });
      
      // Check if it's a NotFoundError (404) or a related message - user needs onboarding
      if (
        error instanceof NotFoundError || 
        error.message?.includes('404') || 
        error.message?.toLowerCase().includes('not found') ||
        error.message?.toLowerCase().includes('onboarding')
      ) {
        console.log('User not onboarded, redirecting to monetization');
        setState(prev => ({
          ...prev,
          isLoading: false,
          isOnboarded: false,
          error: null,
        }));
        
        navigate('/monetization');
      } else {
        // Other errors
        console.log('Other error occurred:', error.message);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'An error occurred',
        }));
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [isReady, navigate]);

  const onboardUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // First, create the user (or verify they exist)
      const createUserResponse = await tributeApiService.createUser();
      console.log('User creation response:', createUserResponse);

      // Then, finalize the onboarding process
      await tributeApiService.onboard();
      
      // Reset the check flag and check dashboard again
      hasCheckedRef.current = false;
      await checkDashboard();
      
    } catch (error: any) {
      console.error('Onboarding/User creation failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Onboarding failed',
      }));
    }
  }, [checkDashboard]);

  const refreshDashboard = useCallback(async () => {
    if (state.isOnboarded) {
      hasCheckedRef.current = false;
      await checkDashboard();
    }
  }, [state.isOnboarded, checkDashboard]);

  useEffect(() => {
    console.log('useAppState useEffect triggered, isReady:', isReady, 'webApp:', !!webApp, 'user:', !!user);
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