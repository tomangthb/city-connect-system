
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import RegistrationForm from '@/components/Auth/RegistrationForm';

const Auth = () => {
  const { language, setLanguage, t } = useLanguage();
  const { session, signUp, signIn, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  const onLoginSubmit = async (data: { email: string; password: string }) => {
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

  const onRegisterSubmit = async (data: any) => {
    const { error } = await signUp(data.email, data.password, {
      firstName: data.firstName,
      lastName: data.lastName,
      patronymic: data.patronymic,
      userType: 'employee'
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

            <TabsContent value="login">
              <LoginForm onSubmit={onLoginSubmit} />
            </TabsContent>

            <TabsContent value="register">
              <RegistrationForm onSubmit={onRegisterSubmit} userType="employee" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
