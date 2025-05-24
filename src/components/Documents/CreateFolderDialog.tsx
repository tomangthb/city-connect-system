
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface CreateFolderDialogProps {
  children: React.ReactNode;
}

const CreateFolderDialog = ({ children }: CreateFolderDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!folderName.trim()) {
      toast.error(language === 'en' ? 'Folder name is required' : 'Назва папки обов\'язкова');
      return;
    }

    setIsCreating(true);
    
    try {
      await addActivity({
        title: language === 'en' ? `Folder created: ${folderName}` : `Папку створено: ${folderName}`,
        description: `Created new folder: ${folderName}`,
        type: 'event',
        priority: 'low',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'Folder created successfully' : 'Папку успішно створено');
      setOpen(false);
      setFolderName('');
    } catch (error) {
      toast.error(language === 'en' ? 'Error creating folder' : 'Помилка створення папки');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Create New Folder' : 'Створити нову папку'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="folderName">{language === 'en' ? 'Folder Name' : 'Назва папки'}</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={language === 'en' ? 'Enter folder name' : 'Введіть назву папки'}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? (language === 'en' ? 'Creating...' : 'Створення...') : (language === 'en' ? 'Create' : 'Створити')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
