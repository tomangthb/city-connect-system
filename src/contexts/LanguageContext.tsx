
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'uk';

// Translation type
type Translations = {
  [key: string]: {
    en: string;
    uk: string;
  };
};

// Define our translations
const translations: Translations = {
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
  
  // Login/logout
  logout: {
    en: 'Logout',
    uk: 'Вихід'
  },
  settings: {
    en: 'Settings',
    uk: 'Налаштування'
  }
};

// Create the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// Create a provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
