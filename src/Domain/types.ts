// User types
export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

// Tribute types
export interface Tribute {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  from_user: User;
  to_user: User;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface CreateTributeForm {
  title: string;
  description: string;
  amount: number;
  currency: string;
  to_user_id: number;
}

// Theme types
export interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

// Navigation types
export interface NavigationState {
  currentPage: string;
  previousPage?: string;
}

// --- New API Types based on documentation ---

// Dashboard Response
export interface DashboardResponse {
  earn: number;
  'channels-and-groups': ChannelDTO[];
  'is-verified': boolean;
  subscriptions: SubDTO[];
  'is-sub-published': boolean;
  'payments-history': PaymentDTO[];
}

// Channel types
export interface ChannelDTO {
  id: string;
  channel_username: string;
}

// Subscription types
export interface SubDTO {
  id: string;
  title: string;
  description: string;
  price: number;
}

// Payment types
export interface PaymentDTO {
  created_date: string;
  description: string;
}

// User Response
export interface UserResponse {
  id: number;
  earned: number;
  is_onboarded: boolean;
  is_sub_published: boolean;
  is_verified: boolean;
}

// Create User Response
export interface CreateUserResponse {
  message: string;
  user: UserResponse;
  created: boolean;
}

// Add Bot Request/Response
export interface AddBotRequest {
  'channel-username': string;
}

export interface AddBotResponse {
  success: boolean;
  message?: string;
}

// Publish Subscription Request/Response
export interface PublishSubscriptionRequest {
  title: string;
  description: string;
  price: number;
  'button-text': string;
  access_token: string;
}

export interface PublishSubscriptionResponse {
  message: string;
  subscription: SubDTO;
}

// Create Subscribe Request
export interface CreateSubscribeRequest {
  user_id: number;
  price: number;
}

// Set Up Payouts Request
export interface SetUpPayoutsRequest {
  'card-number': string;
  'card-date': string;
  'card-cvv': string;
  access_token: string;
}

// Upload Verified Passport Request
export interface UploadVerifiedPassportRequest {
  'user-photo': string; // base64
  'user-passport': string; // base64
  access_token: string;
}

// Message Response
export interface MessageResponse {
  message: string;
}

// Status Response
export interface StatusResponse {
  status: string;
}

// Error Response
export interface ErrorResponse {
  error: string;
}

// Telegram Update types (for webhooks)
export interface TelegramUpdate {
  update_id: number;
  callback_query?: CallbackQuery;
}

export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUser {
  id: number;
}

export interface TelegramMessage {
  message_id: number;
  chat: TelegramChat;
}

export interface TelegramChat {
  id: number;
}

// --- Legacy types for backward compatibility ---

export interface UserModel {
  user_id: string;
  earned: number;
  is_verified: boolean;
  subscriptions: Subscription[];
  is_sub_published: boolean;
}

export interface Channel {
  id: string;
  user_id: string;
  channel_username: string;
}

export interface Subscription {
  id: string;
  channel_id: string;
  user_id: string;
  channel_username: string;
  title: string;
  description: string;
  button_text: string;
  price: number;
  created_date: string;
}

export interface Payment {
  user_id: string;
  description: string;
  created_date: string;
}

export interface DashboardData {
  earn: number;
  'channels-and-groups': Channel[];
  'is-verified': boolean;
  subscriptions: Subscription[];
  'is-sub-published': boolean;
  'payments-history': Payment[];
} 