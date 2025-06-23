import { 
  PublishSubscriptionRequest, 
  PublishSubscriptionResponse,
  UserResponse 
} from '../../Domain/types';
import { TributeApiService } from '../../Data/api';
import { UserRules } from '../rules/UserRules';

export class PublishSubscriptionUseCase {
  constructor(private apiService: TributeApiService) {}

  async execute(
    request: PublishSubscriptionRequest, 
    user: UserResponse
  ): Promise<PublishSubscriptionResponse> {
    // Проверка бизнес-правил
    if (!UserRules.canPublishSubscription(user)) {
      throw new Error('User cannot publish subscription. Must be verified and not have existing subscription.');
    }

    return await this.apiService.publishSubscription(request);
  }
} 