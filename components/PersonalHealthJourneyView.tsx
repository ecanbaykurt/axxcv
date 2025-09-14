'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Icons for each health condition
  Heart,           // Cardiovascular
  Wind,            // Respiratory/Asthma  
  Brain,           // Neurological/Migraine
  Activity,        // Diabetes
  Smile,           // Dental/Post-surgery
  Dumbbell,        // Physiotherapy
  // Navigation & UI
  ArrowLeft, ArrowRight, Calendar, TrendingUp, Target, Award,
  CheckCircle, Star, Eye, Clock, Users, Globe, FileText,
  // Medical icons
  Stethoscope, Clipboard, AlertTriangle, Shield,
  // Dashboard icons
  BarChart3, PieChart, User
} from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  age: number;
  condition: string;
  language: string;
  languageCode: string;
  occupation: string;
  personalGoal: string;
  icon: React.ReactNode;
  color: string;
  dayProgress: DayProgress[];
}

interface DayProgress {
  day: number;
  personalInsights: string[];
  healthScore: number;
  patternsDiscovered: string[];
  doctorReport: DoctorReport;
  personalAchievements: string[];
  dashboardData: DashboardData;
  profileStats: ProfileStats;
  patternAnalysis: PatternAnalysis;
}

interface DashboardData {
  totalEntries: number;
  recentEntries: number;
  healthScore: number;
  insights: string[];
  charts: ChartData[];
  trends: string[];
}

interface ProfileStats {
  totalEntries: number;
  averageSeverity: number;
  moodTrend: number;
  mostCommonSymptoms: Array<{ symptom: string; count: number }>;
  severityDistribution: Array<{ level: string; count: number; color: string }>;
  monthlyTrends: Array<{ month: string; entries: number; avgSeverity: number }>;
}

interface PatternAnalysis {
  patterns: string[];
  correlations: string[];
  predictions: string[];
  trends: string[];
}

interface ChartData {
  type: string;
  title: string;
  data: any;
}

interface DoctorReport {
  patientName: string;
  day: number;
  condition: string;
  dataPoints: number;
  insights: string[];
  patterns: string[];
  recommendations: string[];
  riskFactors: string[];
  accuracy: number;
  nextSteps: string[];
}

const PersonalHealthJourneyView = ({ onNavigateBack }: { onNavigateBack: () => void }) => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [activeView, setActiveView] = useState<'personal' | 'dashboard' | 'profile' | 'patterns'>('personal');

  // Mock data for 6 user personas
  const personas: Persona[] = [
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      age: 45,
      condition: 'Type 2 Diabetes',
      language: 'English',
      languageCode: 'en',
      occupation: 'Office Manager',
      personalGoal: 'Control blood sugar naturally',
      icon: <Activity className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      dayProgress: [
        {
          day: 1,
          personalInsights: ['Started tracking blood sugar'],
          healthScore: 45,
          patternsDiscovered: [],
          personalAchievements: ['First entry completed'],
          dashboardData: {
            totalEntries: 1,
            recentEntries: 1,
            healthScore: 45,
            insights: ['Welcome to HealthBridge! Start tracking your symptoms daily.'],
            charts: [],
            trends: ['No trends available yet - keep tracking!']
          },
          profileStats: {
            totalEntries: 1,
            averageSeverity: 6,
            moodTrend: 0,
            mostCommonSymptoms: [{ symptom: 'High blood sugar', count: 1 }],
            severityDistribution: [{ level: 'Moderate', count: 1, color: '#f59e0b' }],
            monthlyTrends: [{ month: 'Current', entries: 1, avgSeverity: 6 }]
          },
          patternAnalysis: {
            patterns: [],
            correlations: [],
            predictions: [],
            trends: []
          },
          doctorReport: {
            patientName: 'Sarah Johnson',
            day: 1,
            condition: 'Type 2 Diabetes - Newly Diagnosed',
            dataPoints: 1,
            insights: ['Basic glucose monitoring initiated'],
            patterns: [],
            recommendations: ['Continue daily glucose tracking'],
            riskFactors: ['Family history of diabetes'],
            accuracy: 60,
            nextSteps: ['Schedule follow-up in 2 weeks']
          }
        },
        {
          day: 3,
          personalInsights: ['Noticed blood sugar higher in mornings', 'Started tracking meals'],
          healthScore: 48,
          patternsDiscovered: ['Morning glucose elevation'],
          personalAchievements: ['3-day tracking streak', 'First pattern identified'],
          doctorReport: {
            patientName: 'Sarah Johnson',
            day: 3,
            condition: 'Type 2 Diabetes - Monitoring',
            dataPoints: 3,
            insights: ['Consistent morning hyperglycemia noted', 'Meal tracking initiated'],
            patterns: ['Morning glucose elevation pattern'],
            recommendations: ['Monitor morning glucose', 'Track meal timing'],
            riskFactors: ['Family history of diabetes', 'Morning hyperglycemia'],
            accuracy: 65,
            nextSteps: ['Continue monitoring', 'Consider morning medication timing']
          }
        },
        {
          day: 7,
          personalInsights: ['Exercise helps lower blood sugar', 'Late dinners cause spikes'],
          healthScore: 55,
          patternsDiscovered: ['Morning glucose elevation', 'Exercise glucose reduction', 'Late dinner correlation'],
          personalAchievements: ['1-week tracking streak', 'Discovered exercise benefit', 'Identified meal timing issue'],
          doctorReport: {
            patientName: 'Sarah Johnson',
            day: 7,
            condition: 'Type 2 Diabetes - Pattern Recognition',
            dataPoints: 7,
            insights: ['Exercise response documented', 'Meal timing correlation identified', 'Weekly pattern emerging'],
            patterns: ['Morning glucose elevation', 'Exercise glucose reduction', 'Late dinner correlation'],
            recommendations: ['Maintain exercise routine', 'Avoid late dinners', 'Monitor morning glucose'],
            riskFactors: ['Family history of diabetes', 'Morning hyperglycemia', 'Late meal timing'],
            accuracy: 72,
            nextSteps: ['Continue current monitoring', 'Implement meal timing changes']
          }
        },
        {
          day: 14,
          personalInsights: ['Stress affects my blood sugar', 'Regular meal times help control levels', 'Walking after meals is very effective'],
          healthScore: 65,
          patternsDiscovered: ['Morning glucose elevation', 'Exercise glucose reduction', 'Late dinner correlation', 'Stress-glucose correlation', 'Meal timing optimization'],
          personalAchievements: ['2-week tracking streak', 'Discovered stress connection', 'Improved meal timing', 'Lost 3 pounds'],
          doctorReport: {
            patientName: 'Sarah Johnson',
            day: 14,
            condition: 'Type 2 Diabetes - Well Monitored',
            dataPoints: 14,
            insights: ['Stress-glucose correlation identified', 'Meal timing optimization successful', 'Exercise adherence excellent', 'Weight loss initiated'],
            patterns: ['Morning glucose elevation', 'Exercise glucose reduction', 'Late dinner correlation', 'Stress-glucose correlation', 'Meal timing optimization'],
            recommendations: ['Maintain exercise routine', 'Strict meal timing', 'Stress management techniques', 'Continue weight management'],
            riskFactors: ['Family history of diabetes', 'Morning hyperglycemia', 'Stress sensitivity'],
            accuracy: 78,
            nextSteps: ['Continue current regimen', 'Consider stress management program']
          }
        },
        {
          day: 21,
          personalInsights: ['I can predict blood sugar spikes now', 'Sleep quality affects morning readings', 'Hydration helps with glucose control'],
          healthScore: 75,
          patternsDiscovered: ['Morning glucose elevation', 'Exercise glucose reduction', 'Late dinner correlation', 'Stress-glucose correlation', 'Meal timing optimization', 'Sleep-glucose correlation', 'Hydration effect'],
          personalAchievements: ['3-week tracking streak', 'Can predict glucose patterns', 'Improved sleep quality', 'Lost 5 pounds', 'Better hydration habits'],
          doctorReport: {
            patientName: 'Sarah Johnson',
            day: 21,
            condition: 'Type 2 Diabetes - Excellent Control',
            dataPoints: 21,
            insights: ['Predictive pattern recognition achieved', 'Sleep quality correlation documented', 'Hydration benefits identified', 'Excellent self-management'],
            patterns: ['Morning glucose elevation', 'Exercise glucose reduction', 'Late dinner correlation', 'Stress-glucose correlation', 'Meal timing optimization', 'Sleep-glucose correlation', 'Hydration effect'],
            recommendations: ['Maintain current excellent regimen', 'Continue sleep optimization', 'Maintain hydration habits', 'Consider advanced glucose monitoring'],
            riskFactors: ['Well-controlled with lifestyle modifications'],
            accuracy: 85,
            nextSteps: ['Continue current regimen', 'Schedule 3-month HbA1c']
          }
        },
        {
          day: 30,
          personalInsights: [
            'Blood sugar spikes after late dinners',
            'Exercise reduces glucose by 15-20%',
            'Stress affects morning readings',
            'Optimal meal timing is 6-7 PM',
            'I feel in control of my diabetes now'
          ],
          healthScore: 85,
          patternsDiscovered: [
            'Late dinner correlation (r=0.78)',
            'Exercise glucose reduction pattern',
            'Stress-morning glucose correlation',
            'Meal timing optimization',
            'Sleep quality impact',
            'Hydration benefits'
          ],
          personalAchievements: [
            '30-day tracking streak',
            'Discovered 6 key patterns',
            'Reduced HbA1c by 0.8%',
            'Lost 8 pounds',
            'Improved energy levels',
            'Better sleep quality'
          ],
          dashboardData: {
            totalEntries: 30,
            recentEntries: 7,
            healthScore: 85,
            insights: [
              'Excellent glucose control achieved!',
              'Exercise routine showing consistent benefits',
              'Meal timing optimization successful',
              'Stress management improving overall health'
            ],
            charts: [
              { type: 'line', title: 'Glucose Trends', data: '30-day glucose chart' },
              { type: 'bar', title: 'Exercise Impact', data: 'Exercise vs glucose correlation' },
              { type: 'pie', title: 'Meal Timing Distribution', data: 'Optimal vs suboptimal meal times' }
            ],
            trends: [
              'Glucose levels stabilizing',
              'Exercise adherence improving',
              'Stress levels decreasing',
              'Sleep quality enhancing'
            ]
          },
          profileStats: {
            totalEntries: 30,
            averageSeverity: 4,
            moodTrend: 15,
            mostCommonSymptoms: [
              { symptom: 'High blood sugar', count: 12 },
              { symptom: 'Fatigue', count: 8 },
              { symptom: 'Thirst', count: 6 },
              { symptom: 'Blurred vision', count: 3 }
            ],
            severityDistribution: [
              { level: 'Low', count: 18, color: '#10b981' },
              { level: 'Moderate', count: 10, color: '#f59e0b' },
              { level: 'High', count: 2, color: '#ef4444' }
            ],
            monthlyTrends: [
              { month: 'Week 1', entries: 7, avgSeverity: 6 },
              { month: 'Week 2', entries: 7, avgSeverity: 5 },
              { month: 'Week 3', entries: 7, avgSeverity: 4 },
              { month: 'Week 4', entries: 7, avgSeverity: 3 }
            ]
          },
          patternAnalysis: {
            patterns: [
              'Late dinner (>8 PM) increases glucose by 40-60 mg/dL',
              '30-min post-meal walk reduces glucose by 15-20%',
              'Work stress correlates with morning hyperglycemia',
              'Optimal meal timing: 6-7 PM for best control'
            ],
            correlations: [
              'Exercise frequency ↔ Glucose control (r=0.78)',
              'Meal timing ↔ Morning glucose (r=0.65)',
              'Stress level ↔ Blood sugar spikes (r=0.72)',
              'Sleep quality ↔ Glucose stability (r=0.58)'
            ],
            predictions: [
              'High risk of glucose spike if dinner after 8 PM',
              'Exercise session recommended after large meals',
              'Stress management needed during work deadlines',
              'Optimal exercise window: 2-4 PM'
            ],
            trends: [
              'Glucose levels trending downward',
              'Exercise adherence improving weekly',
              'Stress management techniques working',
              'Overall health score increasing'
            ]
          },
          doctorReport: {
            patientName: 'Sarah Johnson',
            day: 30,
            condition: 'Type 2 Diabetes - Well Controlled',
            dataPoints: 30,
            insights: [
              'Excellent glucose monitoring compliance',
              'Clear dietary pattern correlations identified',
              'Exercise response well documented',
              'Stress management needs attention',
              'Outstanding self-management achieved'
            ],
            patterns: [
              'Late dinner (>8 PM) increases glucose by 40-60 mg/dL',
              '30-min post-meal walk reduces glucose by 15-20%',
              'Work stress correlates with morning hyperglycemia',
              'Optimal meal timing: 6-7 PM for best control',
              'Sleep quality affects morning glucose readings',
              'Adequate hydration improves glucose stability'
            ],
            recommendations: [
              'Maintain 6 PM dinner schedule',
              'Continue 30-min post-meal walks',
              'Implement stress management techniques',
              'Consider CGM for continuous monitoring',
              'Maintain current excellent lifestyle modifications'
            ],
            riskFactors: ['Controlled with lifestyle modifications'],
            accuracy: 94,
            nextSteps: [
              'Continue current regimen',
              'Schedule 3-month HbA1c',
              'Consider diabetes education class',
              'Annual comprehensive diabetes review'
            ]
          }
        }
      ]
    },
    {
      id: 'miguel',
      name: 'Miguel Rodriguez',
      age: 52,
      condition: 'Hypertension',
      language: 'Español',
      languageCode: 'es',
      occupation: 'Construction Worker',
      personalGoal: 'Controlar la presión arterial sin medicamentos',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-red-500 to-pink-500',
      dayProgress: [
        {
          day: 1,
          personalInsights: ['Empecé a rastrear mi presión arterial'],
          healthScore: 40,
          patternsDiscovered: [],
          personalAchievements: ['Primera entrada completada'],
          doctorReport: {
            patientName: 'Miguel Rodriguez',
            day: 1,
            condition: 'Hipertensión - Nuevo Diagnóstico',
            dataPoints: 1,
            insights: ['Monitoreo básico de presión arterial iniciado'],
            patterns: [],
            recommendations: ['Continuar monitoreo diario de presión arterial'],
            riskFactors: ['Historia familiar de hipertensión', 'Trabajo estresante'],
            accuracy: 60,
            nextSteps: ['Programar seguimiento en 2 semanas']
          }
        },
        {
          day: 30,
          personalInsights: [
            'El estrés del trabajo aumenta mi presión',
            'El ejercicio reduce la presión 10-15 mmHg',
            'La sal afecta mis lecturas nocturnas',
            'Dormir bien es crucial para mi presión',
            'Puedo controlar mi presión con cambios de estilo de vida'
          ],
          healthScore: 78,
          patternsDiscovered: [
            'Correlación estrés-trabajo (r=0.72)',
            'Patrón de reducción con ejercicio',
            'Efecto de la sal en lecturas nocturnas',
            'Correlación sueño-presión arterial'
          ],
          personalAchievements: [
            'Racha de seguimiento de 30 días',
            'Descubrió 4 patrones clave',
            'Redujo presión sistólica en 15 mmHg',
            'Mejoró calidad del sueño',
            'Implementó rutina de ejercicio'
          ],
          doctorReport: {
            patientName: 'Miguel Rodriguez',
            day: 30,
            condition: 'Hipertensión - Bien Controlada',
            dataPoints: 30,
            insights: [
              'Excelente cumplimiento del monitoreo',
              'Correlaciones de estilo de vida identificadas',
              'Respuesta al ejercicio documentada',
              'Manejo del estrés necesita atención'
            ],
            patterns: [
              'Estrés laboral aumenta presión sistólica 15-20 mmHg',
              '30 min de ejercicio reduce presión 10-15 mmHg',
              'Alto consumo de sal afecta lecturas nocturnas',
              'Calidad del sueño correlaciona con presión matutina'
            ],
            recommendations: [
              'Mantener rutina de ejercicio regular',
              'Reducir consumo de sal',
              'Implementar técnicas de manejo del estrés',
              'Optimizar higiene del sueño'
            ],
            riskFactors: ['Controlada con modificaciones de estilo de vida'],
            accuracy: 92,
            nextSteps: [
              'Continuar régimen actual',
              'Programar seguimiento en 3 meses',
              'Considerar programa de manejo del estrés'
            ]
          }
        }
      ]
    },
    {
      id: 'aisha',
      name: 'Aisha Al-Rashid',
      age: 28,
      condition: 'Chronic Migraine',
      language: 'العربية',
      languageCode: 'ar',
      occupation: 'Software Developer',
      personalGoal: 'توقع نوبات الصداع النصفي ومنعها',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-500',
      dayProgress: [
        {
          day: 1,
          personalInsights: ['بدأت في تتبع نوبات الصداع النصفي'],
          healthScore: 35,
          patternsDiscovered: [],
          personalAchievements: ['أول إدخال مكتمل'],
          doctorReport: {
            patientName: 'Aisha Al-Rashid',
            day: 1,
            condition: 'الصداع النصفي المزمن - تشخيص جديد',
            dataPoints: 1,
            insights: ['بدء المراقبة الأساسية للصداع النصفي'],
            patterns: [],
            recommendations: ['متابعة التتبع اليومي للصداع النصفي'],
            riskFactors: ['تاريخ عائلي للصداع النصفي', 'عمل مكثف على الكمبيوتر'],
            accuracy: 60,
            nextSteps: ['جدولة متابعة خلال أسبوعين']
          }
        },
        {
          day: 30,
          personalInsights: [
            'يمكنني توقع نوبات الصداع النصفي الآن',
            'قلة النوم تزيد من تكرار النوبات',
            'الإجهاد يسبب الصداع النصفي',
            'بعض الأطعمة تحفز النوبات',
            'أشعر بتحكم أكبر في حالتي'
          ],
          healthScore: 82,
          patternsDiscovered: [
            'ارتباط قلة النوم بالصداع النصفي (r=0.68)',
            'نمط الإجهاد والصداع النصفي',
            'محفزات غذائية محددة',
            'نمط توقيت النوبات'
          ],
          personalAchievements: [
            'سلسلة تتبع لمدة 30 يوم',
            'اكتشفت 4 أنماط رئيسية',
            'قللت تكرار النوبات بنسبة 40%',
            'حسنت جودة النوم',
            'طورت استراتيجيات الوقاية'
          ],
          doctorReport: {
            patientName: 'Aisha Al-Rashid',
            day: 30,
            condition: 'الصداع النصفي المزمن - تحت السيطرة',
            dataPoints: 30,
            insights: [
              'امتثال ممتاز للمراقبة',
              'أنماط محفزات محددة',
              'استراتيجيات وقائية فعالة',
              'تحسن في جودة الحياة'
            ],
            patterns: [
              'قلة النوم تزيد خطر الصداع النصفي بنسبة 60%',
              'الإجهاد المهني يرتبط بنوبات الصداع النصفي',
              'أطعمة محددة تحفز النوبات',
              'توقيت النوبات قابل للتنبؤ'
            ],
            recommendations: [
              'الحفاظ على جدول نوم منتظم',
              'تقنيات إدارة الإجهاد',
              'تجنب المحفزات الغذائية',
              'استراتيجيات الوقاية المحددة'
            ],
            riskFactors: ['متحكم بها بالعلاج الوقائي'],
            accuracy: 91,
            nextSteps: [
              'متابعة الاستراتيجيات الحالية',
              'جدولة متابعة في 3 أشهر',
              'تقييم فعالية العلاج الوقائي'
            ]
          }
        }
      ]
    },
    {
      id: 'chen',
      name: 'Chen Wei',
      age: 35,
      condition: 'Post-Surgery Recovery',
      language: '中文',
      languageCode: 'zh',
      occupation: 'Teacher',
      personalGoal: '跟踪康复进度并预防感染',
      icon: <Smile className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      dayProgress: [
        {
          day: 1,
          personalInsights: ['开始跟踪术后恢复情况'],
          healthScore: 30,
          patternsDiscovered: [],
          personalAchievements: ['完成首次记录'],
          doctorReport: {
            patientName: 'Chen Wei',
            day: 1,
            condition: '术后恢复 - 复杂口腔手术',
            dataPoints: 1,
            insights: ['开始基本术后监测'],
            patterns: [],
            recommendations: ['继续每日恢复跟踪'],
            riskFactors: ['复杂手术史', '感染风险'],
            accuracy: 60,
            nextSteps: ['安排2周后复查']
          }
        },
        {
          day: 30,
          personalInsights: [
            '可以跟踪愈合进度',
            '疼痛管理很重要',
            '感染迹象需要立即关注',
            '营养影响愈合速度',
            '恢复进展良好'
          ],
          healthScore: 88,
          patternsDiscovered: [
            '愈合进度模式',
            '疼痛管理效果',
            '营养愈合相关性',
            '感染预防策略'
          ],
          personalAchievements: [
            '30天跟踪记录',
            '发现4个关键模式',
            '无感染并发症',
            '疼痛控制良好',
            '愈合进展顺利'
          ],
          doctorReport: {
            patientName: 'Chen Wei',
            day: 30,
            condition: '术后恢复 - 恢复良好',
            dataPoints: 30,
            insights: [
              '愈合进展优秀',
              '无感染并发症',
              '疼痛管理有效',
              '营养状况良好'
            ],
            patterns: [
              '愈合进度符合预期',
              '疼痛水平逐渐降低',
              '营养摄入与愈合相关',
              '感染预防措施有效'
            ],
            recommendations: [
              '继续当前恢复计划',
              '维持营养摄入',
              '继续疼痛管理',
              '定期复查'
            ],
            riskFactors: ['恢复良好，风险低'],
            accuracy: 95,
            nextSteps: [
              '继续当前恢复计划',
              '安排3个月复查',
              '评估长期恢复效果'
            ]
          }
        }
      ]
    },
    {
      id: 'maria',
      name: 'Maria Santos',
      age: 41,
      condition: 'Adult-Onset Asthma',
      language: 'Português',
      languageCode: 'pt',
      occupation: 'Nurse',
      personalGoal: 'Identificar gatilhos ambientais da asma',
      icon: <Wind className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      dayProgress: [
        {
          day: 1,
          personalInsights: ['Comecei a rastrear sintomas de asma'],
          healthScore: 42,
          patternsDiscovered: [],
          personalAchievements: ['Primeira entrada concluída'],
          doctorReport: {
            patientName: 'Maria Santos',
            day: 1,
            condition: 'Asma de Início na Idade Adulta - Novo Diagnóstico',
            dataPoints: 1,
            insights: ['Monitoramento básico de asma iniciado'],
            patterns: [],
            recommendations: ['Continuar rastreamento diário de sintomas'],
            riskFactors: ['Exposição ocupacional', 'História de alergias'],
            accuracy: 60,
            nextSteps: ['Agendar acompanhamento em 2 semanas']
          }
        },
        {
          day: 30,
          personalInsights: [
            'Posso identificar gatilhos ambientais',
            'Exercício ajuda a controlar a asma',
            'Poluição afeta minha respiração',
            'Medicamentos funcionam melhor em horários específicos',
            'Sinto mais controle sobre minha condição'
          ],
          healthScore: 80,
          patternsDiscovered: [
            'Gatilhos ambientais identificados',
            'Padrão de resposta ao exercício',
            'Correlação poluição-sintomas',
            'Timing otimizado de medicamentos'
          ],
          personalAchievements: [
            'Sequência de rastreamento de 30 dias',
            'Identificou 4 gatilhos principais',
            'Reduziu uso de medicamento de resgate',
            'Melhorou capacidade de exercício',
            'Desenvolveu estratégias de prevenção'
          ],
          doctorReport: {
            patientName: 'Maria Santos',
            day: 30,
            condition: 'Asma de Início na Idade Adulta - Bem Controlada',
            dataPoints: 30,
            insights: [
              'Excelente aderência ao monitoramento',
              'Gatilhos ambientais bem identificados',
              'Resposta ao exercício documentada',
              'Controle de medicamentos otimizado'
            ],
            patterns: [
              'Poluição aumenta sintomas em 40%',
              'Exercício regular melhora função pulmonar',
              'Medicamentos mais eficazes pela manhã',
              'Gatilhos específicos identificados'
            ],
            recommendations: [
              'Evitar exposição a gatilhos identificados',
              'Manter rotina de exercícios',
              'Otimizar timing de medicamentos',
              'Continuar monitoramento preventivo'
            ],
            riskFactors: ['Controlada com medicação e modificações ambientais'],
            accuracy: 93,
            nextSteps: [
              'Continuar regime atual',
              'Agendar espirometria em 3 meses',
              'Avaliar necessidade de ajuste medicamentoso'
            ]
          }
        }
      ]
    },
    {
      id: 'james',
      name: 'James Thompson',
      age: 38,
      condition: 'Knee Surgery Recovery',
      language: 'English',
      languageCode: 'en',
      occupation: 'Former Athlete',
      personalGoal: 'Return to full mobility and strength',
      icon: <Dumbbell className="w-8 h-8" />,
      color: 'from-teal-500 to-blue-500',
      dayProgress: [
        {
          day: 1,
          personalInsights: ['Started tracking recovery progress'],
          healthScore: 25,
          patternsDiscovered: [],
          personalAchievements: ['First entry completed'],
          doctorReport: {
            patientName: 'James Thompson',
            day: 1,
            condition: 'Post-Surgical Recovery - ACL Reconstruction',
            dataPoints: 1,
            insights: ['Basic post-surgical monitoring initiated'],
            patterns: [],
            recommendations: ['Continue daily recovery tracking'],
            riskFactors: ['Recent surgery', 'Limited mobility'],
            accuracy: 60,
            nextSteps: ['Schedule 2-week follow-up']
          }
        },
        {
          day: 30,
          personalInsights: [
            'Can see my strength returning',
            'Exercise progression is working',
            'Pain levels are decreasing',
            'Mobility is improving daily',
            'I feel confident about my recovery'
          ],
          healthScore: 85,
          patternsDiscovered: [
            'Strength recovery pattern',
            'Pain reduction timeline',
            'Mobility improvement curve',
            'Exercise effectiveness correlation'
          ],
          personalAchievements: [
            '30-day tracking streak',
            'Discovered 4 recovery patterns',
            'Improved knee strength by 60%',
            'Reduced pain by 70%',
            'Returned to light exercise'
          ],
          doctorReport: {
            patientName: 'James Thompson',
            day: 30,
            condition: 'Post-Surgical Recovery - Excellent Progress',
            dataPoints: 30,
            insights: [
              'Excellent recovery progress documented',
              'Exercise progression well tolerated',
              'Pain management effective',
              'Mobility improvements significant'
            ],
            patterns: [
              'Strength gains of 15-20% per week',
              'Pain reduction of 5-10% per week',
              'Mobility improvements correlate with exercise',
              'Recovery timeline ahead of schedule'
            ],
            recommendations: [
              'Continue current exercise progression',
              'Maintain pain management protocol',
              'Gradually increase activity level',
              'Continue physical therapy'
            ],
            riskFactors: ['Recovery progressing well, low risk'],
            accuracy: 96,
            nextSteps: [
              'Continue current recovery plan',
              'Schedule 6-week follow-up',
              'Consider advanced exercise progression'
            ]
          }
        }
      ]
    }
  ];

  const currentPersona = personas.find(p => p.id === selectedPersona);
  const currentProgress = currentPersona?.dayProgress.find(d => d.day === currentDay);
  const day1Report = currentPersona?.dayProgress.find(d => d.day === 1)?.doctorReport;
  const day30Report = currentPersona?.dayProgress.find(d => d.day === 30)?.doctorReport;
  
  // Ensure currentProgress has all required properties with defaults
  const safeProgress = currentProgress ? {
    ...currentProgress,
    dashboardData: currentProgress.dashboardData || {
      totalEntries: 0,
      recentEntries: 0,
      healthScore: 0,
      insights: ['No data available yet'],
      charts: [],
      trends: ['Keep tracking to see trends']
    },
    profileStats: currentProgress.profileStats || {
      totalEntries: 0,
      averageSeverity: 0,
      moodTrend: 0,
      mostCommonSymptoms: [],
      severityDistribution: [],
      monthlyTrends: []
    },
    patternAnalysis: currentProgress.patternAnalysis || {
      patterns: [],
      correlations: [],
      predictions: [],
      trends: []
    }
  } : null;

  if (!selectedPersona) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to App
            </button>
            <h1 className="text-3xl font-bold text-white text-center flex-1">
              Personal Health Journey
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
              Your Health Intelligence Journey
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              See how 6 different people transformed their health understanding over 30 days. 
              Each journey shows personal insights and medical reports that evolve with consistent tracking.
            </p>
          </motion.div>

          {/* Persona Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {personas.map((persona) => (
              <motion.div
                key={persona.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => setSelectedPersona(persona.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${persona.color}`}>
                    {persona.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                    <p className="text-white/60">{persona.condition}</p>
                    <p className="text-white/40 text-sm">{persona.language}</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-4">{persona.personalGoal}</p>
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">View Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSelectedPersona(null)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Personas
          </button>
          <h1 className="text-3xl font-bold text-white text-center flex-1">
            {currentPersona?.name}'s Health Journey
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Timeline Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Health Journey Timeline</h3>
          
          {/* Day Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 3, 7, 14, 21, 30].map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentDay === day
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(currentDay / 30) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* View Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {[
            { id: 'personal', label: 'Personal View', icon: <User className="w-4 h-4" /> },
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'profile', label: 'Profile Stats', icon: <Activity className="w-4 h-4" /> },
            { id: 'patterns', label: 'Patterns', icon: <Brain className="w-4 h-4" /> }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeView === view.id
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {view.icon}
              {view.label}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Content Based on Active View */}
        <AnimatePresence mode="wait">
          {activeView === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-8 mb-8"
            >
              {/* Left: Personal Stats */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Welcome back, {currentPersona?.name}!
                </h3>
                <p className="text-white/60 mb-6">Day {currentDay} of your health journey</p>
                
                {/* Personal Health Score */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">My Health Score</span>
                    <span className="text-3xl font-bold text-green-400">{currentProgress?.healthScore}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${currentProgress?.healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Personal Insights */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">What I've Learned About My Health:</h4>
                  <div className="space-y-2">
                    {currentProgress?.personalInsights.map((insight, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Achievements */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">My Achievements:</h4>
                  <div className="space-y-2">
                    {currentProgress?.personalAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Doctor's Report View */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Doctor's Report</h3>
                </div>
                
                {/* Medical Report Header */}
                <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">Patient: {currentPersona?.name}</h4>
                      <p className="text-white/60 text-sm">Day {currentDay} Report</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{currentProgress?.doctorReport.accuracy}%</div>
                      <div className="text-white/60 text-sm">Accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Medical Insights */}
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Clinical Insights:</h5>
                  <div className="space-y-1">
                    {currentProgress?.doctorReport.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span className="text-white/80 text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Recommendations */}
                <div>
                  <h5 className="text-white font-medium mb-2">Clinical Recommendations:</h5>
                  <div className="space-y-1">
                    {currentProgress?.doctorReport.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-400 mt-0.5" />
                        <span className="text-white/80 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                {currentPersona?.name}'s Dashboard - Day {currentDay}
              </h3>
              
              {/* Dashboard Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white">{safeProgress?.dashboardData.totalEntries}</div>
                  <div className="text-white/60">Total Entries</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-400">{safeProgress?.dashboardData.healthScore}</div>
                  <div className="text-white/60">Health Score</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-400">{safeProgress?.dashboardData.recentEntries}</div>
                  <div className="text-white/60">Recent Entries</div>
                </div>
              </div>

              {/* Dashboard Insights */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Dashboard Insights:</h4>
                <div className="space-y-2">
                  {safeProgress?.dashboardData.insights.map((insight, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Section */}
              {safeProgress?.dashboardData.charts.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Available Charts:</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {safeProgress?.dashboardData.charts.map((chart, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {chart.type === 'line' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                          {chart.type === 'bar' && <BarChart3 className="w-4 h-4 text-green-400" />}
                          {chart.type === 'pie' && <PieChart className="w-4 h-4 text-purple-400" />}
                          <span className="text-white font-medium">{chart.title}</span>
                        </div>
                        <p className="text-white/60 text-sm">{chart.data}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trends */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Current Trends:</h4>
                <div className="space-y-2">
                  {safeProgress?.dashboardData.trends.map((trend, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">{trend}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-green-400" />
                {currentPersona?.name}'s Profile Stats - Day {currentDay}
              </h3>
              
              {/* Profile Overview */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white">{safeProgress?.profileStats.totalEntries}</div>
                  <div className="text-white/60">Total Entries</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-yellow-400">{safeProgress?.profileStats.averageSeverity}</div>
                  <div className="text-white/60">Avg Severity</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-400">{safeProgress?.profileStats.moodTrend > 0 ? '+' : ''}{safeProgress?.profileStats.moodTrend}</div>
                  <div className="text-white/60">Mood Trend</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-400">{safeProgress?.profileStats.mostCommonSymptoms.length}</div>
                  <div className="text-white/60">Symptom Types</div>
                </div>
              </div>

              {/* Most Common Symptoms */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Most Common Symptoms:</h4>
                <div className="space-y-2">
                  {safeProgress?.profileStats.mostCommonSymptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{symptom.symptom}</span>
                      <span className="text-blue-400 font-medium">{symptom.count} times</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity Distribution */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Severity Distribution:</h4>
                <div className="space-y-2">
                  {safeProgress?.profileStats.severityDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white">{item.level}</span>
                      </div>
                      <span className="text-white font-medium">{item.count} entries</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trends */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Weekly Trends:</h4>
                <div className="space-y-2">
                  {safeProgress?.profileStats.monthlyTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{trend.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-white/60">{trend.entries} entries</span>
                        <span className="text-blue-400">Severity: {trend.avgSeverity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'patterns' && (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-400" />
                {currentPersona?.name}'s Pattern Analysis - Day {currentDay}
              </h3>
              
              {/* Patterns */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Discovered Patterns:</h4>
                <div className="space-y-2">
                  {safeProgress?.patternAnalysis.patterns.length > 0 ? (
                    safeProgress?.patternAnalysis.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-400 mt-0.5" />
                        <span className="text-white text-sm">{pattern}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-center py-8">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No patterns discovered yet. Keep tracking to unlock insights!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Correlations */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Correlations:</h4>
                <div className="space-y-2">
                  {safeProgress?.patternAnalysis.correlations.length > 0 ? (
                    safeProgress?.patternAnalysis.correlations.map((correlation, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                        <span className="text-white text-sm">{correlation}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-center py-4">
                      <p>No correlations found yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Predictions */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Predictions:</h4>
                <div className="space-y-2">
                  {safeProgress?.patternAnalysis.predictions.length > 0 ? (
                    safeProgress?.patternAnalysis.predictions.map((prediction, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                        <Target className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span className="text-white text-sm">{prediction}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-center py-4">
                      <p>No predictions available yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trends */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Trend Analysis:</h4>
                <div className="space-y-2">
                  {safeProgress?.patternAnalysis.trends.length > 0 ? (
                    safeProgress?.patternAnalysis.trends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <span className="text-white text-sm">{trend}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-center py-4">
                      <p>No trends identified yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            {showComparison ? 'Hide' : 'Show'} Day 1 vs Day 30 Comparison
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Report Comparison */}
        <AnimatePresence>
          {showComparison && day1Report && day30Report && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                  Health Intelligence Evolution
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Day 1 Report */}
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-white mb-4">Day 1 - Starting Point</h4>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{day1Report.dataPoints}</div>
                        <div className="text-white/60">Data Points</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{day1Report.accuracy}%</div>
                        <div className="text-white/60">Accuracy</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{day1Report.insights.length}</div>
                        <div className="text-white/60">Insights</div>
                      </div>
                    </div>
                  </div>

                  {/* Day 30 Report */}
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-white mb-4">Day 30 - Health Intelligence</h4>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
                        <div className="text-2xl font-bold text-green-400">{day30Report.dataPoints}</div>
                        <div className="text-white/60">Data Points</div>
                        <div className="text-green-400 text-sm">+{day30Report.dataPoints - day1Report.dataPoints} more data</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-400">{day30Report.accuracy}%</div>
                        <div className="text-white/60">Accuracy</div>
                        <div className="text-blue-400 text-sm">+{day30Report.accuracy - day1Report.accuracy}% improvement</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="text-2xl font-bold text-purple-400">{day30Report.insights.length}</div>
                        <div className="text-white/60">Insights</div>
                        <div className="text-purple-400 text-sm">+{day30Report.insights.length - day1Report.insights.length} new insights</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalHealthJourneyView;
