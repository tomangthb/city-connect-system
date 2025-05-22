
import React, { createContext, useContext, useState } from 'react';

// Define the structure of our translations
interface Translations {
  [key: string]: string;
}

// Define the shape of our context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for English and Ukrainian
const translations: Record<string, Translations> = {
  en: {
    appTitle: 'City Council Information System',
    employeePortal: 'Employee Portal',
    residentPortal: 'Resident Portal',
    selectUserType: 'Select User Type',
    accessEmployeePortal: 'Access Employee Portal',
    accessResidentPortal: 'Access Resident Portal',
    needHelp: 'Need help? Contact support at support@citycouncil.gov',
    dashboard: 'Dashboard',
    services: 'Services',
    appeals: 'Appeals',
    resources: 'City Resources',
    documents: 'Documents',
    analytics: 'Analytics',
    administration: 'Administration',
    userAccount: 'User Account',
    payments: 'Payments',
    news: 'News',
    settings: 'Settings',
    logout: 'Logout',
    ukrainian: 'Ukrainian',
    english: 'English',
    loading: 'Loading...',
    // Auth related translations
    login: 'Login',
    loginAsEmployee: 'Login as Employee',
    loginAsResident: 'Login as Resident',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    patronymic: 'Patronymic',
    address: 'Address',
    createAccount: 'Create Account',
    loginToContinue: 'Login to continue using the city portal',
    createNewAccount: 'Create a new account',
    welcomeToCityPortal: 'Welcome to the City Portal',
    loggingIn: 'Logging in...',
    creating: 'Creating...',
    enterFirstName: 'Enter first name',
    enterLastName: 'Enter last name',
    enterPatronymic: 'Enter patronymic (optional)',
    enterAddress: 'Enter address',
    backToHome: 'Back to Home',
    // Profile and Settings
    accountSettings: 'Account Settings',
    changePassword: 'Change Password',
    personalInformation: 'Personal Information',
    phoneNumber: 'Phone Number',
    updateYourPersonalInformation: 'Update your personal information',
    updateYourPassword: 'Update your password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    changing: 'Changing...',
    // Toast messages
    errorOccurred: 'Error Occurred',
    loginFailed: 'Login failed. Please try again.',
    registrationFailed: 'Registration failed. Please try again.',
    loginSuccessful: 'Login Successful',
    welcomeBack: 'Welcome back!',
    registrationSuccessful: 'Registration Successful',
    accountCreated: 'Your account has been created successfully!',
    profileCreationFailed: 'Failed to create user profile.',
    profileUpdated: 'Profile Updated',
    profileUpdateSuccess: 'Your profile has been updated successfully!',
    profileUpdateFailed: 'Failed to update profile. Please try again.',
    passwordChanged: 'Password Changed',
    passwordChangeSuccess: 'Your password has been changed successfully!',
    passwordChangeFailed: 'Failed to change password. Please try again.',
    currentPasswordIncorrect: 'Current password is incorrect.',
    signedOut: 'Signed Out',
    successfullySignedOut: 'You have been successfully signed out.',
    // Notification related
    notifications: 'Notifications',
    markAsRead: 'Mark as read',
    markAllAsRead: 'Mark all as read',
    allNotificationsRead: 'All Read',
    markedAllAsRead: 'All notifications marked as read',
    noNotifications: 'No notifications',
  },
  uk: {
    appTitle: 'Інформаційна система міської ради',
    employeePortal: 'Портал працівника',
    residentPortal: 'Портал мешканця',
    selectUserType: 'Оберіть тип користувача',
    accessEmployeePortal: 'Увійти як працівник',
    accessResidentPortal: 'Увійти як мешканець',
    needHelp: 'Потрібна допомога? Зв\'яжіться з підтримкою: support@citycouncil.gov',
    dashboard: 'Панель керування',
    services: 'Послуги',
    appeals: 'Звернення',
    resources: 'Міські ресурси',
    documents: 'Документи',
    analytics: 'Аналітика',
    administration: 'Адміністрування',
    userAccount: 'Особистий кабінет',
    payments: 'Платежі',
    news: 'Новини',
    settings: 'Налаштування',
    logout: 'Вихід',
    ukrainian: 'Українська',
    english: 'Англійська',
    loading: 'Завантаження...',
    // Auth related translations
    login: 'Вхід',
    loginAsEmployee: 'Увійти як працівник',
    loginAsResident: 'Увійти як мешканець',
    register: 'Реєстрація',
    email: 'Електронна пошта',
    password: 'Пароль',
    firstName: 'Ім\'я',
    lastName: 'Прізвище',
    patronymic: 'По батькові',
    address: 'Адреса',
    createAccount: 'Створити обліковий запис',
    loginToContinue: 'Увійдіть, щоб продовжити користування міським порталом',
    createNewAccount: 'Створіть новий обліковий запис',
    welcomeToCityPortal: 'Ласкаво просимо до міського порталу',
    loggingIn: 'Вхід...',
    creating: 'Створення...',
    enterFirstName: 'Введіть ім\'я',
    enterLastName: 'Введіть прізвище',
    enterPatronymic: 'Введіть по батькові (необов\'язково)',
    enterAddress: 'Введіть адресу',
    backToHome: 'Повернутися на головну',
    // Profile and Settings
    accountSettings: 'Налаштування облікового запису',
    changePassword: 'Змінити пароль',
    personalInformation: 'Особиста інформація',
    phoneNumber: 'Номер телефону',
    updateYourPersonalInformation: 'Оновіть вашу особисту інформацію',
    updateYourPassword: 'Оновіть ваш пароль',
    currentPassword: 'Поточний пароль',
    newPassword: 'Новий пароль',
    confirmPassword: 'Підтвердження пароля',
    saveChanges: 'Зберегти зміни',
    saving: 'Збереження...',
    changing: 'Зміна...',
    // Toast messages
    errorOccurred: 'Сталася помилка',
    loginFailed: 'Не вдалося увійти. Будь ласка, спробуйте ще раз.',
    registrationFailed: 'Не вдалося зареєструватися. Будь ласка, спробуйте ще раз.',
    loginSuccessful: 'Вхід успішний',
    welcomeBack: 'Ласкаво просимо назад!',
    registrationSuccessful: 'Реєстрація успішна',
    accountCreated: 'Ваш обліковий запис успішно створено!',
    profileCreationFailed: 'Не вдалося створити профіль користувача.',
    profileUpdated: 'Профіль оновлено',
    profileUpdateSuccess: 'Ваш профіль успішно оновлено!',
    profileUpdateFailed: 'Не вдалося оновити профіль. Будь ласка, спробуйте ще раз.',
    passwordChanged: 'Пароль змінено',
    passwordChangeSuccess: 'Ваш пароль успішно змінено!',
    passwordChangeFailed: 'Не вдалося змінити пароль. Будь ласка, спробуйте ще раз.',
    currentPasswordIncorrect: 'Поточний пароль неправильний.',
    signedOut: 'Вихід виконано',
    successfullySignedOut: 'Ви успішно вийшли з системи.',
    // Notification related
    notifications: 'Сповіщення',
    markAsRead: 'Позначити як прочитане',
    markAllAsRead: 'Позначити все як прочитане',
    allNotificationsRead: 'Все прочитано',
    markedAllAsRead: 'Всі сповіщення позначено як прочитані',
    noNotifications: 'Немає сповіщень',
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('uk'); // Default to Ukrainian

  // Function to get a translation
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English if key not found
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    // Fallback to key if not found in any language
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
