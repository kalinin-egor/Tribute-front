export class Money {
  constructor(
    private amount: number,
    private currency: string = 'USD'
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    
    if (!this.isValidCurrency(currency)) {
      throw new Error(`Invalid currency: ${currency}`);
    }
  }

  private isValidCurrency(currency: string): boolean {
    const validCurrencies = ['USD', 'EUR', 'RUB'];
    return validCurrencies.includes(currency.toUpperCase());
  }

  getValue(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency
    }).format(this.amount);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract different currencies');
    }
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Money(result, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return new Money(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount < other.amount;
  }

  equals(other: Money): boolean {
    if (this.currency !== other.currency) {
      return false;
    }
    return this.amount === other.amount;
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  static fromString(value: string, currency: string = 'USD'): Money {
    const amount = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (isNaN(amount)) {
      throw new Error('Invalid money format');
    }
    return new Money(amount, currency);
  }
} 