
import React, { createContext, useContext, useState } from 'react';

// Define available languages and their translations
const translations: Record<string, Record<string, string>> = {
  en: {
    // App
    appTitle: 'City Management Portal',
    loading: 'Loading',
    saving: 'Saving',
    updating: 'Updating',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    save: 'Save',
    saveChanges: 'Save Changes',
    refresh: 'Refresh',
    
    // Authorization
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    loginDescription: 'Enter your credentials to access your account',
    registerDescription: 'Create a new account to access city services',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    patronymic: 'Patronymic',
    address: 'Address',
    userType: 'User Type',
    selectUserType: 'Select user type',
    settings: 'Settings',
    profileSettings: 'Profile',
    security: 'Security',
    profileInformation: 'Profile Information',
    updateProfileDescription: 'Update your personal information',
    changePassword: 'Change Password',
    passwordDescription: 'Update your password to keep your account secure',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    authFooter: 'By using this service, you agree to our Terms of Service and Privacy Policy',
    
    // Portal sections
    dashboard: 'Dashboard',
    employeePortal: 'Employee Portal',
    residentPortal: 'Resident Portal',
    citizen: 'Citizen',
    employee: 'Employee',
    resident: 'Resident',
    
    // Portals
    home: 'Home',
    resourceManagement: 'Resource Management',
    cityServices: 'City Services',
    citizensAppeals: 'Citizens Appeals',
    documentManagement: 'Document Management',
    analyticsReports: 'Analytics & Reports',
    administration: 'Administration',
    cityResources: 'City Resources',
    submitAppeal: 'Submit Appeal',
    newsEvents: 'News & Events',
    myAccount: 'My Account',
    payments: 'Payments',
    
    // Notifications
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAllRead: 'Mark all as read',
    markAsRead: 'Mark as read',
    allNotificationsRead: 'All notifications read',
    allNotificationsReadDescription: 'All notifications have been marked as read',
  },
  
  uk: {
    // App
    appTitle: 'Портал управління містом',
    loading: 'Завантаження',
    saving: 'Збереження',
    updating: 'Оновлення',
    cancel: 'Скасувати',
    confirm: 'Підтвердити',
    delete: 'Видалити',
    welcome: 'Вітаємо',
    welcomeBack: 'З поверненням',
    save: 'Зберегти',
    saveChanges: 'Зберегти зміни',
    refresh: 'Оновити',
    
    // Authorization
    login: 'Увійти',
    logout: 'Вийти',
    register: 'Реєстрація',
    loginDescription: 'Введіть свої дані для входу в систему',
    registerDescription: 'Створіть новий обліковий запис для доступу до послуг міста',
    email: 'Електронна пошта',
    password: 'Пароль',
    confirmPassword: 'Підтвердіть пароль',
    firstName: 'Ім\'я',
    lastName: 'Прізвище',
    patronymic: 'По батькові',
    address: 'Адреса',
    userType: 'Тип користувача',
    selectUserType: 'Оберіть тип користувача',
    settings: 'Налаштування',
    profileSettings: 'Профіль',
    security: 'Безпека',
    profileInformation: 'Інформація профілю',
    updateProfileDescription: 'Оновіть вашу персональну інформацію',
    changePassword: 'Змінити пароль',
    passwordDescription: 'Оновіть свій пароль для підвищення безпеки облікового запису',
    currentPassword: 'Поточний пароль',
    newPassword: 'Новий пароль',
    confirmNewPassword: 'Підтвердіть новий пароль',
    authFooter: 'Використовуючи цей сервіс, ви погоджуєтесь з Умовами використання та Політикою конфіденційності',
    
    // Portal sections
    dashboard: 'Панель керування',
    employeePortal: 'Портал співробітника',
    residentPortal: 'Портал мешканця',
    citizen: 'Громадянин',
    employee: 'Співробітник',
    resident: 'Мешканець',
    
    // Portals
    home: 'Головна',
    resourceManagement: 'Управління ресурсами',
    cityServices: 'Послуги міста',
    citizensAppeals: 'Звернення громадян',
    documentManagement: 'Управління документами',
    analyticsReports: 'Аналітика та звіти',
    administration: 'Адміністрування',
    cityResources: 'Міські ресурси',
    submitAppeal: 'Подати звернення',
    newsEvents: 'Новини та події',
    myAccount: 'Мій профіль',
    payments: 'Платежі',
    
    // Notifications
    notifications: 'Сповіщення',
    noNotifications: 'Немає сповіщень',
    markAllRead: 'Позначити всі як прочитані',
    markAsRead: 'Позначити як прочитане',
    allNotificationsRead: 'Всі сповіщення прочитані',
    allNotificationsReadDescription: 'Всі сповіщення були позначені як прочитані',
  }
};

// Create language context
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Use browser language or default to English
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'uk' ? 'uk' : 'en';
  };

  const [language, setLanguage] = useState(
    localStorage.getItem('language') || getBrowserLanguage()
  );

  // Save language preference to localStorage
  const changeLanguage = (newLanguage: string) => {
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
