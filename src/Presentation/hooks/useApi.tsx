import { useCallback } from 'react';
import tributeApiService from '../../Data/api';
import { 
  OnboardUserUseCase,
  GetDashboardUseCase,
  AddBotUseCase,
  PublishSubscriptionUseCase,
  ChannelValidationService
} from '../../Core';
import { 
  PublishSubscriptionRequest, 
  CreateSubscribeRequest, 
  SetUpPayoutsRequest, 
  UploadVerifiedPassportRequest,
  TelegramUpdate,
  DashboardResponse,
  UserResponse
} from '../../Domain/types';

export const useApi = () => {
  // Инициализируем use cases
  const onboardUserUseCase = new OnboardUserUseCase(tributeApiService);
  const getDashboardUseCase = new GetDashboardUseCase(tributeApiService);
  const addBotUseCase = new AddBotUseCase(tributeApiService, ChannelValidationService);
  const publishSubscriptionUseCase = new PublishSubscriptionUseCase(tributeApiService);

  const createUser = useCallback(async () => {
    return await onboardUserUseCase.execute();
  }, [onboardUserUseCase]);

  const getDashboard = useCallback(async (): Promise<DashboardResponse> => {
    return await getDashboardUseCase.execute();
  }, [getDashboardUseCase]);

  const addBot = useCallback(async (channelUsername: string) => {
    return await addBotUseCase.execute(channelUsername);
  }, [addBotUseCase]);

  const publishSubscription = useCallback(async (
    request: PublishSubscriptionRequest, 
    user: UserResponse
  ) => {
    return await publishSubscriptionUseCase.execute(request, user);
  }, [publishSubscriptionUseCase]);

  // Методы, которые пока не имеют use cases (можно добавить позже)
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
    createUser,
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