'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Clock, 
  Zap, 
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import { HealthEntry, AIHealthResponse } from '../types/health';

interface QuickEntryViewProps {
  onNavigateBack: () => void;
  onAnalyzeComplete: (response: AIHealthResponse) => void;
  onAddEntry: (entry: HealthEntry) => void;
}

// Common symptoms for quick selection
const COMMON_SYMPTOMS = [
  { id: 'headache', name: 'Headache', emoji: '🤕', severity: 5 },
  { id: 'fever', name: 'Fever', emoji: '🌡️', severity: 6 },
  { id: 'cough', name: 'Cough', emoji: '😷', severity: 4 },
  { id: 'fatigue', name: 'Fatigue', emoji: '😴', severity: 5 },
  { id: 'nausea', name: 'Nausea', emoji: '🤢', severity: 6 },
  { id: 'pain', name: 'Pain', emoji: '😣', severity: 7 },
  { id: 'dizziness', name: 'Dizziness', emoji: '😵', severity: 6 },
  { id: 'breathing', name: 'Shortness of breath', emoji: '😮‍💨', severity: 8 },
  { id: 'rash', name: 'Rash', emoji: '🔴', severity: 5 },
  { id: 'stomach', name: 'Stomach ache', emoji: '🤰', severity: 5 }
];

export default function QuickEntryView({ onNavigateBack, onAnalyzeComplete, onAddEntry }: QuickEntryViewProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Array<{id: string, name: string, emoji: string, severity: number}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const toggleSymptom = (symptom: {id: string, name: string, emoji: string, severity: number}) => {
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (exists) {
        return prev.filter(s => s.id !== symptom.id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const adjustSeverity = (symptomId: string, newSeverity: number) => {
    setSelectedSymptoms(prev => 
      prev.map(s => s.id === symptomId ? { ...s, severity: newSeverity } : s)
    );
  };

  const quickSave = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsProcessing(true);

    try {
      // Create a simple text description from selected symptoms
      const symptomText = selectedSymptoms.map(s => 
        `${s.name} (severity: ${s.severity}/10)`
      ).join(', ');

      // Create a basic AI response for quick entries
      const quickResponse: AIHealthResponse = {
        summary: `Quick log: ${symptomText}`,
        patient_summary: `You logged: ${symptomText}`,
        doctor_summary: `Patient reported: ${symptomText}`,
        severity_level: selectedSymptoms.some(s => s.severity >= 7) ? 'attention' : 'routine',
        timeline: selectedSymptoms.map(symptom => ({
          id: `quick_${symptom.id}_${Date.now()}`,
          symptom: symptom.name,
          severity: symptom.severity,
          duration: 'Unknown',
          frequency: 'Unknown'
        })),
        redFlags: selectedSymptoms.filter(s => s.severity >= 8).map(symptom => ({
          id: `redflag_${symptom.id}_${Date.now()}`,
          description: `High severity ${symptom.name}`,
          severity: 'high' as any,
          recommendation: 'Consider consulting a healthcare provider',
          urgency: 'within_24h' as any
        })),
        advice: selectedSymptoms.length > 0 
          ? 'Continue monitoring your symptoms. If they worsen or persist, consider seeking medical attention.'
          : 'No symptoms logged.',
        recommendations: [
          'Continue monitoring symptoms',
          'Seek medical attention if symptoms worsen',
          'Rest and stay hydrated'
        ],
        triage_guidance: selectedSymptoms.some(s => s.severity >= 7) ? 'attention' : 'routine'
      };

      // Create health entry
      const entry: HealthEntry = {
        id: `quick_entry_${Date.now()}`,
        date: new Date(),
        inputText: symptomText,
        isVoiceInput: false,
        aiResponse: quickResponse,
        createdAt: new Date(),
        tags: ['quick-entry', 'daily-log']
      };

      onAddEntry(entry);
      onAnalyzeComplete(quickResponse);
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onNavigateBack();
      }, 2000);

    } catch (error) {
      console.error('Error saving quick entry:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-400 bg-red-500/20';
    if (severity >= 6) return 'text-orange-400 bg-orange-500/20';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
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
          <h2 className="text-2xl font-bold text-white mb-2">Saved!</h2>
          <p className="text-white/70">Your symptoms have been logged</p>
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
          <h1 className="text-xl font-semibold text-white">Quick Log</h1>
          <p className="text-white/60 text-sm">30 seconds to log symptoms</p>
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
            <Zap className="w-6 h-6 text-yellow-400" />
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            How are you feeling?
          </h2>
          <p className="text-white/70">
            Tap symptoms you're experiencing. We'll handle the rest.
          </p>
        </motion.div>

        {/* Symptom Selection */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.find(s => s.id === symptom.id);
              return (
                <motion.button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-500/30 border-blue-400'
                      : 'glass border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{symptom.emoji}</div>
                    <div className="text-white font-medium text-sm">{symptom.name}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Symptoms with Severity */}
        {selectedSymptoms.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Adjust Severity</h3>
            <div className="space-y-3">
              {selectedSymptoms.map((symptom) => (
                <div key={symptom.id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{symptom.emoji}</span>
                      <span className="text-white font-medium">{symptom.name}</span>
                    </div>
                    <button
                      onClick={() => toggleSymptom(symptom)}
                      className="p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-white/70 text-sm">Severity:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <button
                          key={level}
                          onClick={() => adjustSeverity(symptom.id, level)}
                          className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                            symptom.severity === level
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                      {symptom.severity}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <motion.button
          onClick={quickSave}
          disabled={selectedSymptoms.length === 0 || isProcessing}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: selectedSymptoms.length > 0 && !isProcessing ? 1.02 : 1 }}
          whileTap={{ scale: selectedSymptoms.length > 0 && !isProcessing ? 0.98 : 1 }}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Save & Done ({selectedSymptoms.length} symptoms)</span>
            </>
          )}
        </motion.button>

        {/* Quick Tips */}
        <motion.div
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-300 font-semibold mb-1">Quick Log Tips</h3>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>• Tap symptoms you're experiencing right now</li>
                <li>• Adjust severity if needed (1 = mild, 10 = severe)</li>
                <li>• You can always add more details later</li>
                <li>• This takes less than 30 seconds!</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
