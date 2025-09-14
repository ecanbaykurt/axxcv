'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Heart,
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain,
  Globe,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { HealthEntry, DashboardData, HealthScore, DashboardInsight } from '../types/health';

interface DashboardViewProps {
  onNavigateBack: () => void;
  onViewPatterns: () => void;
  healthEntries: HealthEntry[];
}

export default function DashboardView({ onNavigateBack, onViewPatterns, healthEntries }: DashboardViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    generateDashboardData();
  }, [healthEntries]);

  const generateDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Calculate health score based on recent entries
      const recentEntries = healthEntries.slice(0, 10);
      const healthScore = calculateHealthScore(recentEntries);
      
      // Generate insights
      const insights = generateInsights(healthEntries);
      
      // Create dashboard data
      const data: DashboardData = {
        recentEntries,
        patternAnalysis: {
          patterns: [],
          trends: [],
          correlations: [],
          predictions: [],
          summary: "Pattern analysis available in Patterns view"
        },
        healthScore,
        insights,
        charts: []
      };
      
      setDashboardData(data);
    } catch (error) {
      console.error('Error generating dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateHealthScore = (entries: HealthEntry[]): HealthScore => {
    if (entries.length === 0) {
      return {
        overall: 50,
        trend: 'stable',
        factors: [],
        lastUpdated: new Date()
      };
    }

    // Simple health score calculation based on symptom severity
    let totalSeverity = 0;
    let entryCount = 0;

    entries.forEach(entry => {
      if (entry.aiResponse?.timeline) {
        entry.aiResponse.timeline.forEach(symptom => {
          totalSeverity += symptom.severity;
          entryCount++;
        });
      }
    });

    const averageSeverity = entryCount > 0 ? totalSeverity / entryCount : 5;
    const healthScore = Math.max(10, 100 - (averageSeverity * 8)); // Convert severity to health score

    return {
      overall: Math.round(healthScore),
      trend: entries.length > 1 ? 'stable' : 'stable',
      factors: [
        { name: 'Symptom Severity', score: healthScore, weight: 0.6, trend: 'stable' },
        { name: 'Entry Frequency', score: Math.min(100, entries.length * 10), weight: 0.2, trend: 'stable' },
        { name: 'Consistency', score: 75, weight: 0.2, trend: 'stable' }
      ],
      lastUpdated: new Date()
    };
  };

  const generateInsights = (entries: HealthEntry[]): DashboardInsight[] => {
    const insights: DashboardInsight[] = [];

    if (entries.length === 0) {
      insights.push({
        id: 'no_entries',
        type: 'pattern',
        title: 'Start Tracking Your Health',
        description: 'Create your first health entry to begin tracking symptoms and patterns.',
        severity: 'info',
        actionable: true,
        recommendation: 'Use the "New Entry" button to record your first symptoms.'
      });
      return insights;
    }

    // Recent entries insight
    if (entries.length > 0) {
      insights.push({
        id: 'recent_entries',
        type: 'pattern',
        title: `${entries.length} Health Entries Recorded`,
        description: `You've been tracking your health for ${Math.ceil((Date.now() - new Date(entries[entries.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))} days.`,
        severity: 'info',
        actionable: true,
        recommendation: 'Continue tracking to identify patterns and trends.'
      });
    }

    // High severity symptoms insight
    const highSeverityEntries = entries.filter(entry => 
      entry.aiResponse?.timeline?.some(symptom => symptom.severity >= 7)
    );

    if (highSeverityEntries.length > 0) {
      insights.push({
        id: 'high_severity',
        type: 'pattern',
        title: 'High Severity Symptoms Detected',
        description: `${highSeverityEntries.length} entries contain high-severity symptoms (7+ on pain scale).`,
        severity: 'warning',
        actionable: true,
        recommendation: 'Consider consulting with a healthcare professional for persistent high-severity symptoms.'
      });
    }

    // Red flags insight
    const redFlagEntries = entries.filter(entry => 
      entry.aiResponse?.redFlags?.some(flag => flag.severity === 'high' || flag.severity === 'critical')
    );

    if (redFlagEntries.length > 0) {
      insights.push({
        id: 'red_flags',
        type: 'pattern',
        title: 'Important Health Considerations',
        description: `${redFlagEntries.length} entries contain important health flags that require attention.`,
        severity: 'critical',
        actionable: true,
        recommendation: 'Review flagged entries and consider seeking medical advice.'
      });
    }

    return insights;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
    if (score >= 40) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-white animate-pulse mx-auto mb-4" />
          <p className="text-white/70">Generating your health dashboard...</p>
        </div>
      </div>
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

        <h1 className="text-xl font-semibold text-white">Health Dashboard</h1>

        <div className="flex space-x-2">
          <button
            onClick={onViewPatterns}
            className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 space-y-6">
        {/* Health Score */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">Health Score</h2>
          </div>
          
          {dashboardData && (
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold mb-4 ${getHealthScoreColor(dashboardData.healthScore.overall)}`}>
                {dashboardData.healthScore.overall}
              </div>
              <p className="text-white/70 mb-2">Overall Health Score</p>
              <p className="text-white/50 text-sm">Last updated: {dashboardData.healthScore.lastUpdated.toLocaleDateString()}</p>
            </div>
          )}
        </motion.div>

        {/* Health Factors */}
        {dashboardData && dashboardData.healthScore.factors.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Health Factors</h2>
            </div>
            
            <div className="space-y-4">
              {dashboardData.healthScore.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-white/70" />
                    <span className="text-white font-medium">{factor.name}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(factor.score)}`}>
                    {Math.round(factor.score)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Insights */}
        {dashboardData && dashboardData.insights.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Health Insights</h2>
            </div>
            
            <div className="space-y-4">
              {dashboardData.insights.map((insight) => (
                <div key={insight.id} className={`p-4 rounded-xl border ${getSeverityColor(insight.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {insight.severity === 'critical' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : insight.severity === 'warning' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <p className="text-sm opacity-80 mb-2">{insight.description}</p>
                      {insight.recommendation && (
                        <p className="text-sm opacity-70 font-medium">{insight.recommendation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Entries */}
        {dashboardData && dashboardData.recentEntries.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
            </div>
            
            <div className="space-y-3">
              {dashboardData.recentEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {entry.isVoiceInput && <Globe className="w-4 h-4 text-blue-400" />}
                      {entry.images && entry.images.length > 0 && <FileText className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">{entry.inputText}</p>
                  {entry.aiResponse?.summary && (
                    <p className="text-white/50 text-xs mt-2 line-clamp-1">{entry.aiResponse.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <button
            onClick={onViewPatterns}
            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <TrendingUp className="w-5 h-5" />
            <span>View Patterns</span>
          </button>
          
          <button
            onClick={() => {/* Export functionality */}}
            className="flex-1 py-4 glass rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
