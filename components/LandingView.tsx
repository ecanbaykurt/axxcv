'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mic, Brain, FileText, ChevronRight, BarChart3, Camera, Globe, Languages } from 'lucide-react';

interface LandingViewProps {
  onStartEntry: () => void;
  onViewDashboard: () => void;
  hasEntries: boolean;
  useMultilingualMode: boolean;
  onToggleMultilingual: () => void;
}

export default function LandingView({ onStartEntry, onViewDashboard, hasEntries, useMultilingualMode, onToggleMultilingual }: LandingViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const features = [
    {
      icon: Mic,
      title: 'Voice Input',
      description: 'Record symptoms with your voice'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Intelligent symptom analysis'
    },
    {
      icon: Camera,
      title: 'Image Analysis',
      description: 'Upload images for visual analysis'
    },
    {
      icon: BarChart3,
      title: 'Pattern Recognition',
      description: 'AI-powered trend analysis'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: '60+ languages supported'
    },
    {
      icon: FileText,
      title: 'PDF Export',
      description: 'Share reports with doctors'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* App Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: isAnimating ? 1 : 0.9 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500/30 to-teal-500/20 blur-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Your Health Journal
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-white/80 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Reimagined
        </motion.h2>

        <motion.p
          className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          AI-powered symptom tracking with multi-language support, voice input, and intelligent analysis for global healthcare access
        </motion.p>
        
        {/* Multilingual Mode Toggle */}
        <motion.div
          className="mt-6 flex items-center justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <button
            onClick={onToggleMultilingual}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
              useMultilingualMode 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 shadow-lg' 
                : 'glass hover:bg-white/20'
            }`}
          >
            <Globe className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">
              {useMultilingualMode ? 'Global Mode' : 'Standard Mode'}
            </span>
          </button>
          
          {useMultilingualMode && (
            <div className="flex items-center space-x-2 text-green-400">
              <Languages className="w-4 h-4" />
              <span className="text-sm">60+ Languages</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isAnimating ? 1 : 0, scale: isAnimating ? 1 : 0.9 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <motion.button
          onClick={onStartEntry}
          className="group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg hover:shadow-green-500/25 transition-all duration-300">
            <span className="text-white font-semibold text-lg">Start New Entry</span>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        {hasEntries && (
          <motion.button
            onClick={onViewDashboard}
            className="group relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3 px-8 py-4 glass rounded-2xl hover:bg-white/20 transition-all duration-300">
              <BarChart3 className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-lg">View Dashboard</span>
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* Features */}
      <motion.div
        className="w-full max-w-6xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer Button */}
      <motion.button
        onClick={() => setShowDisclaimer(true)}
        className="text-white/60 hover:text-white/80 underline transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimating ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        Medical Disclaimer
      </motion.button>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDisclaimer(false)} />
          <motion.div
            className="relative glass rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Medical Disclaimer</h2>
            
            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Not Medical Advice</h3>
                <p>This application is designed to help you organize and track your health symptoms. It does not provide medical diagnosis, treatment, or professional medical advice.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Limitations</h3>
                <p>The AI analysis provided is for informational purposes only. It cannot replace professional medical evaluation and should not be used for self-diagnosis.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">When to Seek Help</h3>
                <p>If you experience severe, persistent, or worsening symptoms, seek immediate medical attention from a licensed healthcare professional.</p>
              </div>
              
              <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-300 mb-2">⚠️ Important Reminder</h3>
                <p>This app is a tool to help organize your health information. Always consult with qualified healthcare professionals for medical concerns, diagnosis, and treatment.</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              I Understand
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}