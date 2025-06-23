export class ChannelUsername {
  constructor(private username: string) {
    if (!ChannelUsername.isValid(username)) {
      throw new Error('Invalid channel username format');
    }
  }

  static isValid(username: string): boolean {
    if (!username) return false;
    
    // Должно начинаться с @
    if (!username.startsWith('@')) return false;
    
    // Длина от 3 до 32 символов
    if (username.length < 3 || username.length > 32) return false;
    
    // Только буквы, цифры и подчеркивания после @
    const validPattern = /^@[a-zA-Z0-9_]{2,31}$/;
    return validPattern.test(username);
  }

  getValue(): string {
    return this.username;
  }

  getDisplayName(): string {
    return this.username.substring(1); // Убираем @
  }

  getFullName(): string {
    return this.username;
  }

  equals(other: ChannelUsername): boolean {
    return this.username.toLowerCase() === other.username.toLowerCase();
  }

  static fromString(username: string): ChannelUsername {
    return new ChannelUsername(username);
  }

  static sanitize(username: string): string {
    // Убираем пробелы и приводим к нижнему регистру
    return username.trim().toLowerCase();
  }

  static validate(username: string): { 
    isValid: boolean; 
    error?: string 
  } {
    if (!username) {
      return { isValid: false, error: 'Username is required' };
    }

    if (!username.startsWith('@')) {
      return { isValid: false, error: 'Username must start with @' };
    }

    if (username.length < 3) {
      return { isValid: false, error: 'Username too short' };
    }

    if (username.length > 32) {
      return { isValid: false, error: 'Username too long' };
    }

    const validPattern = /^@[a-zA-Z0-9_]{2,31}$/;
    if (!validPattern.test(username)) {
      return { isValid: false, error: 'Username contains invalid characters' };
    }

    return { isValid: true };
  }
} 