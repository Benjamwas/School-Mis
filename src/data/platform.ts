export const PLATFORM_SUMMARY = {
  schools: 12,
  active: 9,
  trial: 2,
  suspended: 1,
  administrators: 47,
  users: 14820,
  modulesEnabled: 11,
  uptime: '99.97%'
};

export const SCHOOLS = [
{ id: 'sc1', name: 'St. Ann Lifred Academy Schools', county: 'Nairobi', learners: 1148, staff: 86, admins: 6, status: 'Active', plan: 'Premium', modules: 14, since: 'Jan 2023' },
{ id: 'sc2', name: 'Mount Kenya Junior Academy', county: 'Nyeri', learners: 642, staff: 51, admins: 3, status: 'Active', plan: 'Standard', modules: 10, since: 'Aug 2023' },
{ id: 'sc3', name: 'Lakeview Preparatory School', county: 'Kisumu', learners: 806, staff: 63, admins: 4, status: 'Active', plan: 'Premium', modules: 13, since: 'Mar 2024' },
{ id: 'sc4', name: 'Rift Valley Montessori', county: 'Nakuru', learners: 318, staff: 29, admins: 2, status: 'Trial', plan: 'Trial', modules: 6, since: 'Aug 2026' },
{ id: 'sc5', name: 'Coast Star Academy', county: 'Mombasa', learners: 574, staff: 44, admins: 3, status: 'Suspended', plan: 'Standard', modules: 9, since: 'Feb 2024' },
{ id: 'sc6', name: 'Highlands Christian School', county: 'Eldoret', learners: 921, staff: 72, admins: 5, status: 'Active', plan: 'Premium', modules: 12, since: 'Sep 2023' }];


export const MODULES = [
{ name: 'Public Website', enabled: true, usage: 96, config: 'Domain, theme, sections' },
{ name: 'Admissions', enabled: true, usage: 88, config: 'Forms, intakes, assessments' },
{ name: 'CRM', enabled: true, usage: 74, config: 'Pipeline, owners, SLAs' },
{ name: 'Parent Portal', enabled: true, usage: 91, config: 'Widgets, visibility rules' },
{ name: 'Student Portal', enabled: true, usage: 83, config: 'Age bands, gamification' },
{ name: 'LMS', enabled: true, usage: 69, config: 'Topics, resources, quizzes' },
{ name: 'Academics', enabled: true, usage: 94, config: 'Years, terms, grading scales' },
{ name: 'Finance', enabled: true, usage: 87, config: 'Fee heads, M-Pesa, receipts' },
{ name: 'HRM', enabled: true, usage: 72, config: 'Payroll, leave, duty roster' },
{ name: 'Communication', enabled: true, usage: 78, config: 'SMS, WhatsApp, in-app' },
{ name: 'Reports', enabled: true, usage: 64, config: 'Templates, exports' },
{ name: 'CMS', enabled: false, usage: 0, config: 'News, notices, pages' },
{ name: 'Gallery', enabled: true, usage: 55, config: 'Albums, moderation' },
{ name: 'Events', enabled: true, usage: 61, config: 'Calendars, RSVPs' }];


export const PLATFORM_USERS = [
{ name: 'Mr. Samuel Kariuki', email: 's.kariuki@salaschools.ac.ke', school: 'St. Ann Lifred Academy', role: 'School Administrator', status: 'Active', lastActive: '12 min ago' },
{ name: 'Mr. Peter Njoroge', email: 'p.njoroge@salaschools.ac.ke', school: 'St. Ann Lifred Academy', role: 'Finance Admin', status: 'Active', lastActive: '1 hour ago' },
{ name: 'Mrs. Susan Muthoni', email: 's.muthoni@salaschools.ac.ke', school: 'St. Ann Lifred Academy', role: 'HR Admin', status: 'Active', lastActive: '3 hours ago' },
{ name: 'Ms. Winnie Adhiambo', email: 'w.adhiambo@lakeviewprep.ac.ke', school: 'Lakeview Preparatory', role: 'School Administrator', status: 'Active', lastActive: 'Yesterday' },
{ name: 'Mr. Kelvin Rotich', email: 'k.rotich@rvmontessori.ac.ke', school: 'Rift Valley Montessori', role: 'School Administrator', status: 'Invited', lastActive: '—' },
{ name: 'Ms. Halima Yusuf', email: 'h.yusuf@coaststar.ac.ke', school: 'Coast Star Academy', role: 'School Administrator', status: 'Suspended', lastActive: '3 weeks ago' }];


export const AUDIT_LOGS = [
{ user: 'Mr. Samuel Kariuki', role: 'School Admin', action: 'Updated student profile', module: 'Students', target: 'Wanjiru Kamau (SALA/2021/0418)', when: 'Today, 10:42am', status: 'Success' },
{ user: 'Mr. Peter Njoroge', role: 'Finance Admin', action: 'Recorded payment', module: 'Finance', target: 'KES 40,000 · Ref SALA7X92KQ', when: 'Today, 9:18am', status: 'Success' },
{ user: 'Mr. Brian Kimani', role: 'Class Teacher', action: 'Published assignment', module: 'LMS', target: 'Fractions — comparing and ordering', when: 'Today, 8:05am', status: 'Success' },
{ user: 'Super Admin', role: 'Super Admin', action: 'Changed module configuration', module: 'Platform', target: 'CMS disabled for St. Ann Lifred Academy', when: 'Yesterday, 6:31pm', status: 'Success' },
{ user: 'Ms. Halima Yusuf', role: 'School Admin', action: 'Attempted login', module: 'Auth', target: 'Coast Star Academy', when: 'Yesterday, 2:14pm', status: 'Blocked' },
{ user: 'Mrs. Susan Muthoni', role: 'HR Admin', action: 'Approved leave request', module: 'HRM', target: 'Mr. Josphat Mule · 10 days sick leave', when: '17 Sep, 4:55pm', status: 'Success' }];


export const PLATFORM_ACTIVITY = [
{ day: 'Mon', sessions: 4210 },
{ day: 'Tue', sessions: 4680 },
{ day: 'Wed', sessions: 4405 },
{ day: 'Thu', sessions: 4890 },
{ day: 'Fri', sessions: 5120 },
{ day: 'Sat', sessions: 1840 },
{ day: 'Sun', sessions: 1210 }];


export const INTEGRATIONS = [
{ name: 'Safaricom M-Pesa (Daraja)', category: 'Payments', status: 'Connected', detail: 'Paybill 522533 · Account SALA' },
{ name: 'Africa’s Talking SMS', category: 'Communication', status: 'Connected', detail: '18,402 messages this term' },
{ name: 'WhatsApp Business', category: 'Communication', status: 'Connected', detail: 'Verified sender · SALA Schools' },
{ name: 'Google Workspace', category: 'Identity', status: 'Connected', detail: 'SSO for staff accounts' },
{ name: 'KCB Bank Feed', category: 'Payments', status: 'Pending', detail: 'Awaiting bank authorisation' },
{ name: 'Zoom', category: 'Learning', status: 'Not connected', detail: 'Enable for remote lessons' }];