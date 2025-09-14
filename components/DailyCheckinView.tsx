'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar, 
  Heart, 
  CheckCircle,
  TrendingUp,
  Bell
} from 'lucide-react';
import { HealthEntry, AIHealthResponse } from '../types/health';

interface DailyCheckinViewProps {
  onNavigateBack: () => void;
  onAnalyzeComplete: (response: AIHealthResponse) => void;
  onAddEntry: (entry: HealthEntry) => void;
}

const MOOD_OPTIONS = [
  { emoji: '😢', value: 1, label: 'Very Poor', color: 'text-red-400' },
  { emoji: '😕', value: 2, label: 'Poor', color: 'text-orange-400' },
  { emoji: '😐', value: 3, label: 'Neutral', color: 'text-yellow-400' },
  { emoji: '🙂', value: 4, label: 'Good', color: 'text-blue-400' },
  { emoji: '😊', value: 5, label: 'Very Good', color: 'text-green-400' }
];

export default function DailyCheckinView({ onNavigateBack, onAnalyzeComplete, onAddEntry }: DailyCheckinViewProps) {
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [sleep, setSleep] = useState<number>(7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const saveCheckin = async () => {
    if (mood === null) return;

    setIsProcessing(true);

    try {
      const checkinText = `Daily check-in: Mood ${mood}/5, Energy ${energy}/10, Sleep ${sleep} hours`;
      
      const checkinResponse: AIHealthResponse = {
        summary: `Daily check-in completed. Overall mood: ${MOOD_OPTIONS[mood - 1].label}`,
        patient_summary: `You're feeling ${MOOD_OPTIONS[mood - 1].label.toLowerCase()} today. Energy level: ${energy}/10, Sleep: ${sleep} hours.`,
        doctor_summary: `Patient daily check-in: Mood ${mood}/5, Energy ${energy}/10, Sleep ${sleep} hours`,
        severity_level: mood <= 2 ? 'attention' : 'routine',
        timeline: [{
          id: `checkin_${Date.now()}`,
          symptom: 'Daily wellness check',
          severity: mood <= 2 ? 7 : 3,
          duration: '1 day',
          frequency: 'Daily'
        }],
        redFlags: mood <= 2 ? [{
          id: `mood_alert_${Date.now()}`,
          description: 'Low mood detected',
          severity: 'medium' as any,
          recommendation: 'Consider speaking with a healthcare provider about your mood',
          urgency: 'within_week' as any
        }] : [],
        advice: mood <= 2 
          ? 'It\'s important to take care of your mental health. Consider reaching out to friends, family, or a healthcare provider.'
          : 'Great job maintaining your wellness! Continue with your healthy habits.',
        recommendations: [
          'Continue daily check-ins',
          'Maintain healthy sleep schedule',
          'Stay hydrated and active'
        ],
        triage_guidance: mood <= 2 ? 'attention' : 'routine'
      };

      const entry: HealthEntry = {
        id: `checkin_${Date.now()}`,
        date: new Date(),
        inputText: checkinText,
        isVoiceInput: false,
        aiResponse: checkinResponse,
        createdAt: new Date(),
        tags: ['daily-checkin', 'wellness'],
        mood: mood
      };

      onAddEntry(entry);
      onAnalyzeComplete(checkinResponse);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onNavigateBack();
      }, 2000);

    } catch (error) {
      console.error('Error saving check-in:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Check-in Complete!</h2>
          <p className="text-white/70">Your wellness data has been saved</p>
        </div>
      </motion.div>
    );
  }

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

        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Daily Check-in</h1>
          <p className="text-white/60 text-sm">{new Date().toLocaleDateString()}</p>
        </div>

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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <Heart className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            How are you feeling today?
          </h2>
          <p className="text-white/70">
            Quick wellness check to track your daily health
          </p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Overall Mood</h3>
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-center space-x-4">
              {MOOD_OPTIONS.map((moodOption) => (
                <button
                  key={moodOption.value}
                  onClick={() => setMood(moodOption.value)}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 ${
                    mood === moodOption.value
                      ? 'bg-blue-500/30 border-2 border-blue-400'
                      : 'hover:bg-white/10 border-2 border-transparent'
                  }`}
                >
                  <span className="text-3xl">{moodOption.emoji}</span>
                  <span className="text-white/70 text-sm">{moodOption.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Energy Level */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Energy Level</h3>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-sm">Low Energy</span>
              <span className="text-white/70 text-sm">High Energy</span>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setEnergy(level)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    energy === level
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'border-white/30 text-white/70 hover:border-white/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="text-white/70 text-sm">
                {energy <= 3 && 'Low energy'}
                {energy >= 4 && energy <= 7 && 'Moderate energy'}
                {energy >= 8 && 'High energy'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Sleep Hours */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Sleep Last Night</h3>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-sm">Poor Sleep</span>
              <span className="text-white/70 text-sm">Great Sleep</span>
            </div>
            <div className="flex space-x-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setSleep(hours)}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    sleep === hours
                      ? 'bg-purple-500 border-purple-400 text-white'
                      : 'border-white/30 text-white/70 hover:border-white/50'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="text-white/70 text-sm">
                {sleep < 6 && 'Insufficient sleep'}
                {sleep >= 6 && sleep <= 8 && 'Good sleep'}
                {sleep > 8 && 'Long sleep'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={saveCheckin}
          disabled={mood === null || isProcessing}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: mood !== null && !isProcessing ? 1.02 : 1 }}
          whileTap={{ scale: mood !== null && !isProcessing ? 0.98 : 1 }}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Complete Check-in</span>
            </>
          )}
        </motion.button>

        {/* Wellness Tips */}
        <motion.div
          className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-green-300 font-semibold mb-1">Wellness Tip</h3>
              <p className="text-green-200/80 text-sm">
                Daily check-ins help track patterns in your health and mood. 
                Consistent tracking can reveal important insights about your wellbeing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
