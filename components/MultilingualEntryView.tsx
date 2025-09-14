'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Mic, 
  MicOff, 
  Brain, 
  Loader2, 
  Upload, 
  X, 
  Globe,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle,
  Languages
} from 'lucide-react';
import { 
  HealthEntry, 
  AIHealthResponse, 
  RecordingState, 
  HealthImage, 
  ImageAnalysis 
} from '../types/health';
import { 
  SupportedLanguage, 
  StandardizedMedicalResponse,
  MedicalCategory,
  SeverityLevel 
} from '../types/medical';

interface MultilingualEntryViewProps {
  onNavigateBack: () => void;
  onAnalyzeComplete: (response: AIHealthResponse) => void;
  onAddEntry: (entry: HealthEntry) => void;
}

export default function MultilingualEntryView({ 
  onNavigateBack, 
  onAnalyzeComplete, 
  onAddEntry 
}: MultilingualEntryViewProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Multi-language states
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>(SupportedLanguage.ENGLISH);
  const [patientLanguage, setPatientLanguage] = useState<SupportedLanguage>(SupportedLanguage.ENGLISH);
  const [doctorLanguage, setDoctorLanguage] = useState<SupportedLanguage>(SupportedLanguage.ENGLISH);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  
  // Image upload states
  const [uploadedImages, setUploadedImages] = useState<HealthImage[]>([]);
  const [isAnalyzingImages, setIsAnalyzingImages] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<'skin' | 'general' | 'wound'>('general');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Language options with native names
  const languageOptions = [
    { code: SupportedLanguage.ENGLISH, name: 'English', native: 'English' },
    { code: SupportedLanguage.SPANISH, name: 'Spanish', native: 'Español' },
    { code: SupportedLanguage.FRENCH, name: 'French', native: 'Français' },
    { code: SupportedLanguage.GERMAN, name: 'German', native: 'Deutsch' },
    { code: SupportedLanguage.ITALIAN, name: 'Italian', native: 'Italiano' },
    { code: SupportedLanguage.PORTUGUESE, name: 'Portuguese', native: 'Português' },
    { code: SupportedLanguage.RUSSIAN, name: 'Russian', native: 'Русский' },
    { code: SupportedLanguage.CHINESE_SIMPLIFIED, name: 'Chinese (Simplified)', native: '简体中文' },
    { code: SupportedLanguage.CHINESE_TRADITIONAL, name: 'Chinese (Traditional)', native: '繁體中文' },
    { code: SupportedLanguage.JAPANESE, name: 'Japanese', native: '日本語' },
    { code: SupportedLanguage.KOREAN, name: 'Korean', native: '한국어' },
    { code: SupportedLanguage.ARABIC, name: 'Arabic', native: 'العربية' },
    { code: SupportedLanguage.HINDI, name: 'Hindi', native: 'हिन्दी' },
    { code: SupportedLanguage.TURKISH, name: 'Turkish', native: 'Türkçe' },
    { code: SupportedLanguage.DUTCH, name: 'Dutch', native: 'Nederlands' },
    { code: SupportedLanguage.SWEDISH, name: 'Swedish', native: 'Svenska' },
    { code: SupportedLanguage.NORWEGIAN, name: 'Norwegian', native: 'Norsk' },
    { code: SupportedLanguage.DANISH, name: 'Danish', native: 'Dansk' },
    { code: SupportedLanguage.FINNISH, name: 'Finnish', native: 'Suomi' },
    { code: SupportedLanguage.POLISH, name: 'Polish', native: 'Polski' },
    { code: SupportedLanguage.CZECH, name: 'Czech', native: 'Čeština' },
    { code: SupportedLanguage.HUNGARIAN, name: 'Hungarian', native: 'Magyar' },
    { code: SupportedLanguage.ROMANIAN, name: 'Romanian', native: 'Română' },
    { code: SupportedLanguage.BULGARIAN, name: 'Bulgarian', native: 'Български' },
    { code: SupportedLanguage.CROATIAN, name: 'Croatian', native: 'Hrvatski' },
    { code: SupportedLanguage.SERBIAN, name: 'Serbian', native: 'Српски' },
    { code: SupportedLanguage.SLOVAK, name: 'Slovak', native: 'Slovenčina' },
    { code: SupportedLanguage.SLOVENIAN, name: 'Slovenian', native: 'Slovenščina' },
    { code: SupportedLanguage.ESTONIAN, name: 'Estonian', native: 'Eesti' },
    { code: SupportedLanguage.LATVIAN, name: 'Latvian', native: 'Latviešu' },
    { code: SupportedLanguage.LITHUANIAN, name: 'Lithuanian', native: 'Lietuvių' },
    { code: SupportedLanguage.GREEK, name: 'Greek', native: 'Ελληνικά' },
    { code: SupportedLanguage.HEBREW, name: 'Hebrew', native: 'עברית' },
    { code: SupportedLanguage.PERSIAN, name: 'Persian', native: 'فارسی' },
    { code: SupportedLanguage.URDU, name: 'Urdu', native: 'اردو' },
    { code: SupportedLanguage.BENGALI, name: 'Bengali', native: 'বাংলা' },
    { code: SupportedLanguage.TAMIL, name: 'Tamil', native: 'தமிழ்' },
    { code: SupportedLanguage.TELUGU, name: 'Telugu', native: 'తెలుగు' },
    { code: SupportedLanguage.MARATHI, name: 'Marathi', native: 'मराठी' },
    { code: SupportedLanguage.GUJARATI, name: 'Gujarati', native: 'ગુજરાતી' },
    { code: SupportedLanguage.KANNADA, name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: SupportedLanguage.MALAYALAM, name: 'Malayalam', native: 'മലയാളം' },
    { code: SupportedLanguage.PUNJABI, name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: SupportedLanguage.THAI, name: 'Thai', native: 'ไทย' },
    { code: SupportedLanguage.VIETNAMESE, name: 'Vietnamese', native: 'Tiếng Việt' },
    { code: SupportedLanguage.INDONESIAN, name: 'Indonesian', native: 'Bahasa Indonesia' },
    { code: SupportedLanguage.MALAY, name: 'Malay', native: 'Bahasa Melayu' },
    { code: SupportedLanguage.FILIPINO, name: 'Filipino', native: 'Filipino' },
    { code: SupportedLanguage.SWAHILI, name: 'Swahili', native: 'Kiswahili' },
    { code: SupportedLanguage.YORUBA, name: 'Yoruba', native: 'Yorùbá' },
    { code: SupportedLanguage.IGBO, name: 'Igbo', native: 'Igbo' },
    { code: SupportedLanguage.HAUSA, name: 'Hausa', native: 'Hausa' },
    { code: SupportedLanguage.AMHARIC, name: 'Amharic', native: 'አማርኛ' },
    { code: SupportedLanguage.ZULU, name: 'Zulu', native: 'IsiZulu' },
    { code: SupportedLanguage.XHOSA, name: 'Xhosa', native: 'IsiXhosa' }
  ];

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const isInputValid = inputText.trim().length > 0 || uploadedImages.length > 0;

  // Language detection
  const detectLanguage = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      setIsDetectingLanguage(true);
      const response = await fetch('/api/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const detection = await response.json();
        setDetectedLanguage(detection.detectedLanguage);
        setPatientLanguage(detection.detectedLanguage);
      }
    } catch (error) {
      console.error('Language detection failed:', error);
    } finally {
      setIsDetectingLanguage(false);
    }
  };

  // Debounced language detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.length > 10) {
        detectLanguage(inputText);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Multi-language analysis
  const analyzeSymptomsMultilingual = async (text: string, isVoiceInput: boolean = false) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-multilingual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          patientLanguage: patientLanguage,
          doctorLanguage: doctorLanguage,
          region: 'global'
        })
      });

      if (!response.ok) {
        throw new Error('Multi-language analysis failed');
      }

      const medicalResponse = await response.json();
      
      // Convert to standard AIHealthResponse for compatibility
      const aiResponse: AIHealthResponse = {
        summary: medicalResponse.patientSummary || 'Symptom analysis completed',
        timeline: medicalResponse.symptoms?.map((symptom: any, index: number) => ({
          id: symptom.id || `symptom_${index}`,
          symptom: symptom.standardizedDescription || symptom.originalText,
          severity: getSeverityNumber(symptom.severity),
          duration: symptom.duration || 'Unknown',
          frequency: symptom.frequency || 'Unknown'
        })) || [],
        redFlags: medicalResponse.symptoms?.flatMap((symptom: any) => 
          (symptom.redFlags || []).map((flag: string) => ({
            id: `redflag_${symptom.id}_${flag}`,
            description: flag,
            severity: mapSeverityLevel(symptom.severity),
            recommendation: medicalResponse.recommendations?.[0] || 'Consult healthcare provider'
          }))
        ) || [],
        advice: medicalResponse.recommendations?.join(' ') || 'Please consult with a healthcare provider for proper medical evaluation.'
      };
      
      // Create health entry with multi-language data
      const entry: HealthEntry = {
        id: `entry_${Date.now()}`,
        date: new Date(),
        inputText: text,
        isVoiceInput,
        aiResponse,
        createdAt: new Date(),
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        tags: [
          `lang:${patientLanguage}`,
          `doctor-lang:${doctorLanguage}`,
          `multilingual:true`
        ]
      };

      onAddEntry(entry);
      onAnalyzeComplete(aiResponse);
      
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsProcessing(false);
      setRecordingState(RecordingState.IDLE);
      setRecordingDuration(0);
    }
  };

  const getSeverityNumber = (severity: SeverityLevel): number => {
    switch (severity) {
      case SeverityLevel.MINIMAL: return 1;
      case SeverityLevel.MILD: return 3;
      case SeverityLevel.MODERATE: return 5;
      case SeverityLevel.SEVERE: return 7;
      case SeverityLevel.CRITICAL: return 10;
      default: return 5;
    }
  };

  const mapSeverityLevel = (severity: SeverityLevel) => {
    switch (severity) {
      case SeverityLevel.MINIMAL:
      case SeverityLevel.MILD:
        return 'low' as any;
      case SeverityLevel.MODERATE:
        return 'medium' as any;
      case SeverityLevel.SEVERE:
      case SeverityLevel.CRITICAL:
        return 'high' as any;
      default:
        return 'medium' as any;
    }
  };

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            
            const newImage: HealthImage = {
              id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              url: imageData,
              uploadedAt: new Date(),
              description: file.name
            };
            
            setUploadedImages(prev => [...prev, newImage]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState(RecordingState.RECORDING);
      setRecordingDuration(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone. Please check permissions.');
      setRecordingState(RecordingState.ERROR);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === RecordingState.RECORDING) {
      mediaRecorderRef.current.stop();
      setRecordingState(RecordingState.PROCESSING);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const { text } = await response.json();
      await analyzeSymptomsMultilingual(text, true);
      
    } catch (error) {
      console.error('Error processing recording:', error);
      setError('Failed to process voice recording');
      setRecordingState(RecordingState.ERROR);
    }
  };

  const handleAnalyze = () => {
    if (isInputValid && !isProcessing) {
      analyzeSymptomsMultilingual(inputText, false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingButtonColor = () => {
    switch (recordingState) {
      case RecordingState.IDLE:
        return 'from-blue-500 to-purple-500';
      case RecordingState.RECORDING:
        return 'from-red-500 to-orange-500';
      case RecordingState.PROCESSING:
        return 'from-yellow-500 to-orange-500';
      case RecordingState.COMPLETED:
        return 'from-green-500 to-teal-500';
      case RecordingState.ERROR:
        return 'from-red-500 to-pink-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getRecordingIcon = () => {
    switch (recordingState) {
      case RecordingState.IDLE:
        return <Mic className="w-8 h-8" />;
      case RecordingState.RECORDING:
        return <MicOff className="w-8 h-8" />;
      case RecordingState.PROCESSING:
        return <Loader2 className="w-8 h-8 animate-spin" />;
      case RecordingState.COMPLETED:
        return <Brain className="w-8 h-8" />;
      case RecordingState.ERROR:
        return <Mic className="w-8 h-8" />;
      default:
        return <Mic className="w-8 h-8" />;
    }
  };

  const getLanguageName = (code: SupportedLanguage) => {
    return languageOptions.find(lang => lang.code === code)?.native || code;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : -20 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={onNavigateBack}
          className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-xl font-semibold text-white">Global Health Entry</h1>

        <button
          onClick={() => setShowLanguageSettings(!showLanguageSettings)}
          className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
        >
          <Globe className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      {/* Language Settings */}
      {showLanguageSettings && (
        <motion.div
          className="mx-6 mb-6 glass rounded-2xl p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Languages className="w-5 h-5" />
            <span>Language Settings</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Patient Language</label>
              <select
                value={patientLanguage}
                onChange={(e) => setPatientLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-3 glass rounded-lg text-white bg-transparent border border-white/20 focus:border-blue-400 focus:outline-none"
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Doctor Language</label>
              <select
                value={doctorLanguage}
                onChange={(e) => setDoctorLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-3 glass rounded-lg text-white bg-transparent border border-white/20 focus:border-blue-400 focus:outline-none"
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Detected Language Indicator */}
          {isDetectingLanguage && (
            <div className="mt-4 flex items-center space-x-2 text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Detecting language...</span>
            </div>
          )}
          
          {detectedLanguage && !isDetectingLanguage && (
            <div className="mt-4 flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">
                Detected: {getLanguageName(detectedLanguage)}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {/* Instructions */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Describe your symptoms
          </h2>
          <p className="text-white/70">
            Write in your native language - we'll translate for doctors worldwide
          </p>
          <div className="mt-2 flex items-center justify-center space-x-4 text-sm text-white/60">
            <span>Patient: {getLanguageName(patientLanguage)}</span>
            <ArrowRightLeft className="w-4 h-4" />
            <span>Doctor: {getLanguageName(doctorLanguage)}</span>
          </div>
        </motion.div>

        {/* Text Input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <label className="block text-lg font-semibold text-white mb-3">
            Describe Your Symptoms
          </label>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your symptoms in your native language. Include details about severity, duration, location, and any other relevant information..."
              className="w-full h-32 p-4 glass rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50"
              disabled={isProcessing}
            />
            <div className="absolute bottom-3 right-3 text-sm text-white/50">
              {inputText.length} characters
            </div>
          </div>
        </motion.div>

        {/* Voice Input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <label className="block text-lg font-semibold text-white mb-3">
            Or record a voice note
          </label>
          
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={recordingState === RecordingState.RECORDING ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full bg-gradient-to-r ${getRecordingButtonColor()} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50`}
            >
              {getRecordingIcon()}
            </button>

            <div className="text-center">
              <p className="text-white font-medium">
                {recordingState === RecordingState.IDLE && 'Tap to Record'}
                {recordingState === RecordingState.RECORDING && 'Recording...'}
                {recordingState === RecordingState.PROCESSING && 'Processing...'}
                {recordingState === RecordingState.COMPLETED && 'Completed'}
                {recordingState === RecordingState.ERROR && 'Error - Tap to Retry'}
              </p>
              
              {recordingState === RecordingState.RECORDING && (
                <p className="text-white/70 text-sm mt-1">
                  {formatDuration(recordingDuration)}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Image Upload Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <label className="block text-lg font-semibold text-white mb-3">
            Upload Images (Optional)
          </label>
          
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Analysis Type:</label>
            <select
              value={selectedAnalysisType}
              onChange={(e) => setSelectedAnalysisType(e.target.value as any)}
              className="w-full p-3 glass rounded-lg text-white bg-transparent border border-white/20 focus:border-blue-400 focus:outline-none"
              disabled={isProcessing}
            >
              <option value="general">General Health Analysis</option>
              <option value="skin">Skin Condition Analysis</option>
              <option value="wound">Wound Assessment</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-3 glass rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>Choose Images</span>
            </button>
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  {uploadedImages.length} image(s) uploaded
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative glass rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.description}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={!isInputValid || isProcessing}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: isInputValid && !isProcessing ? 1.02 : 1 }}
          whileTap={{ scale: isInputValid && !isProcessing ? 0.98 : 1 }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Analyze Symptoms (Multi-Language)</span>
            </>
          )}
        </motion.button>

        {/* Global Health Note */}
        <motion.div
          className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-300 font-semibold mb-1">Global Health Access</h3>
              <p className="text-blue-200/80 text-sm">
                Your symptoms will be analyzed and translated into standardized medical terminology 
                that doctors worldwide can understand, regardless of language barriers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}