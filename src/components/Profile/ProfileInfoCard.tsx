
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Calendar, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ProfileInfoCardProps {
  profileData: {
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    phone: string;
    address: string;
    position: string;
    avatarUrl?: string;
  };
}

const ProfileInfoCard = ({ profileData }: ProfileInfoCardProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
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
    return parts.length > 0 ? parts.join(' ') : (language === 'en' ? 'User' : 'Користувач');
  };

  const getRegistrationDate = () => {
    return new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA');
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(language === 'en' ? 'Copied to clipboard' : 'Скопійовано в буфер');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error(language === 'en' ? 'Failed to copy' : 'Помилка копіювання');
    }
  };

  return (
    <Card className="bg-card border-border theme-transition">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground">
          {language === 'en' ? 'Profile Information' : 'Інформація профілю'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === 'en' 
            ? 'Basic information about your account' 
            : 'Основна інформація про ваш обліковий запис'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 shadow-lg dark:shadow-gray-900/50 border-2 border-accent">
            <AvatarImage src={profileData.avatarUrl} />
            <AvatarFallback className="text-2xl bg-green-600 dark:bg-green-700 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground">
              {getFullName()}
            </h3>
          </div>
        </div>

        {/* Contact information */}
        <div className="space-y-4">
          {profileData.email && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{profileData.email}</span>
              </div>
              <button
                onClick={() => copyToClipboard(profileData.email, 'email')}
                className="p-1 hover:bg-accent rounded transition-colors duration-200"
              >
                {copiedField === 'email' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </div>
          )}
          
          {profileData.phone && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{profileData.phone}</span>
              </div>
              <button
                onClick={() => copyToClipboard(profileData.phone, 'phone')}
                className="p-1 hover:bg-accent rounded transition-colors duration-200"
              >
                {copiedField === 'phone' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </div>
          )}
          
          {profileData.address && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/30">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground leading-relaxed">{profileData.address}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/30">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {language === 'en' ? 'Registered: ' : 'Зареєстровано: '}
              <span className="text-foreground font-medium">{getRegistrationDate()}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
