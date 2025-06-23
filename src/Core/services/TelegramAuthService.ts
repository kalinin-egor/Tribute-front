import { TelegramUser } from '../../Domain/types';

export class TelegramAuthService {
  static validateInitData(initData: string): boolean {
    if (!initData || initData.length === 0) {
      return false;
    }
    
    // Здесь можно добавить более сложную валидацию
    // например, проверку подписи от Telegram
    return true;
  }

  static extractUserFromInitData(initData: string): TelegramUser | null {
    try {
      // В реальном приложении здесь была бы дешифровка initData
      // Пока что возвращаем null для демонстрации
      return null;
    } catch (error) {
      console.error('Failed to extract user from initData:', error);
      return null;
    }
  }

  static getAuthHeader(initData: string): string | null {
    if (this.validateInitData(initData)) {
      return `TgAuth ${initData}`;
    }
    return null;
  }

  static isTelegramWebApp(): boolean {
    return typeof window !== 'undefined' && 
           window.Telegram && 
           window.Telegram.WebApp;
  }

  static getWebAppInfo(): {
    isAvailable: boolean;
    version?: string;
    platform?: string;
    initData?: string;
  } {
    if (!this.isTelegramWebApp()) {
      return { isAvailable: false };
    }

    const webApp = window.Telegram.WebApp;
    return {
      isAvailable: true,
      version: webApp.version,
      platform: webApp.platform,
      initData: webApp.initData
    };
  }
} 