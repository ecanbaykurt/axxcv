// Health Entry Models
export interface HealthEntry {
  id: string;
  date: Date;
  inputText: string;
  isVoiceInput: boolean;
  aiResponse: AIHealthResponse;
  createdAt: Date;
  // Enhanced fields for new features
  images?: HealthImage[];
  location?: LocationData;
  tags?: string[];
  mood?: number; // 1-10 scale
  weather?: WeatherData;
}

// AI Response Models
export interface AIHealthResponse {
  summary: string;
  timeline: SymptomTimeline[];
  redFlags: RedFlag[];
  advice: string;
}

export interface SymptomTimeline {
  id: string;
  symptom: string;
  severity: number; // 1-10 scale
  duration: string;
  frequency: string;
}

export interface RedFlag {
  id: string;
  description: string;
  severity: RedFlagSeverity;
  recommendation: string;
}

export enum RedFlagSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Image Analysis Models
export interface HealthImage {
  id: string;
  url: string;
  description?: string;
  analysis?: ImageAnalysis;
  uploadedAt: Date;
}

export interface ImageAnalysis {
  detectedConditions: string[];
  confidence: number;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  notes: string;
}

// Pattern Recognition Models
export interface SymptomPattern {
  id: string;
  patternType: 'trending' | 'cyclical' | 'correlated' | 'seasonal';
  symptoms: string[];
  description: string;
  confidence: number;
  severity: number;
  timeframe: string;
  insights: string[];
  recommendations: string[];
}

export interface PatternAnalysis {
  patterns: SymptomPattern[];
  trends: TrendData[];
  correlations: CorrelationData[];
  predictions: PredictionData[];
  summary: string;
}

export interface TrendData {
  id?: string;
  symptom: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number;
  timeframe: string;
  significance: 'low' | 'medium' | 'high';
}

export interface CorrelationData {
  id?: string;
  symptom1: string;
  symptom2: string;
  correlation: number; // -1 to 1
  significance: number;
  timeframe: string;
  description: string;
}

export interface PredictionData {
  id?: string;
  symptom: string;
  prediction: 'likely' | 'possible' | 'unlikely';
  timeframe: string;
  confidence: number;
  factors: string[];
}

// Dashboard Models
export interface DashboardData {
  recentEntries: HealthEntry[];
  patternAnalysis: PatternAnalysis;
  healthScore: HealthScore;
  insights: DashboardInsight[];
  charts: ChartData[];
}

export interface HealthScore {
  overall: number; // 1-100
  trend: 'improving' | 'stable' | 'declining';
  factors: HealthFactor[];
  lastUpdated: Date;
}

export interface HealthFactor {
  name: string;
  score: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardInsight {
  id: string;
  type: 'pattern' | 'trend' | 'correlation' | 'prediction';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  actionable: boolean;
  recommendation?: string;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'heatmap';
  title: string;
  data: any;
  timeframe: string;
}

// Location and Weather Models
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
  description: string;
  timestamp: Date;
}

// API Request Models
export interface WhisperRequest {
  audioData: Blob;
  model: string;
}

export interface GPTRequest {
  model: string;
  messages: GPTMessage[];
  response_format: ResponseFormat;
  temperature: number;
}

export interface GPTMessage {
  role: string;
  content: string;
}

export interface ResponseFormat {
  type: string;
}

// API Response Models
export interface WhisperResponse {
  text: string;
}

export interface GPTResponse {
  choices: GPTChoice[];
}

export interface GPTChoice {
  message: GPTMessage;
}

// App State Models
export enum AppState {
  LANDING = 'landing',
  ENTRY = 'entry',
  RESULTS = 'results',
  EXPORT = 'export',
  DASHBOARD = 'dashboard',
  PATTERNS = 'patterns'
}

export enum RecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Animation Constants
export const ANIMATION_CONSTANTS = {
  CARD_SLIDE_IN: 0.6,
  CARD_FADE_IN: 0.8,
  RED_FLAG_PULSE: 1.2,
  BUTTON_PRESS: 0.2,
} as const;

// Error Types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface AudioError {
  message: string;
  code?: string;
}

// API Request Models for new features
export interface ImageAnalysisRequest {
  imageData: string; // base64 encoded
  analysisType: 'skin' | 'general' | 'wound';
}

export interface PatternAnalysisRequest {
  entries: HealthEntry[];
  timeframe: string;
  analysisTypes: ('trends' | 'correlations' | 'patterns')[];
}
