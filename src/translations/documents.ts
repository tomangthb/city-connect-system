
import { TranslationRecord } from './types';

export const documentsTranslations: Record<string, TranslationRecord> = {
  documentManagement: {
    en: 'Document Management',
    uk: 'Управління документами'
  },
  documentUploaded: {
    en: 'Document uploaded successfully',
    uk: 'Документ успішно завантажено'
  },
  errorUploadingDocument: {
    en: 'Error uploading document',
    uk: 'Помилка завантаження документа'
  },
  documentDownloaded: {
    en: 'Document downloaded',
    uk: 'Документ завантажено'
  },
  errorDownloadingDocument: {
    en: 'Error downloading document',
    uk: 'Помилка завантаження документа'
  },
  confirmDeleteDocument: {
    en: 'Are you sure you want to delete this document?',
    uk: 'Ви впевнені, що хочете видалити цей документ?'
  },
  documentDeleted: {
    en: 'Document deleted successfully',
    uk: 'Документ успішно видалено'
  },
  errorDeletingDocument: {
    en: 'Error deleting document',
    uk: 'Помилка видалення документа'
  }
};
