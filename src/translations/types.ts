
export type Language = 'en' | 'uk';

export type TranslationRecord = Record<Language, string>;
export type Translations = Record<string, TranslationRecord>;
