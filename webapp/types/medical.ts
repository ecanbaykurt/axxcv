// Medical Standardization and Multi-Language Support

// Supported Languages (60+ languages)
export enum SupportedLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  ITALIAN = 'it',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  CHINESE_SIMPLIFIED = 'zh-CN',
  CHINESE_TRADITIONAL = 'zh-TW',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  ARABIC = 'ar',
  HINDI = 'hi',
  TURKISH = 'tr',
  DUTCH = 'nl',
  SWEDISH = 'sv',
  NORWEGIAN = 'no',
  DANISH = 'da',
  FINNISH = 'fi',
  POLISH = 'pl',
  CZECH = 'cs',
  HUNGARIAN = 'hu',
  ROMANIAN = 'ro',
  BULGARIAN = 'bg',
  CROATIAN = 'hr',
  SERBIAN = 'sr',
  SLOVAK = 'sk',
  SLOVENIAN = 'sl',
  ESTONIAN = 'et',
  LATVIAN = 'lv',
  LITHUANIAN = 'lt',
  GREEK = 'el',
  HEBREW = 'he',
  PERSIAN = 'fa',
  URDU = 'ur',
  BENGALI = 'bn',
  TAMIL = 'ta',
  TELUGU = 'te',
  MARATHI = 'mr',
  GUJARATI = 'gu',
  KANNADA = 'kn',
  MALAYALAM = 'ml',
  PUNJABI = 'pa',
  THAI = 'th',
  VIETNAMESE = 'vi',
  INDONESIAN = 'id',
  MALAY = 'ms',
  FILIPINO = 'tl',
  SWAHILI = 'sw',
  YORUBA = 'yo',
  IGBO = 'ig',
  HAUSA = 'ha',
  AMHARIC = 'am',
  ZULU = 'zu',
  XHOSA = 'xh'
}

// Medical Category Standards (ICD-10 based)
export enum MedicalCategory {
  INFECTIOUS_DISEASES = 'infectious_diseases',
  NEOPLASMS = 'neoplasms',
  BLOOD_DISEASES = 'blood_diseases',
  ENDOCRINE_DISEASES = 'endocrine_diseases',
  MENTAL_DISORDERS = 'mental_disorders',
  NERVOUS_SYSTEM = 'nervous_system',
  EYE_DISEASES = 'eye_diseases',
  EAR_DISEASES = 'ear_diseases',
  CIRCULATORY_SYSTEM = 'circulatory_system',
  RESPIRATORY_SYSTEM = 'respiratory_system',
  DIGESTIVE_SYSTEM = 'digestive_system',
  SKIN_DISEASES = 'skin_diseases',
  MUSCULOSKELETAL = 'musculoskeletal',
  GENITOURINARY = 'genitourinary',
  PREGNANCY_CHILDBIRTH = 'pregnancy_childbirth',
  CONGENITAL_ANOMALIES = 'congenital_anomalies',
  INJURIES_POISONING = 'injuries_poisoning',
  EXTERNAL_CAUSES = 'external_causes',
  HEALTH_SERVICES = 'health_services',
  UNSPECIFIED = 'unspecified'
}

// Pain Scale Standardization
export enum PainScale {
  NONE = 0,
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  VERY_SEVERE = 4,
  EXCRUCIATING = 5
}

// Severity Levels (WHO Standard)
export enum SeverityLevel {
  MINIMAL = 'minimal',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical'
}

// Medical Terminology Translation
export interface MedicalTerm {
  code: string;
  category: MedicalCategory;
  translations: Record<SupportedLanguage, string>;
  synonyms: Record<SupportedLanguage, string[]>;
  icd10Code?: string;
  snomedCode?: string;
}

// Standardized Symptom Description
export interface StandardizedSymptom {
  id: string;
  originalText: string;
  originalLanguage: SupportedLanguage;
  standardizedDescription: string;
  category: MedicalCategory;
  severity: SeverityLevel;
  painScale: PainScale;
  duration: string;
  frequency: string;
  location?: string;
  associatedSymptoms: string[];
  redFlags: string[];
  doctorNotes: string;
  patientLanguage: string;
  doctorLanguage: string;
  translation: Record<SupportedLanguage, {
    description: string;
    patientNotes: string;
    doctorNotes: string;
  }>;
}

// Regional Medical Standards
export interface RegionalMedicalStandard {
  region: string;
  language: SupportedLanguage;
  medicalSystem: 'western' | 'traditional' | 'integrated';
  emergencyNumbers: string[];
  commonTerms: Record<string, string>;
  culturalConsiderations: string[];
  accessibilityNotes: string[];
}

// Translation Request
export interface TranslationRequest {
  text: string;
  fromLanguage: SupportedLanguage;
  toLanguage: SupportedLanguage;
  context: 'symptom_description' | 'medical_term' | 'patient_note' | 'doctor_note';
  medicalCategory?: MedicalCategory;
}

// Standardized Medical Response
export interface StandardizedMedicalResponse {
  patientSummary: string;
  doctorSummary: string;
  symptoms: StandardizedSymptom[];
  categories: MedicalCategory[];
  severity: SeverityLevel;
  urgency: 'routine' | 'urgent' | 'emergency';
  recommendations: string[];
  followUpRequired: boolean;
  specialistReferral?: string[];
  translations: Record<SupportedLanguage, {
    patientSummary: string;
    doctorSummary: string;
    recommendations: string[];
  }>;
  culturalNotes: string[];
  accessibilityNotes: string[];
}

// Language Detection
export interface LanguageDetection {
  detectedLanguage: SupportedLanguage;
  confidence: number;
  alternatives: Array<{
    language: SupportedLanguage;
    confidence: number;
  }>;
}

// Medical Translation Service
export interface MedicalTranslationService {
  detectLanguage(text: string): Promise<LanguageDetection>;
  translateMedicalText(request: TranslationRequest): Promise<string>;
  standardizeSymptom(symptom: string, language: SupportedLanguage): Promise<StandardizedSymptom>;
  generateDoctorSummary(symptoms: StandardizedSymptom[], doctorLanguage: SupportedLanguage): Promise<string>;
  generatePatientSummary(symptoms: StandardizedSymptom[], patientLanguage: SupportedLanguage): Promise<string>;
}
