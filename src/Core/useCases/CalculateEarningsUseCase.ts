import { PaymentDTO } from '../../Domain/types';

export class CalculateEarningsUseCase {
  execute(payments: PaymentDTO[]): number {
    return payments.reduce((sum, payment) => {
      // Предполагаем, что в payment есть поле amount
      // Если его нет, нужно будет адаптировать под реальную структуру
      const amount = (payment as any).amount || 0;
      return sum + amount;
    }, 0);
  }

  calculateMonthlyEarnings(payments: PaymentDTO[]): number {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    return payments
      .filter(payment => new Date(payment.created_date) >= monthAgo)
      .reduce((sum, payment) => {
        const amount = (payment as any).amount || 0;
        return sum + amount;
      }, 0);
  }
} 