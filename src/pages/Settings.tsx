
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';

// Settings form schema with validation
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  patronymic: z.string().optional(),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().optional(),
});

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileType = {
  id: string;
  full_name: string;
  address: string;
  phone: string | null;
  type: string;
};

const Settings = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [activeTab, setActiveTab] = useState('account');

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      patronymic: "",
      address: "",
      phone: "",
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Check authentication and load profile data
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        navigate('/auth');
        return;
      }
      
      setUser(data.session.user);
      fetchUserProfile(data.session.user.id);
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
        
        // Parse full name into components
        const nameParts = data.full_name.split(' ');
        const lastName = nameParts[0] || '';
        const firstName = nameParts[1] || '';
        const patronymic = nameParts[2] || '';
        
        // Set form values
        profileForm.reset({
          lastName,
          firstName,
          patronymic,
          address: data.address || '',
          phone: data.phone || '',
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const onUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      if (!user) return;
      
      // Update full_name in profiles table
      const fullName = `${values.lastName} ${values.firstName} ${values.patronymic || ''}`.trim();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          address: values.address,
          phone: values.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: t('errorOccurred'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Also update user metadata
      await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          patronymic: values.patronymic,
        }
      });
      
      toast({
        title: t('profileUpdated'),
        description: t('profileUpdateSuccess'),
      });
      
      // Refresh profile data
      fetchUserProfile(user.id);
      
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: t('errorOccurred'),
        description: t('profileUpdateFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const onChangePassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.currentPassword,
      });
      
      if (signInError) {
        toast({
          title: t('errorOccurred'),
          description: t('currentPasswordIncorrect'),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (error) {
        toast({
          title: t('errorOccurred'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t('passwordChanged'),
          description: t('passwordChangeSuccess'),
        });
        passwordForm.reset();
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast({
        title: t('errorOccurred'),
        description: t('passwordChangeFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userType={profile.type as 'employee' | 'resident'} 
        userName={profile.full_name}
      />
      <div className="flex flex-1">
        <Sidebar 
          userType={profile.type as 'employee' | 'resident'} 
          activeTab="account" 
          onTabChange={() => {}}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="account">{t('accountSettings')}</TabsTrigger>
                <TabsTrigger value="password">{t('changePassword')}</TabsTrigger>
              </TabsList>
              
              {/* Account Settings */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalInformation')}</CardTitle>
                    <CardDescription>
                      {t('updateYourPersonalInformation')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('lastName')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('firstName')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="patronymic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('patronymic')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('address')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('phoneNumber')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? t('saving') : t('saveChanges')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Password Change */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('changePassword')}</CardTitle>
                    <CardDescription>
                      {t('updateYourPassword')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('currentPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('newPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('confirmPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? t('changing') : t('changePassword')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
