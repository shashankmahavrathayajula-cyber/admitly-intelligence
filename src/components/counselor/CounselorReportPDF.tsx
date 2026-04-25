import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const COLORS = {
  navy: '#1a1f36',
  coral: '#e85d3a',
  teal: '#0d9488',
  amber: '#d97706',
  red: '#dc2626',
  gray: '#6b7280',
  darkGray: '#374151',
  lightGray: '#f8f9fb',
  border: '#e5e7eb',
  white: '#ffffff',
};

function scoreColor(score: number): string {
  if (score >= 7) return COLORS.teal;
  if (score >= 4) return COLORS.amber;
  return COLORS.red;
}

function bandColor(band: string): string {
  const b = (band || '').toLowerCase();
  if (b === 'safety') return COLORS.teal;
  if (b === 'target') return COLORS.amber;
  return COLORS.red;
}

function gapBorderColor(avg: number): string {
  if (avg < 4) return COLORS.red;
  if (avg <= 5.5) return COLORS.amber;
  return COLORS.teal;
}

function abbreviateSchool(name: string): string {
  return name
    .replace('University of California, ', 'UC ')
    .replace('The University of Texas at ', 'UT ')
    .replace('University of Washington', 'UW')
    .replace('Washington State University', 'WSU')
    .replace('Massachusetts Institute of Technology', 'MIT')
    .replace('University of Southern California', 'USC')
    .replace('University of Michigan', 'UMich')
    .replace(' University', '');
}

function truncate(text: string, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function truncateAtWord(text: string, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return cut.trimEnd() + '...';
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.navy,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brand: {
    color: COLORS.coral,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
  },
  headerDate: {
    fontSize: 9,
    color: COLORS.gray,
    marginTop: 2,
  },
  rule: {
    height: 2,
    backgroundColor: COLORS.coral,
    marginBottom: 16,
  },
  smallLabel: {
    fontSize: 8,
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 16,
  },
  subheader: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    marginTop: 14,
    color: COLORS.navy,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.navy,
  },
  small: {
    fontSize: 8,
    color: COLORS.gray,
  },
  italicGray: {
    fontSize: 10,
    color: COLORS.gray,
    fontFamily: 'Helvetica-Oblique',
  },
  profileLine: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
    color: COLORS.navy,
  },
  profileLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  // School mini-card (page 1)
  schoolCard: {
    backgroundColor: COLORS.lightGray,
    borderLeftWidth: 3,
    padding: 8,
    marginBottom: 8,
  },
  schoolCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  schoolCardName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    flex: 1,
  },
  schoolCardScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolCardScore: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
  },
  schoolCardBand: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  schoolSignalLine: {
    fontSize: 8.5,
    color: COLORS.darkGray,
    lineHeight: 1.4,
    marginTop: 2,
  },
  // Executive summary
  executiveSummary: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.5,
    marginTop: 4,
  },
  executiveTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginTop: 12,
    marginBottom: 6,
  },
  // Comparison table
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  tableCellLast: {
    padding: 6,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: COLORS.navy,
    color: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  tableHeaderCellLast: {
    padding: 6,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: COLORS.navy,
    color: COLORS.white,
  },
  // Key findings
  findingsTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginTop: 16,
    marginBottom: 8,
  },
  findingParagraph: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  // Strategic action plan cards
  priorityCard: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  priorityLabel: {
    fontSize: 7,
    color: COLORS.gray,
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  priorityTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 2,
  },
  priorityGap: {
    fontSize: 9,
    color: COLORS.gray,
    marginBottom: 4,
  },
  prioritySectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginTop: 8,
    marginBottom: 2,
  },
  priorityBodyText: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.4,
  },
  // Strengths to protect
  strengthRow: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.teal,
    paddingLeft: 8,
    marginBottom: 6,
  },
  strengthName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.teal,
    marginBottom: 2,
  },
  strengthAdvice: {
    fontSize: 8,
    color: COLORS.gray,
    lineHeight: 1.4,
  },
  // Discussion guide
  discussionIntro: {
    fontSize: 9,
    color: COLORS.gray,
    lineHeight: 1.5,
    marginTop: 6,
    marginBottom: 14,
  },
  questionBlock: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 4,
  },
  contextLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
  },
  contextText: {
    fontSize: 10,
    color: COLORS.navy,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  basedOn: {
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
    color: COLORS.gray,
  },
  questionDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: COLORS.gray,
  },
});

interface ProfileProps {
  gpa: number;
  intendedMajor: string;
  apCoursesTaken: number;
  apCoursesAvailable: number;
  satScore?: number;
  activitiesCount: number;
  leadershipRoles: number;
  honorsCount: number;
}

interface EvaluationProps {
  university: string;
  alignmentScore: number;
  academicStrength: number;
  activityImpact: number;
  honorsAwards: number;
  narrativeStrength: number;
  institutionalFit: number;
  band: string;
  strengths: string[];
  weaknesses: string[];
}

interface CounselorReportProps {
  studentName: string;
  generatedDate: string;
  profile: ProfileProps;
  evaluations: EvaluationProps[];
  essayAnalyses: Array<{
    university: string;
    strategicFit: number;
    contentAnalysis: number;
    structureAndVoice: number;
    overallVerdict: string;
  }>;
  discussionQuestions: Array<{
    question: string;
    context: string;
    dataPoint: string;
  }>;
}

function PageFooter({ pageNumber }: { pageNumber: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>Generated by Admitly | useadmitly.com</Text>
      <Text style={styles.footerText}>Page {pageNumber}</Text>
    </View>
  );
}

function Header({ generatedDate }: { generatedDate: string }) {
  return (
    <>
      <View style={styles.brandRow}>
        <Text style={styles.brand}>ADMITLY</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>Counselor Summary</Text>
          <Text style={styles.headerDate}>{generatedDate}</Text>
        </View>
      </View>
      <View style={styles.rule} />
    </>
  );
}

const DIMENSIONS: Array<{ key: keyof EvaluationProps; label: string }> = [
  { key: 'academicStrength', label: 'Academic Strength' },
  { key: 'activityImpact', label: 'Activity Impact' },
  { key: 'honorsAwards', label: 'Honors & Awards' },
  { key: 'narrativeStrength', label: 'Narrative Strength' },
  { key: 'institutionalFit', label: 'Institutional Fit' },
];

const DIM_LABELS_LOWER: Record<string, string> = {
  academicStrength: 'academic preparation',
  activityImpact: 'extracurricular impact',
  honorsAwards: 'honors and recognition',
  narrativeStrength: 'essay and narrative',
  institutionalFit: 'institutional fit',
};

const DIM_KEYWORDS: Record<string, string[]> = {
  academicStrength: ['gpa', 'grade', 'transcript', 'course', 'rigor', 'ap ', 'sat', 'act', 'academic', 'class rank'],
  activityImpact: ['extracurricular', 'activity', 'club', 'sport', 'volunteer', 'leadership', 'president', 'captain', 'team', 'organization'],
  honorsAwards: ['award', 'honor', 'scholar', 'recognition', 'medal', 'prize', 'competition', 'distinction'],
  narrativeStrength: ['essay', 'personal statement', 'writing', 'story', 'voice', 'narrative', 'reflection', 'piq'],
  institutionalFit: ['fit', 'major', 'campus', 'culture', 'mission', 'program', 'why us', 'supplement'],
};

function generateExecutiveSummary(evaluations: EvaluationProps[]): string {
  if (evaluations.length === 0) return '';
  const reachSchools = evaluations.filter((e) => (e.band || '').toLowerCase() === 'reach');
  const targetSchools = evaluations.filter((e) => (e.band || '').toLowerCase() === 'target');
  const safetySchools = evaluations.filter((e) => (e.band || '').toLowerCase() === 'safety');

  const dims = ['academicStrength', 'activityImpact', 'honorsAwards', 'narrativeStrength', 'institutionalFit'] as const;
  const avgs = dims.map((d) => ({
    dim: d,
    avg: evaluations.reduce((s, e) => s + (Number(e[d]) || 0), 0) / evaluations.length,
  }));

  const strongest = avgs.reduce((a, b) => (a.avg > b.avg ? a : b));
  const weakest = avgs.reduce((a, b) => (a.avg < b.avg ? a : b));

  let summary = '';

  if (reachSchools.length > 0 && safetySchools.length > 0) {
    summary += `This student's application portfolio spans from competitive reach schools (${reachSchools.map((e) => e.university.replace(' University', '')).join(', ')}) to strong safety positions (${safetySchools.map((e) => e.university.replace(' University', '')).join(', ')}). `;
  } else if (reachSchools.length === evaluations.length) {
    summary += `All evaluated schools are reach-level for this student, indicating an ambitious but challenging application strategy. `;
  } else if (safetySchools.length === evaluations.length) {
    summary += `This student is well-positioned at all evaluated schools, with strong alignment scores across the board. `;
  } else if (targetSchools.length === evaluations.length) {
    summary += `All evaluated schools fall in the target range, suggesting a well-calibrated list with realistic admission prospects. `;
  } else {
    summary += `The student shows mixed positioning across their target schools. `;
  }

  summary += `Their strongest dimension is ${DIM_LABELS_LOWER[strongest.dim]} (${strongest.avg.toFixed(1)}/10 average), while ${DIM_LABELS_LOWER[weakest.dim]} (${weakest.avg.toFixed(1)}/10) represents the most significant opportunity for improvement. `;

  if (weakest.avg < 4) {
    summary += `Addressing ${DIM_LABELS_LOWER[weakest.dim]} should be the top priority — at current levels, it significantly weakens applications at all target schools.`;
  } else if (weakest.avg < 6) {
    summary += `Targeted work on ${DIM_LABELS_LOWER[weakest.dim]} could meaningfully shift outcomes, particularly at the more selective schools on this list.`;
  } else {
    summary += `The student's profile is relatively balanced, with no critical gaps to address.`;
  }

  return summary;
}

function generateKeyFindings(evaluations: EvaluationProps[]): string[] {
  if (evaluations.length === 0) return [];
  const findings: string[] = [];
  const dims = ['academicStrength', 'activityImpact', 'honorsAwards', 'narrativeStrength', 'institutionalFit'] as const;
  const dimLabels: Record<string, string> = {
    academicStrength: 'Academic Strength',
    activityImpact: 'Activity Impact',
    honorsAwards: 'Honors & Awards',
    narrativeStrength: 'Narrative Strength',
    institutionalFit: 'Institutional Fit',
  };

  const avgs = dims.map((d) => ({
    dim: d,
    label: dimLabels[d],
    avg: evaluations.reduce((s, e) => s + (Number(e[d]) || 0), 0) / evaluations.length,
    values: evaluations.map((e) => Number(e[d]) || 0),
  }));

  const strongest = avgs.reduce((a, b) => (a.avg > b.avg ? a : b));
  findings.push(
    `${strongest.label} is the student's strongest dimension at ${strongest.avg.toFixed(1)}/10 average. This is a genuine asset that should be highlighted and protected throughout the application process.`,
  );

  const weakest = avgs.reduce((a, b) => (a.avg < b.avg ? a : b));
  if (weakest.avg < 5) {
    findings.push(
      `${weakest.label} at ${weakest.avg.toFixed(1)}/10 is a significant gap that likely limits outcomes at more selective schools. This should be the primary focus of the counseling conversation.`,
    );
  } else {
    findings.push(
      `${weakest.label} at ${weakest.avg.toFixed(1)}/10 is the lowest-scoring dimension. While not critically weak, improving it would strengthen applications across all target schools.`,
    );
  }

  for (const dim of avgs) {
    const spread = Math.max(...dim.values) - Math.min(...dim.values);
    if (spread >= 2 && evaluations.length >= 2) {
      const highIdx = dim.values.indexOf(Math.max(...dim.values));
      const lowIdx = dim.values.indexOf(Math.min(...dim.values));
      const highSchool = evaluations[highIdx].university.replace(' University', '');
      const lowSchool = evaluations[lowIdx].university.replace(' University', '');
      findings.push(
        `${dim.label} varies significantly: ${Math.max(...dim.values).toFixed(1)} at ${highSchool} versus ${Math.min(...dim.values).toFixed(1)} at ${lowSchool}. This suggests the student's profile resonates differently with different institutional priorities — school-specific tailoring of application materials could help close this gap.`,
      );
      break;
    }
  }

  return findings;
}

function pickWeaknessForDimension(
  dimKey: string,
  evaluations: EvaluationProps[],
  used: Set<string>,
): string | null {
  const keywords = DIM_KEYWORDS[dimKey] || [];
  // First pass: keyword-matched
  for (const ev of evaluations) {
    for (const w of ev.weaknesses || []) {
      if (used.has(w)) continue;
      const lower = w.toLowerCase();
      if (keywords.some((k) => lower.includes(k))) {
        used.add(w);
        return w;
      }
    }
  }
  // Fallback: any unused weakness
  for (const ev of evaluations) {
    for (const w of ev.weaknesses || []) {
      if (!used.has(w)) {
        used.add(w);
        return w;
      }
    }
  }
  return null;
}

function getRecommendedAction(dimKey: string, avg: number, profile: ProfileProps): string {
  switch (dimKey) {
    case 'activityImpact':
      if (profile.activitiesCount === 0)
        return 'Begin by documenting all current and past involvements — including informal roles, family responsibilities, and personal projects. Even without formal extracurriculars, demonstrated initiative and consistency carry weight. Focus on 1-2 areas where you can show deepening commitment before applications.';
      if (profile.leadershipRoles === 0)
        return 'The current activities show involvement but lack leadership positioning. Seek opportunities to take on coordinating roles — organizing an event, mentoring newer members, or leading a project within an existing commitment. Document specific outcomes with numbers where possible.';
      return 'Focus on documenting measurable outcomes in your strongest activities. Quantify impact where possible — members recruited, funds raised, events organized, people served. Admissions readers look for evidence of genuine impact, not just participation.';

    case 'honorsAwards':
      if (profile.honorsCount === 0)
        return 'No formal recognitions are currently listed. Immediate opportunities to pursue: AP Scholar designation from upcoming AP exams, National Honor Society application, subject-specific honor societies (like Mu Alpha Theta for math), school-level departmental awards, or regional competitions in your intended major. Even 2-3 recognitions significantly strengthen this dimension.';
      return 'Strengthen this dimension by identifying competitions and recognition programs with upcoming deadlines in your intended field. School-level awards, regional academic competitions, and subject-specific honor societies all contribute. Ask teachers and counselors about nomination-based awards you may be eligible for.';

    case 'academicStrength':
      return 'Academic trajectory is largely set at this point. If standardized test scores can still be improved, a focused retake may be the highest-ROI action. Otherwise, prioritize a strong final semester — upward grade trends signal resilience. Ensure course selection demonstrates rigor appropriate to intended major.';

    case 'narrativeStrength':
      if (avg < 4)
        return 'The personal essay needs substantial revision. Focus on one specific moment or experience — not a life overview. Every paragraph should contain at least one concrete, sensory detail. Read it aloud: if it sounds like anyone else could have written it, it needs more of your specific voice and perspective.';
      return 'The essay foundation is there but needs sharpening. Identify the single most memorable moment in your current draft and build outward from it. Replace abstract statements ("I learned the value of perseverance") with specific scenes showing that lesson in action. Have someone who does not know you read it — if they can describe you accurately afterward, it is working.';

    case 'institutionalFit':
      return 'Research each school beyond the surface. Name specific programs, courses, research labs, faculty, traditions, or student organizations that connect to your goals and interests. Generic statements like "the diverse community" signal that you have not done your homework. Each school\'s supplemental essays should feel like they could only have been written for that school.';

    default:
      return 'Focus improvement efforts on concrete, measurable actions that directly address the specific feedback from your evaluations.';
  }
}

function getProtectionAdvice(dimKey: string): string {
  switch (dimKey) {
    case 'academicStrength':
      return 'Academic foundation is solid — maintain current trajectory. No significant intervention needed.';
    case 'activityImpact':
      return 'Continue current commitments and document any new outcomes. Avoid starting new activities that could dilute your demonstrated depth.';
    case 'honorsAwards':
      return 'Recognition profile supports the application well. Highlight the most relevant awards in your activities section and reference them in essays where natural.';
    case 'narrativeStrength':
      return 'Essay quality is a genuine asset. Avoid the temptation to over-revise. Focus supplemental essays on school-specific tailoring rather than rewriting your personal statement.';
    case 'institutionalFit':
      return 'Application demonstrates authentic school knowledge. Maintain this level of specificity and genuine engagement across all applications.';
    default:
      return 'This is a strength — maintain and protect it throughout the application process.';
  }
}

function generateFallbackQuestions(
  evaluations: EvaluationProps[],
): Array<{ question: string; context: string; dataPoint: string }> {
  if (evaluations.length === 0) return [];
  const questions: Array<{ question: string; context: string; dataPoint: string }> = [];
  const dims = ['academicStrength', 'activityImpact', 'honorsAwards', 'narrativeStrength', 'institutionalFit'] as const;
  const dimLabels: Record<string, string> = {
    academicStrength: 'Academic Strength',
    activityImpact: 'Activity Impact',
    honorsAwards: 'Honors & Awards',
    narrativeStrength: 'Narrative Strength',
    institutionalFit: 'Institutional Fit',
  };
  const avgs = dims.map((d) => ({
    dim: d,
    label: dimLabels[d],
    avg: evaluations.reduce((s, e) => s + (Number(e[d]) || 0), 0) / evaluations.length,
    values: evaluations.map((e) => Number(e[d]) || 0),
  }));

  const weakest = avgs.reduce((a, b) => (a.avg < b.avg ? a : b));
  questions.push({
    question: `What concrete steps can be taken in the next 60 days to strengthen ${weakest.label.toLowerCase()}?`,
    context: `${weakest.label} scored ${weakest.avg.toFixed(1)}/10 on average — the lowest of any dimension. Improvement here would lift outcomes across the entire school list.`,
    dataPoint: `Average ${weakest.label} score: ${weakest.avg.toFixed(1)}/10`,
  });

  if (evaluations.length >= 2) {
    let biggestSpread = { dim: avgs[0], spread: 0, highSchool: '', lowSchool: '' };
    for (const dim of avgs) {
      const spread = Math.max(...dim.values) - Math.min(...dim.values);
      if (spread > biggestSpread.spread) {
        const highIdx = dim.values.indexOf(Math.max(...dim.values));
        const lowIdx = dim.values.indexOf(Math.min(...dim.values));
        biggestSpread = {
          dim,
          spread,
          highSchool: evaluations[highIdx].university.replace(' University', ''),
          lowSchool: evaluations[lowIdx].university.replace(' University', ''),
        };
      }
    }
    if (biggestSpread.spread >= 1.5) {
      questions.push({
        question: `Why does ${biggestSpread.dim.label.toLowerCase()} land so differently at ${biggestSpread.highSchool} versus ${biggestSpread.lowSchool}?`,
        context: `The same profile was scored ${Math.max(...biggestSpread.dim.values).toFixed(1)} at one school and ${Math.min(...biggestSpread.dim.values).toFixed(1)} at another — likely a signal that materials need school-specific tailoring.`,
        dataPoint: `${biggestSpread.dim.label} spread: ${biggestSpread.spread.toFixed(1)} points`,
      });
    }
  }

  questions.push({
    question: 'What experiences or commitments are not yet captured in the application materials?',
    context: 'Evaluations can only score what is visible. Family responsibilities, informal mentoring, personal projects, or work outside formal activities often go unreported but matter to admissions readers.',
    dataPoint: 'Standard gap-check question for any application',
  });

  return questions;
}

export default function CounselorReportPDF(props: CounselorReportProps) {
  const { studentName, generatedDate, profile, evaluations, essayAnalyses, discussionQuestions } = props;

  // Compute averages per dimension
  const dimAverages = DIMENSIONS.map((d) => {
    const vals = evaluations.map((e) => Number(e[d.key]) || 0);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { ...d, avg };
  });
  const sortedAsc = [...dimAverages].sort((a, b) => a.avg - b.avg);
  const gaps = sortedAsc.filter((d) => d.avg < 7.0).slice(0, 3);
  const strong = dimAverages.filter((d) => d.avg >= 7.0);

  const executiveSummary = generateExecutiveSummary(evaluations);
  const keyFindings = generateKeyFindings(evaluations);

  // Exclusive weakness assignment per priority
  const usedWeaknesses = new Set<string>();
  const priorityData = gaps.map((g) => ({
    ...g,
    weakness: pickWeaknessForDimension(g.key as string, evaluations, usedWeaknesses),
    action: getRecommendedAction(g.key as string, g.avg, profile),
    gapToTarget: Math.max(0, 7.0 - g.avg),
  }));

  const isMulti = evaluations.length > 1;
  const comparisonTitle = isMulti
    ? 'Cross-School Comparison'
    : `Detailed Evaluation: ${evaluations[0]?.university || ''}`;

  // Profile lines
  const profileLines: Array<{ label: string; value: string; gray?: boolean }> = [];
  if (profile.gpa > 0) profileLines.push({ label: 'GPA:', value: String(profile.gpa) });
  else profileLines.push({ label: 'GPA:', value: 'Not provided', gray: true });

  if (profile.intendedMajor && profile.intendedMajor !== 'Not specified') {
    profileLines.push({ label: 'Intended Major:', value: profile.intendedMajor });
  } else {
    profileLines.push({ label: 'Intended Major:', value: 'Not provided', gray: true });
  }

  if (profile.apCoursesTaken > 0 || profile.apCoursesAvailable > 0) {
    profileLines.push({
      label: 'AP Courses:',
      value: `${profile.apCoursesTaken} taken${profile.apCoursesAvailable ? ` of ${profile.apCoursesAvailable} available` : ''}`,
    });
  }
  if (profile.satScore) {
    profileLines.push({ label: 'SAT:', value: String(profile.satScore) });
  }

  const allCountsZero = !profile.activitiesCount && !profile.leadershipRoles && !profile.honorsCount;

  // Discussion questions: use provided, fall back if too few
  const finalQuestions =
    discussionQuestions && discussionQuestions.length >= 3
      ? discussionQuestions
      : [...(discussionQuestions || []), ...generateFallbackQuestions(evaluations)].slice(0, 4);

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="LETTER" style={styles.page}>
        <Header generatedDate={generatedDate} />

        <Text style={styles.smallLabel}>Student Profile</Text>
        <Text style={styles.studentName}>{studentName}</Text>

        <Text style={styles.subheader}>Profile</Text>
        {profileLines.map((line, i) => (
          <Text key={i} style={[styles.profileLine, line.gray ? { color: COLORS.gray } : {}]}>
            <Text style={styles.profileLabel}>{line.label} </Text>
            {line.value}
          </Text>
        ))}

        <Text style={styles.subheader}>Application Snapshot</Text>
        {allCountsZero ? (
          <Text style={styles.italicGray}>Profile details not available for this evaluation.</Text>
        ) : (
          <Text style={styles.body}>
            Activities: {profile.activitiesCount} {'\u00B7'} Leadership: {profile.leadershipRoles} {'\u00B7'} Honors: {profile.honorsCount}
          </Text>
        )}

        <Text style={styles.subheader}>Schools Evaluated</Text>
        {evaluations.map((e, i) => {
          const strongest = (e.strengths && e.strengths[0]) || '';
          const concern = (e.weaknesses && e.weaknesses[0]) || '';
          return (
            <View key={i} style={[styles.schoolCard, { borderLeftColor: bandColor(e.band) }]}>
              <View style={styles.schoolCardHeader}>
                <Text style={styles.schoolCardName}>{e.university}</Text>
                <View style={styles.schoolCardScoreRow}>
                  <Text style={[styles.schoolCardScore, { color: scoreColor(e.alignmentScore) }]}>
                    {e.alignmentScore.toFixed(1)}/10
                  </Text>
                  <Text style={[styles.schoolCardBand, { color: bandColor(e.band) }]}>
                    {(e.band || 'UNKNOWN').toUpperCase()}
                  </Text>
                </View>
              </View>
              {strongest ? (
                <Text style={styles.schoolSignalLine}>
                  <Text style={{ color: COLORS.teal, fontFamily: 'Helvetica-Bold' }}>{'\u2713 '}</Text>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Strongest signal: </Text>
                  {truncateAtWord(strongest, 200)}
                </Text>
              ) : null}
              {concern ? (
                <Text style={styles.schoolSignalLine}>
                  <Text style={{ color: COLORS.amber, fontFamily: 'Helvetica-Bold' }}>{'\u25B3 '}</Text>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>Key concern: </Text>
                  {truncateAtWord(concern, 200)}
                </Text>
              ) : null}
            </View>
          );
        })}

        {executiveSummary ? (
          <>
            <Text style={styles.executiveTitle}>Executive Summary</Text>
            <Text style={styles.executiveSummary}>{executiveSummary}</Text>
          </>
        ) : null}

        <PageFooter pageNumber={1} />
      </Page>

      {/* PAGE 2 */}
      <Page size="LETTER" style={styles.page}>
        <Header generatedDate={generatedDate} />
        <Text style={styles.headerTitle}>{comparisonTitle}</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Dimension</Text>
            {evaluations.map((e, i) => {
              const isLast = i === evaluations.length - 1;
              return (
                <Text
                  key={i}
                  style={[isLast ? styles.tableHeaderCellLast : styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}
                >
                  {abbreviateSchool(e.university)}
                </Text>
              );
            })}
          </View>

          {DIMENSIONS.map((d, rowIdx) => (
            <View key={d.key} style={[styles.tableRow, { backgroundColor: rowIdx % 2 === 0 ? COLORS.white : COLORS.lightGray }]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{d.label}</Text>
              {evaluations.map((e, i) => {
                const isLast = i === evaluations.length - 1;
                const v = Number(e[d.key]) || 0;
                return (
                  <Text
                    key={i}
                    style={[
                      isLast ? styles.tableCellLast : styles.tableCell,
                      { flex: 1, textAlign: 'center', color: scoreColor(v), fontFamily: 'Helvetica-Bold' },
                    ]}
                  >
                    {v.toFixed(1)}
                  </Text>
                );
              })}
            </View>
          ))}

          <View style={[styles.tableRow, { backgroundColor: DIMENSIONS.length % 2 === 0 ? COLORS.white : COLORS.lightGray }]}>
            <Text style={[styles.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>Alignment Score</Text>
            {evaluations.map((e, i) => {
              const isLast = i === evaluations.length - 1;
              return (
                <Text
                  key={i}
                  style={[
                    isLast ? styles.tableCellLast : styles.tableCell,
                    { flex: 1, textAlign: 'center', color: scoreColor(e.alignmentScore), fontFamily: 'Helvetica-Bold' },
                  ]}
                >
                  {e.alignmentScore.toFixed(1)}
                </Text>
              );
            })}
          </View>
        </View>

        {keyFindings.length > 0 ? (
          <>
            <Text style={styles.findingsTitle}>Key Findings</Text>
            {keyFindings.map((f, i) => (
              <Text key={i} style={styles.findingParagraph}>{f}</Text>
            ))}
          </>
        ) : null}

        <PageFooter pageNumber={2} />
      </Page>

      {/* PAGE 3 */}
      <Page size="LETTER" style={styles.page}>
        <Header generatedDate={generatedDate} />
        <Text style={styles.headerTitle}>Strategic Action Plan</Text>

        <View style={{ marginTop: 12 }}>
          {priorityData.length === 0 ? (
            <Text style={styles.italicGray}>No major gaps detected — profile is balanced across all dimensions.</Text>
          ) : (
            priorityData.map((p, i) => (
              <View key={p.key as string} style={[styles.priorityCard, { borderLeftColor: gapBorderColor(p.avg) }]}>
                <Text style={styles.priorityLabel}>PRIORITY {i + 1}</Text>
                <Text style={styles.priorityTitle}>
                  {p.label} — {p.avg.toFixed(1)}/10 average
                </Text>
                <Text style={styles.priorityGap}>Gap to target: {p.gapToTarget.toFixed(1)} points</Text>

                {p.weakness ? (
                  <>
                    <Text style={styles.prioritySectionLabel}>What the evaluations found:</Text>
                    <Text style={styles.priorityBodyText}>{p.weakness}</Text>
                  </>
                ) : null}

                <Text style={styles.prioritySectionLabel}>Recommended action:</Text>
                <Text style={styles.priorityBodyText}>{p.action}</Text>
              </View>
            ))
          )}
        </View>

        {strong.length > 0 ? (
          <>
            <Text style={[styles.executiveTitle, { marginTop: 16 }]}>Strengths to Protect</Text>
            {strong.map((s) => (
              <View key={s.key as string} style={styles.strengthRow}>
                <Text style={styles.strengthName}>
                  {s.label} — {s.avg.toFixed(1)}/10 average
                </Text>
                <Text style={styles.strengthAdvice}>{getProtectionAdvice(s.key as string)}</Text>
              </View>
            ))}
          </>
        ) : null}

        {essayAnalyses.length > 0 && (
          <>
            <Text style={styles.subheader}>Essay Performance</Text>
            {essayAnalyses.map((ea, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={[styles.body, { fontFamily: 'Helvetica-Bold' }]}>{ea.university}</Text>
                <Text style={styles.small}>
                  Strategic Fit: {Number(ea.strategicFit).toFixed(1)} {'\u00B7'} Content: {Number(ea.contentAnalysis).toFixed(1)} {'\u00B7'} Structure: {Number(ea.structureAndVoice).toFixed(1)}
                </Text>
                {ea.overallVerdict && (
                  <Text style={[styles.body, { marginTop: 2 }]}>
                    {ea.overallVerdict.length > 80 ? ea.overallVerdict.slice(0, 80) + '…' : ea.overallVerdict}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        <PageFooter pageNumber={3} />
      </Page>

      {/* PAGE 4 */}
      <Page size="LETTER" style={styles.page}>
        <Header generatedDate={generatedDate} />
        <Text style={styles.headerTitle}>Discussion Guide for Counselor Meeting</Text>
        <Text style={styles.discussionIntro}>
          These questions are designed to guide a focused 15-minute conversation. Each references specific data from the student's evaluation. Start with question 1 and prioritize based on available time.
        </Text>

        {finalQuestions.length === 0 ? (
          <Text style={styles.italicGray}>
            No targeted discussion questions are available for this evaluation. Use the Cross-School Comparison and Strategic Action Plan above to guide the conversation.
          </Text>
        ) : (
          finalQuestions.map((q, i) => (
            <View key={i}>
              <View style={styles.questionBlock}>
                <Text style={styles.questionText}>{i + 1}. {q.question}</Text>
                {q.context ? (
                  <Text style={styles.contextText}>
                    <Text style={styles.contextLabel}>Context: </Text>
                    {q.context}
                  </Text>
                ) : null}
                {q.dataPoint ? <Text style={styles.basedOn}>Based on: {q.dataPoint}</Text> : null}
              </View>
              {i < finalQuestions.length - 1 ? <View style={styles.questionDivider} /> : null}
            </View>
          ))
        )}

        <PageFooter pageNumber={4} />
      </Page>
    </Document>
  );
}
