import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramChat {
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
    console.log('TelegramProvider useEffect - checking for Telegram WebApp');
    console.log('window.Telegram:', !!window.Telegram);
    console.log('window.Telegram?.WebApp:', !!window.Telegram?.WebApp);
    
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      console.log('Telegram WebApp found:', tg);
      console.log('initData:', tg.initData ? 'present' : 'missing');
      console.log('initDataUnsafe:', tg.initDataUnsafe);
      
      setWebApp(tg);
      
      if (tg.initDataUnsafe?.user) {
        console.log('User data found:', tg.initDataUnsafe.user);
        setUser(tg.initDataUnsafe.user);
      } else {
        console.log('No user data in initDataUnsafe');
      }
      
      setTheme(tg.colorScheme);
      setThemeParams(tg.themeParams);
      setIsReady(true);
      console.log('Telegram WebApp initialized successfully');
    } else {
      console.log('Telegram WebApp not available');
    }
  }, []);

  const value: TelegramContextType = {
    webApp,
    user,
    isReady,
    theme,
    themeParams,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}; 