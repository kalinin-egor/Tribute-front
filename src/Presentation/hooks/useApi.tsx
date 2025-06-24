import { useCallback, useMemo } from 'react';
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
  // Инициализируем use cases с useMemo для стабилизации
  const useCases = useMemo(() => ({
    onboardUserUseCase: new OnboardUserUseCase(tributeApiService),
    getDashboardUseCase: new GetDashboardUseCase(tributeApiService),
    addBotUseCase: new AddBotUseCase(tributeApiService, ChannelValidationService),
    publishSubscriptionUseCase: new PublishSubscriptionUseCase(tributeApiService),
  }), []);

  const createUser = useCallback(async () => {
    return await useCases.onboardUserUseCase.execute();
  }, [useCases.onboardUserUseCase]);

  const getDashboard = useCallback(async (): Promise<DashboardResponse> => {
    return await useCases.getDashboardUseCase.execute();
  }, [useCases.getDashboardUseCase]);

  const addBot = useCallback(async (channelUsername: string) => {
    return await useCases.addBotUseCase.execute(channelUsername);
  }, [useCases.addBotUseCase]);

  const publishSubscription = useCallback(async (
    request: PublishSubscriptionRequest, 
    user: UserResponse
  ) => {
    return await useCases.publishSubscriptionUseCase.execute(request, user);
  }, [useCases.publishSubscriptionUseCase]);

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

  // Методы для работы с каналами
  const getChannelList = useCallback(async () => {
    return await tributeApiService.getChannelList();
  }, []);

  const checkChannel = useCallback(async (channelId: string) => {
    return await tributeApiService.checkChannel(channelId);
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
    getChannelList,
    checkChannel,
  };
}; 