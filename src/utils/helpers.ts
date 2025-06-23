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

// Получение объекта Telegram WebApp
export const getTelegramWebApp = () => {
  return window.Telegram?.WebApp;
};

// Проверка доступности метода sendData
export const isSendDataAvailable = (): boolean => {
  return isTelegramWebApp() && typeof window.Telegram.WebApp.sendData === 'function';
};

// Безопасная отправка данных в Telegram бота
export const sendDataToTelegram = async (data: string): Promise<boolean> => {
  // Детальная проверка WebApp
  
  if (!isTelegramWebApp()) {
    const errorMsg = '❌ Telegram WebApp API недоступен';
    console.error(errorMsg);
    return false;
  }

  if (!isSendDataAvailable()) {
    const errorMsg = '❌ sendData method недоступен';
    console.error(errorMsg);
    return false;
  }

  // Проверяем initData
  const webApp = window.Telegram.WebApp;
  if (!webApp.initData) {
    const errorMsg = '❌ initData отсутствует - WebApp не авторизован';
    console.error(errorMsg);
    return false;
  }

  try {
    // Вызываем sendData
    const result = await window.Telegram.WebApp.sendData(data);
    
    const successMsg = `✅ Данные успешно отправлены: ${data}`;
    console.log(successMsg);
    
    return true;
  } catch (error: any) {
    const errorMsg = `❌ Ошибка отправки данных: ${error?.message || error} для данных: ${data}`;
    console.error(errorMsg);
    
    return false;
  }
};

// Инициализация Telegram WebApp
export const initializeTelegramWebApp = (): boolean => {
  if (!isTelegramWebApp()) {
    const msg = '⚠️ Telegram WebApp not available';
    console.log(msg);
    return false;
  }
  
  try {
    const webApp = window.Telegram.WebApp;
    
    // Проверяем и вызываем методы только если они доступны
    if (typeof webApp.ready === 'function') {
      webApp.ready();
      console.log('✅ WebApp.ready() called');
    }
    
    if (typeof webApp.expand === 'function') {
      webApp.expand();
      console.log('✅ WebApp.expand() called');
    }
    
    if (typeof webApp.setHeaderColor === 'function') {
      webApp.setHeaderColor('#ffffff');
    }
    
    if (typeof webApp.setBackgroundColor === 'function') {
      webApp.setBackgroundColor('#f2f2f2');
    }
    
    const successMsg = '✅ Telegram WebApp initialized successfully';
    console.log(successMsg);
    return true;
  } catch (error: any) {
    const errorMsg = `❌ Error initializing Telegram WebApp: ${error?.message || error}`;
    console.error(errorMsg);
    return false;
  }
};

// Получение информации о WebApp для отладки
export const getWebAppInfo = () => {
  if (!isTelegramWebApp()) {
    return { available: false };
  }
  
  const webApp = window.Telegram.WebApp;
  return {
    available: true,
    version: webApp.version,
    platform: webApp.platform,
    initData: webApp.initData ? 'present' : 'missing',
    initDataUnsafe: webApp.initDataUnsafe,
    sendDataAvailable: typeof webApp.sendData === 'function',
    readyAvailable: typeof webApp.ready === 'function',
    expandAvailable: typeof webApp.expand === 'function',
  };
};

// Функция для отправки отладочной информации в Telegram
export const sendDebugInfoToTelegram = async () => {
  const info = getWebAppInfo();
  const timestamp = new Date().toLocaleString('ru-RU');
  
  let debugMessage = `🔍 WebApp Debug Info [${timestamp}]:\n\n`;
  
  if (info.available) {
    debugMessage += `✅ WebApp доступен\n`;
    debugMessage += `📱 Версия: ${info.version}\n`;
    debugMessage += `🖥️ Платформа: ${info.platform}\n`;
    debugMessage += `📊 initData: ${info.initData}\n`;
    debugMessage += `📤 sendData доступен: ${info.sendDataAvailable ? 'Да' : 'Нет'}\n`;
    debugMessage += `⚙️ ready доступен: ${info.readyAvailable ? 'Да' : 'Нет'}\n`;
    debugMessage += `📏 expand доступен: ${info.expandAvailable ? 'Да' : 'Нет'}\n`;
    
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      debugMessage += `👤 Пользователь: ${user.first_name} ${user.last_name || ''} (ID: ${user.id})\n`;
    }
    
    // Дополнительная информация о WebApp
    const webApp = window.Telegram.WebApp;
    debugMessage += `\n📋 Дополнительная информация:\n`;
    debugMessage += `🔗 URL: ${window.location.href}\n`;
    debugMessage += `🌐 User Agent: ${navigator.userAgent.substring(0, 100)}...\n`;
    debugMessage += `📱 isExpanded: ${webApp.isExpanded}\n`;
    debugMessage += `📏 viewportHeight: ${webApp.viewportHeight}\n`;
    debugMessage += `🎨 colorScheme: ${webApp.colorScheme}\n`;
    debugMessage += `📊 initData length: ${webApp.initData ? webApp.initData.length : 0}\n`;
    
    // Проверяем доступность методов
    const methods = ['ready', 'expand', 'close', 'sendData', 'showPopup', 'showAlert', 'showConfirm'];
    debugMessage += `\n🔧 Доступные методы:\n`;
    methods.forEach(method => {
      const isAvailable = typeof webApp[method as keyof typeof webApp] === 'function';
      debugMessage += `${method}: ${isAvailable ? '✅' : '❌'}\n`;
    });
  } else {
    debugMessage += `❌ WebApp недоступен\n`;
    debugMessage += `🔗 URL: ${window.location.href}\n`;
    debugMessage += `🌐 User Agent: ${navigator.userAgent.substring(0, 100)}...\n`;
  }
  
  console.log(debugMessage);
}; 