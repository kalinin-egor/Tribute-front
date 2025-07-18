# Tribute Frontend Architecture

## Обзор

Приложение построено по принципам **чистой архитектуры** с четким разделением на слои:

- **Domain** - типы данных и интерфейсы
- **Core** - бизнес-логика, use cases, сервисы и правила
- **Data** - работа с API и внешними источниками данных
- **Presentation** - UI компоненты и хуки

## Структура проекта

```
src/
├── Domain/
│   └── types.ts          # Все типы данных и интерфейсы
├── Core/
│   ├── useCases/         # Сценарии использования
│   ├── services/         # Бизнес-сервисы
│   ├── rules/           # Бизнес-правила
│   ├── valueObjects/    # Объекты-значения
│   └── index.ts         # Экспорт всех Core модулей
├── Data/
│   └── api.ts           # API сервис (только данные)
├── Presentation/
│   ├── Components/      # Переиспользуемые компоненты
│   ├── Scenes/         # Страницы приложения
│   └── hooks/          # React хуки
└── utils/
    └── helpers.ts      # Утилиты
```

## Core Layer (Бизнес-логика)

### Use Cases (Сценарии использования)
- **OnboardUserUseCase** - регистрация пользователя
- **GetDashboardUseCase** - получение данных дашборда
- **AddBotUseCase** - добавление бота к каналу
- **PublishSubscriptionUseCase** - публикация подписки
- **CalculateEarningsUseCase** - расчет заработка

### Services (Сервисы)
- **UserService** - работа с пользователями
- **ChannelValidationService** - валидация каналов
- **PaymentService** - работа с платежами
- **TelegramAuthService** - аутентификация Telegram

### Rules (Бизнес-правила)
- **UserRules** - правила для пользователей
- **PaymentRules** - правила для платежей

### Value Objects (Объекты-значения)
- **Money** - работа с денежными суммами
- **ChannelUsername** - валидация имен каналов

## API Интеграция

### Аутентификация
Приложение использует Telegram Web App `initData` для аутентификации. Токен автоматически добавляется в заголовок `Authorization` в формате `TgAuth <initData>`.

### Основные эндпоинты

1. **GET /dashboard** - получение данных дашборда
2. **PUT /onboard** - регистрация пользователя
3. **POST /add-bot** - добавление бота/канала
4. **POST /publish-subscription** - публикация подписки
5. **POST /create-subscribe** - создание подписки
6. **POST /set-up-payouts** - настройка выплат
7. **POST /upload-verified-passport** - загрузка документов для верификации

## Навигация

### Логика навигации

1. При загрузке приложения автоматически вызывается `/dashboard`
2. Если пользователь не зарегистрирован (404), происходит редирект на `/monetization`
3. После успешного онбординга происходит редирект на `/dashboard`
4. Если пользователь уже зарегистрирован, сразу открывается `/dashboard`

### Состояние приложения

Управляется через хук `useAppState` с использованием Core use cases:

```typescript
interface AppState {
  isLoading: boolean;
  isOnboarded: boolean;
  dashboardData: DashboardResponse | null;
  error: string | null;
}
```

## Компоненты

### Основные компоненты

- **EarningsSummary** - отображение заработка и статуса верификации
- **QuickActions** - быстрые действия и статус каналов
- **TransactionsPlaceholder** - история транзакций и подписок
- **PayoutAlert** - уведомление о необходимости настройки выплат
- **GettingStarted** - руководство для новых пользователей

### Пропсы компонентов

Все компоненты принимают данные через пропсы, что обеспечивает:
- Переиспользуемость
- Тестируемость
- Предсказуемость

## Хуки

### useTelegram
Предоставляет доступ к Telegram Web App API и пользовательским данным.

### useAppState
Управляет глобальным состоянием приложения и навигацией с использованием Core use cases.

### useApi
Предоставляет удобный доступ ко всем методам API.

## Типы данных

Все типы определены в `Domain/types.ts` и соответствуют API документации:

- `DashboardResponse` - ответ от /dashboard
- `ChannelDTO` - информация о канале
- `SubDTO` - информация о подписке
- `PaymentDTO` - информация о платеже
- И другие...

## Обработка ошибок

1. **Сетевые ошибки** - отображаются пользователю с возможностью повтора
2. **Ошибки аутентификации** - редирект на страницу онбординга
3. **Ошибки валидации** - отображаются в соответствующих формах
4. **Бизнес-ошибки** - обрабатываются в Core слое

## Стилизация

Используется Tailwind CSS с модульными стилями для компонентов. Все стили находятся в соответствующих `.module.css` файлах.

## Разработка

### Добавление нового эндпоинта

1. Добавить тип в `Domain/types.ts`
2. Добавить метод в `Data/api.ts`
3. Создать use case в `Core/useCases/`
4. Добавить метод в `Presentation/hooks/useApi.tsx`
5. Использовать в компонентах

### Добавление нового компонента

1. Создать компонент в `Presentation/Components/`
2. Определить интерфейс пропсов
3. Добавить стили в `.module.css`
4. Интегрировать в соответствующие страницы

### Добавление бизнес-логики

1. Создать use case в `Core/useCases/`
2. Добавить сервис в `Core/services/` если нужно
3. Определить правила в `Core/rules/`
4. Создать value objects в `Core/valueObjects/` если нужно

## Тестирование

Архитектура позволяет легко тестировать:
- **Domain слой** - типы и интерфейсы
- **Core слой** - бизнес-логику, use cases, сервисы
- **Data слой** - API вызовы
- **Presentation слой** - UI компоненты

## Производительность

- Ленивая загрузка компонентов
- Мемоизация хуков с useCallback
- Оптимизированные ре-рендеры
- Кэширование API ответов
- Разделение бизнес-логики и UI

## Преимущества новой архитектуры

1. **Разделение ответственности** - каждый слой имеет четкую роль
2. **Тестируемость** - бизнес-логика изолирована от UI
3. **Переиспользование** - Core слой можно использовать в разных UI
4. **Независимость** - Core не зависит от фреймворков
5. **Масштабируемость** - легко добавлять новые функции
6. **Поддерживаемость** - код структурирован и понятен 