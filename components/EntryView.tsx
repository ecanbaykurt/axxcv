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
  Camera
} from 'lucide-react';
import { 
  HealthEntry, 
  AIHealthResponse, 
  RecordingState, 
  HealthImage, 
  ImageAnalysis 
} from '../types/health';

interface EntryViewProps {
  onNavigateBack: () => void;
  onAnalyzeComplete: (response: AIHealthResponse) => void;
  onAddEntry: (entry: HealthEntry) => void;
}

export default function EntryView({ onNavigateBack, onAnalyzeComplete, onAddEntry }: EntryViewProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Medical tracking states
  const [painScale, setPainScale] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [symptomLocation, setSymptomLocation] = useState('');
  
  // Image upload states
  const [uploadedImages, setUploadedImages] = useState<HealthImage[]>([]);
  const [isAnalyzingImages, setIsAnalyzingImages] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<'skin' | 'general' | 'wound'>('general');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const isInputValid = inputText.trim().length > 0 || uploadedImages.length > 0;

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

  const analyzeImage = async (imageData: string): Promise<ImageAnalysis | null> => {
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: imageData.split(',')[1], // Remove data:image/... prefix
          analysisType: selectedAnalysisType
        })
      });

      if (!response.ok) {
        throw new Error('Image analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing image:', error);
      return null;
    }
  };

  const analyzeAllImages = async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzingImages(true);
    const updatedImages = [...uploadedImages];

    for (let i = 0; i < updatedImages.length; i++) {
      if (!updatedImages[i].analysis) {
        const analysis = await analyzeImage(updatedImages[i].url);
        if (analysis) {
          updatedImages[i].analysis = analysis;
        }
      }
    }

    setUploadedImages(updatedImages);
    setIsAnalyzingImages(false);
  };

  const analyzeSymptoms = async (text: string, isVoiceInput: boolean = false) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const aiResponse = await response.json();
      
      // Create health entry with images
      const entry: HealthEntry = {
        id: `entry_${Date.now()}`,
        date: new Date(),
        inputText: text,
        isVoiceInput,
        aiResponse,
        createdAt: new Date(),
        images: uploadedImages.length > 0 ? uploadedImages : undefined
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
      await analyzeSymptoms(text, true);
      
    } catch (error) {
      console.error('Error processing recording:', error);
      setError('Failed to process voice recording');
      setRecordingState(RecordingState.ERROR);
    }
  };

  const handleAnalyze = () => {
    if (isInputValid && !isProcessing) {
      analyzeSymptoms(inputText, false);
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

        <h1 className="text-xl font-semibold text-white">New Health Entry</h1>

        <div className="w-12" />
      </motion.div>

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
            Tell us about your symptoms so we can help organize your health information
          </p>
        </motion.div>

        {/* Pain Scale */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <label className="block text-lg font-semibold text-white mb-3">
            Pain Level (0-5 Scale)
          </label>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-sm">No Pain</span>
              <span className="text-white/70 text-sm">Severe Pain</span>
            </div>
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setPainScale(level)}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    painScale === level
                      ? 'bg-red-500 border-red-400 text-white'
                      : 'border-white/30 text-white/70 hover:border-white/50'
                  }`}
                  disabled={isProcessing}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="text-white/70 text-sm">
                {painScale === 0 && 'No pain'}
                {painScale === 1 && 'Mild pain'}
                {painScale === 2 && 'Moderate pain'}
                {painScale === 3 && 'Moderate-severe pain'}
                {painScale === 4 && 'Severe pain'}
                {painScale === 5 && 'Unbearable pain'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <label className="block text-lg font-semibold text-white mb-3">
            How are you feeling? (Optional)
          </label>
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-center space-x-4">
              {[
                { emoji: '😢', value: 1, label: 'Very Poor' },
                { emoji: '😕', value: 2, label: 'Poor' },
                { emoji: '😐', value: 3, label: 'Neutral' },
                { emoji: '🙂', value: 4, label: 'Good' },
                { emoji: '😊', value: 5, label: 'Very Good' }
              ].map((moodOption) => (
                <button
                  key={moodOption.value}
                  onClick={() => setMood(moodOption.value)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200 ${
                    mood === moodOption.value
                      ? 'bg-blue-500/30 border-2 border-blue-400'
                      : 'hover:bg-white/10 border-2 border-transparent'
                  }`}
                  disabled={isProcessing}
                >
                  <span className="text-2xl">{moodOption.emoji}</span>
                  <span className="text-white/70 text-xs">{moodOption.label}</span>
                </button>
              ))}
            </div>
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
              placeholder="Describe your symptoms in detail. Include information about severity, duration, location, and any other relevant details..."
              className="w-full h-32 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
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
                {uploadedImages.some(img => !img.analysis) && (
                  <button
                    onClick={analyzeAllImages}
                    disabled={isAnalyzingImages}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isAnalyzingImages ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3 h-3" />
                        <span>Analyze Images</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="glass rounded-lg p-4">
                    <div className="flex space-x-3">
                      <img
                        src={image.url}
                        alt={image.description}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-white text-sm font-medium">
                            {image.description}
                          </span>
                          <button
                            onClick={() => removeImage(image.id)}
                            className="p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        
                        {image.analysis && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Camera className="w-3 h-3 text-blue-400" />
                              <span className="text-xs text-blue-400">
                                Analysis Complete
                              </span>
                            </div>
                            <div className="text-xs text-white/70">
                              <p><strong>Confidence:</strong> {(image.analysis.confidence * 100).toFixed(0)}%</p>
                              <p><strong>Severity:</strong> {image.analysis.severity}</p>
                              {image.analysis.detectedConditions.length > 0 && (
                                <p><strong>Detected:</strong> {image.analysis.detectedConditions.join(', ')}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
              <span>Analyze Symptoms</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
