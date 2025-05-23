
// Define available languages
export type Language = 'en' | 'uk';

// Translation type
export type Translations = {
  [key: string]: {
    en: string;
    uk: string;
  };
};

// Define our translations
export const translations: Translations = {
  // Common
  appTitle: {
    en: 'City Council Information System',
    uk: 'Інформаційна система міської ради'
  },
  dashboard: {
    en: 'Dashboard',
    uk: 'Панель управління'
  },
  employeePortal: {
    en: 'Employee Portal',
    uk: 'Портал працівника'
  },
  residentPortal: {
    en: 'Resident Portal',
    uk: 'Портал мешканця'
  },
  selectUserType: {
    en: 'Select your user type to access the portal',
    uk: 'Оберіть свій тип користувача для доступу до порталу'
  },
  accessEmployeePortal: {
    en: 'Access Employee Portal',
    uk: 'Увійти як працівник'
  },
  accessResidentPortal: {
    en: 'Access Resident Portal',
    uk: 'Увійти як мешканець'
  },
  needHelp: {
    en: 'Need help? Contact support at support@citycouncil.gov or call (555) 123-4567',
    uk: 'Потрібна допомога? Зверніться до служби підтримки support@citycouncil.gov або зателефонуйте (555) 123-4567'
  },
  home: {
    en: 'Home',
    uk: 'Головна'
  },
  
  // Employee features
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
  
  // Resident features
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
    uk: 'Мій обліковий запис'
  },
  payments: {
    en: 'Payments',
    uk: 'Платежі'
  },
  
  // Dashboard items
  pendingAppeals: {
    en: 'Pending Appeals',
    uk: 'Звернення в очікуванні'
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
    uk: 'Місячний дохід'
  },
  recentActivities: {
    en: 'Recent Activities',
    uk: 'Останні дії'
  },
  quickActions: {
    en: 'Quick Actions',
    uk: 'Швидкі дії'
  },
  generateReport: {
    en: 'Generate Report',
    uk: 'Створити звіт'
  },
  reviewAppeals: {
    en: 'Review Appeals',
    uk: 'Переглянути звернення'
  },
  manageUsers: {
    en: 'Manage Users',
    uk: 'Керування користувачами'
  },
  viewAnalytics: {
    en: 'View Analytics',
    uk: 'Переглянути аналітику'
  },
  
  // Language toggle
  language: {
    en: 'Language',
    uk: 'Мова'
  },
  english: {
    en: 'English',
    uk: 'Англійська'
  },
  ukrainian: {
    en: 'Ukrainian',
    uk: 'Українська'
  },
  
  // Login/logout/auth
  login: {
    en: 'Login',
    uk: 'Увійти'
  },
  logout: {
    en: 'Logout',
    uk: 'Вихід'
  },
  settings: {
    en: 'Settings',
    uk: 'Налаштування'
  },
  register: {
    en: 'Register',
    uk: 'Зареєструватися'
  },
  loginDescription: {
    en: 'Sign in to your account',
    uk: 'Увійдіть в свій обліковий запис'
  },
  registerDescription: {
    en: 'Create a new account',
    uk: 'Створити новий обліковий запис'
  },
  email: {
    en: 'Email',
    uk: 'Електронна пошта'
  },
  password: {
    en: 'Password',
    uk: 'Пароль'
  },
  confirmPassword: {
    en: 'Confirm Password',
    uk: 'Підтвердити пароль'
  },
  firstName: {
    en: 'First Name',
    uk: 'Ім\'я'
  },
  lastName: {
    en: 'Last Name',
    uk: 'Прізвище'
  },
  patronymic: {
    en: 'Patronymic',
    uk: 'По батькові'
  },
  address: {
    en: 'Address',
    uk: 'Адреса'
  },
  changePortal: {
    en: 'Change Portal',
    uk: 'Змінити портал'
  }
};
