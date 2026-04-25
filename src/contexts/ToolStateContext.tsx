import React, { createContext, useContext, useState } from 'react';

interface ToolState {
  // Essay Analyzer
  essaySelectedSchool: string | null;
  essayResults: any | null;

  // Gap Analysis (Plan tab)
  planSelectedSchool: string | null;
  planSelectedTimeline: string | null;
  planResults: any | null;

  // School List Builder
  schoolListResults: any | null;
  schoolListBuiltAt: string | null;

  // Evaluation
  evaluationResults: any[] | null;
  evaluationProfile: any | null;

  // Setters
  setEssaySelectedSchool: (school: string | null) => void;
  setEssayResults: (results: any | null) => void;
  setPlanSelectedSchool: (school: string | null) => void;
  setPlanSelectedTimeline: (timeline: string | null) => void;
  setPlanResults: (results: any | null) => void;
  setSchoolListResults: (results: any | null) => void;
  setSchoolListBuiltAt: (date: string | null) => void;
  setEvaluationResults: (results: any[] | null) => void;
  setEvaluationProfile: (profile: any | null) => void;
}

const ToolStateContext = createContext<ToolState | undefined>(undefined);

export function ToolStateProvider({ children }: { children: React.ReactNode }) {
  const [essaySelectedSchool, setEssaySelectedSchool] = useState<string | null>(null);
  const [essayResults, setEssayResults] = useState<any | null>(null);
  const [planSelectedSchool, setPlanSelectedSchool] = useState<string | null>(null);
  const [planSelectedTimeline, setPlanSelectedTimeline] = useState<string | null>(null);
  const [planResults, setPlanResults] = useState<any | null>(null);
  const [schoolListResults, setSchoolListResults] = useState<any | null>(null);
  const [schoolListBuiltAt, setSchoolListBuiltAt] = useState<string | null>(null);
  const [evaluationResults, setEvaluationResults] = useState<any[] | null>(null);
  const [evaluationProfile, setEvaluationProfile] = useState<any | null>(null);

  return (
    <ToolStateContext.Provider
      value={{
        essaySelectedSchool,
        essayResults,
        planSelectedSchool,
        planSelectedTimeline,
        planResults,
        schoolListResults,
        schoolListBuiltAt,
        evaluationResults,
        evaluationProfile,
        setEssaySelectedSchool,
        setEssayResults,
        setPlanSelectedSchool,
        setPlanSelectedTimeline,
        setPlanResults,
        setSchoolListResults,
        setSchoolListBuiltAt,
        setEvaluationResults,
        setEvaluationProfile,
      }}
    >
      {children}
    </ToolStateContext.Provider>
  );
}

export function useToolState() {
  const ctx = useContext(ToolStateContext);
  if (!ctx) throw new Error('useToolState must be used within ToolStateProvider');
  return ctx;
}