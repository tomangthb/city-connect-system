
import { TranslationRecord } from './types';

export const messageTranslations: Record<string, TranslationRecord> = {
  // Toast messages
  reportGenerated: {
    en: 'Report generated successfully',
    uk: 'Звіт успішно згенеровано'
  },
  appealsRedirect: {
    en: 'Redirecting to appeals management...',
    uk: 'Перенаправлення до управління зверненнями...'
  },
  usersManagement: {
    en: 'Opening users management...',
    uk: 'Відкриття управління користувачами...'
  },
  analyticsLoading: {
    en: 'Loading analytics dashboard...',
    uk: 'Завантаження панелі аналітики...'
  },
  taskCreated: {
    en: 'New task created successfully',
    uk: 'Нове завдання успішно створено'
  },
  loadingAppeals: {
    en: 'Loading appeals dashboard...',
    uk: 'Завантаження панелі звернень...'
  },
  loadingServices: {
    en: 'Loading services management...',
    uk: 'Завантаження управління послугами...'
  },
  loadingCitizens: {
    en: 'Loading citizen registry...',
    uk: 'Завантаження реєстру громадян...'
  },
  loadingFinancial: {
    en: 'Loading financial dashboard...',
    uk: 'Завантаження фінансової панелі...'
  }
};
