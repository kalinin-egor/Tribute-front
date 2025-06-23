import { AddBotResponse } from '../../Domain/types';
import { TributeApiService } from '../../Data/api';
import { ChannelValidationService } from '../services/ChannelValidationService';

export class AddBotUseCase {
  constructor(
    private apiService: TributeApiService,
    private channelValidationService: typeof ChannelValidationService
  ) {}

  async execute(channelUsername: string): Promise<AddBotResponse> {
    // Валидация канала
    const validation = this.channelValidationService.validateChannelUsername(channelUsername);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    return await this.apiService.addBot(channelUsername);
  }
} 