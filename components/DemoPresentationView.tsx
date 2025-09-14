'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Wind, 
  Brain, 
  Activity, 
  Smile, 
  Dumbbell,
  Globe,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface HealthCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  symptoms: string[];
  userCount: number;
  improvementRate: number;
  languageBarriersResolved: number;
  monthlyTrend: number[];
  keyInsights: string[];
}

interface LanguageData {
  language: string;
  users: number;
  improvement: number;
}

interface DemoStats {
  totalUsers: number;
  languagesSupported: number;
  timeSaved: number;
  accuracyRate: number;
  globalReach: number;
}

const DemoPresentationView = ({ onNavigateBack }: { onNavigateBack: () => void }) => {
  const [activeCategory, setActiveCategory] = useState<string>('cardiovascular');
  const [animatedStats, setAnimatedStats] = useState<DemoStats>({
    totalUsers: 0,
    languagesSupported: 0,
    timeSaved: 0,
    accuracyRate: 0,
    globalReach: 0
  });

  // Mock data for health categories
  const healthCategories: HealthCategory[] = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular Health',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-red-500 to-pink-500',
      symptoms: ['Chest pain', 'Breathlessness', 'Palpitations', 'Blood pressure', 'Collapse'],
      userCount: 1247,
      improvementRate: 23,
      languageBarriersResolved: 89,
      monthlyTrend: [45, 52, 48, 61, 58, 67, 72, 69, 75, 78, 82, 89],
      keyInsights: [
        'Early detection of cardiac symptoms',
        'Improved blood pressure monitoring',
        'Reduced emergency room visits'
      ]
    },
    {
      id: 'respiratory',
      name: 'Respiratory Health',
      icon: <Wind className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      symptoms: ['Fever', 'Cough', 'Sputum', 'Wheezing', 'Oxygen levels', 'Asthma control'],
      userCount: 634,
      improvementRate: 28,
      languageBarriersResolved: 67,
      monthlyTrend: [32, 38, 35, 42, 45, 48, 52, 49, 55, 58, 61, 67],
      keyInsights: [
        'Better asthma management',
        'Improved oxygen level tracking',
        'Enhanced respiratory monitoring'
      ]
    },
    {
      id: 'neurological',
      name: 'Neurological & Mental Health',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-500',
      symptoms: ['Sudden headache', 'Speech issues', 'Weakness', 'Seizures', 'Chronic headache', 'Sleep', 'Mood', 'Suicidality'],
      userCount: 892,
      improvementRate: 31,
      languageBarriersResolved: 156,
      monthlyTrend: [28, 35, 32, 41, 38, 45, 48, 52, 58, 61, 67, 156],
      keyInsights: [
        'Early mental health intervention',
        'Improved sleep pattern tracking',
        'Better neurological symptom monitoring'
      ]
    },
    {
      id: 'diabetes',
      name: 'Diabetes Management',
      icon: <Activity className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      symptoms: ['Thirst', 'Frequent urination', 'Weight loss', 'Vision changes', 'Fatigue', 'Lifestyle factors'],
      userCount: 445,
      improvementRate: 26,
      languageBarriersResolved: 78,
      monthlyTrend: [18, 22, 20, 25, 28, 32, 35, 38, 42, 45, 48, 78],
      keyInsights: [
        'Better blood sugar control',
        'Improved lifestyle tracking',
        'Enhanced diabetes education'
      ]
    },
    {
      id: 'dental',
      name: 'Dental Postoperative Care',
      icon: <Smile className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      symptoms: ['Pain', 'Swelling', 'Bleeding', 'Fever', 'Infection after complex oral surgeries'],
      userCount: 567,
      improvementRate: 29,
      languageBarriersResolved: 45,
      monthlyTrend: [22, 28, 25, 32, 35, 38, 42, 39, 45, 48, 52, 45],
      keyInsights: [
        'Reduced post-surgical complications',
        'Better pain management',
        'Improved recovery tracking'
      ]
    },
    {
      id: 'physiotherapy',
      name: 'Physiotherapy & Rehabilitation',
      icon: <Dumbbell className="w-8 h-8" />,
      color: 'from-teal-500 to-blue-500',
      symptoms: ['Steps', 'Exercise tolerance', 'Heart response', 'Pain/function scores', 'Breathing rehab', 'Safe progression'],
      userCount: 723,
      improvementRate: 35,
      languageBarriersResolved: 134,
      monthlyTrend: [35, 42, 38, 48, 52, 58, 62, 65, 72, 78, 82, 134],
      keyInsights: [
        'Improved exercise adherence',
        'Better pain management',
        'Enhanced rehabilitation outcomes'
      ]
    }
  ];

  // Mock language data
  const languageData: LanguageData[] = [
    { language: 'English', users: 1247, improvement: 28 },
    { language: 'Spanish', users: 892, improvement: 31 },
    { language: 'French', users: 634, improvement: 26 },
    { language: 'German', users: 445, improvement: 29 },
    { language: 'Chinese', users: 567, improvement: 33 },
    { language: 'Arabic', users: 378, improvement: 27 },
    { language: 'Portuguese', users: 312, improvement: 25 },
    { language: 'Japanese', users: 289, improvement: 30 }
  ];

  // Animate stats on component mount
  useEffect(() => {
    const animateStats = () => {
      const targetStats: DemoStats = {
        totalUsers: 4507,
        languagesSupported: 60,
        timeSaved: 42,
        accuracyRate: 94,
        globalReach: 25
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedStats({
          totalUsers: Math.floor(targetStats.totalUsers * progress),
          languagesSupported: Math.floor(targetStats.languagesSupported * progress),
          timeSaved: Math.floor(targetStats.timeSaved * progress),
          accuracyRate: Math.floor(targetStats.accuracyRate * progress),
          globalReach: Math.floor(targetStats.globalReach * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats(targetStats);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const currentCategory = healthCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to App
          </button>
          <h1 className="text-3xl font-bold text-white text-center flex-1">
            HealthBridge Demo Presentation
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Breaking Language Barriers in Global Healthcare
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            AI-powered health analysis that translates symptoms across 60+ languages, 
            providing instant medical insights and standardized reports for faster primary care.
          </p>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{animatedStats.totalUsers.toLocaleString()}</div>
            <div className="text-white/60">Total Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{animatedStats.languagesSupported}+</div>
            <div className="text-white/60">Languages</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{animatedStats.timeSaved}%</div>
            <div className="text-white/60">Time Saved</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{animatedStats.accuracyRate}%</div>
            <div className="text-white/60">Accuracy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{animatedStats.globalReach}+</div>
            <div className="text-white/60">Countries</div>
          </div>
        </motion.div>

        {/* Health Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Health Categories We Track
          </h3>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {healthCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </div>
              </button>
            ))}
          </div>

          {/* Active Category Details */}
          <AnimatePresence mode="wait">
            {currentCategory && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Stats */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${currentCategory.color}`}>
                        {currentCategory.icon}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white">{currentCategory.name}</h4>
                        <p className="text-white/60">Comprehensive health tracking</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{currentCategory.userCount.toLocaleString()}</div>
                        <div className="text-white/60 text-sm">Active Users</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">+{currentCategory.improvementRate}%</div>
                        <div className="text-white/60 text-sm">Improvement Rate</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">{currentCategory.languageBarriersResolved}</div>
                        <div className="text-white/60 text-sm">Language Barriers Resolved</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">{currentCategory.symptoms.length}</div>
                        <div className="text-white/60 text-sm">Symptoms Tracked</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-3">Key Symptoms Tracked:</h5>
                      <div className="flex flex-wrap gap-2">
                        {currentCategory.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Chart */}
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">Monthly Progress Trend</h5>
                    <div className="bg-white/5 rounded-lg p-6 h-64 flex items-end justify-between gap-2">
                      {currentCategory.monthlyTrend.map((value, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-8 rounded-t-lg bg-gradient-to-t ${currentCategory.color} transition-all duration-500`}
                            style={{ height: `${(value / Math.max(...currentCategory.monthlyTrend)) * 200}px` }}
                          />
                          <span className="text-white/60 text-xs">{index + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <h6 className="text-white font-medium mb-2">Key Insights:</h6>
                      <ul className="space-y-1">
                        {currentCategory.keyInsights.map((insight, index) => (
                          <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Language Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Global Language Impact
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Language Distribution */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Top Languages by User Impact
              </h4>
              <div className="space-y-3">
                {languageData.slice(0, 6).map((lang, index) => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                      <span className="text-white">{lang.language}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{lang.users.toLocaleString()}</div>
                      <div className="text-white/60 text-sm">+{lang.improvement}% improvement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Before/After Comparison */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Consultation Efficiency
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-500/20 rounded-lg">
                  <span className="text-white">Before HealthBridge</span>
                  <span className="text-red-400 font-bold">25 min avg</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-500/20 rounded-lg">
                  <span className="text-white">With HealthBridge</span>
                  <span className="text-green-400 font-bold">12 min avg</span>
                </div>
                <div className="text-center text-white/60 text-sm">
                  52% faster consultations • 21% better accuracy
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            How HealthBridge Transforms Healthcare
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Eliminates Language Barriers</h4>
              <p className="text-white/70">
                Instant translation across 60+ languages ensures no patient is left behind due to communication gaps.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">AI-Powered Intelligence</h4>
              <p className="text-white/70">
                Advanced symptom analysis provides accurate medical insights and standardized health reports.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Faster Primary Care</h4>
              <p className="text-white/70">
                Standardized reports enable doctors to make faster, more accurate decisions during consultations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPresentationView;
