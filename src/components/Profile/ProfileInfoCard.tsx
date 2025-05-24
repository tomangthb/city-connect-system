
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, User, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileInfoCardProps {
  profileData: {
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    phone: string;
    address: string;
    position: string;
  };
}

const ProfileInfoCard = ({ profileData }: ProfileInfoCardProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const getUserInitials = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    const parts = [profileData.lastName, profileData.firstName, profileData.patronymic].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Користувач';
  };

  const getUserType = () => {
    return language === 'en' ? 'Citizen' : 'Громадянин';
  };

  const getRegistrationDate = () => {
    return new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Profile Information' : 'Інформація профілю'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {language === 'en' 
            ? 'Basic information about your account' 
            : 'Основна інформація про ваш обліковий запис'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl bg-blue-600 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {getFullName()}
            </h3>
            <p className="text-gray-600">{getUserType()}</p>
          </div>
        </div>

        {/* Contact information */}
        <div className="space-y-3">
          {profileData.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.email}</span>
            </div>
          )}
          
          {profileData.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.phone}</span>
            </div>
          )}
          
          {profileData.address && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.address}</span>
            </div>
          )}
          
          {profileData.position && (
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.position}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {language === 'en' ? 'Registered: ' : 'Зареєстровано: '}
              {getRegistrationDate()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
