import type { Role } from '../types';

export interface NavLink {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
}
export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const ROLE_LABELS: Record<Role, string> = {
  visitor: 'Visitor',
  parent: 'Parent / Guardian',
  student: 'Student',
  classteacher: 'Class Teacher',
  subjectteacher: 'Subject Teacher',
  hr: 'HR Administrator',
  finance: 'Finance Administrator',
  admin: 'School Administrator',
  superadmin: 'Super Administrator'
};

export const ROLE_USERS: Record<Role, {name: string;initials: string;context: string;}> = {
  visitor: { name: 'Guest', initials: 'G', context: 'Public website' },
  parent: { name: 'Grace Wanjiku Kamau', initials: 'GK', context: 'Parent of Wanjiru & Baraka' },
  student: { name: 'Wanjiru Kamau', initials: 'WK', context: 'Grade 4 Acacia' },
  classteacher: { name: 'Mr. Brian Kimani', initials: 'BK', context: 'Class Teacher · Grade 4 Acacia' },
  subjectteacher: { name: 'Ms. Lydia Achieng', initials: 'LA', context: 'English · Grades 4 – 6' },
  hr: { name: 'Mrs. Susan Muthoni', initials: 'SM', context: 'Human Resources' },
  finance: { name: 'Mr. Peter Njoroge', initials: 'PN', context: 'Finance Office' },
  admin: { name: 'Mr. Samuel Kariuki', initials: 'SK', context: 'Head Teacher · SALA' },
  superadmin: { name: 'Eunice Wafula', initials: 'EW', context: 'SALA Platform Operations' }
};

export const ROLE_HOME: Record<Role, string> = {
  visitor: '/',
  parent: '/parent',
  student: '/student',
  classteacher: '/teacher',
  subjectteacher: '/teacher',
  hr: '/hr/overview',
  finance: '/finance/overview',
  admin: '/admin',
  superadmin: '/super'
};

/** Which roles may enter each portal. Mirrors the role the backend issues via
 *  `mapRole`, and is the single source of truth for route guards in `App.tsx`.
 *  `admin` is included in finance/hr because the school-admin nav links there. */
export const PORTAL_ROLES = {
  parent: ['parent'],
  student: ['student'],
  teacher: ['classteacher', 'subjectteacher'],
  admin: ['admin', 'superadmin'],
  finance: ['finance', 'admin'],
  hr: ['hr', 'admin'],
  super: ['superadmin']
} as const satisfies Record<string, readonly Role[]>;

/** True when `role` is allowed inside `portal`. */
export function canAccessPortal(portal: keyof typeof PORTAL_ROLES, role: Role): boolean {
  return (PORTAL_ROLES[portal] as readonly Role[]).includes(role);
}

const PARENT_NAV: NavGroup[] = [
{
  title: 'My family',
  links: [
  { label: 'Dashboard', to: '/parent', icon: 'LayoutDashboard', end: true },
  { label: 'My children', to: '/parent/children', icon: 'Users' },
  { label: 'Academics & progress', to: '/parent/child/s1/Academics', icon: 'TrendingUp' },
  { label: 'Assignments', to: '/parent/child/s1/Assignments', icon: 'ClipboardList' },
  { label: 'Attendance', to: '/parent/child/s1/Attendance', icon: 'CalendarCheck' },
  { label: 'Results', to: '/parent/child/s1/Results', icon: 'Award' }]

},
{
  title: 'Fees & school',
  links: [
  { label: 'Fees & payments', to: '/parent/fees', icon: 'Wallet' },
  { label: 'Messages', to: '/parent/messages', icon: 'MessageSquare' },
  { label: 'Events', to: '/parent/events', icon: 'CalendarDays' },
  { label: 'My profile', to: '/parent/profile', icon: 'UserCircle' }]

}];


const STUDENT_NAV: NavGroup[] = [
{
  title: 'Learn',
  links: [
  { label: 'Dashboard', to: '/student', icon: 'LayoutDashboard', end: true },
  { label: 'My learning', to: '/student/learning', icon: 'BookOpen' },
  { label: 'Assignments', to: '/student/assignments', icon: 'ClipboardList' },
  { label: 'Quizzes', to: '/student/quiz', icon: 'HelpCircle' }]

},
{
  title: 'Me',
  links: [
  { label: 'My progress', to: '/student/progress', icon: 'TrendingUp' },
  { label: 'Achievements', to: '/student/achievements', icon: 'Trophy' },
  { label: 'My profile', to: '/student/profile', icon: 'UserCircle' }]

}];


const CLASS_TEACHER_NAV: NavGroup[] = [
{
  title: 'Teaching',
  links: [
  { label: 'Dashboard', to: '/teacher', icon: 'LayoutDashboard', end: true },
  { label: 'My class', to: '/teacher/classes', icon: 'School' },
  { label: 'Students', to: '/teacher/students', icon: 'Users' },
  { label: 'Assignments', to: '/teacher/assignments', icon: 'ClipboardList' },
  { label: 'Assessments & results', to: '/teacher/results', icon: 'Award' },
  { label: 'Student groups', to: '/teacher/groups', icon: 'UsersRound' },
  { label: 'Attendance register', to: '/teacher/attendance', icon: 'CalendarCheck' },
  { label: 'Learning topics', to: '/teacher/topics', icon: 'BookOpen' }]

},
{
  title: 'Communication',
  links: [
  { label: 'Parent messages', to: '/teacher/messages', icon: 'MessageSquare' },
  { label: 'Calendar', to: '/teacher/calendar', icon: 'CalendarDays' }]

},
{
  title: 'My HR',
  links: [
  { label: 'My attendance', to: '/teacher/hr/My attendance', icon: 'Clock' },
  { label: 'Leave', to: '/teacher/hr/Leave', icon: 'Plane' },
  { label: 'Payslips', to: '/teacher/hr/Payslips', icon: 'Receipt' },
  { label: 'Duty roster', to: '/teacher/hr/Duty roster', icon: 'ListChecks' },
  { label: 'HR tickets', to: '/teacher/hr/HR tickets', icon: 'LifeBuoy' },
  { label: 'My profile', to: '/teacher/profile', icon: 'UserCircle' }]

}];


const SUBJECT_TEACHER_NAV: NavGroup[] = [
{
  title: 'My subject — English',
  links: [
  { label: 'Dashboard', to: '/teacher', icon: 'LayoutDashboard', end: true },
  { label: 'My classes', to: '/teacher/classes', icon: 'School' },
  { label: 'Subject students', to: '/teacher/students', icon: 'Users' },
  { label: 'Assignments', to: '/teacher/assignments', icon: 'ClipboardList' },
  { label: 'Results', to: '/teacher/results', icon: 'Award' },
  { label: 'Learning topics', to: '/teacher/topics', icon: 'BookOpen' },
  { label: 'Student groups', to: '/teacher/groups', icon: 'UsersRound' }]

},
{
  title: 'My HR',
  links: [
  { label: 'My attendance', to: '/teacher/hr/My attendance', icon: 'Clock' },
  { label: 'Leave', to: '/teacher/hr/Leave', icon: 'Plane' },
  { label: 'Payslips', to: '/teacher/hr/Payslips', icon: 'Receipt' },
  { label: 'My profile', to: '/teacher/profile', icon: 'UserCircle' }]

}];


const ADMIN_NAV: NavGroup[] = [
{
  title: 'Overview',
  links: [
  { label: 'Dashboard', to: '/admin', icon: 'LayoutDashboard', end: true },
  { label: 'Reports', to: '/admin/reports', icon: 'BarChart3' }]

},
{
  title: 'Admissions',
  links: [
  { label: 'Applications', to: '/admin/admissions', icon: 'FileText' },
  { label: 'CRM & enquiries', to: '/admin/crm', icon: 'Handshake' }]

},
{
  title: 'School',
  links: [
  { label: 'Students', to: '/admin/students', icon: 'GraduationCap' },
  { label: 'Parents', to: '/admin/parents', icon: 'Users' },
  { label: 'Teachers', to: '/admin/teachers', icon: 'UserSquare2' },
  { label: 'Classes', to: '/admin/classes', icon: 'School' },
  { label: 'Academics & LMS', to: '/admin/academics', icon: 'BookOpen' },
  { label: 'Attendance', to: '/admin/attendance', icon: 'CalendarCheck' }]

},
{
  title: 'Operations',
  links: [
  { label: 'Finance', to: '/finance/overview', icon: 'Wallet' },
  { label: 'Human resources', to: '/hr/overview', icon: 'Briefcase' },
  { label: 'Communication', to: '/admin/communication', icon: 'Send' }]

},
{
  title: 'School content',
  links: [
  { label: 'Events', to: '/admin/content/Events', icon: 'CalendarDays' },
  { label: 'Gallery', to: '/admin/content/Gallery', icon: 'Images' },
  { label: 'News & notices', to: '/admin/content/News', icon: 'Newspaper' },
  { label: 'Settings', to: '/admin/settings', icon: 'Settings' }]

}];


const FINANCE_NAV: NavGroup[] = [
{
  title: 'Finance office',
  links: [
  { label: 'Dashboard', to: '/finance/overview', icon: 'LayoutDashboard' },
  { label: 'Payments', to: '/finance/payments', icon: 'Wallet' },
  { label: 'Student balances', to: '/finance/balances', icon: 'Users' },
  { label: 'Collections', to: '/finance/collections', icon: 'TrendingUp' },
  { label: 'Receipts', to: '/finance/receipts', icon: 'Receipt' },
  { label: 'Reports', to: '/finance/reports', icon: 'BarChart3' }]

}];


const HR_NAV: NavGroup[] = [
{
  title: 'Human resources',
  links: [
  { label: 'Dashboard', to: '/hr/overview', icon: 'LayoutDashboard' },
  { label: 'Staff directory', to: '/hr/staff', icon: 'Users' },
  { label: 'Staff attendance', to: '/hr/attendance', icon: 'Clock' },
  { label: 'Leave requests', to: '/hr/leave', icon: 'Plane' },
  { label: 'Payroll', to: '/hr/payroll', icon: 'Wallet' },
  { label: 'Duty roster', to: '/hr/roster', icon: 'ListChecks' },
  { label: 'HR tickets', to: '/hr/tickets', icon: 'LifeBuoy' }]

}];


const SUPER_NAV: NavGroup[] = [
{
  title: 'Platform',
  links: [
  { label: 'Dashboard', to: '/super', icon: 'LayoutDashboard', end: true },
  { label: 'Schools', to: '/super/schools', icon: 'Building2' },
  { label: 'Administrators', to: '/super/users/Administrators', icon: 'ShieldCheck' },
  { label: 'Users', to: '/super/users/All users', icon: 'Users' },
  { label: 'Modules', to: '/super/modules', icon: 'Blocks' }]

},
{
  title: 'Governance',
  links: [
  { label: 'Analytics', to: '/super/audit/Analytics', icon: 'BarChart3' },
  { label: 'Audit logs', to: '/super/audit/Audit logs', icon: 'ScrollText' },
  { label: 'Integrations', to: '/super/settings/Integrations', icon: 'Plug' },
  { label: 'Platform settings', to: '/super/settings/General', icon: 'Settings' }]

}];


export const ROLE_NAV: Record<Role, NavGroup[]> = {
  visitor: [],
  parent: PARENT_NAV,
  student: STUDENT_NAV,
  classteacher: CLASS_TEACHER_NAV,
  subjectteacher: SUBJECT_TEACHER_NAV,
  hr: HR_NAV,
  finance: FINANCE_NAV,
  admin: ADMIN_NAV,
  superadmin: SUPER_NAV
};

export const MOBILE_NAV: Record<Role, NavLink[]> = {
  visitor: [],
  parent: [
  { label: 'Home', to: '/parent', icon: 'Home', end: true },
  { label: 'Children', to: '/parent/children', icon: 'Users' },
  { label: 'Academics', to: '/parent/child/s1/Academics', icon: 'TrendingUp' },
  { label: 'Fees', to: '/parent/fees', icon: 'Wallet' },
  { label: 'More', to: '/parent/profile', icon: 'Menu' }],

  student: [
  { label: 'Home', to: '/student', icon: 'Home', end: true },
  { label: 'Learn', to: '/student/learning', icon: 'BookOpen' },
  { label: 'Tasks', to: '/student/assignments', icon: 'ClipboardList' },
  { label: 'Progress', to: '/student/progress', icon: 'TrendingUp' },
  { label: 'Profile', to: '/student/profile', icon: 'UserCircle' }],

  classteacher: [
  { label: 'Home', to: '/teacher', icon: 'Home', end: true },
  { label: 'Class', to: '/teacher/classes', icon: 'School' },
  { label: 'Tasks', to: '/teacher/assignments', icon: 'ClipboardList' },
  { label: 'Messages', to: '/teacher/messages', icon: 'MessageSquare' },
  { label: 'More', to: '/teacher/profile', icon: 'Menu' }],

  subjectteacher: [
  { label: 'Home', to: '/teacher', icon: 'Home', end: true },
  { label: 'Classes', to: '/teacher/classes', icon: 'School' },
  { label: 'Tasks', to: '/teacher/assignments', icon: 'ClipboardList' },
  { label: 'Results', to: '/teacher/results', icon: 'Award' },
  { label: 'More', to: '/teacher/profile', icon: 'Menu' }],

  hr: [
  { label: 'Home', to: '/hr/overview', icon: 'Home' },
  { label: 'Staff', to: '/hr/staff', icon: 'Users' },
  { label: 'Leave', to: '/hr/leave', icon: 'Plane' },
  { label: 'Payroll', to: '/hr/payroll', icon: 'Wallet' },
  { label: 'Tickets', to: '/hr/tickets', icon: 'LifeBuoy' }],

  finance: [
  { label: 'Home', to: '/finance/overview', icon: 'Home' },
  { label: 'Payments', to: '/finance/payments', icon: 'Wallet' },
  { label: 'Balances', to: '/finance/balances', icon: 'Users' },
  { label: 'Receipts', to: '/finance/receipts', icon: 'Receipt' },
  { label: 'Reports', to: '/finance/reports', icon: 'BarChart3' }],

  admin: [
  { label: 'Home', to: '/admin', icon: 'Home', end: true },
  { label: 'Students', to: '/admin/students', icon: 'GraduationCap' },
  { label: 'Finance', to: '/finance/overview', icon: 'Wallet' },
  { label: 'CRM', to: '/admin/crm', icon: 'Handshake' },
  { label: 'Reports', to: '/admin/reports', icon: 'BarChart3' }],

  superadmin: [
  { label: 'Home', to: '/super', icon: 'Home', end: true },
  { label: 'Schools', to: '/super/schools', icon: 'Building2' },
  { label: 'Modules', to: '/super/modules', icon: 'Blocks' },
  { label: 'Users', to: '/super/users/All users', icon: 'Users' },
  { label: 'Audit', to: '/super/audit/Audit logs', icon: 'ScrollText' }]

};

export const NOTIFICATIONS: Record<string, {title: string;body: string;when: string;tone: string;unread: boolean;}[]> = {
  parent: [
  { title: 'Fee payment successful', body: 'KES 40,000 received · Ref SALA7X92KQ', when: '2 Sep', tone: 'success', unread: false },
  { title: 'New assignment — Mathematics', body: 'Fractions: comparing and ordering, due 24 Sep', when: '2 hours ago', tone: 'info', unread: true },
  { title: 'Assignment graded', body: 'Wanjiru scored 7/10 in Energy sources sorting task', when: 'Yesterday', tone: 'success', unread: true },
  { title: 'Balance due in 10 days', body: 'KES 35,000 outstanding for Term 3', when: '3 days ago', tone: 'warning', unread: false }],

  student: [
  { title: 'New assignment', body: 'Fractions — comparing and ordering. Due Thursday.', when: '2 hours ago', tone: 'info', unread: true },
  { title: 'Well done!', body: 'You earned the Assignment Streak badge.', when: 'Yesterday', tone: 'success', unread: true },
  { title: 'Quiz reminder', body: 'Fractions topic quiz is still open.', when: '2 days ago', tone: 'pending', unread: false }],

  teacher: [
  { title: '6 submissions to grade', body: 'Insha: Siku Niliyoisahau — Grade 4 Acacia', when: '1 hour ago', tone: 'pending', unread: true },
  { title: 'Leave request submitted', body: 'Your annual leave for 12 – 16 Oct is awaiting approval.', when: 'Yesterday', tone: 'info', unread: true },
  { title: 'Duty tomorrow', body: 'Lunch hall supervision · 12:40pm', when: 'Yesterday', tone: 'warning', unread: false }],

  admin: [
  { title: '5 applications need review', body: '2 are past the 10-day decision window.', when: '30 min ago', tone: 'warning', unread: true },
  { title: 'Fees collected today', body: 'KES 412,000 across 11 payments.', when: '2 hours ago', tone: 'success', unread: true },
  { title: 'Leave awaiting approval', body: '2 teachers · Grade 4 Acacia cover needed.', when: 'Yesterday', tone: 'pending', unread: false }],

  superadmin: [
  { title: 'Coast Star Academy suspended', body: 'Subscription lapsed 3 weeks ago.', when: '1 day ago', tone: 'error', unread: true },
  { title: 'Trial ending — Rift Valley Montessori', body: '6 days remaining on the trial plan.', when: '2 days ago', tone: 'warning', unread: true },
  { title: 'Platform uptime 99.97%', body: 'September service report is ready.', when: '3 days ago', tone: 'info', unread: false }]

};