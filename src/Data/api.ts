import { 
  DashboardResponse, 
  CreateUserResponse,
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
  ChannelDTO,
  CheckChannelRequest,
  CheckChannelResponse
} from '../Domain/types';

// Custom error class for 404 responses
export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

const API_BASE_URL = 'https://gateway.statgram.org/api/v1';

class TributeApiService {
  private getAuthHeader(): string | null {
    if (window.Telegram?.WebApp?.initData) {
      const authHeader = `TgAuth ${window.Telegram.WebApp.initData}`;
      return authHeader;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const authHeader = this.getAuthHeader();
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authHeader) {
      defaultHeaders['Authorization'] = authHeader;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 404 specifically for dashboard endpoint
      if (response.status === 404 && endpoint === '/dashboard') {
        throw new NotFoundError('Dashboard not found - user needs onboarding');
      }
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data.error 
          ? data.error 
          : `HTTP error! status: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request<any>('/health');
  }

  // Dashboard
  async getDashboard(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/dashboard');
  }

  // Create User
  async createUser(): Promise<CreateUserResponse> {
    return this.request<CreateUserResponse>('/create-user', {
      method: 'POST',
    });
  }

  // Add Bot
  async addBot(channelUsername: string): Promise<AddBotResponse> {
    const request: AddBotRequest = {
      'channel-username': channelUsername
    };
    return this.request<AddBotResponse>('/add-bot', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get Channel List
  async getChannelList(): Promise<ChannelDTO[]> {
    return this.request<ChannelDTO[]>('/channel-list');
  }

  // Check Channel Ownership
  async checkChannel(channelId: string): Promise<CheckChannelResponse> {
    const request: CheckChannelRequest = {
      channel_id: channelId
    };
    return this.request<CheckChannelResponse>('/check-channel', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Publish Subscription
  async publishSubscription(request: PublishSubscriptionRequest): Promise<PublishSubscriptionResponse> {
    return this.request<PublishSubscriptionResponse>('/publish-subscription', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Create Subscribe
  async createSubscribe(request: CreateSubscribeRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/create-subscribe', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Set Up Payouts
  async setUpPayouts(request: SetUpPayoutsRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/set-up-payouts', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Upload Verified Passport
  async uploadVerifiedPassport(request: UploadVerifiedPassportRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/upload-verified-passport', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Check Verified Passport (public endpoint)
  async checkVerifiedPassport(update: TelegramUpdate): Promise<StatusResponse> {
    return this.request<StatusResponse>('/check-verified-passport', {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }
}

export const tributeApiService = new TributeApiService();
export default tributeApiService; 