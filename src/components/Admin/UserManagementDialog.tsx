
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { Search, UserPlus, Edit, Trash2, Shield } from 'lucide-react';

interface UserManagementDialogProps {
  children: React.ReactNode;
}

const UserManagementDialog = ({ children }: UserManagementDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const users = [
    { id: 1, name: 'Іван Петренко', email: 'ivan@example.com', role: 'employee', status: 'active', lastLogin: '2024-01-20' },
    { id: 2, name: 'Марія Коваленко', email: 'maria@example.com', role: 'resident', status: 'active', lastLogin: '2024-01-19' },
    { id: 3, name: 'Олексій Сидоренко', email: 'alex@example.com', role: 'employee', status: 'inactive', lastLogin: '2024-01-15' },
    { id: 4, name: 'Анна Мельник', email: 'anna@example.com', role: 'resident', status: 'active', lastLogin: '2024-01-18' }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      await addActivity({
        title: language === 'en' ? 'User creation initiated' : 'Ініційовано створення користувача',
        description: 'Started user creation process',
        type: 'event',
        priority: 'medium',
        status: 'pending'
      });

      toast.success(language === 'en' ? 'User creation form opened' : 'Відкрито форму створення користувача');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleEditUser = async (user: any) => {
    try {
      await addActivity({
        title: language === 'en' ? `User edit initiated: ${user.name}` : `Ініційовано редагування користувача: ${user.name}`,
        description: `Started editing user: ${user.email}`,
        type: 'event',
        priority: 'medium',
        status: 'pending'
      });

      toast.success(language === 'en' ? 'User edit form opened' : 'Відкрито форму редагування користувача');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'User Management' : 'Управління користувачами'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'en' ? 'Search users...' : 'Пошук користувачів...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add User' : 'Додати користувача'}
            </Button>
          </div>

          {/* Users List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={user.role === 'employee' ? 'default' : 'secondary'}>
                          {user.role === 'employee' ? (language === 'en' ? 'Employee' : 'Працівник') : (language === 'en' ? 'Resident' : 'Мешканець')}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status === 'active' ? (language === 'en' ? 'Active' : 'Активний') : (language === 'en' ? 'Inactive' : 'Неактивний')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {language === 'en' ? 'Last login:' : 'Останній вхід:'} {user.lastLogin}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
