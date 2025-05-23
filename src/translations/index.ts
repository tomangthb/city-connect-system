
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
    en: 'Choose the portal you want to access',
    uk: 'Оберіть портал, до якого хочете отримати доступ'
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
  
  // New notification translations
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
  }
};
