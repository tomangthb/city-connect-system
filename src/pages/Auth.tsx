import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Building, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// Registration form schema - includes user type selection
const registrationSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  patronymic: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  userType: z.enum(['employee', 'resident'], { message: "Please select user type" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Auth = () => {
  const { language, setLanguage, t } = useLanguage();
  const { session, signUp, signIn, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Registration form with user type
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      patronymic: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'resident',
    },
  });

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  // Handle login submission
  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    }
  };

  // Handle registration submission with user type
  const onRegisterSubmit = async (data: z.infer<typeof registrationSchema>) => {
    const { error } = await signUp(data.email, data.password, {
      firstName: data.firstName,
      lastName: data.lastName,
      patronymic: data.patronymic,
      userType: data.userType
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      setAuthMode('login');
    }
  };

  // If already authenticated, redirect to home
  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={toggleLanguage} className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          {language === 'en' ? t('ukrainian') : t('english')}
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{authMode === 'login' ? t('login') || 'Login' : t('register') || 'Register'}</CardTitle>
          <CardDescription>
            {authMode === 'login' 
              ? t('loginDescription') || 'Access your account' 
              : t('registerDescription') || 'Create a new account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('login') || 'Login'}</TabsTrigger>
              <TabsTrigger value="register">{t('register') || 'Register'}</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email') || 'Email'}</FormLabel>
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
                        <FormLabel>{t('password') || 'Password'}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">{t('login') || 'Login'}</Button>
                </form>
              </Form>
            </TabsContent>

            {/* Registration Form */}
            <TabsContent value="register">
              <Form {...registrationForm}>
                <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  {/* User Type Selection */}
                  <FormField
                    control={registrationForm.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Account Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50">
                              <RadioGroupItem value="resident" id="resident" />
                              <label htmlFor="resident" className="flex items-center space-x-2 cursor-pointer flex-1">
                                <Users className="h-5 w-5 text-green-600" />
                                <div>
                                  <div className="font-medium">Resident</div>
                                  <div className="text-sm text-gray-500">Access city services and submit requests</div>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50">
                              <RadioGroupItem value="employee" id="employee" />
                              <label htmlFor="employee" className="flex items-center space-x-2 cursor-pointer flex-1">
                                <Building className="h-5 w-5 text-blue-600" />
                                <div>
                                  <div className="font-medium">Employee</div>
                                  <div className="text-sm text-gray-500">Administrative access and management tools</div>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registrationForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('firstName') || 'First name'}</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registrationForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('lastName') || 'Last name'}</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registrationForm.control}
                    name="patronymic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('patronymic') || 'Patronymic'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Patronymic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email') || 'Email'}</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password') || 'Password'}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('confirmPassword') || 'Confirm Password'}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">{t('register') || 'Register'}</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
