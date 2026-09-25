export type Role =
'visitor' |
'parent' |
'student' |
'classteacher' |
'subjectteacher' |
'hr' |
'finance' |
'admin' |
'superadmin';

export type StatusTone =
'success' |
'warning' |
'danger' |
'info' |
'neutral' |
'pending';

export interface NavItem {
  label: string;
  to: string;
  icon: string;
}

export interface Student {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  stream: string;
  age: number;
  gender: 'Male' | 'Female';
  avatarInitials: string;
  parentId: string;
  status: 'Active' | 'On Leave' | 'Alumni';
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  childIds: string[];
}

export interface Teacher {
  id: string;
  name: string;
  role: 'Class Teacher' | 'Subject Teacher' | 'Head of Department';
  subjects: string[];
  classes: string[];
  email: string;
  phone: string;
  staffNo: string;
  status: 'Active' | 'On Leave';
}

export interface SubjectScore {
  subject: string;
  score: number;
  previous: number;
  grade: string;
  teacher: string;
  comment: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  className: string;
  teacher: string;
  due: string;
  marks: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Graded' | 'Late' | 'Returned';
  score?: number;
  feedback?: string;
}

export interface FeeItem {
  label: string;
  amount: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'M-Pesa' | 'Bank Transfer' | 'Card';
  reference: string;
  student: string;
  term: string;
  receiptNo: string;
}

export interface Lead {
  id: string;
  parent: string;
  child: string;
  applyingClass: string;
  stage: 'New' | 'Contacted' | 'Interested' | 'Visit Booked' | 'Application' | 'Admitted' | 'Enrolled';
  source: string;
  phone: string;
  email: string;
  owner: string;
  updated: string;
  nextAction: string;
}