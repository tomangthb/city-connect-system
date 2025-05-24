import { TranslationRecord } from './types';

export const dashboardTranslations: Record<string, TranslationRecord> = {
  // Dashboard KPI Cards
  pendingAppeals: {
    en: 'Pending Appeals',
    uk: 'Звернення на розгляді'
  },
  activeServices: {
    en: 'Active Services',
    uk: 'Активні послуги'
  },
  registeredCitizens: {
    en: 'Registered Citizens',
    uk: 'Зареєстровані громадяни'
  },
  monthlyRevenue: {
    en: 'Monthly Revenue',
    uk: 'Щомісячний дохід'
  },

  // Dashboard Activities
  recentActivities: {
    en: 'Recent Activities',
    uk: 'Останні активності'
  },
  quickActions: {
    en: 'Quick Actions',
    uk: 'Швидкі дії'
  },

  // Quick Actions
  generateReport: {
    en: 'Generate Report',
    uk: 'Згенерувати звіт'
  },
  reviewAppeals: {
    en: 'Review Appeals',
    uk: 'Розглянути звернення'
  },
  manageUsers: {
    en: 'Manage Users',
    uk: 'Управління користувачами'
  },
  viewAnalytics: {
    en: 'View Analytics',
    uk: 'Переглянути аналітику'
  },
  createTask: {
    en: 'Create Task',
    uk: 'Створити завдання'
  },

  // Activity Filter
  allTypes: {
    en: 'All Types',
    uk: 'Всі типи'
  },
  appeal: {
    en: 'Appeal',
    uk: 'Звернення'
  },
  service: {
    en: 'Service',
    uk: 'Послуга'
  },
  report: {
    en: 'Report',
    uk: 'Звіт'
  },
  event: {
    en: 'Event',
    uk: 'Подія'
  },
  allPriorities: {
    en: 'All Priorities',
    uk: 'Всі пріоритети'
  },
  high: {
    en: 'High',
    uk: 'Високий'
  },
  medium: {
    en: 'Medium',
    uk: 'Середній'
  },
  low: {
    en: 'Low',
    uk: 'Низький'
  },
  allStatus: {
    en: 'All Status',
    uk: 'Всі статуси'
  },
  pending: {
    en: 'Pending',
    uk: 'Очікує'
  },
  completed: {
    en: 'Completed',
    uk: 'Завершено'
  },
  scheduled: {
    en: 'Scheduled',
    uk: 'Заплановано'
  },
  clearFilters: {
    en: 'Clear Filters',
    uk: 'Очистити фільтри'
  },

  // Time format
  justNow: {
    en: 'Just now',
    uk: 'Щойно'
  },
  hoursAgo: {
    en: 'h ago',
    uk: 'г тому'
  },
  daysAgo: {
    en: 'd ago',
    uk: 'д тому'
  },

  // General
  noActivitiesFound: {
    en: 'No activities found',
    uk: 'Активності не знайдено'
  },
  target: {
    en: 'Target',
    uk: 'Ціль'
  },
  type: {
    en: 'Type',
    uk: 'Тип'
  },
  priority: {
    en: 'Priority',
    uk: 'Пріоритет'
  },
  status: {
    en: 'Status',
    uk: 'Статус'
  },

  // Activity logging messages
  appealsReviewStarted: {
    en: 'Started reviewing appeals',
    uk: 'Розпочато розгляд звернень'
  },
  userManagementAccessed: {
    en: 'Accessed user management',
    uk: 'Відкрито управління користувачами'
  },
  analyticsAccessed: {
    en: 'Accessed analytics dashboard',
    uk: 'Відкрито панель аналітики'
  },
  settingsOpened: {
    en: 'Opened profile settings',
    uk: 'Відкрито налаштування профілю'
  },

  // Form fields
  fillAllFields: {
    en: 'Please fill all fields',
    uk: 'Будь ласка, заповніть всі поля'
  },
  fillRequiredFields: {
    en: 'Please fill required fields',
    uk: 'Будь ласка, заповніть обов\'язкові поля'
  },
  titleRequired: {
    en: 'Title is required',
    uk: 'Назва обов\'язкова'
  },
  responseRequired: {
    en: 'Response is required',
    uk: 'Відповідь обов\'язкова'
  },

  // Report generation
  reportType: {
    en: 'Report Type',
    uk: 'Тип звіту'
  },
  selectReportType: {
    en: 'Select report type',
    uk: 'Оберіть тип звіту'
  },
  financialReport: {
    en: 'Financial Report',
    uk: 'Фінансовий звіт'
  },
  appealsReport: {
    en: 'Appeals Report',
    uk: 'Звіт про звернення'
  },
  servicesReport: {
    en: 'Services Report',
    uk: 'Звіт про послуги'
  },
  analyticsReport: {
    en: 'Analytics Report',
    uk: 'Аналітичний звіт'
  },
  dateRange: {
    en: 'Date Range',
    uk: 'Діапазон дат'
  },
  selectDateRange: {
    en: 'Select date range',
    uk: 'Оберіть діапазон дат'
  },
  last7Days: {
    en: 'Last 7 days',
    uk: 'Останні 7 днів'
  },
  last30Days: {
    en: 'Last 30 days',
    uk: 'Останні 30 днів'
  },
  last3Months: {
    en: 'Last 3 months',
    uk: 'Останні 3 місяці'
  },
  lastYear: {
    en: 'Last year',
    uk: 'Останній рік'
  },
  generating: {
    en: 'Generating...',
    uk: 'Генерація...'
  },
  generate: {
    en: 'Generate',
    uk: 'Згенерувати'
  },
  creating: {
    en: 'Creating...',
    uk: 'Створення...'
  },
  create: {
    en: 'Create',
    uk: 'Створити'
  },

  // Task creation
  title: {
    en: 'Title',
    uk: 'Назва'
  },
  enterTaskTitle: {
    en: 'Enter task title',
    uk: 'Введіть назву завдання'
  },
  enterTaskDescription: {
    en: 'Enter task description',
    uk: 'Введіть опис завдання'
  },

  // Loading states
  loading: {
    en: 'Loading...',
    uk: 'Завантаження...'
  }
};
