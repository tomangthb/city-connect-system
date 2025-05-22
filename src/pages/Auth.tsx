
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Form schemas with validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  patronymic: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string().min(5, { message: "Address is required" }),
});

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      patronymic: "",
      email: "",
      password: "",
      address: "",
    },
  });

  // Handle login
  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        toast({
          title: t('errorOccurred'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t('loginSuccessful'),
          description: t('welcomeBack'),
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('errorOccurred'),
        description: t('loginFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            patronymic: values.patronymic,
          }
        }
      });
      
      if (authError) {
        toast({
          title: t('errorOccurred'),
          description: authError.message,
          variant: "destructive",
        });
        return;
      }
      
      // Create profile if auth was successful and user exists
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: `${values.lastName} ${values.firstName} ${values.patronymic || ''}`.trim(),
          address: values.address,
          type: 'resident', // Default user type
        });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: t('errorOccurred'),
            description: t('profileCreationFailed'),
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: t('registrationSuccessful'),
          description: t('accountCreated'),
        });
        
        // Redirect to home after successful registration
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('errorOccurred'),
        description: t('registrationFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t('welcomeToCityPortal')}
          </CardTitle>
          <CardDescription className="text-center">
            {authTab === 'login' ? t('loginToContinue') : t('createNewAccount')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('loggingIn') : t('login')}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* Register Tab */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('lastName')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('enterLastName')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('firstName')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('enterFirstName')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="patronymic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('patronymic')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enterPatronymic')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('address')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enterAddress')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('creating') : t('createAccount')}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="mt-2">
            {t('backToHome')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
