# Устранение неполадок с sendData в Telegram WebApp

## Проблема
Функция `window.Telegram.WebApp.sendData(name)` не работает в вашем коде.

## Решение

### 1. Исправления в коде

Мы внесли следующие исправления:

#### ✅ Создана утилитарная функция `sendDataToTelegram`
```typescript
// src/utils/helpers.ts
export const sendDataToTelegram = (data: string, webApp?: any): boolean => {
  // Безопасная отправка данных с fallback методами
}
```

#### ✅ Обновлен CreatorDashboardPage
- Заменено прямое обращение к `window.Telegram.WebApp.sendData`
- Добавлены проверки на существование WebApp
- Использование хука `useTelegram` вместо прямого доступа

#### ✅ Улучшена инициализация WebApp
- Добавлен вызов `webApp.ready()` в правильном порядке
- Улучшена обработка ошибок
- Добавлено логирование для отладки

### 2. Как использовать

#### В компонентах React:
```typescript
import { useTelegram } from '../../hooks/useTelegram';
import { sendDataToTelegram } from '../../../utils/helpers';

const MyComponent = () => {
  const { webApp } = useTelegram();
  
  const handleSendData = () => {
    const success = sendDataToTelegram('your-data', webApp);
    if (success) {
      console.log('✅ Data sent successfully');
    } else {
      console.error('❌ Failed to send data');
    }
  };
};
```

#### Прямой вызов (fallback):
```typescript
if (window.Telegram?.WebApp?.sendData) {
  window.Telegram.WebApp.sendData('your-data');
}
```

### 3. Тестирование

#### Тестовая страница
Откройте `http://localhost:3000/test-senddata.html` для изолированного тестирования.

#### Отладочные кнопки
В CreatorDashboardPage добавлены кнопки для тестирования:
- 🧪 Test SendData - тестирует основную функцию
- 🔍 Debug WebApp - показывает состояние WebApp
- 🎯 Direct SendData Test - тестирует прямой вызов

### 4. Возможные причины проблем

#### ❌ WebApp не инициализирован
```javascript
// Убедитесь, что вызывается в правильном порядке:
window.Telegram.WebApp.ready();  // Сначала
window.Telegram.WebApp.expand(); // Потом
// Затем можно использовать sendData
```

#### ❌ Отсутствует initData
```javascript
// Проверьте наличие initData:
console.log('initData:', window.Telegram.WebApp.initData);
```

#### ❌ Неправильный контекст
- WebApp должен быть открыт внутри Telegram
- Не работает в обычном браузере (только в режиме разработки)

#### ❌ Ошибки в боте
- Убедитесь, что бот правильно обрабатывает данные
- Проверьте логи бота

### 5. Отладка

#### Проверьте консоль браузера:
```javascript
// Добавьте эти проверки:
console.log('window.Telegram:', window.Telegram);
console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
console.log('window.Telegram?.WebApp?.sendData:', window.Telegram?.WebApp?.sendData);
console.log('initData:', window.Telegram?.WebApp?.initData);
```

#### Проверьте в Telegram:
1. Откройте WebApp в Telegram
2. Откройте консоль разработчика (если доступно)
3. Проверьте логи

### 6. Пример рабочего кода

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <div onclick="chosen('test-data')">Send Test Data</div>
    
    <script>
        function chosen(name) {
            console.log("Chosen " + name);
            if (window.Telegram?.WebApp?.sendData) {
                window.Telegram.WebApp.sendData(name);
            }
        }
        
        // Инициализация
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    </script>
</body>
</html>
```

### 7. Проверка в боте

Убедитесь, что ваш бот правильно обрабатывает данные:

```python
# Python пример
@bot.message_handler(content_types=['web_app_data'])
def handle_web_app_data(message):
    data = message.web_app_data.data
    print(f"Received data: {data}")
    # Обработка данных
```

### 8. Частые ошибки

1. **"sendData is not a function"** - WebApp не инициализирован
2. **"WebApp not available"** - Запущено не в Telegram
3. **Данные не доходят до бота** - Проверьте обработчик в боте
4. **Ошибки в консоли** - Проверьте порядок инициализации

### 9. Поддержка

Если проблемы остаются:
1. Проверьте консоль браузера
2. Убедитесь, что WebApp открыт в Telegram
3. Проверьте, что бот правильно настроен
4. Используйте тестовую страницу для изоляции проблемы 