import { TributeApiService } from '../../Data/api';

export class OnboardUserUseCase {
  constructor(private apiService: TributeApiService) {}

  async execute(): Promise<void> {
    await this.apiService.createUser();
  }
} 