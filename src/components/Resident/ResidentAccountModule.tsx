
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Shield,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Key,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const ResidentAccountModule = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Олександр',
    lastName: 'Петренко',
    email: user?.email || 'alexander.petrenko@example.com',
    phone: '+380 67 123 4567',
    address: 'вул. Шевченка, 15, кв. 42',
    city: 'Київ',
    postalCode: '01001'
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    appealStatus: true,
    newsUpdates: true,
    serviceReminders: true
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = () => {
    toast.success(language === 'en' ? 'Profile updated successfully' : 'Профіль успішно оновлено');
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error(language === 'en' ? 'Passwords do not match' : 'Паролі не співпадають');
      return;
    }
    if (security.newPassword.length < 6) {
      toast.error(language === 'en' ? 'Password must be at least 6 characters' : 'Пароль повинен містити щонайменше 6 символів');
      return;
    }
    
    toast.success(language === 'en' ? 'Password changed successfully' : 'Пароль успішно змінено');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationSave = () => {
    toast.success(language === 'en' ? 'Notification preferences saved' : 'Налаштування сповіщень збережено');
  };

  const tabs = [
    { id: 'profile', label: language === 'en' ? 'Profile Information' : 'Інформація профілю', icon: User },
    { id: 'security', label: language === 'en' ? 'Security' : 'Безпека', icon: Shield },
    { id: 'notifications', label: language === 'en' ? 'Notifications' : 'Сповіщення', icon: Bell },
    { id: 'preferences', label: language === 'en' ? 'Preferences' : 'Налаштування', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
          {language === 'en' ? 'Profile Information' : 'Інформація профілю'}
        </h2>
        <p className="text-gray-200 dark:text-gray-200">
          {language === 'en' 
            ? 'Manage your account settings and preferences.' 
            : 'Керуйте налаштуваннями та уподобаннями вашого акаунту.'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-600 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-transparent border-gray-600 text-gray-200 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <Card className="enhanced-card-block">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white dark:text-white">
                {language === 'en' ? 'Personal Information' : 'Особиста інформація'}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                {isEditing 
                  ? (language === 'en' ? 'Cancel' : 'Скасувати')
                  : (language === 'en' ? 'Edit' : 'Редагувати')
                }
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'First Name' : 'Ім\'я'}
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Last Name' : 'Прізвище'}
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Email' : 'Електронна пошта'}
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Phone' : 'Телефон'}
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Address' : 'Адреса'}
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'City' : 'Місто'}
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Postal Code' : 'Поштовий індекс'}
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.postalCode}
                    onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="enhanced-input"
                  />
                ) : (
                  <p className="text-white bg-gray-800 p-2 rounded border border-gray-600">
                    {profileData.postalCode}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {language === 'en' ? 'Cancel' : 'Скасувати'}
                </Button>
                <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Save Changes' : 'Зберегти зміни'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="enhanced-card-block">
          <CardHeader>
            <CardTitle className="text-white dark:text-white">
              {language === 'en' ? 'Security Settings' : 'Налаштування безпеки'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Current Password' : 'Поточний пароль'}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={security.currentPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="enhanced-input pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'New Password' : 'Новий пароль'}
                </label>
                <Input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="enhanced-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {language === 'en' ? 'Confirm New Password' : 'Підтвердіть новий пароль'}
                </label>
                <Input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="enhanced-input"
                />
              </div>

              <Button onClick={handlePasswordChange} className="bg-green-600 hover:bg-green-700">
                <Key className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Change Password' : 'Змінити пароль'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="enhanced-card-block">
          <CardHeader>
            <CardTitle className="text-white dark:text-white">
              {language === 'en' ? 'Notification Preferences' : 'Налаштування сповіщень'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-white font-medium">
                      {key === 'emailUpdates' && (language === 'en' ? 'Email Updates' : 'Оновлення електронною поштою')}
                      {key === 'smsAlerts' && (language === 'en' ? 'SMS Alerts' : 'SMS сповіщення')}
                      {key === 'appealStatus' && (language === 'en' ? 'Appeal Status' : 'Статус звернень')}
                      {key === 'newsUpdates' && (language === 'en' ? 'News Updates' : 'Новини')}
                      {key === 'serviceReminders' && (language === 'en' ? 'Service Reminders' : 'Нагадування про послуги')}
                    </p>
                    <p className="text-sm text-gray-300">
                      {key === 'emailUpdates' && (language === 'en' ? 'Receive updates via email' : 'Отримувати оновлення електронною поштою')}
                      {key === 'smsAlerts' && (language === 'en' ? 'Receive urgent alerts via SMS' : 'Отримувати термінові сповіщення через SMS')}
                      {key === 'appealStatus' && (language === 'en' ? 'Notifications about your appeals' : 'Сповіщення про ваші звернення')}
                      {key === 'newsUpdates' && (language === 'en' ? 'City news and announcements' : 'Міські новини та оголошення')}
                      {key === 'serviceReminders' && (language === 'en' ? 'Reminders for scheduled services' : 'Нагадування про заплановані послуги')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <Button onClick={handleNotificationSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Save Preferences' : 'Зберегти налаштування'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card className="enhanced-card-block">
          <CardHeader>
            <CardTitle className="text-white dark:text-white">
              {language === 'en' ? 'Application Preferences' : 'Налаштування додатку'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-600">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">
                      {language === 'en' ? 'Language' : 'Мова'}
                    </p>
                    <p className="text-sm text-gray-300">
                      {language === 'en' ? 'Choose your preferred language' : 'Оберіть бажану мову'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-white border-gray-600">
                  {language === 'en' ? 'English' : 'Українська'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-600">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">
                      {language === 'en' ? 'Push Notifications' : 'Push сповіщення'}
                    </p>
                    <p className="text-sm text-gray-300">
                      {language === 'en' ? 'Enable browser notifications' : 'Увімкнути сповіщення браузера'}
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="text-white">
                  {language === 'en' ? 'Enabled' : 'Увімкнено'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">
                      {language === 'en' ? 'Two-Factor Authentication' : 'Двофакторна автентифікація'}
                    </p>
                    <p className="text-sm text-gray-300">
                      {language === 'en' ? 'Add an extra layer of security' : 'Додайте додатковий рівень безпеки'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  {language === 'en' ? 'Not Setup' : 'Не налаштовано'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResidentAccountModule;
