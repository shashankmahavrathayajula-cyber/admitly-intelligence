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
    apCoursesTaken: number | null;
    apCoursesAvailable: number | null;
    apCoursesAvailableNotSure?: boolean;
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
    apCoursesTaken: null,
    apCoursesAvailable: null,
    intendedMajor: '',
  },
  activities: [],
  honors: [],
  essays: {
    personalStatement: '',
  },
  universities: [],
});
