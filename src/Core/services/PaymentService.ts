import { PaymentDTO } from '../../Domain/types';

export class PaymentService {
  static formatPaymentAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static getPaymentHistory(payments: PaymentDTO[]): PaymentDTO[] {
    return payments.sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );
  }

  static getRecentPayments(payments: PaymentDTO[], days: number = 30): PaymentDTO[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return payments.filter(payment => 
      new Date(payment.created_date) >= cutoffDate
    );
  }

  static calculateTotalEarnings(payments: PaymentDTO[]): number {
    return payments.reduce((sum, payment) => {
      const amount = (payment as any).amount || 0;
      return sum + amount;
    }, 0);
  }

  static getPaymentStats(payments: PaymentDTO[]): {
    total: number;
    recent: number;
    average: number;
    count: number;
  } {
    const total = this.calculateTotalEarnings(payments);
    const recent = this.calculateTotalEarnings(this.getRecentPayments(payments));
    const count = payments.length;
    const average = count > 0 ? total / count : 0;

    return { total, recent, average, count };
  }
} 