
import { Language, Translations } from './types';
import { authTranslations } from './auth';
import { navigationTranslations } from './navigation';
import { userTranslations } from './user';
import { notificationTranslations } from './notifications';
import { dashboardTranslations } from './dashboard';
import { appealsTranslations } from './appeals';
import { servicesTranslations } from './services';
import { messageTranslations } from './messages';
import { documentsTranslations } from './documents';

export type { Language };

export const translations: Translations = {
  ...authTranslations,
  ...navigationTranslations,
  ...userTranslations,
  ...notificationTranslations,
  ...dashboardTranslations,
  ...appealsTranslations,
  ...servicesTranslations,
  ...messageTranslations,
  ...documentsTranslations
};
