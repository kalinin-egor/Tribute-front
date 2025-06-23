# Core Layer

Core слой содержит всю бизнес-логику приложения, следуя принципам Clean Architecture.

## Структура

```
Core/
├── useCases/         # Сценарии использования
├── services/         # Бизнес-сервисы
├── rules/           # Бизнес-правила
├── valueObjects/    # Объекты-значения
└── index.ts         # Экспорт всех модулей
```

## Use Cases (Сценарии использования)

Use Cases представляют конкретные сценарии использования приложения. Каждый use case инкапсулирует бизнес-логику для выполнения определенной задачи.

### Примеры:
- `OnboardUserUseCase` - регистрация нового пользователя
- `GetDashboardUseCase` - получение данных дашборда
- `AddBotUseCase` - добавление бота к каналу
- `PublishSubscriptionUseCase` - публикация подписки

### Использование:
```typescript
const useCase = new GetDashboardUseCase(apiService);
const dashboardData = await useCase.execute();
```

## Services (Сервисы)

Сервисы содержат бизнес-логику, которая может использоваться в разных use cases.

### Примеры:
- `UserService` - работа с пользователями
- `PaymentService` - работа с платежами
- `ChannelValidationService` - валидация каналов
- `TelegramAuthService` - аутентификация Telegram

### Использование:
```typescript
const formattedAmount = PaymentService.formatPaymentAmount(100, 'USD');
const isVerified = UserService.isUserVerified(user);
```

## Rules (Бизнес-правила)

Rules содержат бизнес-правила и ограничения приложения.

### Примеры:
- `UserRules` - правила для пользователей
- `PaymentRules` - правила для платежей

### Использование:
```typescript
const canPublish = UserRules.canPublishSubscription(user);
const minPayout = PaymentRules.getMinimumPayoutAmount();
```

## Value Objects (Объекты-значения)

Value Objects инкапсулируют значения с бизнес-логикой валидации.

### Примеры:
- `Money` - работа с денежными суммами
- `ChannelUsername` - валидация имен каналов

### Использование:
```typescript
const money = new Money(100, 'USD');
const formatted = money.format(); // "$100.00"

const username = new ChannelUsername('@mychannel');
const displayName = username.getDisplayName(); // "mychannel"
```

## Принципы

1. **Независимость от фреймворков** - Core не зависит от React, API или других внешних зависимостей
2. **Тестируемость** - вся бизнес-логика легко тестируется
3. **Переиспользование** - Core можно использовать в разных UI (Web, Mobile, Desktop)
4. **Инкапсуляция** - бизнес-логика скрыта от внешних слоев

## Добавление нового функционала

### 1. Создание Use Case:
```typescript
// Core/useCases/NewFeatureUseCase.ts
export class NewFeatureUseCase {
  constructor(private apiService: TributeApiService) {}

  async execute(params: any): Promise<any> {
    // Бизнес-логика
    return await this.apiService.newFeature(params);
  }
}
```

### 2. Создание Service:
```typescript
// Core/services/NewService.ts
export class NewService {
  static processData(data: any): any {
    // Бизнес-логика обработки
    return processedData;
  }
}
```

### 3. Создание Rules:
```typescript
// Core/rules/NewRules.ts
export class NewRules {
  static canPerformAction(user: UserResponse): boolean {
    // Бизнес-правила
    return user.is_verified;
  }
}
```

### 4. Создание Value Object:
```typescript
// Core/valueObjects/NewValueObject.ts
export class NewValueObject {
  constructor(private value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid value');
    }
  }

  private static isValid(value: string): boolean {
    // Валидация
    return value.length > 0;
  }

  getValue(): string {
    return this.value;
  }
}
```

## Тестирование

Core слой легко тестируется благодаря отсутствию внешних зависимостей:

```typescript
describe('PaymentService', () => {
  it('should format amount correctly', () => {
    const formatted = PaymentService.formatPaymentAmount(100, 'USD');
    expect(formatted).toBe('$100.00');
  });
});

describe('UserRules', () => {
  it('should allow verified users to publish subscriptions', () => {
    const user = { is_verified: true, is_sub_published: false };
    expect(UserRules.canPublishSubscription(user)).toBe(true);
  });
});
``` 