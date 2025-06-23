// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};

// Get user initials
export const getUserInitials = (firstName: string, lastName?: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Check if running in Telegram Web App
export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && window.Telegram?.WebApp !== undefined;
};

// Get Telegram theme color
export const getTelegramThemeColor = (): string => {
  if (isTelegramWebApp()) {
    return window.Telegram.WebApp.themeParams.button_color || '#0088cc';
  }
  return '#0088cc';
};

// Dark mode utilities
export const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
};

export const setDarkMode = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  
  if (enabled) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const toggleDarkMode = (): void => {
  if (typeof window === 'undefined') return;
  
  const isDark = isDarkMode();
  setDarkMode(!isDark);
};

// Get system preference for dark mode
export const getSystemDarkModePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Safe function to send data to Telegram bot
export const sendDataToTelegram = (data: string, webApp?: any): boolean => {
  console.log(`📤 Attempting to send data: ${data}`);
  
  try {
    // First try using the webApp object from useTelegram hook
    if (webApp && typeof webApp.sendData === 'function') {
      webApp.sendData(data);
      console.log('✅ Data sent successfully via webApp object');
      return true;
    }
    
    // Fallback to direct window access
    if (window.Telegram?.WebApp?.sendData) {
      window.Telegram.WebApp.sendData(data);
      console.log('✅ Data sent successfully via window.Telegram.WebApp');
      return true;
    }
    
    console.error('❌ No valid sendData method found');
    return false;
    
  } catch (error) {
    console.error('❌ Error sending data to Telegram:', error);
    
    // Try fallback method
    try {
      if (window.Telegram?.WebApp?.sendData) {
        window.Telegram.WebApp.sendData(data);
        console.log('✅ Data sent successfully via fallback method');
        return true;
      }
    } catch (fallbackError) {
      console.error('❌ Fallback method also failed:', fallbackError);
    }
    
    return false;
  }
};

// Initialize Telegram WebApp safely
export const initializeTelegramWebApp = (): boolean => {
  if (!isTelegramWebApp()) {
    console.log('⚠️ Telegram WebApp not available');
    return false;
  }
  
  try {
    const webApp = window.Telegram.WebApp;
    
    // Call ready() to initialize
    webApp.ready();
    console.log('✅ WebApp.ready() called');
    
    // Expand the WebApp
    webApp.expand();
    console.log('✅ WebApp.expand() called');
    
    // Set colors
    webApp.setHeaderColor('#ffffff');
    webApp.setBackgroundColor('#f2f2f2');
    console.log('✅ WebApp colors set');
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing Telegram WebApp:', error);
    return false;
  }
}; 