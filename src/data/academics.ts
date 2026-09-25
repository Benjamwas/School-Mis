import type { Assignment, SubjectScore } from '../types';

export const TERM = 'Term 3 · 2026';

export const SUBJECT_SCORES: SubjectScore[] = [
{ subject: 'English Reading', score: 91, previous: 84, grade: 'A', teacher: 'Ms. Lydia Achieng', comment: 'Reads fluently and with real expression. Ready for longer chapter books.' },
{ subject: 'Kiswahili', score: 82, previous: 79, grade: 'A-', teacher: 'Mrs. Faith Wambui', comment: 'Msamiati mzuri. Aendelee kufanya mazoezi ya insha.' },
{ subject: 'Science & Technology', score: 78, previous: 74, grade: 'B+', teacher: 'Mr. Brian Kimani', comment: 'Strong practical work. Written explanations are improving steadily.' },
{ subject: 'Social Studies', score: 74, previous: 76, grade: 'B', teacher: 'Mr. Josphat Mule', comment: 'Confident in class discussion; needs to revise map work.' },
{ subject: 'Mathematics', score: 55, previous: 61, grade: 'C', teacher: 'Mr. Brian Kimani', comment: 'Fractions and multi-step word problems are the barrier. Support plan in place.' },
{ subject: 'Creative Arts', score: 88, previous: 85, grade: 'A-', teacher: 'Ms. Nancy Chebet', comment: 'Imaginative and careful with finishing.' }];


export const TERM_TREND = [
{ term: 'T1 2025', average: 63 },
{ term: 'T2 2025', average: 66 },
{ term: 'T3 2025', average: 70 },
{ term: 'T1 2026', average: 72 },
{ term: 'T2 2026', average: 76 },
{ term: 'T3 2026', average: 78 }];


export const RECOMMENDED_TOPICS = [
{ topic: 'Fractions — equivalent & comparing', subject: 'Mathematics', reason: 'Scored 4/10 in the last two class quizzes on this topic.', progress: 35, activity: 'Practice set: Fraction Walls (15 min)' },
{ topic: 'Multi-step word problems', subject: 'Mathematics', reason: 'Correct method, arithmetic slips in the final step.', progress: 48, activity: 'Guided lesson + 6 worked examples' },
{ topic: 'Reading comprehension — inference', subject: 'English', reason: 'Literal questions are secure; inference questions are inconsistent.', progress: 72, activity: 'Short passage a day with two “why” questions' },
{ topic: 'Energy and its forms', subject: 'Science', reason: 'Missed the practical lesson on 4 September.', progress: 20, activity: 'Watch lesson recap and complete the sorting task' },
{ topic: 'Sentence agreement', subject: 'Kiswahili', reason: 'Recurring errors in ngeli agreement in written work.', progress: 60, activity: 'Zoezi la sarufi — 10 sentensi' }];


export const STRENGTHS = ['Reading fluency and expression', 'Practical science investigation', 'Creative and visual work', 'Class participation and collaboration'];
export const SUPPORT_AREAS = ['Fractions and division', 'Multi-step problem solving', 'Map and diagram interpretation'];

export const ASSIGNMENTS: Assignment[] = [
{ id: 'a1', title: 'Fractions — comparing and ordering', subject: 'Mathematics', topic: 'Fractions', className: 'Grade 4 Acacia', teacher: 'Mr. Brian Kimani', due: '24 Sep 2026', marks: 20, status: 'Not Started' },
{ id: 'a2', title: 'Comprehension: “The Rains Came Late”', subject: 'English', topic: 'Reading comprehension', className: 'Grade 4 Acacia', teacher: 'Ms. Lydia Achieng', due: '22 Sep 2026', marks: 15, status: 'In Progress' },
{ id: 'a3', title: 'Insha: Siku Niliyoisahau', subject: 'Kiswahili', topic: 'Uandishi wa insha', className: 'Grade 4 Acacia', teacher: 'Mrs. Faith Wambui', due: '19 Sep 2026', marks: 20, status: 'Submitted' },
{ id: 'a4', title: 'Energy sources sorting task', subject: 'Science & Technology', topic: 'Energy', className: 'Grade 4 Acacia', teacher: 'Mr. Brian Kimani', due: '15 Sep 2026', marks: 10, status: 'Graded', score: 7, feedback: 'Good sorting. Remember that a battery stores chemical energy before it becomes electrical.' },
{ id: 'a5', title: 'Map work: Counties of Kenya', subject: 'Social Studies', topic: 'Physical features', className: 'Grade 4 Acacia', teacher: 'Mr. Josphat Mule', due: '11 Sep 2026', marks: 15, status: 'Late' },
{ id: 'a6', title: 'Multiplication tables 6 – 9 drill', subject: 'Mathematics', topic: 'Multiplication', className: 'Grade 4 Acacia', teacher: 'Mr. Brian Kimani', due: '08 Sep 2026', marks: 10, status: 'Graded', score: 6, feedback: 'The 7 and 8 tables need daily practice — five minutes a day will fix this.' }];


export const SUBJECT_TOPICS = [
{
  subject: 'Mathematics',
  icon: 'Calculator',
  progress: 58,
  topics: [
  { name: 'Whole numbers', progress: 100, lessons: 6, status: 'Completed' },
  { name: 'Multiplication & division', progress: 80, lessons: 8, status: 'In Progress' },
  { name: 'Fractions', progress: 35, lessons: 7, status: 'In Progress' },
  { name: 'Measurement', progress: 0, lessons: 5, status: 'Locked' },
  { name: 'Geometry', progress: 0, lessons: 4, status: 'Locked' }]

},
{
  subject: 'English',
  icon: 'BookOpen',
  progress: 84,
  topics: [
  { name: 'Reading fluency', progress: 100, lessons: 5, status: 'Completed' },
  { name: 'Comprehension & inference', progress: 72, lessons: 6, status: 'In Progress' },
  { name: 'Creative writing', progress: 65, lessons: 6, status: 'In Progress' },
  { name: 'Grammar & punctuation', progress: 90, lessons: 7, status: 'In Progress' }]

},
{
  subject: 'Science & Technology',
  icon: 'FlaskConical',
  progress: 66,
  topics: [
  { name: 'Living things', progress: 100, lessons: 6, status: 'Completed' },
  { name: 'Energy', progress: 20, lessons: 5, status: 'In Progress' },
  { name: 'Water', progress: 88, lessons: 4, status: 'In Progress' },
  { name: 'Environment', progress: 0, lessons: 5, status: 'Locked' }]

},
{
  subject: 'Kiswahili',
  icon: 'Languages',
  progress: 71,
  topics: [
  { name: 'Kusoma', progress: 92, lessons: 5, status: 'In Progress' },
  { name: 'Sarufi', progress: 60, lessons: 6, status: 'In Progress' },
  { name: 'Insha', progress: 55, lessons: 5, status: 'In Progress' }]

}];


export const LESSON = {
  subject: 'Mathematics',
  topic: 'Fractions',
  title: 'Comparing fractions with different denominators',
  duration: '18 min',
  objectives: [
  'Recognise that fractions can be compared by making the denominators the same',
  'Use a fraction wall to compare halves, thirds, quarters and sixths',
  'Order three fractions from smallest to largest'],

  steps: [
  { title: 'Watch the lesson', body: 'A 6-minute video explaining fraction walls with Mr. Kimani.', type: 'Video', done: true },
  { title: 'Read: What makes fractions equal?', body: 'A short illustrated reading with three worked examples.', type: 'Reading', done: true },
  { title: 'Practice — 8 questions', body: 'Untimed practice with instant feedback after each question.', type: 'Practice', done: false },
  { title: 'Topic quiz — 10 questions', body: 'Counts towards your topic progress.', type: 'Quiz', done: false }],

  resources: [
  { name: 'Fraction wall printable.pdf', size: '284 KB', type: 'PDF' },
  { name: 'Lesson slides — Comparing fractions.pdf', size: '1.2 MB', type: 'PDF' },
  { name: 'Extra practice worksheet.pdf', size: '190 KB', type: 'PDF' }]

};

export const QUIZ = {
  title: 'Fractions — Topic Quiz',
  subject: 'Mathematics',
  questions: [
  { q: 'Which fraction is larger: 3/4 or 2/3?', options: ['3/4', '2/3', 'They are equal', 'Cannot tell'], answer: 0, why: 'Converting both to twelfths gives 9/12 and 8/12.' },
  { q: 'Which of these is equivalent to 1/2?', options: ['2/3', '3/6', '4/9', '5/12'], answer: 1, why: '3/6 simplifies to 1/2.' },
  { q: 'Order from smallest: 1/3, 1/6, 1/2', options: ['1/2, 1/3, 1/6', '1/6, 1/3, 1/2', '1/3, 1/6, 1/2', '1/6, 1/2, 1/3'], answer: 1, why: 'The larger the denominator, the smaller each equal part.' },
  { q: 'What is 2/5 + 1/5?', options: ['3/10', '2/10', '3/5', '1/5'], answer: 2, why: 'With the same denominator you add only the numerators.' },
  { q: 'A pizza is cut into 8 slices. Amani eats 2. What fraction is left?', options: ['2/8', '6/8', '8/6', '1/8'], answer: 1, why: '8 − 2 = 6 slices remain out of 8.' }]

};

export const ACHIEVEMENTS = [
{ name: 'Reading Champion', desc: '24 books logged this term', progress: 100, earned: true, icon: 'BookOpen' },
{ name: 'Perfect Attendance', desc: 'September — no absences', progress: 100, earned: true, icon: 'CalendarCheck' },
{ name: 'Assignment Streak', desc: '9 assignments submitted on time', progress: 100, earned: true, icon: 'Flame' },
{ name: 'Quiz Master', desc: 'Score 80%+ in 10 quizzes — 7 so far', progress: 70, earned: false, icon: 'Trophy' },
{ name: 'Maths Progress', desc: 'Finish the Fractions topic', progress: 35, earned: false, icon: 'TrendingUp' },
{ name: 'Class Participation', desc: 'Recognised by 3 teachers this term', progress: 66, earned: false, icon: 'Hand' }];


export const ATTENDANCE_SUMMARY = { present: 51, absent: 2, late: 3, percentage: 96 };

export const ATTENDANCE_DAYS: {day: number;status: 'present' | 'absent' | 'late' | 'none';}[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const dow = (day + 1) % 7;
  if (dow === 0 || dow === 6) return { day, status: 'none' as const };
  if (day === 4) return { day, status: 'absent' as const };
  if (day === 11) return { day, status: 'late' as const };
  if (day === 18) return { day, status: 'late' as const };
  if (day === 23) return { day, status: 'absent' as const };
  return { day, status: 'present' as const };
});

export const CLASS_ATTENDANCE_TREND = [
{ month: 'May', rate: 94 },
{ month: 'Jun', rate: 95 },
{ month: 'Jul', rate: 92 },
{ month: 'Aug', rate: 96 },
{ month: 'Sep', rate: 96 }];


export const SUBMISSIONS = [
{ student: 'Wanjiru Kamau', status: 'Submitted', submitted: '18 Sep, 8:42pm', score: null as number | null },
{ student: 'Amani Kiplagat', status: 'Graded', submitted: '17 Sep, 6:10pm', score: 17 },
{ student: 'Joy Mutiso', status: 'Graded', submitted: '18 Sep, 7:55pm', score: 19 },
{ student: 'Brian Ochieng', status: 'Submitted', submitted: '19 Sep, 9:31am', score: null },
{ student: 'Aisha Hassan', status: 'Not Submitted', submitted: '—', score: null },
{ student: 'Kevin Mwangi', status: 'Graded', submitted: '16 Sep, 5:20pm', score: 12 },
{ student: 'Lucy Njeri', status: 'Submitted', submitted: '18 Sep, 10:02pm', score: null },
{ student: 'Samuel Kiptoo', status: 'Not Submitted', submitted: '—', score: null }];


export const GROUPS = [
{ id: 'gr1', name: 'Fraction Focus Group', subject: 'Mathematics', members: 6, leader: 'Joy Mutiso', task: 'Fraction wall poster + 3 worked examples', progress: 45 },
{ id: 'gr2', name: 'Reading Buddies A', subject: 'English', members: 8, leader: 'Wanjiru Kamau', task: 'Paired reading log — 20 min daily', progress: 78 },
{ id: 'gr3', name: 'Science Fair Team', subject: 'Science & Technology', members: 5, leader: 'Brian Ochieng', task: 'Rainwater filter prototype', progress: 62 }];


export const CLASS_SUBJECT_AVERAGES = [
{ subject: 'English', average: 78, classAvg: 74 },
{ subject: 'Kiswahili', average: 72, classAvg: 70 },
{ subject: 'Maths', average: 64, classAvg: 66 },
{ subject: 'Science', average: 75, classAvg: 73 },
{ subject: 'Social St.', average: 71, classAvg: 72 },
{ subject: 'Arts', average: 84, classAvg: 80 }];