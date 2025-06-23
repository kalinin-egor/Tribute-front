import React, { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './useTelegram';
import tributeApiService, { NotFoundError } from '../../Data/api';
import { DashboardResponse } from '../../Domain/types';
import { 
  GetDashboardUseCase, 
  OnboardUserUseCase,
  UserRules 
} from '../../Core';

export interface AppState {
  isLoading: boolean;
  isOnboarded: boolean;
  dashboardData: DashboardResponse | null;
  error: string | null;
}

export interface AppStateContextType extends AppState {
  onboardUser: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: FC<{children: ReactNode}> = ({ children }) => {
  const { isReady } = useTelegram();
  const navigate = useNavigate();
  const hasCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);
  
  // Инициализируем use cases
  const getDashboardUseCase = new GetDashboardUseCase(tributeApiService);
  const onboardUserUseCase = new OnboardUserUseCase(tributeApiService);
  
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isOnboarded: false,
    dashboardData: null,
    error: null,
  });

  const checkDashboard = useCallback(async () => {
    if (isCheckingRef.current) return;
    
    if (!isReady || hasCheckedRef.current) {
      return;
    }

    isCheckingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Используем use case вместо прямого вызова API
      const dashboardData = await getDashboardUseCase.execute();
      
      // Используем бизнес-правила для определения состояния
      const accessRules = UserRules.getDashboardAccessRules(dashboardData);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isOnboarded: accessRules.canAccess,
        dashboardData,
        error: null,
      }));
      hasCheckedRef.current = true;
      
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
  }, [isReady, getDashboardUseCase]);

  const refreshDashboard = useCallback(async () => {
    hasCheckedRef.current = false;
    await checkDashboard();
  }, [checkDashboard]);

  const onboardUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Используем use case для онбординга
      await onboardUserUseCase.execute();
      await refreshDashboard();
      
    } catch (error: any) {
      console.error('User creation failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'User creation failed',
      }));
    }
  }, [refreshDashboard, onboardUserUseCase]);

  useEffect(() => {
    if (isReady) {
      checkDashboard();
    }
  }, [isReady, checkDashboard]);

  const value = {
    ...state,
    onboardUser,
    refreshDashboard,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}; 