import { ChannelDTO } from '../../Domain/types';

export class ChannelValidationService {
  static validateChannelUsername(channelUsername: string): { 
    isValid: boolean; 
    error?: string 
  } {
    if (!channelUsername) {
      return { isValid: false, error: 'Channel username is required' };
    }

    if (!channelUsername.startsWith('@')) {
      return { isValid: false, error: 'Channel username must start with @' };
    }

    if (channelUsername.length < 3) {
      return { isValid: false, error: 'Channel username too short' };
    }

    if (channelUsername.length > 32) {
      return { isValid: false, error: 'Channel username too long' };
    }

    // Проверка на допустимые символы
    const validPattern = /^@[a-zA-Z0-9_]{2,31}$/;
    if (!validPattern.test(channelUsername)) {
      return { isValid: false, error: 'Channel username contains invalid characters' };
    }

    return { isValid: true };
  }

  static validateChannelOwnership(channel: ChannelDTO): boolean {
    return channel.is_verified;
  }

  static canAddBotToChannel(channel: ChannelDTO): boolean {
    return !channel.is_verified; // Можно добавить бота только к неверифицированным каналам
  }

  static getChannelStatus(channel: ChannelDTO): {
    isVerified: boolean;
    needsVerification: boolean;
    canAddBot: boolean;
  } {
    return {
      isVerified: channel.is_verified,
      needsVerification: !channel.is_verified,
      canAddBot: this.canAddBotToChannel(channel)
    };
  }
} 