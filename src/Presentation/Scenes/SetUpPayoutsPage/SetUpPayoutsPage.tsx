import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useAppState } from '../../hooks/useAppState';
import tributeApiService from '../../../Data/api';
import styles from './SetUpPayoutsPage.module.css';

const SetUpPayoutsPage: React.FC = () => {
  const { webApp } = useTelegram();
  const { refreshDashboard } = useAppState();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!cardNumber.trim()) {
      setError('Пожалуйста, введите номер карты');
      setIsSubmitting(false);
      return;
    }

    // Basic card number validation (16 digits)
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber.replace(/\s/g, ''))) {
      setError('Номер карты должен содержать 16 цифр');
      setIsSubmitting(false);
      return;
    }

    setError('');

    try {
      const response = await tributeApiService.setUpPayouts({
        'card-number': cardNumber.replace(/\s/g, '')
      });

      await refreshDashboard();
      alert('Способ выплат успешно настроен!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error setting up payouts:', error);
      // Если ошибка 403, показать текст ошибки от сервера под полем ввода
      if (error && error.message && error.message.includes('403')) {
        // Попробуем извлечь текст ошибки из error.message
        let serverError = 'Ошибка при настройке выплат. Попробуйте еще раз.';
        try {
          const match = error.message.match(/\{.*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.error) serverError = parsed.error;
          }
        } catch {}
        setError(serverError);
      } else if (error && error.message) {
        setError(error.message);
      } else {
        setError('Ошибка при настройке выплат. Попробуйте еще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setError(''); // Clear error when user starts typing
  };

  // Show back button on mount and hide on unmount
  useEffect(() => {
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => navigate('/dashboard'));
    }
    return () => {
      if (webApp) {
        webApp.BackButton.offClick(() => navigate('/dashboard'));
        webApp.BackButton.hide();
      }
    };
  }, [webApp, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Настройка выплат</h1>
          <p className={styles.subtitle}>
            Введите номер карты для получения выплат
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="cardNumber" className={styles.label}>
              Номер карты
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19} // 16 digits + 3 spaces
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>

          <div className={styles.info}>
            <p className={styles.infoText}>
              💳 Номер карты используется только для выплат
            </p>
            <p className={styles.infoText}>
              🔒 Данные защищены и не передаются третьим лицам
            </p>
          </div>
        </div>
      </div>

      <div className={styles.footerFixed}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !cardNumber.trim()}
          className={`${styles.submitButton} ${
            isSubmitting || !cardNumber.trim() ? styles.submitButtonDisabled : ''
          }`}
        >
          {isSubmitting ? 'Настройка...' : 'Настроить выплаты'}
        </button>
      </div>
    </div>
  );
};

export default SetUpPayoutsPage; 