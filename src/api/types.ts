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
  student: string;
  student_name: string;
  admission_number: string;
  transaction_ref: string;
  amount: number | string;
  method: string;
  status: string;
  paid_at: string;
  provider?: string;
  metadata?: { [k: string]: unknown };
  [k: string]: unknown;
}

/* ---------------------------------------------------------------------------
 * Catalogue DTOs — mirror backend serializers (apps.*.serializers).
 * Each `Api*` corresponds to one list resource under /api/v1/.
 * ------------------------------------------------------------------------- */

export interface ApiStudent {
  id: string;
  school: string;
  person: ApiPerson | null;
  full_name: string;
  admission_number: string;
  admission_date?: string;
  status: string;
  is_active: boolean;
  current_class?: string | null;
  current_class_name?: string;
  [k: string]: unknown;
}

export interface ApiParent {
  id: string;
  school?: string;
  person: ApiPerson | null;
  full_name: string;
  occupation?: string;
  employer?: string;
  is_active?: boolean;
  [k: string]: unknown;
}

export interface ApiEmployee {
  id: string;
  school: string;
  person: ApiPerson | null;
  full_name: string;
  employee_number: string;
  department?: string | null;
  department_name?: string;
  employment_date?: string;
  employment_status: string;
  role_title?: string;
  base_salary?: string;
  is_active?: boolean;
  [k: string]: unknown;
}

export interface ApiLeaveRequest {
  id: string;
  school: string;
  employee: string;
  employee_name: string;
  leave_type: string;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: string;
  [k: string]: unknown;
}

export interface ApiDepartment {
  id: string;
  school?: string;
  name: string;
  description?: string;
  [k: string]: unknown;
}

export interface ApiClass {
  id: string;
  school: string;
  academic_year: string;
  academic_year_name: string;
  grade_level?: string;
  grade_level_name: string;
  name: string;
  section?: string;
  display_name: string;
  class_teacher?: string | null;
  status: string;
  [k: string]: unknown;
}

export interface ApiTerm {
  id: string;
  school: string;
  academic_year: string;
  academic_year_name?: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  [k: string]: unknown;
}

export interface ApiAcademicYear {
  id: string;
  school: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  [k: string]: unknown;
}

export interface ApiGradeLevel {
  id: string;
  school?: string;
  name: string;
  category?: string;
  display_order?: number;
  [k: string]: unknown;
}

export interface ApiSubject {
  id: string;
  school: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  [k: string]: unknown;
}

export interface ApiEnrollment {
  id: string;
  school: string;
  student: string;
  student_name: string;
  school_class: string;
  class_name: string;
  academic_year: string;
  academic_year_name?: string;
  start_date?: string;
  end_date?: string | null;
  status: string;
  [k: string]: unknown;
}

export interface ApiTeachingAssignment {
  id: string;
  school: string;
  teacher: string;
  teacher_name: string;
  school_class: string;
  class_name: string;
  subject: string;
  subject_name: string;
  term: string;
  term_name?: string;
  is_primary: boolean;
  status: string;
  [k: string]: unknown;
}

export interface ApiClassSubject {
  id: string;
  school: string;
  school_class: string;
  subject: string;
  subject_name: string;
  subject_code?: string;
  [k: string]: unknown;
}

export interface ApiAttendanceSession {
  id: string;
  school: string;
  school_class: string;
  class_name: string;
  term: string;
  attendance_date: string;
  recorded_by?: string | null;
  remarks?: string;
  status: string;
  [k: string]: unknown;
}

export interface ApiFeeStructureItem {
  id: string;
  name: string;
  amount: string | number;
  is_mandatory?: boolean;
  is_recurring?: boolean;
  description?: string;
  [k: string]: unknown;
}

export interface ApiFeeStructure {
  id: string;
  school?: string;
  name: string;
  grade_level?: string;
  grade_level_name?: string;
  billing_cycle?: string;
  description?: string;
  is_active?: boolean;
  items: ApiFeeStructureItem[];
  [k: string]: unknown;
}

export interface ApiInvoiceItem {
  id: string;
  description: string;
  quantity?: number;
  unit_price?: string | number;
  amount: string | number;
  [k: string]: unknown;
}

export interface ApiInvoice {
  id: string;
  school: string;
  student: string;
  student_name: string;
  admission_number?: string;
  invoice_number: string;
  invoice_type?: string;
  issue_date: string;
  due_date?: string;
  amount_due: string | number;
  amount_paid: string | number;
  adjustments?: string | number;
  balance: string | number;
  status: string;
  term?: string | null;
  description?: string;
  items: ApiInvoiceItem[];
  [k: string]: unknown;
}

export interface ApiReceipt {
  id: string;
  school?: string;
  receipt_number: string;
  payment: string;
  payment_transaction_ref?: string;
  student: string;
  student_name?: string;
  amount: string | number;
  issued_at: string;
  pdf_url?: string;
  method?: string;
  [k: string]: unknown;
}

export interface ApiFeeAccount {
  id: string;
  school: string;
  student: string;
  student_name: string;
  fee_structure?: string | null;
  fee_structure_name?: string;
  opening_balance?: string | number;
  credit_limit?: string | number;
  is_blocked?: boolean;
  remarks?: string;
  balance: string | number;
  [k: string]: unknown;
}

export interface ApiAnnouncement {
  id: string;
  school?: string;
  title: string;
  body: string;
  audience?: string;
  channels?: string[];
  published_at?: string;
  status: string;
  created_by?: string | null;
  author?: string;
  [k: string]: unknown;
}

export interface ApiEvent {
  id: string;
  school: string;
  title: string;
  description?: string;
  event_type?: string;
  start_time: string;
  end_time?: string;
  venue?: string;
  capacity?: number;
  status: string;
  cover_image_url?: string;
  allow_registration?: boolean;
  is_recurring?: boolean;
  published_at?: string;
  created_by_name?: string;
  participant_count?: number;
  [k: string]: unknown;
}

export interface ApiSchoolModule {
  id: string;
  school: string;
  module: string;
  module_code: string;
  module_name: string;
  enabled: boolean;
  configuration?: { [k: string]: unknown };
  [k: string]: unknown;
}

export interface ApiModule {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_core?: boolean;
  [k: string]: unknown;
}

export interface ApiSchoolSetting {
  id: string;
  school: string;
  key: string;
  value?: string;
  [k: string]: unknown;
}

export interface ApiAuditLog {
  id: string;
  school?: string | null;
  user: string;
  user_name: string;
  action: string;
  module: string;
  entity_type?: string;
  entity_id?: string | null;
  old_value?: unknown;
  new_value?: unknown;
  ip_address?: string;
  created_at: string;
  [k: string]: unknown;
}

export interface ApiSearchResult {
  id: string;
  name: string;
  category?: string;
  admission_number?: string;
  status?: string;
  [k: string]: unknown;
}

export interface ApiNotification {
  id: string;
  school?: string;
  title: string;
  body?: string;
  type?: string;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  [k: string]: unknown;
}

/* ------------------------- Report payloads ------------------------- */

export interface ApiReportDef {
  reports: string[];
  [k: string]: unknown;
}

export interface ApiReportTable {
  columns: string[];
  rows: (string | number)[][];
  summary?: { [k: string]: number | string };
  [k: string]: unknown;
}

/* --------------------------- Dashboards --------------------------- */

export interface DashboardStudents {
  by_grade: { [k: string]: unknown }[];
  by_gender: { [k: string]: unknown }[];
  new_this_month: number;
  active: number;
  archived: number;
  [k: string]: unknown;
}

export interface DashboardStudent {
  student: { id: string; name: string; admission_number: string } | null;
  assignments: {
    id: string;
    title: string;
    subject: string;
    topic?: string;
    due_date?: string | null;
    max_marks?: number;
    status: string;
  }[];
  subject_results: { subject: string; score: number; grade: string; term: string }[];
  attendance: { present: number; absent: number; late: number; percentage: number };
  [k: string]: unknown;
}

export interface DashboardAnnouncements {
  published_this_month: number;
  unread: number;
  [k: string]: unknown;
}

export interface DashboardHR {
  by_department: { department__name?: string; count: number; [k: string]: unknown }[];
  on_leave_today: number;
  duties_today: number;
  pending_tickets: number;
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

export interface ApiTimetableSlot {
  id: string;
  school: string;
  school_class: string;
  class_name?: string;
  period: string;
  period_name?: string;
  teaching_assignment?: string | null;
  subject_name?: string;
  teacher_name?: string;
  day_of_week: string;
  day_display?: string;
  room?: string;
  status: string;
  [k: string]: unknown;
}

export interface ApiMedicalRecord {
  id: string;
  school: string;
  student: string;
  student_name?: string;
  record_date: string;
  height_cm?: string | null;
  weight_kg?: string | null;
  bmi?: number | null;
  blood_group?: string;
  vision?: string;
  hearing?: string;
  general_condition?: string;
  allergies?: string;
  chronic_conditions?: string;
  medications?: string;
  physical_exam_notes?: string;
  examined_by?: string;
  next_checkup_date?: string | null;
  status: string;
  [k: string]: unknown;
}

export interface ApiAssessment {
  id: string;
  school: string;
  teaching_assignment: string;
  term: string;
  title: string;
  assessment_type: string;
  max_score: string;
  date?: string;
  status: string;
  subject?: string;
  class_name?: string;
  [k: string]: unknown;
}
