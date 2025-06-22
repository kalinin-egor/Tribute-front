import { 
  DashboardResponse,
  AddBotRequest, 
  AddBotResponse,
  PublishSubscriptionRequest,
  PublishSubscriptionResponse,
  CreateSubscribeRequest,
  SetUpPayoutsRequest,
  UploadVerifiedPassportRequest,
  MessageResponse,
  StatusResponse,
  TelegramUpdate,
  ErrorResponse,
  CreateUserResponse,
  ChannelDTO,
} from '../Domain/types';

class MockApiService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getDashboard(): Promise<DashboardResponse> {
    await this.delay(1000);
    // Simulate a 404 for a user who is not onboarded
    if (localStorage.getItem('is-onboarded') !== 'true') {
      console.log('Mock API: User not onboarded, throwing 404');
      throw new Error('404 Not Found');
    }
    console.log('Mock API: User is onboarded, returning dashboard data');
    const channels: ChannelDTO[] = [
      { id: '1', channel_username: '@test_channel_1' },
      { id: '2', channel_username: '@test_channel_2' },
    ];
    return {
      earn: 1250.50,
      'channels-and-groups': channels,
      'is-verified': true,
      subscriptions: [],
      'is-sub-published': true,
      'payments-history': [],
    };
  }

  async createUser(): Promise<CreateUserResponse> {
    await this.delay(1000);
    localStorage.setItem('is-onboarded', 'true');
    console.log('Mock API: User created and onboarded');
    return {
      message: 'User processed successfully',
      user: {
        id: 123456789,
        earned: 0,
        is_onboarded: true,
        is_sub_published: false,
        is_verified: false,
      },
      created: true,
    };
  }

  async addBot(request: AddBotRequest): Promise<AddBotResponse> {
    await this.delay(1000);
    return {
      message: 'Bot added successfully',
      channel: {
        id: '3',
        channel_username: request['bot-username'],
      },
    };
  }

  async publishSubscription(request: PublishSubscriptionRequest): Promise<PublishSubscriptionResponse> {
    await this.delay(1000);
    return {
      message: 'Subscription published successfully',
      subscription: {
        id: 'sub1',
        title: request.title,
        description: request.description,
        price: request.price,
      },
    };
  }

  async createSubscribe(request: CreateSubscribeRequest): Promise<MessageResponse> {
    await this.delay(1000);
    return { message: `Subscribed user ${request.user_id} successfully` };
  }

  async setUpPayouts(request: SetUpPayoutsRequest): Promise<MessageResponse> {
    await this.delay(1000);
    return { message: 'Payouts set up successfully' };
  }

  async uploadVerifiedPassport(request: UploadVerifiedPassportRequest): Promise<MessageResponse> {
    await this.delay(1000);
    return { message: 'Passport uploaded successfully' };
  }

  async checkVerifiedPassport(update: TelegramUpdate): Promise<StatusResponse> {
    await this.delay(1000);
    return { status: 'verified' };
  }

  async healthCheck(): Promise<any> {
    await this.delay(500);
    return { status: 'ok' };
  }
}

export const mockApi = new MockApiService();
export default mockApi; 