import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ApplicationData, createEmptyApplication } from '@/types/application';
import { saveCurrentDraft, getCurrentDraft } from '@/services/storage';

interface ApplicationContextType {
  data: ApplicationData;
  updateSection: <K extends keyof ApplicationData>(section: K, value: ApplicationData[K]) => void;
  resetApplication: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const TOTAL_STEPS = 6;

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ApplicationData>(getCurrentDraft);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    saveCurrentDraft(data);
  }, [data]);

  const updateSection = useCallback(<K extends keyof ApplicationData>(section: K, value: ApplicationData[K]) => {
    setData((prev) => ({ ...prev, [section]: value }));
  }, []);

  const resetApplication = useCallback(() => {
    setData(createEmptyApplication());
    setCurrentStep(0);
  }, []);

  return (
    <ApplicationContext.Provider
      value={{ data, updateSection, resetApplication, currentStep, setCurrentStep, totalSteps: TOTAL_STEPS }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}
