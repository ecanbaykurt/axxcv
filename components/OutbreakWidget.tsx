'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Globe,
  Loader2
} from 'lucide-react';

interface OutbreakData {
  country: string;
  covid19: {
    cases: number;
    deaths: number;
    recovered: number;
    active: number;
    todayCases: number;
    todayDeaths: number;
    updated: number;
  };
  flu: {
    cases: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    season: 'active' | 'inactive';
  };
  dengue: {
    cases: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    season: 'active' | 'inactive';
  };
}

interface OutbreakWidgetProps {
  className?: string;
}

export default function OutbreakWidget({ className = '' }: OutbreakWidgetProps) {
  const [outbreakData, setOutbreakData] = useState<OutbreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOutbreakData();
  }, []);

  const fetchOutbreakData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/outbreak-data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch outbreak data');
      }
      
      const data = await response.json();
      setOutbreakData(data);
    } catch (error) {
      console.error('Error fetching outbreak data:', error);
      setError('Unable to load outbreak data');
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-red-400';
      case 'decreasing':
        return 'text-green-400';
      default:
        return 'text-yellow-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <motion.div
        className={`glass rounded-2xl p-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Local Outbreak Info</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="ml-2 text-white/70">Loading outbreak data...</span>
        </div>
      </motion.div>
    );
  }

  if (error || !outbreakData) {
    return (
      <motion.div
        className={`glass rounded-2xl p-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Outbreak Data</h3>
        </div>
        <p className="text-white/70 text-sm">{error || 'Unable to load outbreak data'}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`glass rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <Globe className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Local Outbreak Info</h3>
      </div>
      
      <div className="space-y-4">
        {/* COVID-19 */}
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-300 font-medium text-sm">COVID-19</span>
            <span className="text-red-200 text-xs">
              {new Date(outbreakData.covid19.updated).toLocaleDateString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-white/70">Active: </span>
              <span className="text-white font-medium">{formatNumber(outbreakData.covid19.active)}</span>
            </div>
            <div>
              <span className="text-white/70">Today: </span>
              <span className="text-white font-medium">{formatNumber(outbreakData.covid19.todayCases)}</span>
            </div>
          </div>
        </div>

        {/* Flu */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 font-medium text-sm">Influenza</span>
            <div className="flex items-center space-x-1">
              {getTrendIcon(outbreakData.flu.trend)}
              <span className={`text-xs ${getTrendColor(outbreakData.flu.trend)}`}>
                {outbreakData.flu.trend}
              </span>
            </div>
          </div>
          <div className="text-xs">
            <span className="text-white/70">Cases: </span>
            <span className="text-white font-medium">{formatNumber(outbreakData.flu.cases)}</span>
            <span className="text-white/50 ml-2">({outbreakData.flu.season} season)</span>
          </div>
        </div>

        {/* Dengue */}
        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-300 font-medium text-sm">Dengue</span>
            <div className="flex items-center space-x-1">
              {getTrendIcon(outbreakData.dengue.trend)}
              <span className={`text-xs ${getTrendColor(outbreakData.dengue.trend)}`}>
                {outbreakData.dengue.trend}
              </span>
            </div>
          </div>
          <div className="text-xs">
            <span className="text-white/70">Cases: </span>
            <span className="text-white font-medium">{formatNumber(outbreakData.dengue.cases)}</span>
            <span className="text-white/50 ml-2">({outbreakData.dengue.season} season)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/50 text-xs">
          Data for {outbreakData.country} • Updated {new Date(outbreakData.covid19.updated).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
