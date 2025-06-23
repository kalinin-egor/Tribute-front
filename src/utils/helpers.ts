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

// Функция для отправки логов в Telegram чат
export const sendLogToTelegram = async (message: string) => {
  try {
    const botToken = '7688554254:AAETiKY-EFO4VBCXhr-715J28mHEXxoKmvI';
    const chatId = '-4935327333'; // Рабочий чат
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const timestamp = new Date().toLocaleString('ru-RU');
    const logMessage = `📱 WebApp Log [${timestamp}]:\n${message}`;
    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: logMessage,
        parse_mode: 'HTML'
      })
    });
    
    console.log('📤 Log sent to Telegram:', message);
  } catch (error: any) {
    console.error('❌ Failed to send log to Telegram:', error?.message || error);
  }
};

// Безопасная отправка данных в Telegram бота
export const sendDataToTelegram = async (data: string): Promise<boolean> => {
  console.log(`📤 Attempting to send data: ${data}`);
  await sendLogToTelegram(`🔄 Попытка отправить данные: ${data}`);
  
  // Детальная проверка WebApp
  await sendLogToTelegram(`🔍 Проверка WebApp состояния...`);
  
  if (!isTelegramWebApp()) {
    const errorMsg = '❌ Telegram WebApp API недоступен';
    console.error(errorMsg);
    await sendLogToTelegram(errorMsg);
    return false;
  }

  await sendLogToTelegram(`✅ WebApp API доступен`);

  if (!isSendDataAvailable()) {
    const errorMsg = '❌ sendData method недоступен';
    console.error(errorMsg);
    await sendLogToTelegram(errorMsg);
    return false;
  }

  await sendLogToTelegram(`✅ sendData метод доступен`);

  // Проверяем initData
  const webApp = window.Telegram.WebApp;
  if (!webApp.initData) {
    const errorMsg = '❌ initData отсутствует - WebApp не авторизован';
    console.error(errorMsg);
    await sendLogToTelegram(errorMsg);
    return false;
  }

  await sendLogToTelegram(`✅ initData присутствует (${webApp.initData.length} символов)`);

  // Проверяем пользователя
  if (webApp.initDataUnsafe?.user) {
    const user = webApp.initDataUnsafe.user;
    await sendLogToTelegram(`👤 Пользователь: ${user.first_name} (ID: ${user.id})`);
  } else {
    await sendLogToTelegram(`⚠️ Данные пользователя отсутствуют`);
  }

  // Проверяем версию и платформу
  await sendLogToTelegram(`📱 Версия: ${webApp.version}, Платформа: ${webApp.platform}`);

  try {
    await sendLogToTelegram(`🚀 Вызываем window.Telegram.WebApp.sendData("${data}")...`);
    
    // Вызываем sendData
    const result = await window.Telegram.WebApp.sendData(data);
    
    await sendLogToTelegram(`✅ sendData вызван, результат: ${result}`);
    
    const successMsg = `✅ Данные успешно отправлены: ${data}`;
    console.log(successMsg);
    await sendLogToTelegram(successMsg);
    
    // Дополнительная проверка через небольшую задержку
    setTimeout(async () => {
      await sendLogToTelegram(`⏰ Проверка через 2 секунды: данные "${data}" должны быть получены ботом`);
    }, 2000);
    
    return true;
  } catch (error: any) {
    const errorMsg = `❌ Ошибка отправки данных: ${error?.message || error} для данных: ${data}`;
    console.error(errorMsg);
    await sendLogToTelegram(errorMsg);
    
    // Дополнительная информация об ошибке
    await sendLogToTelegram(`🔍 Тип ошибки: ${typeof error}`);
    await sendLogToTelegram(`🔍 Стек ошибки: ${error?.stack || 'недоступен'}`);
    
    return false;
  }
};

// Инициализация Telegram WebApp
export const initializeTelegramWebApp = (): boolean => {
  if (!isTelegramWebApp()) {
    const msg = '⚠️ Telegram WebApp not available';
    console.log(msg);
    sendLogToTelegram(msg);
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
    sendLogToTelegram(successMsg);
    return true;
  } catch (error: any) {
    const errorMsg = `❌ Error initializing Telegram WebApp: ${error?.message || error}`;
    console.error(errorMsg);
    sendLogToTelegram(errorMsg);
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
    
    // Проверяем все доступные методы
    debugMessage += `\n🔧 Доступные методы:\n`;
    const methods = ['ready', 'expand', 'close', 'sendData', 'showPopup', 'showAlert', 'showConfirm'];
    methods.forEach(method => {
      const isAvailable = typeof webApp[method] === 'function';
      debugMessage += `${isAvailable ? '✅' : '❌'} ${method}: ${isAvailable ? 'доступен' : 'недоступен'}\n`;
    });
    
    // Проверяем initData более детально
    if (webApp.initData) {
      debugMessage += `\n📊 initData детали:\n`;
      debugMessage += `📏 Длина: ${webApp.initData.length} символов\n`;
      debugMessage += `🔑 Начинается с: ${webApp.initData.substring(0, 20)}...\n`;
      
      // Пытаемся декодировать initData
      try {
        const urlParams = new URLSearchParams(webApp.initData);
        debugMessage += `🔍 Параметры initData:\n`;
        for (const [key, value] of urlParams.entries()) {
          if (key !== 'hash') { // Не показываем хеш
            debugMessage += `  ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}\n`;
          }
        }
      } catch (e) {
        debugMessage += `❌ Не удалось декодировать initData: ${e}\n`;
      }
    }
    
  } else {
    debugMessage += `❌ WebApp недоступен\n`;
    debugMessage += `🌐 Запущено в браузере: ${typeof window !== 'undefined'}\n`;
    debugMessage += `📱 Telegram объект: ${window.Telegram ? 'доступен' : 'недоступен'}\n`;
    debugMessage += `🔗 URL: ${window.location.href}\n`;
    debugMessage += `🌐 User Agent: ${navigator.userAgent.substring(0, 100)}...\n`;
  }
  
  await sendLogToTelegram(debugMessage);
}; 