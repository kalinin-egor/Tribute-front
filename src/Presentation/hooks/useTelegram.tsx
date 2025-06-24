import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo?: {
    small_file_id: string;
    small_file_unique_id: string;
    big_file_id: string;
    big_file_unique_id: string;
  };
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  initData: string;
  openTelegramLink: (url: string) => void;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: TelegramChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    getItems: (keys: string[]) => Promise<Record<string, string | null>>;
    removeItem: (key: string) => Promise<void>;
    removeItems: (keys: string[]) => Promise<void>;
  };
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  theme: 'light' | 'dark';
  themeParams: TelegramWebApp['themeParams'];
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeParams, setThemeParams] = useState<TelegramWebApp['themeParams']>({});

  useEffect(() => {
    // ПРОСТАЯ ИНИЦИАЛИЗАЦИЯ КАК В РАБОЧЕМ КОДЕ
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setWebApp(tg);
      
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      setTheme(tg.colorScheme);
      setThemeParams(tg.themeParams);
      setIsReady(true);
    } else {
      // For development, we can simulate Telegram WebApp
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment) {
        const mockWebApp = {
          ready: () => {},
          expand: () => {},
          close: () => {},
          sendData: (data: string) => {
            // Mock implementation
          },
          showPopup: (params: any) => {},
          showAlert: (message: string) => {},
          showConfirm: (message: string) => {},
          openTelegramLink: (url: string) => {},
          setHeaderColor: (color: string) => {},
          setBackgroundColor: (color: string) => {},
          initData: '',
          initDataUnsafe: {},
          version: '6.0',
          platform: 'web',
          isExpanded: false,
          viewportHeight: 0,
          colorScheme: 'light',
        };
        
        setWebApp(mockWebApp as any);
        setUser(null);
        setTheme('light');
        setThemeParams({});
        setIsReady(true);
      }
    }
  }, []);

  // Стабилизируем объект value с помощью useMemo
  const value: TelegramContextType = useMemo(() => ({
    webApp,
    user,
    isReady,
    theme,
    themeParams,
  }), [webApp, user, isReady, theme, themeParams]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}; 