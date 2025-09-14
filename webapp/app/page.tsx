'use client';

import { useState, useEffect } from 'react';
import LandingView from '../components/LandingView';
import EntryView from '../components/EntryView';
import MultilingualEntryView from '../components/MultilingualEntryView';
import ResultsView from '../components/ResultsView';
import DashboardView from '../components/DashboardView';
import PatternView from '../components/PatternView';
import ExportView from '../components/ExportView';
import { AppState, HealthEntry, AIHealthResponse } from '../types/health';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIHealthResponse | null>(null);
  const [useMultilingualMode, setUseMultilingualMode] = useState(false);

  // Load saved entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('healthEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Convert date strings back to Date objects
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          images: entry.images?.map((img: any) => ({
            ...img,
            uploadedAt: new Date(img.uploadedAt)
          }))
        }));
        setHealthEntries(entriesWithDates);
      } catch (error) {
        console.error('Error loading saved entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('healthEntries', JSON.stringify(healthEntries));
  }, [healthEntries]);

  const navigateToEntry = () => {
    setAppState(useMultilingualMode ? AppState.ENTRY : AppState.ENTRY);
  };

  const navigateToResults = (analysis: AIHealthResponse) => {
    setCurrentAnalysis(analysis);
    setAppState(AppState.RESULTS);
  };

  const navigateToExport = () => {
    setAppState(AppState.EXPORT);
  };

  const navigateToDashboard = () => {
    setAppState(AppState.DASHBOARD);
  };

  const navigateToPatterns = () => {
    setAppState(AppState.PATTERNS);
  };

  const navigateBack = () => {
    switch (appState) {
      case AppState.ENTRY:
      case AppState.RESULTS:
      case AppState.EXPORT:
      case AppState.DASHBOARD:
      case AppState.PATTERNS:
        setAppState(AppState.LANDING);
        break;
      default:
        setAppState(AppState.LANDING);
    }
  };

  const addHealthEntry = (entry: HealthEntry) => {
    setHealthEntries(prev => [entry, ...prev]);
  };

  const toggleMultilingualMode = () => {
    setUseMultilingualMode(prev => !prev);
  };

  const renderCurrentView = () => {
    switch (appState) {
      case AppState.LANDING:
        return (
          <LandingView
            onStartEntry={navigateToEntry}
            onViewDashboard={navigateToDashboard}
            hasEntries={healthEntries.length > 0}
            useMultilingualMode={useMultilingualMode}
            onToggleMultilingual={toggleMultilingualMode}
          />
        );
      
      case AppState.ENTRY:
        if (useMultilingualMode) {
          return (
            <MultilingualEntryView
              onNavigateBack={navigateBack}
              onAnalyzeComplete={navigateToResults}
              onAddEntry={addHealthEntry}
            />
          );
        } else {
          return (
            <EntryView
              onNavigateBack={navigateBack}
              onAnalyzeComplete={navigateToResults}
              onAddEntry={addHealthEntry}
            />
          );
        }
      
      case AppState.RESULTS:
        return (
          <ResultsView
            onNavigateBack={navigateBack}
            onExport={navigateToExport}
            onNewEntry={navigateToEntry}
            aiResponse={currentAnalysis!}
          />
        );
      
      case AppState.EXPORT:
        return (
          <ExportView
            onNavigateBack={navigateBack}
            healthEntries={healthEntries}
            currentAnalysis={currentAnalysis}
          />
        );
      
      case AppState.DASHBOARD:
        return (
          <DashboardView
            onNavigateBack={navigateBack}
            onViewPatterns={navigateToPatterns}
            healthEntries={healthEntries}
          />
        );
      
      case AppState.PATTERNS:
        return (
          <PatternView
            onNavigateBack={navigateBack}
            healthEntries={healthEntries}
          />
        );
      
      default:
        return (
          <LandingView
            onStartEntry={navigateToEntry}
            onViewDashboard={navigateToDashboard}
            hasEntries={healthEntries.length > 0}
            useMultilingualMode={useMultilingualMode}
            onToggleMultilingual={toggleMultilingualMode}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {renderCurrentView()}
      </div>
    </main>
  );
}