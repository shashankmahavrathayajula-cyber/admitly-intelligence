import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const COLORS = {
  navy: '#1a1f36',
  coral: '#e85d3a',
  teal: '#0d9488',
  amber: '#d97706',
  red: '#dc2626',
  gray: '#6b7280',
  lightGray: '#f8f9fb',
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
  schoolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  schoolName: {
    fontSize: 10,
    color: COLORS.navy,
    flex: 2,
  },
  bandLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    textAlign: 'center',
  },
  alignText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    textAlign: 'right',
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableCellLast: {
    padding: 6,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: COLORS.navy,
    color: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableHeaderCellLast: {
    padding: 6,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: COLORS.navy,
    color: COLORS.white,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: COLORS.coral,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.navy,
  },
  priorityBox: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.coral,
    paddingLeft: 10,
    paddingVertical: 6,
    marginBottom: 12,
    backgroundColor: COLORS.lightGray,
  },
  priorityTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 2,
  },
  questionBlock: {
    marginBottom: 14,
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

interface CounselorReportProps {
  studentName: string;
  generatedDate: string;
  profile: {
    gpa: number;
    intendedMajor: string;
    apCoursesTaken: number;
    apCoursesAvailable: number;
    satScore?: number;
    activitiesCount: number;
    leadershipRoles: number;
    honorsCount: number;
  };
  evaluations: Array<{
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
  }>;
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

const DIMENSIONS: Array<{ key: keyof CounselorReportProps['evaluations'][number]; label: string }> = [
  { key: 'academicStrength', label: 'Academic Strength' },
  { key: 'activityImpact', label: 'Activity Impact' },
  { key: 'honorsAwards', label: 'Honors & Awards' },
  { key: 'narrativeStrength', label: 'Narrative Strength' },
  { key: 'institutionalFit', label: 'Institutional Fit' },
];

export default function CounselorReportPDF(props: CounselorReportProps) {
  const { studentName, generatedDate, profile, evaluations, essayAnalyses, discussionQuestions } = props;

  const hasReach = evaluations.some((e) => (e.band || '').toLowerCase() === 'reach');
  const overallAssessment = hasReach
    ? `${studentName}'s list includes reach schools that will require strategic strengthening to be competitive.`
    : `${studentName}'s school list appears appropriately calibrated to their current profile.`;

  // Compute averages per dimension
  const dimAverages = DIMENSIONS.map((d) => {
    const vals = evaluations.map((e) => Number(e[d.key]) || 0);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { ...d, avg };
  });
  const sortedAsc = [...dimAverages].sort((a, b) => a.avg - b.avg);
  const gaps = sortedAsc.filter((d) => d.avg < 7.0).slice(0, 3);
  const strong = dimAverages.filter((d) => d.avg >= 7.0);
  const strongest = [...dimAverages].sort((a, b) => b.avg - a.avg)[0];
  const largestGap = sortedAsc[0];

  // Exclusive weakness assignment
  const usedWeaknesses = new Set<string>();
  function pickWeakness(): string | null {
    for (const ev of evaluations) {
      for (const w of ev.weaknesses || []) {
        if (!usedWeaknesses.has(w)) {
          usedWeaknesses.add(w);
          return w;
        }
      }
    }
    return null;
  }

  function impactLabel(avg: number): string {
    if (avg < 4) return 'High';
    if (avg <= 5.5) return 'Medium';
    return 'Low';
  }

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
        {evaluations.map((e, i) => (
          <View key={i} style={styles.schoolRow}>
            <Text style={styles.schoolName}>{e.university}</Text>
            <Text style={[styles.bandLabel, { color: bandColor(e.band) }]}>
              {(e.band || 'unknown').toUpperCase()}
            </Text>
            <Text style={[styles.alignText, { color: scoreColor(e.alignmentScore) }]}>
              {e.alignmentScore.toFixed(1)}/10
            </Text>
          </View>
        ))}

        <Text style={styles.subheader}>Overall Assessment</Text>
        <Text style={styles.body}>{overallAssessment}</Text>

        <PageFooter pageNumber={1} />
      </Page>

      {/* PAGE 2 */}
      <Page size="LETTER" style={styles.page}>
        <Header generatedDate={generatedDate} />
        <Text style={styles.headerTitle}>{comparisonTitle}</Text>

        <View style={styles.table}>
          {/* Header row */}
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

          {/* Alignment row (bold) */}
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

        <Text style={styles.subheader}>Patterns</Text>
        {strongest && (
          <View style={styles.bullet}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Strongest dimension: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{strongest.label}</Text> (avg {strongest.avg.toFixed(1)})
            </Text>
          </View>
        )}
        {largestGap && (
          <View style={styles.bullet}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Largest gap: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{largestGap.label}</Text> (avg {largestGap.avg.toFixed(1)})
            </Text>
          </View>
        )}

        <PageFooter pageNumber={2} />
      </Page>

      {/* PAGE 3 */}
      <Page size="LETTER" style={styles.page}>
        <Header generatedDate={generatedDate} />
        <Text style={styles.headerTitle}>Strategic Priorities</Text>

        <View style={{ marginTop: 12 }}>
          {gaps.length === 0 ? (
            <Text style={styles.italicGray}>No major gaps detected — profile is balanced across all dimensions.</Text>
          ) : (
            gaps.map((g, i) => {
              const w = pickWeakness();
              return (
                <View key={g.key} style={styles.priorityBox}>
                  <Text style={styles.priorityTitle}>
                    {i + 1}. {g.label} (avg {g.avg.toFixed(1)})
                  </Text>
                  <Text style={styles.body}>
                    Impact: <Text style={{ fontFamily: 'Helvetica-Bold', color: g.avg < 4 ? COLORS.red : g.avg <= 5.5 ? COLORS.amber : COLORS.teal }}>{impactLabel(g.avg)}</Text>
                  </Text>
                  {w && <Text style={[styles.body, { marginTop: 3 }]}>{w}</Text>}
                </View>
              );
            })
          )}
        </View>

        <Text style={styles.subheader}>Already Strong — Protect These</Text>
        {strong.length === 0 ? (
          <Text style={styles.italicGray}>No dimensions currently averaging 7.0 or above.</Text>
        ) : (
          strong.map((s) => (
            <View key={s.key} style={styles.bullet}>
              <Text style={[styles.bulletDot, { color: COLORS.teal }]}>•</Text>
              <Text style={[styles.bulletText, { color: COLORS.teal }]}>
                {s.label} (avg {s.avg.toFixed(1)})
              </Text>
            </View>
          ))
        )}

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
        <Text style={[styles.body, { marginTop: 6, marginBottom: 14, color: COLORS.gray }]}>
          The questions below are data-driven, generated from this student's specific evaluation results. Use them to guide a focused planning conversation.
        </Text>

        {discussionQuestions.length === 0 ? (
          <Text style={styles.italicGray}>
            No targeted discussion questions are available for this evaluation. Use the Cross-School Comparison and Strategic Priorities above to guide the conversation.
          </Text>
        ) : (
          discussionQuestions.map((q, i) => (
            <View key={i} style={styles.questionBlock}>
              <Text style={styles.questionText}>{i + 1}. {q.question}</Text>
              <Text style={styles.contextText}>
                <Text style={styles.contextLabel}>Context: </Text>
                {q.context}
              </Text>
              {q.dataPoint && (
                <Text style={styles.basedOn}>Based on: {q.dataPoint}</Text>
              )}
            </View>
          ))
        )}

        <PageFooter pageNumber={4} />
      </Page>
    </Document>
  );
}