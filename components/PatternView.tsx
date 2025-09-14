'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  TrendingUp, 
  BarChart3, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Clock
} from 'lucide-react';
import { HealthEntry, PatternAnalysis, SymptomPattern, TrendData, CorrelationData, PredictionData } from '../types/health';

interface PatternViewProps {
  onNavigateBack: () => void;
  healthEntries: HealthEntry[];
}

export default function PatternView({ onNavigateBack, healthEntries }: PatternViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [patternAnalysis, setPatternAnalysis] = useState<PatternAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const analyzePatterns = async () => {
    if (healthEntries.length === 0) {
      setError('No health entries available for pattern analysis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: healthEntries,
          timeframe: '30 days',
          analysisTypes: ['trends', 'correlations', 'patterns']
        })
      });

      if (!response.ok) {
        throw new Error('Pattern analysis failed');
      }

      const analysis = await response.json();
      setPatternAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      setError('Failed to analyze patterns. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increasing':
        return <ArrowUp className="w-4 h-4 text-red-400" />;
      case 'decreasing':
        return <ArrowDown className="w-4 h-4 text-green-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'increasing':
        return 'text-red-400 bg-red-500/20';
      case 'decreasing':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high':
        return 'text-red-400 bg-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'likely':
        return 'text-red-400 bg-red-500/20';
      case 'possible':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-green-400 bg-green-500/20';
    }
  };

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'text-blue-400 bg-blue-500/20';
      case 'cyclical':
        return 'text-purple-400 bg-purple-500/20';
      case 'correlated':
        return 'text-green-400 bg-green-500/20';
      case 'seasonal':
        return 'text-orange-400 bg-orange-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
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

        <h1 className="text-xl font-semibold text-white">Pattern Analysis</h1>

        <button
          onClick={analyzePatterns}
          disabled={isLoading || healthEntries.length === 0}
          className="p-3 glass rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <Brain className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 space-y-6">
        {/* Analysis Button */}
        {!patternAnalysis && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Pattern Recognition</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Analyze your health entries to identify patterns, trends, and correlations in your symptoms.
            </p>
            
            {healthEntries.length === 0 ? (
              <div className="p-6 glass rounded-2xl max-w-md mx-auto">
                <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <p className="text-white/70">No health entries found. Create some entries first to analyze patterns.</p>
              </div>
            ) : (
              <button
                onClick={analyzePatterns}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                {isLoading ? (
                  <>
                    <Brain className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>Analyze Patterns</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Brain className="w-16 h-16 text-white animate-pulse mx-auto mb-6" />
            <p className="text-white/70">Analyzing your health patterns...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="p-6 bg-red-500/20 border border-red-500/30 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Pattern Analysis Results */}
        {patternAnalysis && (
          <>
            {/* Summary */}
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Analysis Summary</h2>
              </div>
              <p className="text-white/80 leading-relaxed">{patternAnalysis.summary}</p>
            </motion.div>

            {/* Patterns */}
            {patternAnalysis.patterns && patternAnalysis.patterns.length > 0 && (
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">Identified Patterns</h2>
                </div>
                
                <div className="space-y-4">
                  {patternAnalysis.patterns.map((pattern) => (
                    <div key={pattern.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{pattern.description}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPatternTypeColor(pattern.patternType)}`}>
                          {pattern.patternType}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center space-x-2 text-white/70">
                          <Target className="w-4 h-4" />
                          <span className="text-sm"><strong>Symptoms:</strong> {pattern.symptoms.join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <Activity className="w-4 h-4" />
                          <span className="text-sm"><strong>Severity:</strong> {pattern.severity}/10</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm"><strong>Timeframe:</strong> {pattern.timeframe}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm"><strong>Confidence:</strong> {(pattern.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      
                      {pattern.insights && pattern.insights.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-white mb-2">Insights:</h4>
                          <ul className="text-sm text-white/70 space-y-1">
                            {pattern.insights.map((insight, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {pattern.recommendations && pattern.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Recommendations:</h4>
                          <ul className="text-sm text-white/70 space-y-1">
                            {pattern.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trends */}
            {patternAnalysis.trends && patternAnalysis.trends.length > 0 && (
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Symptom Trends</h2>
                </div>
                
                <div className="space-y-4">
                  {patternAnalysis.trends.map((trend) => (
                    <div key={trend.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{trend.symptom}</h3>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(trend.direction)}
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(trend.direction)}`}>
                            {trend.direction}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2 text-white/70">
                          <Activity className="w-4 h-4" />
                          <span className="text-sm"><strong>Rate:</strong> {trend.rate}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm"><strong>Timeframe:</strong> {trend.timeframe}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <Target className="w-4 h-4" />
                          <span className={`text-sm px-2 py-1 rounded ${getSignificanceColor(trend.significance)}`}>
                            {trend.significance} significance
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Correlations */}
            {patternAnalysis.correlations && patternAnalysis.correlations.length > 0 && (
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Symptom Correlations</h2>
                </div>
                
                <div className="space-y-4">
                  {patternAnalysis.correlations.map((correlation) => (
                    <div key={correlation.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {correlation.symptom1} ↔ {correlation.symptom2}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          Math.abs(correlation.correlation) > 0.7 ? 'text-red-400 bg-red-500/20' :
                          Math.abs(correlation.correlation) > 0.4 ? 'text-yellow-400 bg-yellow-500/20' :
                          'text-blue-400 bg-blue-500/20'
                        }`}>
                          {correlation.correlation > 0 ? '+' : ''}{correlation.correlation.toFixed(2)}
                        </div>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3">{correlation.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 text-white/70">
                          <Target className="w-4 h-4" />
                          <span className="text-sm"><strong>Significance:</strong> {correlation.significance.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm"><strong>Timeframe:</strong> {correlation.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Predictions */}
            {patternAnalysis.predictions && patternAnalysis.predictions.length > 0 && (
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">Future Predictions</h2>
                </div>
                
                <div className="space-y-4">
                  {patternAnalysis.predictions.map((prediction) => (
                    <div key={prediction.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{prediction.symptom}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPredictionColor(prediction.prediction)}`}>
                          {prediction.prediction}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center space-x-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm"><strong>Timeframe:</strong> {prediction.timeframe}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm"><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      
                      {prediction.factors && prediction.factors.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Contributing Factors:</h4>
                          <ul className="text-sm text-white/70 space-y-1">
                            {prediction.factors.map((factor, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-orange-400 mt-1">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
