
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Mail, Camera, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PersonalInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    phone: string;
    address: string;
    position: string;
    bio: string;
    avatarUrl: string;
  };
  onInputChange: (field: string, value: string) => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getUserInitials: () => string;
  isUploadingAvatar: boolean;
}

const PersonalInfoForm = ({ 
  formData, 
  onInputChange, 
  onAvatarUpload, 
  getUserInitials, 
  isUploadingAvatar 
}: PersonalInfoFormProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={formData.avatarUrl} />
            <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Button 
              size="sm" 
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              disabled={isUploadingAvatar}
              asChild
            >
              <div>
                <Camera className="h-4 w-4" />
              </div>
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarUpload}
            />
          </label>
        </div>
        <div>
          <h3 className="font-medium">Фото профілю</h3>
          <p className="text-sm text-gray-500">JPG, PNG до 5MB</p>
        </div>
      </div>

      {/* Personal Information - Optimized layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {t('firstName')}
            </Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              placeholder={language === 'en' ? 'Enter your first name' : 'Введіть ваше ім\'я'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">
              {t('lastName')}
            </Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              placeholder={language === 'en' ? 'Enter your last name' : 'Введіть ваше прізвище'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patronymic">
              {t('patronymic')}
            </Label>
            <Input 
              id="patronymic" 
              value={formData.patronymic}
              onChange={(e) => onInputChange('patronymic', e.target.value)}
              placeholder={language === 'en' ? 'Enter your patronymic' : 'Введіть ваше по-батькові'}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {t('emailAddress')}
            </Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {t('phoneNumber')}
            </Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder={language === 'en' ? 'Enter your phone number' : 'Введіть ваш номер телефону'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">
              {t('position')}
            </Label>
            <Input 
              id="position" 
              value={formData.position}
              disabled
              className="bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Address - Full width */}
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {t('address')}
        </Label>
        <Input 
          id="address" 
          value={formData.address}
          onChange={(e) => onInputChange('address', e.target.value)}
          placeholder={language === 'en' ? 'Enter your address' : 'Введіть вашу адресу'}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
