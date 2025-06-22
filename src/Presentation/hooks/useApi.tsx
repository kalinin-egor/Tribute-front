import { useCallback } from 'react';
import tributeApiService from '../../Data/api';
import { 
  AddBotRequest, 
  PublishSubscriptionRequest, 
  CreateSubscribeRequest, 
  SetUpPayoutsRequest, 
  UploadVerifiedPassportRequest,
  TelegramUpdate,
  DashboardResponse
} from '../../Domain/types';

export const useApi = () => {
  const getDashboard = useCallback(async (): Promise<DashboardResponse> => {
    return await tributeApiService.getDashboard();
  }, []);

  const addBot = useCallback(async (request: AddBotRequest) => {
    return await tributeApiService.addBot(request);
  }, []);

  const publishSubscription = useCallback(async (request: PublishSubscriptionRequest) => {
    return await tributeApiService.publishSubscription(request);
  }, []);

  const createSubscribe = useCallback(async (request: CreateSubscribeRequest) => {
    return await tributeApiService.createSubscribe(request);
  }, []);

  const setUpPayouts = useCallback(async (request: SetUpPayoutsRequest) => {
    return await tributeApiService.setUpPayouts(request);
  }, []);

  const uploadVerifiedPassport = useCallback(async (request: UploadVerifiedPassportRequest) => {
    return await tributeApiService.uploadVerifiedPassport(request);
  }, []);

  const checkVerifiedPassport = useCallback(async (update: TelegramUpdate) => {
    return await tributeApiService.checkVerifiedPassport(update);
  }, []);

  const healthCheck = useCallback(async () => {
    return await tributeApiService.healthCheck();
  }, []);

  return {
    getDashboard,
    addBot,
    publishSubscription,
    createSubscribe,
    setUpPayouts,
    uploadVerifiedPassport,
    checkVerifiedPassport,
    healthCheck,
  };
}; 