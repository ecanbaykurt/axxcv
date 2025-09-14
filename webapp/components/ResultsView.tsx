'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Download,
  Share2,
  CheckCircle,
  Brain
} from 'lucide-react';
import { AIHealthResponse, RedFlagSeverity } from '../types/health';

interface ResultsViewProps {
  onNavigateBack: () => void;
  onExport: () => void;
  onNewEntry: () => void;
  aiResponse: AIHealthResponse;
}

export default function ResultsView({ onNavigateBack, onExport, onNewEntry, aiResponse }: ResultsViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const getSeverityColor = (severity: RedFlagSeverity) => {
    switch (severity) {
      case RedFlagSeverity.LOW:
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case RedFlagSeverity.MEDIUM:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case RedFlagSeverity.HIGH:
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case RedFlagSeverity.CRITICAL:
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getSeverityIcon = (severity: RedFlagSeverity) => {
    switch (severity) {
      case RedFlagSeverity.LOW:
        return <CheckCircle className="w-4 h-4" />;
      case RedFlagSeverity.MEDIUM:
      case RedFlagSeverity.HIGH:
      case RedFlagSeverity.CRITICAL:
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTimelineSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-400 bg-red-500/20';
    if (severity >= 6) return 'text-orange-400 bg-orange-500/20';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
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

        <h1 className="text-xl font-semibold text-white">Analysis Results</h1>

        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
          >
            <Download className="w-6 h-6 text-white" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 space-y-6">
        {/* Summary */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">AI Analysis Summary</h2>
          </div>
          <p className="text-white/80 leading-relaxed">{aiResponse.summary}</p>
        </motion.div>

        {/* Timeline */}
        {aiResponse.timeline && aiResponse.timeline.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Symptom Timeline</h2>
              </div>
              {aiResponse.timeline.length > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentTimelineIndex(Math.max(0, currentTimelineIndex - 1))}
                    disabled={currentTimelineIndex === 0}
                    className="p-2 glass rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white/70 text-sm">
                    {currentTimelineIndex + 1} of {aiResponse.timeline.length}
                  </span>
                  <button
                    onClick={() => setCurrentTimelineIndex(Math.min(aiResponse.timeline.length - 1, currentTimelineIndex + 1))}
                    disabled={currentTimelineIndex === aiResponse.timeline.length - 1}
                    className="p-2 glass rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {aiResponse.timeline.slice(currentTimelineIndex, currentTimelineIndex + 1).map((item) => (
                <motion.div
                  key={item.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{item.symptom}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTimelineSeverityColor(item.severity)}`}>
                      Severity: {item.severity}/10
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm"><strong>Duration:</strong> {item.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm"><strong>Frequency:</strong> {item.frequency}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Red Flags */}
        {aiResponse.redFlags && aiResponse.redFlags.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Important Considerations</h2>
            </div>
            
            <div className="space-y-4">
              {aiResponse.redFlags.map((redFlag) => (
                <motion.div
                  key={redFlag.id}
                  className={`p-4 rounded-xl border ${getSeverityColor(redFlag.severity)}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(redFlag.severity)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{redFlag.description}</h3>
                      <p className="text-sm opacity-80">{redFlag.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Advice */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Recommendations</h2>
          </div>
          <p className="text-white/80 leading-relaxed">{aiResponse.advice}</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <button
            onClick={onNewEntry}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <Brain className="w-5 h-5" />
            <span>New Entry</span>
          </button>
          
          <button
            onClick={onExport}
            className="flex-1 py-4 glass rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="glass rounded-2xl p-6 bg-orange-500/10 border border-orange-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-orange-300 font-semibold mb-2">Important Medical Disclaimer</h3>
              <p className="text-orange-200/80 text-sm leading-relaxed">
                This AI analysis is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. 
                Always consult with a qualified healthcare professional for proper medical evaluation and care.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
