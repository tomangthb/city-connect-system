
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '@/utils/activityUtils';

interface AddServiceDialogProps {
  children: React.ReactNode;
  onServiceAdded?: () => void;
}

const AddServiceDialog = ({ children, onServiceAdded }: AddServiceDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_uk: '',
    category: '',
    category_uk: '',
    subcategory: '',
    subcategory_uk: '',
    description: '',
    description_uk: '',
    target_audience: '',
    target_audience_uk: '',
    processing_time: '',
    cost: '',
    cost_uk: '',
    providing_authority: '',
    providing_authority_uk: '',
    legal_basis: '',
    legal_basis_uk: '',
    status: 'Available',
    required_documents: [] as string[],
    required_documents_uk: [] as string[],
    steps_to_obtain: [] as string[],
    steps_to_obtain_uk: [] as string[],
    life_situations: [] as string[],
    life_situations_uk: [] as string[],
    contact_info: {
      phone: '',
      email: '',
      address: ''
    }
  });

  const [documentInput, setDocumentInput] = useState('');
  const [documentInputUk, setDocumentInputUk] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [stepInputUk, setStepInputUk] = useState('');

  const lifeSituationOptions = [
    { en: 'Birth of a child', uk: 'Народження дитини' },
    { en: 'Moving to new address', uk: 'Зміна місця проживання' },
    { en: 'Marriage', uk: 'Одруження' },
    { en: 'Divorce', uk: 'Розлучення' },
    { en: 'Starting business', uk: 'Відкриття бізнесу' },
    { en: 'Retirement', uk: 'Вихід на пенсію' },
    { en: 'Unemployment', uk: 'Безробіття' },
    { en: 'Property purchase', uk: 'Купівля нерухомості' },
  ];

  const addDocument = () => {
    if (documentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        required_documents: [...prev.required_documents, documentInput.trim()]
      }));
      setDocumentInput('');
    }
  };

  const addDocumentUk = () => {
    if (documentInputUk.trim()) {
      setFormData(prev => ({
        ...prev,
        required_documents_uk: [...prev.required_documents_uk, documentInputUk.trim()]
      }));
      setDocumentInputUk('');
    }
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setFormData(prev => ({
        ...prev,
        steps_to_obtain: [...prev.steps_to_obtain, stepInput.trim()]
      }));
      setStepInput('');
    }
  };

  const addStepUk = () => {
    if (stepInputUk.trim()) {
      setFormData(prev => ({
        ...prev,
        steps_to_obtain_uk: [...prev.steps_to_obtain_uk, stepInputUk.trim()]
      }));
      setStepInputUk('');
    }
  };

  const handleLifeSituationChange = (situation: { en: string; uk: string }, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        life_situations: [...prev.life_situations, situation.en],
        life_situations_uk: [...prev.life_situations_uk, situation.uk]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        life_situations: prev.life_situations.filter(s => s !== situation.en),
        life_situations_uk: prev.life_situations_uk.filter(s => s !== situation.uk)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error(t('fillRequiredFields') || 'Please fill required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .insert([{
          ...formData,
          required_documents: formData.required_documents.length > 0 ? formData.required_documents : null,
          required_documents_uk: formData.required_documents_uk.length > 0 ? formData.required_documents_uk : null,
          steps_to_obtain: formData.steps_to_obtain.length > 0 ? formData.steps_to_obtain : null,
          steps_to_obtain_uk: formData.steps_to_obtain_uk.length > 0 ? formData.steps_to_obtain_uk : null,
          life_situations: formData.life_situations.length > 0 ? formData.life_situations : null,
          life_situations_uk: formData.life_situations_uk.length > 0 ? formData.life_situations_uk : null,
          contact_info: Object.values(formData.contact_info).some(v => v.trim()) ? formData.contact_info : null
        }]);

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `New service added: ${formData.name}` : `Нова послуга додана: ${formData.name_uk || formData.name}`,
        description: `Service "${formData.name}" has been added to the system`,
        type: 'service',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(t('serviceAdded') || 'Service added successfully');
      setOpen(false);
      // Reset form
      setFormData({
        name: '',
        name_uk: '',
        category: '',
        category_uk: '',
        subcategory: '',
        subcategory_uk: '',
        description: '',
        description_uk: '',
        target_audience: '',
        target_audience_uk: '',
        processing_time: '',
        cost: '',
        cost_uk: '',
        providing_authority: '',
        providing_authority_uk: '',
        legal_basis: '',
        legal_basis_uk: '',
        status: 'Available',
        required_documents: [],
        required_documents_uk: [],
        steps_to_obtain: [],
        steps_to_obtain_uk: [],
        life_situations: [],
        life_situations_uk: [],
        contact_info: { phone: '', email: '', address: '' }
      });
      onServiceAdded?.();
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error(t('errorAddingService') || 'Error adding service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addNewService') || 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('serviceName')} (EN) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Service name in English"
                required
              />
            </div>
            <div>
              <Label htmlFor="name_uk">{t('serviceName')} (UK)</Label>
              <Input
                id="name_uk"
                value={formData.name_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, name_uk: e.target.value }))}
                placeholder="Назва послуги українською"
              />
            </div>
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t('category')} (EN) *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Category in English"
                required
              />
            </div>
            <div>
              <Label htmlFor="category_uk">{t('category')} (UK)</Label>
              <Input
                id="category_uk"
                value={formData.category_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, category_uk: e.target.value }))}
                placeholder="Категорія українською"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subcategory">Subcategory (EN)</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                placeholder="Subcategory in English"
              />
            </div>
            <div>
              <Label htmlFor="subcategory_uk">Subcategory (UK)</Label>
              <Input
                id="subcategory_uk"
                value={formData.subcategory_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory_uk: e.target.value }))}
                placeholder="Підкатегорія українською"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{t('description')} (EN)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Service description in English"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="description_uk">{t('description')} (UK)</Label>
              <Textarea
                id="description_uk"
                value={formData.description_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, description_uk: e.target.value }))}
                placeholder="Опис послуги українською"
                rows={3}
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_audience">Target Audience (EN)</Label>
              <Textarea
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                placeholder="Who can receive this service"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="target_audience_uk">Target Audience (UK)</Label>
              <Textarea
                id="target_audience_uk"
                value={formData.target_audience_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, target_audience_uk: e.target.value }))}
                placeholder="Хто може отримати цю послугу"
                rows={2}
              />
            </div>
          </div>

          {/* Required Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Required Documents (EN)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  placeholder="Add required document"
                />
                <Button type="button" onClick={addDocument}>Add</Button>
              </div>
              <ul className="text-sm space-y-1">
                {formData.required_documents.map((doc, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    {doc}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        required_documents: prev.required_documents.filter((_, i) => i !== index)
                      }))}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Required Documents (UK)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={documentInputUk}
                  onChange={(e) => setDocumentInputUk(e.target.value)}
                  placeholder="Додати необхідний документ"
                />
                <Button type="button" onClick={addDocumentUk}>Додати</Button>
              </div>
              <ul className="text-sm space-y-1">
                {formData.required_documents_uk.map((doc, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    {doc}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        required_documents_uk: prev.required_documents_uk.filter((_, i) => i !== index)
                      }))}
                    >
                      Видалити
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps to Obtain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Steps to Obtain (EN)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  placeholder="Add step"
                />
                <Button type="button" onClick={addStep}>Add</Button>
              </div>
              <ol className="text-sm space-y-1">
                {formData.steps_to_obtain.map((step, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    {index + 1}. {step}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        steps_to_obtain: prev.steps_to_obtain.filter((_, i) => i !== index)
                      }))}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <Label>Steps to Obtain (UK)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={stepInputUk}
                  onChange={(e) => setStepInputUk(e.target.value)}
                  placeholder="Додати крок"
                />
                <Button type="button" onClick={addStepUk}>Додати</Button>
              </div>
              <ol className="text-sm space-y-1">
                {formData.steps_to_obtain_uk.map((step, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    {index + 1}. {step}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        steps_to_obtain_uk: prev.steps_to_obtain_uk.filter((_, i) => i !== index)
                      }))}
                    >
                      Видалити
                    </Button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Life Situations */}
          <div>
            <Label>Life Situations</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {lifeSituationOptions.map((situation) => (
                <div key={situation.en} className="flex items-center space-x-2">
                  <Checkbox
                    id={situation.en}
                    checked={formData.life_situations.includes(situation.en)}
                    onCheckedChange={(checked) => handleLifeSituationChange(situation, checked as boolean)}
                  />
                  <Label htmlFor={situation.en} className="text-sm">
                    {language === 'en' ? situation.en : situation.uk}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="processing_time">Processing Time</Label>
              <Input
                id="processing_time"
                value={formData.processing_time}
                onChange={(e) => setFormData(prev => ({ ...prev, processing_time: e.target.value }))}
                placeholder="e.g., 5-7 business days"
              />
            </div>
            <div>
              <Label htmlFor="cost">Cost (EN)</Label>
              <Input
                id="cost"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="e.g., Free or 500 UAH"
              />
            </div>
            <div>
              <Label htmlFor="cost_uk">Cost (UK)</Label>
              <Input
                id="cost_uk"
                value={formData.cost_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_uk: e.target.value }))}
                placeholder="напр., Безкоштовно або 500 грн"
              />
            </div>
          </div>

          {/* Providing Authority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="providing_authority">Providing Authority (EN)</Label>
              <Input
                id="providing_authority"
                value={formData.providing_authority}
                onChange={(e) => setFormData(prev => ({ ...prev, providing_authority: e.target.value }))}
                placeholder="Authority that provides the service"
              />
            </div>
            <div>
              <Label htmlFor="providing_authority_uk">Providing Authority (UK)</Label>
              <Input
                id="providing_authority_uk"
                value={formData.providing_authority_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, providing_authority_uk: e.target.value }))}
                placeholder="Орган, що надає послугу"
              />
            </div>
          </div>

          {/* Legal Basis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="legal_basis">Legal Basis (EN)</Label>
              <Textarea
                id="legal_basis"
                value={formData.legal_basis}
                onChange={(e) => setFormData(prev => ({ ...prev, legal_basis: e.target.value }))}
                placeholder="Legal documents and regulations"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="legal_basis_uk">Legal Basis (UK)</Label>
              <Textarea
                id="legal_basis_uk"
                value={formData.legal_basis_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, legal_basis_uk: e.target.value }))}
                placeholder="Правові документи та регламенти"
                rows={2}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <Label>Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <Input
                placeholder="Phone"
                value={formData.contact_info.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_info: { ...prev.contact_info, phone: e.target.value }
                }))}
              />
              <Input
                placeholder="Email"
                value={formData.contact_info.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_info: { ...prev.contact_info, email: e.target.value }
                }))}
              />
              <Input
                placeholder="Address"
                value={formData.contact_info.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_info: { ...prev.contact_info, address: e.target.value }
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">{t('status')}</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">{t('available') || 'Available'}</SelectItem>
                <SelectItem value="Unavailable">{t('unavailable') || 'Unavailable'}</SelectItem>
                <SelectItem value="Maintenance">{t('maintenance') || 'Maintenance'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (t('adding') || 'Adding...') : (t('addService') || 'Add Service')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
