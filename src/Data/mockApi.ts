import { 
  DashboardResponse, 
  OnboardResponse, 
  AddBotRequest, 
  AddBotResponse,
  PublishSubscriptionRequest,
  PublishSubscriptionResponse,
  CreateSubscribeRequest,
  SetUpPayoutsRequest,
  UploadVerifiedPassportRequest,
  MessageResponse,
  StatusResponse,
  TelegramUpdate
} from '../Domain/types';

class MockApiService {
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async healthCheck(): Promise<any> {
    await this.delay(500);
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  // Dashboard
  async getDashboard(): Promise<DashboardResponse> {
    await this.delay(1000);
    
    // Simulate user not onboarded
    const error = new Error('Not Found');
    error.message = 'User not found';
    throw error;
    
    // Uncomment below to simulate onboarded user
    /*
    return {
      earn: 1250.50,
      'channels-and-groups': [
        { id: '1', channel_username: 'my_channel' },
        { id: '2', channel_username: 'another_channel' }
      ],
      'is-verified': true,
      subscriptions: [
        {
          id: '1',
          title: 'Premium Content',
          description: 'Access to exclusive content',
          price: 9.99
        }
      ],
      'is-sub-published': true,
      'payments-history': [
        {
          created_date: '2024-01-15T10:30:00Z',
          description: 'Payment from user123'
        }
      ]
    };
    */
  }

  // Onboard
  async onboard(): Promise<OnboardResponse> {
    await this.delay(1000);
    return {
      message: 'User onboarded successfully',
      user: {
        id: 123456789,
        earned: 0,
        is_onboarded: true,
        is_sub_published: false,
        is_verified: false
      }
    };
  }

  // Add Bot
  async addBot(request: AddBotRequest): Promise<AddBotResponse> {
    await this.delay(1000);
    return {
      message: 'Bot added successfully',
      channel: {
        id: '1',
        channel_username: request['bot-username']
      }
    };
  }

  // Publish Subscription
  async publishSubscription(request: PublishSubscriptionRequest): Promise<PublishSubscriptionResponse> {
    await this.delay(1000);
    return {
      message: 'Subscription published successfully',
      subscription: {
        id: '1',
        title: request.title,
        description: request.description,
        price: request.price
      }
    };
  }

  // Create Subscribe
  async createSubscribe(request: CreateSubscribeRequest): Promise<MessageResponse> {
    await this.delay(1000);
    return {
      message: 'Subscription created successfully'
    };
  }

  // Set Up Payouts
  async setUpPayouts(request: SetUpPayoutsRequest): Promise<MessageResponse> {
    await this.delay(1000);
    return {
      message: 'Payout method set up successfully'
    };
  }

  // Upload Verified Passport
  async uploadVerifiedPassport(request: UploadVerifiedPassportRequest): Promise<MessageResponse> {
    await this.delay(1000);
    return {
      message: 'Documents uploaded successfully'
    };
  }

  // Check Verified Passport
  async checkVerifiedPassport(update: TelegramUpdate): Promise<StatusResponse> {
    await this.delay(500);
    return {
      status: 'ok'
    };
  }
}

export const mockApiService = new MockApiService();
export default mockApiService; 