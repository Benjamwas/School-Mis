export const MY_ATTENDANCE = {
  today: 'Clocked in',
  clockIn: '7:12 am',
  clockOut: '—',
  hoursToday: '6h 48m',
  monthRate: 98,
  daysPresent: 18,
  daysLate: 1,
  daysAbsent: 0
};

export const ATTENDANCE_LOG = [
{ date: 'Fri, 18 Sep 2026', in: '7:04 am', out: '4:38 pm', hours: '9h 34m', status: 'Present' },
{ date: 'Thu, 17 Sep 2026', in: '7:21 am', out: '4:40 pm', hours: '9h 19m', status: 'Present' },
{ date: 'Wed, 16 Sep 2026', in: '7:48 am', out: '4:35 pm', hours: '8h 47m', status: 'Late' },
{ date: 'Tue, 15 Sep 2026', in: '7:02 am', out: '5:10 pm', hours: '10h 08m', status: 'Present' },
{ date: 'Mon, 14 Sep 2026', in: '6:58 am', out: '4:32 pm', hours: '9h 34m', status: 'Present' }];


export const LEAVE_BALANCES = [
{ type: 'Annual leave', entitled: 21, taken: 8, remaining: 13 },
{ type: 'Sick leave', entitled: 14, taken: 2, remaining: 12 },
{ type: 'Compassionate', entitled: 7, taken: 0, remaining: 7 }];


export const LEAVE_REQUESTS = [
{ id: 'lv1', type: 'Annual leave', from: '12 Oct 2026', to: '16 Oct 2026', days: 5, reason: 'Family travel to Eldoret', status: 'Pending', applied: '14 Sep 2026', staff: 'Mr. Brian Kimani' },
{ id: 'lv2', type: 'Sick leave', from: '05 Aug 2026', to: '06 Aug 2026', days: 2, reason: 'Medical appointment and recovery', status: 'Approved', applied: '04 Aug 2026', staff: 'Mr. Brian Kimani' },
{ id: 'lv3', type: 'Annual leave', from: '21 Apr 2026', to: '25 Apr 2026', days: 5, reason: 'Personal', status: 'Approved', applied: '02 Apr 2026', staff: 'Mr. Brian Kimani' },
{ id: 'lv4', type: 'Compassionate', from: '18 Mar 2026', to: '19 Mar 2026', days: 2, reason: 'Bereavement', status: 'Rejected', applied: '17 Mar 2026', staff: 'Mr. Brian Kimani' }];


export const STAFF_LEAVE_QUEUE = [
{ id: 'q1', staff: 'Mr. Brian Kimani', role: 'Class Teacher — Grade 4 Acacia', type: 'Annual leave', dates: '12 – 16 Oct', days: 5, status: 'Pending' },
{ id: 'q2', staff: 'Mr. Josphat Mule', role: 'Subject Teacher — Social Studies', type: 'Sick leave', dates: '15 – 26 Sep', days: 10, status: 'Approved' },
{ id: 'q3', staff: 'Ms. Nancy Chebet', role: 'Class Teacher — Grade 1 Baobab', type: 'Annual leave', dates: '02 – 03 Oct', days: 2, status: 'Pending' },
{ id: 'q4', staff: 'Mr. Elijah Mutua', role: 'Subject Teacher — Digital Literacy', type: 'Compassionate', dates: '28 Aug', days: 1, status: 'Approved' }];


export const PAYSLIP = {
  month: 'August 2026',
  paidOn: '28 Aug 2026',
  basic: 82000,
  allowances: [
  { label: 'House allowance', amount: 16000 },
  { label: 'Responsibility allowance', amount: 8000 },
  { label: 'Transport allowance', amount: 6000 }],

  deductions: [
  { label: 'PAYE', amount: 18450 },
  { label: 'NSSF', amount: 2160 },
  { label: 'SHIF', amount: 2750 },
  { label: 'Staff SACCO', amount: 5000 }],

  net: 83640
};

export const PAYSLIP_HISTORY = [
{ month: 'August 2026', gross: 112000, net: 83640, status: 'Paid' },
{ month: 'July 2026', gross: 112000, net: 83640, status: 'Paid' },
{ month: 'June 2026', gross: 108000, net: 80920, status: 'Paid' },
{ month: 'May 2026', gross: 108000, net: 80920, status: 'Paid' }];


export const DUTY_ROSTER = [
{ day: 'Monday', time: '7:00 – 7:40 am', duty: 'Gate & arrival supervision', teacher: 'Mr. Brian Kimani', location: 'Main Gate' },
{ day: 'Monday', time: '10:20 – 10:50 am', duty: 'Break supervision', teacher: 'Ms. Lydia Achieng', location: 'Lower Field' },
{ day: 'Tuesday', time: '12:40 – 1:30 pm', duty: 'Lunch hall', teacher: 'Mr. Brian Kimani', location: 'Dining Hall' },
{ day: 'Wednesday', time: '7:00 – 7:40 am', duty: 'Assembly setup', teacher: 'Mr. Elijah Mutua', location: 'Main Hall' },
{ day: 'Thursday', time: '3:30 – 4:30 pm', duty: 'Bus loading', teacher: 'Mrs. Faith Wambui', location: 'Car Park' },
{ day: 'Friday', time: '10:20 – 10:50 am', duty: 'Break supervision', teacher: 'Ms. Nancy Chebet', location: 'Playground' }];


export const HR_TICKETS = [
{ id: 'HR-2041', subject: 'August payslip shows wrong SACCO deduction', category: 'Payroll', created: '05 Sep 2026', status: 'In Progress', owner: 'Mrs. Susan Muthoni', staff: 'Mr. Brian Kimani' },
{ id: 'HR-2038', subject: 'Request for CPD workshop sponsorship', category: 'Training', created: '28 Aug 2026', status: 'Awaiting Response', owner: 'Mrs. Susan Muthoni', staff: 'Ms. Lydia Achieng' },
{ id: 'HR-2019', subject: 'Staff ID card replacement', category: 'Facilities', created: '11 Aug 2026', status: 'Resolved', owner: 'Admin Office', staff: 'Mr. Brian Kimani' },
{ id: 'HR-1998', subject: 'Update bank account details', category: 'Payroll', created: '22 Jul 2026', status: 'Closed', owner: 'Mr. Peter Njoroge', staff: 'Mr. Elijah Mutua' }];


export const STAFF_DIRECTORY = [
{ name: 'Mr. Samuel Kariuki', role: 'Head Teacher', dept: 'Leadership', staffNo: 'SALA-L-001', status: 'Active', phone: '+254 722 110 004' },
{ name: 'Mrs. Faith Wambui', role: 'Deputy Head, Academics', dept: 'Academics', staffNo: 'SALA-T-006', status: 'Active', phone: '+254 720 887 331' },
{ name: 'Mr. Brian Kimani', role: 'Class Teacher', dept: 'Upper Primary', staffNo: 'SALA-T-018', status: 'Active', phone: '+254 712 004 118' },
{ name: 'Ms. Lydia Achieng', role: 'Subject Teacher', dept: 'Languages', staffNo: 'SALA-T-024', status: 'Active', phone: '+254 733 551 009' },
{ name: 'Mr. Josphat Mule', role: 'Subject Teacher', dept: 'Humanities', staffNo: 'SALA-T-031', status: 'On Leave', phone: '+254 701 220 774' },
{ name: 'Mr. Peter Njoroge', role: 'Finance Manager', dept: 'Finance', staffNo: 'SALA-F-003', status: 'Active', phone: '+254 726 118 990' },
{ name: 'Mrs. Susan Muthoni', role: 'HR Manager', dept: 'Human Resources', staffNo: 'SALA-H-002', status: 'Active', phone: '+254 719 220 447' },
{ name: 'Ms. Nancy Chebet', role: 'Class Teacher', dept: 'Early Years', staffNo: 'SALA-T-040', status: 'Active', phone: '+254 719 664 210' }];


export const PAYROLL_SUMMARY = {
  staff: 86,
  grossMonthly: 7840000,
  netMonthly: 5920000,
  statutory: 1180000,
  nextRun: '28 September 2026'
};