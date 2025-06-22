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
  TelegramUpdate,
  ErrorResponse
} from '../Domain/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://gateway.statgram.org/api/v1';

class TributeApiService {
  private getAuthHeader(): string | null {
    if (window.Telegram?.WebApp?.initData) {
      return `TgAuth ${window.Telegram.WebApp.initData}`;
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
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
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

  // Onboard
  async onboard(): Promise<OnboardResponse> {
    return this.request<OnboardResponse>('/onboard', {
      method: 'PUT',
    });
  }

  // Add Bot
  async addBot(request: AddBotRequest): Promise<AddBotResponse> {
    return this.request<AddBotResponse>('/add-bot', {
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