export interface Activity {
  id: string;
  name: string;
  role: string;
  description: string;
  yearsActive: number;
  isLeadership: boolean;
}

export interface Honor {
  id: string;
  title: string;
  level: 'school' | 'regional' | 'state' | 'national' | 'international';
  year: string;
}

export interface ApplicationData {
  academics: {
    gpa: number | null;
    courseRigor: 'standard' | 'honors' | 'ap_ib' | 'most_demanding' | '';
    intendedMajor: string;
    satScore?: number | null;
    actScore?: number | null;
  };
  activities: Activity[];
  honors: Honor[];
  essays: {
    personalStatement: string;
  };
  universities: string[];
  // Extensible: add SAT, classRank, demographics, etc. here later
  [key: string]: unknown;
}

export interface ApplicationDraft {
  id: string;
  name: string;
  data: ApplicationData;
  lastUpdated: string;
  status: 'draft' | 'submitted';
}

export const createEmptyApplication = (): ApplicationData => ({
  academics: {
    gpa: null,
    courseRigor: '',
    intendedMajor: '',
  },
  activities: [],
  honors: [],
  essays: {
    personalStatement: '',
  },
  universities: [],
});
