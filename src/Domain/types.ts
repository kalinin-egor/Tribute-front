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