// Medical and Health-related type definitions

// Language Support
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

// Medical Categories
export enum MedicalCategory {
  GENERAL = 'general',
  CARDIOLOGY = 'cardiology',
  NEUROLOGY = 'neurology',
  DERMATOLOGY = 'dermatology',
  ORTHOPEDICS = 'orthopedics',
  GASTROENTEROLOGY = 'gastroenterology',
  RESPIRATORY = 'respiratory',
  ENDOCRINOLOGY = 'endocrinology',
  ONCOLOGY = 'oncology',
  PSYCHIATRY = 'psychiatry',
  PEDIATRICS = 'pediatrics',
  GYNECOLOGY = 'gynecology',
  UROLOGY = 'urology',
  OPHTHALMOLOGY = 'ophthalmology',
  OTOLARYNGOLOGY = 'otolaryngology',
  EMERGENCY = 'emergency',
  INTENSIVE_CARE = 'intensive_care',
  ANESTHESIOLOGY = 'anesthesiology',
  RADIOLOGY = 'radiology',
  PATHOLOGY = 'pathology'
}

// Severity Levels
export enum SeverityLevel {
  MINIMAL = 'minimal',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical'
}

// Pain Scale
export enum PainScale {
  NONE = 0,
  MILD = 1,
  DISCOMFORTING = 2,
  TROUBLESOME = 3,
  DISTRESSING = 4,
  INTENSE = 5,
  EXCRUCIATING = 6,
  UNBEARABLE = 7,
  TORTUROUS = 8,
  UNIMAGINABLE = 9,
  UNSPEAKABLE = 10
}

// Standardized Medical Response
export interface StandardizedMedicalResponse {
  id: string;
  patientLanguage: SupportedLanguage;
  doctorLanguage: SupportedLanguage;
  region: string;
  summary: string;
  patientSummary: string;
  doctorSummary: string;
  severityLevel: SeverityLevel;
  triageGuidance: string;
  symptoms: StandardizedSymptom[];
  redFlags: RedFlag[];
  recommendations: string[];
  followUpInstructions: string[];
  emergencyInstructions: string[];
  culturalConsiderations: string[];
  translationNotes: string[];
  timestamp: Date;
}

// Standardized Symptom
export interface StandardizedSymptom {
  id: string;
  name: string;
  description: string;
  severity: SeverityLevel;
  duration: string;
  frequency: string;
  onset: string;
  triggers: string[];
  alleviatingFactors: string[];
  associatedSymptoms: string[];
  icd10Codes: string[];
  snomedCodes: string[];
  category: MedicalCategory;
  bodySystem: string;
  anatomicalLocation: string;
  laterality: 'left' | 'right' | 'bilateral' | 'central' | 'unknown';
  quality: string;
  radiation: string;
  timing: string;
  context: string;
  impact: string;
  patientLanguage: SupportedLanguage;
  doctorLanguage: SupportedLanguage;
  translations: {
    [key in SupportedLanguage]?: string;
  };
}

// Translation Request
export interface TranslationRequest {
  text: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  context: 'medical' | 'patient' | 'doctor' | 'general';
  preserveMedicalTerms: boolean;
  culturalAdaptation: boolean;
}

// Red Flag
export interface RedFlag {
  id: string;
  description: string;
  severity: SeverityLevel;
  urgency: 'immediate' | 'within_24h' | 'within_week' | 'routine';
  recommendation: string;
  culturalConsiderations: string[];
  translations: {
    [key in SupportedLanguage]?: string;
  };
}

export interface MedicalCondition {
  id: string;
  name: string;
  icd10Code: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  category: string;
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
  severity: number; // 1-10 scale
  duration: string;
  frequency: string;
  associatedConditions: string[];
}

export interface Treatment {
  id: string;
  name: string;
  type: 'medication' | 'therapy' | 'lifestyle' | 'surgery';
  description: string;
  effectiveness: number; // 1-10 scale
  sideEffects: string[];
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: MedicalCondition;
  diagnosisDate: Date;
  treatment: Treatment[];
  status: 'active' | 'resolved' | 'chronic' | 'monitoring';
  notes: string;
}

export interface VitalSigns {
  id: string;
  timestamp: Date;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  sideEffects: string[];
  interactions: string[];
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  notes: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface InsuranceInfo {
  id: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  effectiveDate: Date;
  expirationDate?: Date;
  copay: number;
  deductible: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  type: 'consultation' | 'lab' | 'imaging' | 'procedure' | 'emergency';
  provider: string;
  diagnosis: string[];
  treatment: string[];
  notes: string;
  attachments: string[];
}

export interface LabResult {
  id: string;
  testName: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: Date;
  lab: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  provider: string;
  date: Date;
  time: string;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string;
  location: string;
}

export interface Prescription {
  id: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: Date;
  refills: number;
  pharmacy: string;
}

export interface Immunization {
  id: string;
  vaccine: string;
  date: Date;
  provider: string;
  lotNumber: string;
  expirationDate: Date;
  nextDueDate?: Date;
  notes: string;
}

export interface FamilyHistory {
  id: string;
  relationship: string;
  condition: string;
  ageOfOnset?: number;
  notes: string;
}

export interface SocialHistory {
  id: string;
  smoking: {
    status: 'never' | 'former' | 'current';
    packYears?: number;
    quitDate?: Date;
  };
  alcohol: {
    status: 'never' | 'former' | 'current';
    frequency?: string;
    quantity?: string;
  };
  drugs: {
    status: 'never' | 'former' | 'current';
    substances?: string[];
  };
  exercise: {
    frequency: string;
    type: string;
    duration: string;
  };
  diet: {
    type: string;
    restrictions: string[];
    allergies: string[];
  };
}

export interface MentalHealth {
  id: string;
  mood: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  stress: number; // 1-10 scale
  sleep: {
    hours: number;
    quality: number; // 1-10 scale
    disturbances: string[];
  };
  socialSupport: number; // 1-10 scale
  copingStrategies: string[];
  therapy: {
    status: 'none' | 'current' | 'former';
    provider?: string;
    frequency?: string;
  };
  medications: string[];
  notes: string;
}

export interface PreventiveCare {
  id: string;
  type: 'screening' | 'vaccination' | 'checkup' | 'dental' | 'vision';
  name: string;
  lastDate?: Date;
  nextDue: Date;
  status: 'up-to-date' | 'overdue' | 'not-applicable';
  provider: string;
  notes: string;
}

export interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'mental' | 'nutrition' | 'fitness' | 'medical';
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  progress: number; // 0-100
  milestones: {
    description: string;
    targetDate: Date;
    completed: boolean;
  }[];
  notes: string;
}

export interface HealthReminder {
  id: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'exercise' | 'diet' | 'checkup';
  date: Date;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'completed' | 'snoozed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

export interface HealthMetrics {
  id: string;
  date: Date;
  weight: number;
  bmi: number;
  bodyFat?: number;
  muscleMass?: number;
  hydration: number; // 1-10 scale
  energy: number; // 1-10 scale
  mood: number; // 1-10 scale
  sleep: {
    hours: number;
    quality: number; // 1-10 scale
  };
  exercise: {
    minutes: number;
    type: string;
    intensity: number; // 1-10 scale
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number; // in liters
  };
  symptoms: {
    name: string;
    severity: number; // 1-10 scale
  }[];
  medications: {
    name: string;
    taken: boolean;
    sideEffects: string[];
  }[];
  notes: string;
}
