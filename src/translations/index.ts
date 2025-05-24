
export type Language = 'en' | 'uk';

export const translations: Record<string, Record<Language, string>> = {
  // App title and navigation
  appTitle: {
    en: 'Municipal Portal',
    uk: 'Муніципальний Портал'
  },
  employeePortal: {
    en: 'Employee Portal',
    uk: 'Портал Співробітника'
  },
  residentPortal: {
    en: 'Resident Portal',
    uk: 'Портал Мешканця'
  },

  // Authentication
  login: {
    en: 'Login',
    uk: 'Увійти'
  },
  logout: {
    en: 'Logout',
    uk: 'Вийти'
  },
  register: {
    en: 'Register',
    uk: 'Зареєструватися'
  },

  // Portal selection
  selectUserType: {
    en: 'Select your user type to access the portal',
    uk: 'Виберіть свій тип користувача для доступу до порталу'
  },
  accessEmployeePortal: {
    en: 'Access Employee Portal',
    uk: 'Перейти до Порталу Співробітника'
  },
  accessResidentPortal: {
    en: 'Access Resident Portal',
    uk: 'Перейти до Порталу Мешканця'
  },
  needHelp: {
    en: 'Need help? Contact municipal support',
    uk: 'Потрібна допомога? Зв\'яжіться з муніципальною підтримкою'
  },

  // User menu
  changePortal: {
    en: 'Change Portal',
    uk: 'Змінити Портал'
  },
  settings: {
    en: 'Settings',
    uk: 'Налаштування'
  },

  // Languages
  english: {
    en: 'English',
    uk: 'Англійська'
  },
  ukrainian: {
    en: 'Ukrainian',
    uk: 'Українська'
  },

  // Sidebar menu items - Employee
  dashboard: {
    en: 'Dashboard',
    uk: 'Панель управління'
  },
  resourceManagement: {
    en: 'Resource Management',
    uk: 'Управління ресурсами'
  },
  cityServices: {
    en: 'City Services',
    uk: 'Міські послуги'
  },
  citizensAppeals: {
    en: 'Citizens Appeals',
    uk: 'Звернення громадян'
  },
  documentManagement: {
    en: 'Document Management',
    uk: 'Управління документами'
  },
  analyticsReports: {
    en: 'Analytics & Reports',
    uk: 'Аналітика та звіти'
  },
  administration: {
    en: 'Administration',
    uk: 'Адміністрування'
  },

  // Sidebar menu items - Resident
  home: {
    en: 'Home',
    uk: 'Головна'
  },
  submitAppeal: {
    en: 'Submit Appeal',
    uk: 'Подати звернення'
  },
  cityResources: {
    en: 'City Resources',
    uk: 'Міські ресурси'
  },
  newsEvents: {
    en: 'News & Events',
    uk: 'Новини та події'
  },
  myAccount: {
    en: 'My Account',
    uk: 'Мій профіль'
  },
  payments: {
    en: 'Payments',
    uk: 'Платежі'
  },
  
  // Notification translations
  notifications: {
    en: 'Notifications',
    uk: 'Сповіщення'
  },
  clearAll: {
    en: 'Clear All',
    uk: 'Очистити все'
  },
  noNotifications: {
    en: 'No notifications',
    uk: 'Немає сповіщень'
  },
  markAsRead: {
    en: 'Mark as read',
    uk: 'Позначити як прочитане'
  },
  newTaskAssigned: {
    en: 'New Task Assigned',
    uk: 'Призначено нове завдання'
  },
  youHaveNewTask: {
    en: 'You have been assigned a new task to review.',
    uk: 'Вам призначено нове завдання для розгляду.'
  },
  documentUpdated: {
    en: 'Document Updated',
    uk: 'Документ оновлено'
  },
  documentWasUpdated: {
    en: 'The document "City Budget Plan" has been updated.',
    uk: 'Документ "План міського бюджету" було оновлено.'
  },
  meetingReminder: {
    en: 'Meeting Reminder',
    uk: 'Нагадування про зустріч'
  },
  teamMeetingScheduled: {
    en: 'Team meeting scheduled for tomorrow at 10:00 AM.',
    uk: 'Командна зустріч запланована на завтра о 10:00.'
  },
  notificationMarkedAsRead: {
    en: 'Notification marked as read',
    uk: 'Сповіщення позначено як прочитане'
  },
  allNotificationsCleared: {
    en: 'All notifications cleared',
    uk: 'Усі сповіщення очищено'
  },
  settingsOpened: {
    en: 'Settings opened',
    uk: 'Налаштування відкрито'
  },

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
  }
};
