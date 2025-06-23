export class PaymentRules {
  static getMinimumPayoutAmount(): number {
    return 10; // Минимальная сумма для выплаты в USD
  }

  static getMaximumPayoutAmount(): number {
    return 10000; // Максимальная сумма для выплаты в USD
  }

  static canRequestPayout(earned: number): boolean {
    return earned >= this.getMinimumPayoutAmount() && 
           earned <= this.getMaximumPayoutAmount();
  }

  static getPayoutFee(amount: number): number {
    // Комиссия 2.5% за выплату
    return amount * 0.025;
  }

  static getNetPayoutAmount(amount: number): number {
    return amount - this.getPayoutFee(amount);
  }

  static validatePayoutRequest(amount: number, earned: number): {
    isValid: boolean;
    error?: string;
  } {
    if (amount < this.getMinimumPayoutAmount()) {
      return {
        isValid: false,
        error: `Minimum payout amount is $${this.getMinimumPayoutAmount()}`
      };
    }

    if (amount > this.getMaximumPayoutAmount()) {
      return {
        isValid: false,
        error: `Maximum payout amount is $${this.getMaximumPayoutAmount()}`
      };
    }

    if (amount > earned) {
      return {
        isValid: false,
        error: 'Payout amount cannot exceed earned amount'
      };
    }

    return { isValid: true };
  }

  static getPayoutSchedule(): {
    frequency: 'weekly' | 'monthly';
    minAmount: number;
    processingDays: number;
  } {
    return {
      frequency: 'weekly',
      minAmount: this.getMinimumPayoutAmount(),
      processingDays: 3
    };
  }
} 