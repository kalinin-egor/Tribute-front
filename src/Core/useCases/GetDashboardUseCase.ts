import { DashboardResponse } from '../../Domain/types';
import { TributeApiService } from '../../Data/api';

export class GetDashboardUseCase {
  constructor(private apiService: TributeApiService) {}

  async execute(): Promise<DashboardResponse> {
    return await this.apiService.getDashboard();
  }
} 