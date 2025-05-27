
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard,
  FileText,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newsUpdates: boolean;
  serviceReminders: boolean;
  appealUpdates: boolean;
}

const ResidentAccountModule = () => {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'Олександр',
    lastName: 'Іваненко',
    email: 'oleksandr.ivanenko@gmail.com',
    phone: '+380 67 123 4567',
    address: 'вул. Хрещатик, 1, кв. 45',
    dateOfBirth: '1985-03-15',
    emergencyContact: '+380 67 987 6543'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newsUpdates: true,
    serviceReminders: true,
    appealUpdates: true
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    toast.success(language === 'en' ? 'Profile updated successfully!' : 'Профіль успішно оновлено!');
  };

  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success(language === 'en' ? 'Settings updated' : 'Налаштування оновлено');
  };

  const recentActivity = [
    {
      id: '1',
      type: 'appeal',
      title: language === 'en' ? 'Appeal submitted' : 'Звернення подано',
      description: language === 'en' ? 'Street Light Repair Request' : 'Запит на ремонт вуличного освітлення',
      date: '2024-05-20',
      status: 'pending'
    },
    {
      id: '2',
      type: 'service',
      title: language === 'en' ? 'Service requested' : 'Послугу запитано',
      description: language === 'en' ? 'Building Permit Application' : 'Заявка на будівельний дозвіл',
      date: '2024-05-18',
      status: 'in_progress'
    },
    {
      id: '3',
      type: 'payment',
      title: language === 'en' ? 'Payment made' : 'Платіж здійснено',
      description: language === 'en' ? 'Water Bill Payment' : 'Оплата рахунку за воду',
      date: '2024-05-15',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return language === 'en' ? 'Completed' : 'Завершено';
      case 'in_progress': return language === 'en' ? 'In Progress' : 'В процесі';
      case 'pending': return language === 'en' ? 'Pending' : 'Очікує';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'en' ? 'My Account' : 'Мій акаунт'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Manage your personal information and account preferences.' 
            : 'Керуйте своєю особистою інформацією та налаштуваннями акаунту.'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {language === 'en' ? 'Profile' : 'Профіль'}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {language === 'en' ? 'Notifications' : 'Сповіщення'}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {language === 'en' ? 'Security' : 'Безпека'}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {language === 'en' ? 'Activity' : 'Активність'}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Personal Information' : 'Особиста інформація'}
                </CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Edit' : 'Редагувати'}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Cancel' : 'Скасувати'}
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Save' : 'Зберегти'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'First Name' : 'Ім\'я'}
                  </label>
                  <Input
                    value={isEditing ? tempProfile.firstName : profile.firstName}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Last Name' : 'Прізвище'}
                  </label>
                  <Input
                    value={isEditing ? tempProfile.lastName : profile.lastName}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Email' : 'Електронна пошта'}
                  </label>
                  <Input
                    type="email"
                    value={isEditing ? tempProfile.email : profile.email}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Phone' : 'Телефон'}
                  </label>
                  <Input
                    value={isEditing ? tempProfile.phone : profile.phone}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Address' : 'Адреса'}
                  </label>
                  <Input
                    value={isEditing ? tempProfile.address : profile.address}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Date of Birth' : 'Дата народження'}
                  </label>
                  <Input
                    type="date"
                    value={isEditing ? tempProfile.dateOfBirth : profile.dateOfBirth}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Emergency Contact' : 'Екстрений контакт'}
                  </label>
                  <Input
                    value={isEditing ? tempProfile.emergencyContact : profile.emergencyContact}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Notification Preferences' : 'Налаштування сповіщень'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => {
                const labels = {
                  emailNotifications: language === 'en' ? 'Email Notifications' : 'Email сповіщення',
                  smsNotifications: language === 'en' ? 'SMS Notifications' : 'SMS сповіщення',
                  pushNotifications: language === 'en' ? 'Push Notifications' : 'Push сповіщення',
                  newsUpdates: language === 'en' ? 'News Updates' : 'Оновлення новин',
                  serviceReminders: language === 'en' ? 'Service Reminders' : 'Нагадування про послуги',
                  appealUpdates: language === 'en' ? 'Appeal Updates' : 'Оновлення звернень'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{labels[key as keyof typeof labels]}</span>
                    <Button
                      variant={value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange(key as keyof NotificationSettings, !value)}
                    >
                      {value 
                        ? (language === 'en' ? 'Enabled' : 'Увімкнено')
                        : (language === 'en' ? 'Disabled' : 'Вимкнено')
                      }
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Security Settings' : 'Налаштування безпеки'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{language === 'en' ? 'Change Password' : 'Змінити пароль'}</h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? 'Update your account password' : 'Оновіть пароль вашого акаунту'}
                    </p>
                  </div>
                  <Button variant="outline">
                    {language === 'en' ? 'Change' : 'Змінити'}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{language === 'en' ? 'Two-Factor Authentication' : 'Двофакторна автентифікація'}</h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? 'Add extra security to your account' : 'Додайте додаткову безпеку до вашого акаунту'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    {language === 'en' ? 'Not Enabled' : 'Не увімкнено'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{language === 'en' ? 'Login History' : 'Історія входів'}</h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? 'View recent login activity' : 'Переглянути недавню активність входів'}
                    </p>
                  </div>
                  <Button variant="outline">
                    {language === 'en' ? 'View' : 'Переглянути'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Recent Activity' : 'Недавня активність'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                {language === 'en' ? 'View All Activity' : 'Переглянути всю активність'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResidentAccountModule;
