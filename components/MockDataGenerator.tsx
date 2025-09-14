'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  User, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { HealthEntry, AIHealthResponse } from '../types/health';

interface MockDataGeneratorProps {
  onAddEntries: (entries: HealthEntry[]) => void;
  onClearAll: () => void;
  currentEntryCount: number;
}

// Mock user profiles with different health patterns
const MOCK_USERS = [
  {
    name: "Sarah Chen",
    age: 28,
    profile: "Busy professional with occasional migraines and stress-related symptoms",
    entries: [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        symptoms: "Headache, fatigue, neck tension",
        severity: 6,
        mood: 3,
        tags: ['work-stress', 'migraine']
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        symptoms: "Mild headache, eye strain",
        severity: 4,
        mood: 4,
        tags: ['work-stress']
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        symptoms: "Severe migraine, nausea, light sensitivity",
        severity: 8,
        mood: 2,
        tags: ['migraine', 'severe']
      }
    ]
  },
  {
    name: "Marcus Johnson",
    age: 45,
    profile: "Middle-aged with chronic back pain and sleep issues",
    entries: [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        symptoms: "Lower back pain, stiffness, poor sleep",
        severity: 7,
        mood: 3,
        tags: ['chronic-pain', 'sleep']
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        symptoms: "Back pain, fatigue, difficulty sleeping",
        severity: 6,
        mood: 3,
        tags: ['chronic-pain', 'sleep']
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        symptoms: "Severe back pain, muscle spasms",
        severity: 9,
        mood: 2,
        tags: ['chronic-pain', 'severe']
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
        symptoms: "Moderate back pain, good sleep",
        severity: 5,
        mood: 4,
        tags: ['chronic-pain']
      }
    ]
  },
  {
    name: "Elena Rodriguez",
    age: 32,
    profile: "New mother with postpartum symptoms and anxiety",
    entries: [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        symptoms: "Fatigue, mood swings, breast tenderness",
        severity: 5,
        mood: 3,
        tags: ['postpartum', 'hormonal']
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        symptoms: "Anxiety, sleep deprivation, emotional",
        severity: 6,
        mood: 2,
        tags: ['postpartum', 'mental-health']
      },
      {
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        symptoms: "Feeling better, more energy, stable mood",
        severity: 3,
        mood: 4,
        tags: ['recovery']
      },
      {
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        symptoms: "Severe fatigue, depression, difficulty bonding",
        severity: 8,
        mood: 1,
        tags: ['postpartum', 'severe', 'mental-health']
      }
    ]
  },
  {
    name: "David Kim",
    age: 55,
    profile: "Senior with diabetes management and regular health monitoring",
    entries: [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        symptoms: "Blood sugar fluctuations, increased thirst",
        severity: 5,
        mood: 4,
        tags: ['diabetes', 'monitoring']
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        symptoms: "Good energy, stable blood sugar, feeling well",
        severity: 2,
        mood: 5,
        tags: ['diabetes', 'stable']
      },
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        symptoms: "High blood sugar, fatigue, blurred vision",
        severity: 7,
        mood: 3,
        tags: ['diabetes', 'high-sugar']
      },
      {
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        symptoms: "Numbness in feet, tingling sensation",
        severity: 6,
        mood: 3,
        tags: ['diabetes', 'neuropathy']
      },
      {
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        symptoms: "Routine check-in, feeling good, well-controlled",
        severity: 2,
        mood: 5,
        tags: ['diabetes', 'routine']
      }
    ]
  }
];

// Generate realistic AI responses for mock data
const generateMockAIResponse = (symptoms: string, severity: number, mood: number): AIHealthResponse => {
  const isHighSeverity = severity >= 7;
  const isLowMood = mood <= 2;
  
  let summary = `Patient reported: ${symptoms}`;
  let patientSummary = `You're experiencing ${symptoms.toLowerCase()}. ${severity >= 7 ? 'These symptoms seem significant and may require attention.' : 'These symptoms appear manageable with monitoring.'}`;
  let doctorSummary = `Patient presents with ${symptoms.toLowerCase()}. Severity level: ${severity}/10. Mood assessment: ${mood}/5.`;
  
  let severityLevel: 'routine' | 'attention' | 'emergency' = 'routine';
  if (severity >= 8) severityLevel = 'emergency';
  else if (severity >= 6 || isLowMood) severityLevel = 'attention';
  
  const timeline = [{
    id: `mock_${Date.now()}`,
    symptom: symptoms,
    severity: severity,
    duration: 'Recent',
    frequency: 'Variable'
  }];
  
  const redFlags = [];
  if (severity >= 8) {
    redFlags.push({
      id: `redflag_${Date.now()}`,
      description: 'High severity symptoms detected',
      severity: 'high' as any,
      recommendation: 'Consider immediate medical evaluation',
      urgency: 'immediate' as any
    });
  }
  if (isLowMood) {
    redFlags.push({
      id: `mood_${Date.now()}`,
      description: 'Low mood indicators',
      severity: 'medium' as any,
      recommendation: 'Monitor mental health and consider support',
      urgency: 'within_week' as any
    });
  }
  
  let advice = 'Continue monitoring your symptoms and maintain regular health practices.';
  if (severity >= 7) {
    advice = 'These symptoms warrant attention. Consider consulting a healthcare provider for proper evaluation.';
  } else if (isLowMood) {
    advice = 'Take care of your mental health. Consider reaching out to friends, family, or a healthcare provider.';
  }
  
  const recommendations = [
    'Continue monitoring symptoms',
    'Maintain healthy lifestyle habits',
    'Seek medical attention if symptoms worsen'
  ];
  
  if (severity >= 7) {
    recommendations.unshift('Consider consulting a healthcare provider');
  }
  if (isLowMood) {
    recommendations.push('Focus on mental health and wellbeing');
  }
  
  return {
    summary,
    patient_summary: patientSummary,
    doctor_summary: doctorSummary,
    severity_level: severityLevel,
    timeline,
    redFlags,
    advice,
    recommendations,
    triage_guidance: severityLevel
  };
};

export default function MockDataGenerator({ onAddEntries, onClearAll, currentEntryCount }: MockDataGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const generateMockData = async (user: typeof MOCK_USERS[0]) => {
    setIsGenerating(true);
    setSelectedUser(user);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockEntries: HealthEntry[] = user.entries.map((entry, index) => {
      const aiResponse = generateMockAIResponse(entry.symptoms, entry.severity, entry.mood);
      
      return {
        id: `mock_${user.name.replace(' ', '_').toLowerCase()}_${index}_${Date.now()}`,
        date: entry.date,
        inputText: entry.symptoms,
        isVoiceInput: false,
        aiResponse: aiResponse,
        createdAt: entry.date,
        tags: entry.tags,
        mood: entry.mood
      };
    });
    
    onAddEntries(mockEntries);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsGenerating(false);
  };

  const clearAllData = () => {
    onClearAll();
    setSelectedUser(null);
  };

  if (showSuccess && selectedUser) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Mock Data Generated!</h3>
          <p className="text-white/70 mb-4">
            Added {selectedUser.entries.length} entries for {selectedUser.name}
          </p>
          <p className="text-white/60 text-sm">
            You can now explore the dashboard, patterns, and export features with realistic data.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Mock Data Generator</h3>
      </div>
      
      <p className="text-white/70 mb-6">
        Generate realistic health data to explore the app's features. Choose a user profile to see how different health conditions are tracked.
      </p>

      {/* Current Data Status */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-white/80 text-sm">Current entries: {currentEntryCount}</span>
          </div>
          {currentEntryCount > 0 && (
            <button
              onClick={clearAllData}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* User Profiles */}
      <div className="space-y-4">
        {MOCK_USERS.map((user, index) => (
          <motion.div
            key={user.name}
            className="border border-white/20 rounded-xl p-4 hover:border-white/40 transition-all duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-white font-semibold">{user.name}</h4>
                <p className="text-white/60 text-sm">Age: {user.age}</p>
                <p className="text-white/70 text-sm mt-1">{user.profile}</p>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm">{user.entries.length} entries</div>
                <div className="text-white/50 text-xs">
                  {new Date(user.entries[0].date).toLocaleDateString()} - {new Date(user.entries[user.entries.length - 1].date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {user.entries.slice(0, 3).map((entry, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1 rounded-full text-xs ${
                      entry.severity >= 7 
                        ? 'bg-red-500/20 text-red-300' 
                        : entry.severity >= 5 
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {entry.severity}/10
                  </div>
                ))}
                {user.entries.length > 3 && (
                  <div className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                    +{user.entries.length - 3}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => generateMockData(user)}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating && selectedUser?.name === user.name ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Generate Data</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-green-300 font-semibold mb-1">Demo Tips</h4>
            <ul className="text-green-200/80 text-sm space-y-1">
              <li>• Each profile shows different health patterns and conditions</li>
              <li>• Try generating data for multiple users to see variety</li>
              <li>• Explore the Dashboard and Patterns views with the generated data</li>
              <li>• Test the Export feature to see how data is formatted for doctors</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
