
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfileData = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    email: user?.email || '',
    phone: '',
    address: '',
    position: '',
    bio: '',
    avatarUrl: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setFormData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            patronymic: data.patronymic || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            position: data.user_type === 'employee' ? 'Municipal Employee' : 'Resident',
            bio: '',
            avatarUrl: data.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
      toast.success('Фото профілю успішно оновлено!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Помилка завантаження фото');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) {
      toast.error('Користувач не авторизований');
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          patronymic: formData.patronymic,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
      
      toast.success('Профіль успішно оновлено!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Помилка оновлення профілю');
    } finally {
      setIsUpdating(false);
    }
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return {
    formData,
    isLoading,
    isUpdating,
    isUploadingAvatar,
    handleInputChange,
    handleAvatarUpload,
    handleUpdateProfile,
    getUserInitials
  };
};
