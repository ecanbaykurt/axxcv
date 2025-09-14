'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Download, 
  FileText, 
  Calendar,
  Brain,
  AlertTriangle,
  CheckCircle,
  Globe,
  Camera
} from 'lucide-react';
import { HealthEntry, AIHealthResponse } from '../types/health';

interface ExportViewProps {
  onNavigateBack: () => void;
  healthEntries: HealthEntry[];
  currentAnalysis?: AIHealthResponse | null;
}

export default function ExportView({ onNavigateBack, healthEntries, currentAnalysis }: ExportViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Create a simple text-based report
      const report = generateHealthReport(healthEntries, currentAnalysis);
      
      // Create and download the file
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHealthReport = (entries: HealthEntry[], analysis: AIHealthResponse | null) => {
    const report = [
      'HEALTHBRIDGE - GLOBAL HEALTH JOURNAL',
      '=====================================',
      '',
      `Report Generated: ${new Date().toLocaleDateString()}`,
      `Total Entries: ${entries.length}`,
      '',
      'IMPORTANT MEDICAL DISCLAIMER',
      '============================',
      'This report is for informational purposes only and does not constitute',
      'medical advice, diagnosis, or treatment. Always consult with a qualified',
      'healthcare professional for proper medical evaluation and care.',
      '',
      'HEALTH ENTRIES SUMMARY',
      '======================',
      ''
    ];

    if (entries.length === 0) {
      report.push('No health entries recorded yet.');
      return report.join('\n');
    }

    // Add entries
    entries.forEach((entry, index) => {
      report.push(`Entry ${index + 1}: ${entry.date.toLocaleDateString()}`);
      report.push(`Input: ${entry.inputText}`);
      
      if (entry.isVoiceInput) {
        report.push('(Voice Input)');
      }
      
      if (entry.images && entry.images.length > 0) {
        report.push(`Images: ${entry.images.length} uploaded`);
      }
      
      if (entry.aiResponse) {
        report.push(`AI Summary: ${entry.aiResponse.summary}`);
        
        if (entry.aiResponse.timeline && entry.aiResponse.timeline.length > 0) {
          report.push('Symptoms:');
          entry.aiResponse.timeline.forEach((symptom, i) => {
            report.push(`  ${i + 1}. ${symptom.symptom} (Severity: ${symptom.severity}/10)`);
          });
        }
        
        if (entry.aiResponse.redFlags && entry.aiResponse.redFlags.length > 0) {
          report.push('Important Considerations:');
          entry.aiResponse.redFlags.forEach((flag, i) => {
            report.push(`  ${i + 1}. ${flag.description} (${flag.severity})`);
          });
        }
        
        report.push(`Recommendations: ${entry.aiResponse.advice}`);
      }
      
      report.push('');
      report.push('---');
      report.push('');
    });

    // Add current analysis if available
    if (analysis) {
      report.push('CURRENT ANALYSIS');
      report.push('================');
      report.push(`Summary: ${analysis.summary}`);
      report.push(`Advice: ${analysis.advice}`);
      report.push('');
    }

    // Add statistics
    const totalSymptoms = entries.reduce((count, entry) => 
      count + (entry.aiResponse?.timeline?.length || 0), 0);
    const highSeverityCount = entries.reduce((count, entry) => 
      count + (entry.aiResponse?.timeline?.filter(s => s.severity >= 7).length || 0), 0);
    const redFlagsCount = entries.reduce((count, entry) => 
      count + (entry.aiResponse?.redFlags?.length || 0), 0);

    report.push('STATISTICS');
    report.push('==========');
    report.push(`Total Symptoms Recorded: ${totalSymptoms}`);
    report.push(`High Severity Symptoms: ${highSeverityCount}`);
    report.push(`Important Health Flags: ${redFlagsCount}`);
    report.push('');

    report.push('END OF REPORT');
    report.push('=============');

    return report.join('\n');
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

        <h1 className="text-xl font-semibold text-white">Export Report</h1>

        <div className="w-12" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 space-y-6">
        {/* Export Options */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Export Options</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Text Report</h3>
              <p className="text-white/70 text-sm mb-4">
                Generate a comprehensive text report with all your health entries, AI analysis, and recommendations.
              </p>
              <button
                onClick={generatePDF}
                disabled={isGenerating || healthEntries.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-3 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Report Preview */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Report Preview</h2>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-white/80 text-sm whitespace-pre-wrap">
              {generateHealthReport(healthEntries, currentAnalysis).substring(0, 500)}
              {generateHealthReport(healthEntries, currentAnalysis).length > 500 && '...'}
            </pre>
          </div>
          
          <p className="text-white/50 text-xs mt-2">
            {generateHealthReport(healthEntries, currentAnalysis).length} characters total
          </p>
        </motion.div>

        {/* Statistics */}
        {healthEntries.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Export Statistics</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{healthEntries.length}</div>
                <div className="text-white/70 text-sm">Entries</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {healthEntries.reduce((count, entry) => count + (entry.aiResponse?.timeline?.length || 0), 0)}
                </div>
                <div className="text-white/70 text-sm">Symptoms</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {healthEntries.filter(entry => entry.isVoiceInput).length}
                </div>
                <div className="text-white/70 text-sm">Voice Entries</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {healthEntries.reduce((count, entry) => count + (entry.images?.length || 0), 0)}
                </div>
                <div className="text-white/70 text-sm">Images</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          className="glass rounded-2xl p-6 bg-orange-500/10 border border-orange-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-orange-300 font-semibold mb-2">Export Disclaimer</h3>
              <p className="text-orange-200/80 text-sm leading-relaxed">
                The exported report contains your personal health information. Please keep it secure and only share 
                with trusted healthcare professionals. This data is for informational purposes only and should not 
                replace professional medical advice.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
