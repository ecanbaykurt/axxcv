'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  User, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Heart,
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Clock,
  MapPin,
  Globe,
  Settings,
  Download,
  Filter
} from 'lucide-react';
import { HealthEntry, AIHealthResponse } from '../types/health';

interface ProfileViewProps {
  onNavigateBack: () => void;
  healthEntries: HealthEntry[];
}

interface HealthStats {
  totalEntries: number;
  averageSeverity: number;
  moodTrend: number;
  mostCommonSymptoms: Array<{ symptom: string; count: number }>;
  severityDistribution: Array<{ level: string; count: number; color: string }>;
  monthlyTrends: Array<{ month: string; entries: number; avgSeverity: number }>;
  triageDistribution: Array<{ level: string; count: number; color: string }>;
}

export default function ProfileView({ onNavigateBack, healthEntries }: ProfileViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [selectedChart, setSelectedChart] = useState<'severity' | 'symptoms' | 'triage' | 'trends'>('severity');
  const [healthStats, setHealthStats] = useState<HealthStats | null>(null);

  useEffect(() => {
    setIsAnimating(true);
    calculateHealthStats();
  }, [healthEntries, selectedTimeframe]);

  const calculateHealthStats = () => {
    if (healthEntries.length === 0) {
      setHealthStats(null);
      return;
    }

    const now = new Date();
    const filteredEntries = healthEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      switch (selectedTimeframe) {
        case 'week':
          return entryDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return entryDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'year':
          return entryDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });

    // Calculate average severity
    const totalSeverity = filteredEntries.reduce((sum, entry) => {
      const avgSymptomSeverity = entry.aiResponse.timeline.reduce((s, t) => s + t.severity, 0) / entry.aiResponse.timeline.length;
      return sum + avgSymptomSeverity;
    }, 0);
    const averageSeverity = filteredEntries.length > 0 ? totalSeverity / filteredEntries.length : 0;

    // Calculate mood trend
    const moodEntries = filteredEntries.filter(entry => entry.mood !== undefined);
    const moodTrend = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / moodEntries.length 
      : 0;

    // Most common symptoms
    const symptomCounts: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
      entry.aiResponse.timeline.forEach(timeline => {
        symptomCounts[timeline.symptom] = (symptomCounts[timeline.symptom] || 0) + 1;
      });
    });
    const mostCommonSymptoms = Object.entries(symptomCounts)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Severity distribution
    const severityCounts = { low: 0, moderate: 0, high: 0, critical: 0 };
    filteredEntries.forEach(entry => {
      const avgSeverity = entry.aiResponse.timeline.reduce((s, t) => s + t.severity, 0) / entry.aiResponse.timeline.length;
      if (avgSeverity <= 3) severityCounts.low++;
      else if (avgSeverity <= 6) severityCounts.moderate++;
      else if (avgSeverity <= 8) severityCounts.high++;
      else severityCounts.critical++;
    });

    const severityDistribution = [
      { level: 'Low (1-3)', count: severityCounts.low, color: 'bg-green-500' },
      { level: 'Moderate (4-6)', count: severityCounts.moderate, color: 'bg-yellow-500' },
      { level: 'High (7-8)', count: severityCounts.high, color: 'bg-orange-500' },
      { level: 'Critical (9-10)', count: severityCounts.critical, color: 'bg-red-500' }
    ];

    // Triage distribution
    const triageCounts = { routine: 0, attention: 0, emergency: 0 };
    filteredEntries.forEach(entry => {
      const triage = entry.aiResponse.triage_guidance || entry.aiResponse.severity_level || 'routine';
      if (triage === 'routine') triageCounts.routine++;
      else if (triage === 'attention') triageCounts.attention++;
      else if (triage === 'emergency') triageCounts.emergency++;
    });

    const triageDistribution = [
      { level: 'Routine', count: triageCounts.routine, color: 'bg-green-500' },
      { level: 'Attention', count: triageCounts.attention, color: 'bg-yellow-500' },
      { level: 'Emergency', count: triageCounts.emergency, color: 'bg-red-500' }
    ];

    // Monthly trends
    const monthlyData: { [key: string]: { entries: number; totalSeverity: number } } = {};
    filteredEntries.forEach(entry => {
      const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { entries: 0, totalSeverity: 0 };
      }
      monthlyData[month].entries++;
      const avgSeverity = entry.aiResponse.timeline.reduce((s, t) => s + t.severity, 0) / entry.aiResponse.timeline.length;
      monthlyData[month].totalSeverity += avgSeverity;
    });

    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        entries: data.entries,
        avgSeverity: data.totalSeverity / data.entries
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    setHealthStats({
      totalEntries: filteredEntries.length,
      averageSeverity,
      moodTrend,
      mostCommonSymptoms,
      severityDistribution,
      monthlyTrends,
      triageDistribution
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-400';
    if (severity <= 6) return 'text-yellow-400';
    if (severity <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 1) return '😢';
    if (mood <= 2) return '😕';
    if (mood <= 3) return '😐';
    if (mood <= 4) return '🙂';
    return '😊';
  };

  const renderChart = () => {
    if (!healthStats) return null;

    switch (selectedChart) {
      case 'severity':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
            {healthStats.severityDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />
                  <span className="text-white/80">{item.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / healthStats.totalEntries) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'symptoms':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Most Common Symptoms</h3>
            {healthStats.mostCommonSymptoms.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white/80">{item.symptom}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(item.count / Math.max(...healthStats.mostCommonSymptoms.map(s => s.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'triage':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Triage Distribution</h3>
            {healthStats.triageDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />
                  <span className="text-white/80">{item.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / healthStats.totalEntries) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Trends</h3>
            {healthStats.monthlyTrends.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white/80">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-white/60 text-xs">Entries</div>
                    <div className="text-white font-semibold">{item.entries}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60 text-xs">Avg Severity</div>
                    <div className={`font-semibold ${getSeverityColor(item.avgSeverity)}`}>
                      {item.avgSeverity.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!healthStats) {
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
            <h1 className="text-xl font-semibold text-white">Health Profile</h1>
            <p className="text-white/60 text-sm">Your health analytics</p>
          </div>

          <div className="w-12" />
        </motion.div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Health Data Yet</h2>
            <p className="text-white/70 mb-6">
              Start logging your symptoms to see your health analytics and trends.
            </p>
            <button
              onClick={onNavigateBack}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Tracking
            </button>
          </motion.div>
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

        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Health Profile</h1>
          <p className="text-white/60 text-sm">Your health analytics</p>
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {/* Timeframe Selector */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex space-x-2">
            {(['week', 'month', 'year', 'all'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Health Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="glass rounded-xl p-4 text-center">
            <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{healthStats.totalEntries}</div>
            <div className="text-white/60 text-sm">Total Entries</div>
          </div>

          <div className="glass rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getSeverityColor(healthStats.averageSeverity)}`}>
              {healthStats.averageSeverity.toFixed(1)}
            </div>
            <div className="text-white/60 text-sm">Avg Severity</div>
          </div>

          <div className="glass rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {getMoodEmoji(Math.round(healthStats.moodTrend))}
            </div>
            <div className="text-white/60 text-sm">Mood Trend</div>
          </div>

          <div className="glass rounded-xl p-4 text-center">
            <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {healthStats.mostCommonSymptoms.length > 0 ? healthStats.mostCommonSymptoms[0].symptom.split(' ')[0] : 'N/A'}
            </div>
            <div className="text-white/60 text-sm">Top Symptom</div>
          </div>
        </motion.div>

        {/* Chart Selector */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex space-x-2">
            {[
              { key: 'severity', label: 'Severity', icon: BarChart3 },
              { key: 'symptoms', label: 'Symptoms', icon: PieChart },
              { key: 'triage', label: 'Triage', icon: AlertTriangle },
              { key: 'trends', label: 'Trends', icon: LineChart }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedChart(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedChart === key
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chart Display */}
        <motion.div
          className="glass rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {renderChart()}
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {healthEntries.slice(0, 5).map((entry, index) => {
              const avgSeverity = entry.aiResponse.timeline.reduce((s, t) => s + t.severity, 0) / entry.aiResponse.timeline.length;
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(avgSeverity).replace('text-', 'bg-')}`} />
                    <div>
                      <div className="text-white font-medium text-sm">
                        {entry.aiResponse.timeline[0]?.symptom || 'Health Entry'}
                      </div>
                      <div className="text-white/60 text-xs">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {entry.mood && (
                      <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    )}
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getSeverityColor(avgSeverity)}`}>
                        {avgSeverity.toFixed(1)}/10
                      </div>
                      <div className="text-white/60 text-xs">
                        {entry.aiResponse.triage_guidance || entry.aiResponse.severity_level || 'routine'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
