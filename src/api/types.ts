import type { Role } from '../types';

export interface ApiPerson {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  gender?: string;
  phone?: string;
  email?: string;
  [k: string]: unknown;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  status: string;
  full_name: string;
  person: ApiPerson | null;
  is_staff: boolean;
  is_superuser: boolean;
  roles: string[];
  school_ids: string[];
  permissions: string[];
  [k: string]: unknown;
}

export interface DashboardOverview {
  students: { total: number; active: number; parents: number };
  staff: { teachers: number; employees: number };
  academics: { active_enrollments: number; current_year: string };
  attendance: { records: number; present: number; rate: number };
  upcoming_events: number;
  pending_admissions: number;
  pending_leave: number;
  new_leads: number;
  [k: string]: unknown;
}

export interface DashboardFinance {
  total_invoiced: number;
  collected: number;
  outstanding: number;
  overdue_invoices: number;
  top_defaulters: { name: string; balance: number; [k: string]: unknown }[];
  [k: string]: unknown;
}

export interface DashboardAttendance {
  weekly_trend: { date: string; present: number; total: number }[];
  by_class: { class: string; present: number; total: number }[];
  [k: string]: unknown;
}

export interface ApiSchool {
  id: string;
  name: string;
  code: string;
  slug?: string;
  status: string;
  email?: string;
  phone?: string;
  motto?: string;
  [k: string]: unknown;
}

export interface ApiPayment {
  id: string;
  student_name: string;
  admission_number: string;
  transaction_ref: string;
  amount: number;
  method: string;
  status: string;
  paid_at: string;
  [k: string]: unknown;
}

/** Role codes as assigned on the backend (apps.identity.RoleCode). */
export type RoleCode =
  'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'FINANCE_ADMIN' | 'HR_ADMIN'
  | 'CLASS_TEACHER' | 'SUBJECT_TEACHER' | 'PARENT' | 'STUDENT';

const ROLE_MAP: Record<RoleCode, Role> = {
  SUPER_ADMIN: 'superadmin',
  SCHOOL_ADMIN: 'admin',
  FINANCE_ADMIN: 'finance',
  HR_ADMIN: 'hr',
  CLASS_TEACHER: 'classteacher',
  SUBJECT_TEACHER: 'subjectteacher',
  PARENT: 'parent',
  STUDENT: 'student',
};

/** Map backend role codes to a single frontend role. SCHOOL_ADMIN wins over SUPER_ADMIN
 *  so the school's administrator lands on the school admin portal first. */
export function mapRole(codes: string[]): Role | null {
  if (!Array.isArray(codes)) return null;
  const priority: RoleCode[] = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN', 'HR_ADMIN',
    'CLASS_TEACHER', 'SUBJECT_TEACHER', 'PARENT', 'STUDENT'];
  for (const code of priority) {
    if (codes.includes(code)) return ROLE_MAP[code];
  }
  return null;
}