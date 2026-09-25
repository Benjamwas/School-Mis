import type { Lead } from '../types';

export const PIPELINE_STAGES = ['New', 'Contacted', 'Interested', 'Visit Booked', 'Application', 'Admitted', 'Enrolled'] as const;

export const PIPELINE_COUNTS = [
{ stage: 'New', count: 38 },
{ stage: 'Contacted', count: 29 },
{ stage: 'Interested', count: 21 },
{ stage: 'Visit Booked', count: 16 },
{ stage: 'Application', count: 24 },
{ stage: 'Admitted', count: 11 },
{ stage: 'Enrolled', count: 9 }];


export const LEADS: Lead[] = [
{ id: 'L-1042', parent: 'Mercy Wairimu', child: 'Tehilah Wairimu', applyingClass: 'PP2', stage: 'New', source: 'Website enquiry', phone: '+254 711 334 908', email: 'mercy.w@gmail.com', owner: 'Jane Njoki', updated: '2 hours ago', nextAction: 'First call — today 4:00pm' },
{ id: 'L-1041', parent: 'Collins Barasa', child: 'Ethan Barasa', applyingClass: 'Grade 2', stage: 'Contacted', source: 'Referral — Otieno family', phone: '+254 722 908 114', email: 'c.barasa@gmail.com', owner: 'Jane Njoki', updated: 'Yesterday', nextAction: 'Send fee structure' },
{ id: 'L-1039', parent: 'Fatuma Ali', child: 'Layla Ali', applyingClass: 'Grade 1', stage: 'Visit Booked', source: 'Instagram', phone: '+254 700 552 331', email: 'f.ali@gmail.com', owner: 'Peter Mwaura', updated: '2 days ago', nextAction: 'Campus tour — 24 Sep, 10:00am' },
{ id: 'L-1036', parent: 'George Otieno', child: 'Mark Otieno', applyingClass: 'Grade 4', stage: 'Application', source: 'Open Day', phone: '+254 733 118 440', email: 'g.otieno@gmail.com', owner: 'Jane Njoki', updated: '3 days ago', nextAction: 'Assessment — 26 Sep, 9:00am' },
{ id: 'L-1030', parent: 'Sarah Chelimo', child: 'Ivy Chelimo', applyingClass: 'PP1', stage: 'Interested', source: 'Website enquiry', phone: '+254 714 229 087', email: 's.chelimo@gmail.com', owner: 'Peter Mwaura', updated: '4 days ago', nextAction: 'Follow up on brochure' },
{ id: 'L-1024', parent: 'Michael Wanyama', child: 'Blessing Wanyama', applyingClass: 'Grade 5', stage: 'Admitted', source: 'Referral', phone: '+254 745 660 210', email: 'm.wanyama@gmail.com', owner: 'Jane Njoki', updated: '5 days ago', nextAction: 'Awaiting commitment fee' },
{ id: 'L-1019', parent: 'Rehema Juma', child: 'Sifa Juma', applyingClass: 'Grade 3', stage: 'Enrolled', source: 'Walk-in', phone: '+254 729 004 776', email: 'r.juma@gmail.com', owner: 'Peter Mwaura', updated: '1 week ago', nextAction: 'Uniform fitting booked' }];


export const LEAD_ACTIVITY = [
{ when: 'Today, 9:14am', who: 'Jane Njoki', what: 'Logged a call — parent asked about transport on the Ruaka route.', type: 'Call' },
{ when: 'Yesterday, 4:02pm', who: 'System', what: 'Application form started — 3 of 7 steps complete.', type: 'Application' },
{ when: '17 Sep, 11:30am', who: 'Jane Njoki', what: 'Sent Term 1 2027 fee structure and admissions pack by email.', type: 'Email' },
{ when: '15 Sep, 10:00am', who: 'Peter Mwaura', what: 'Campus tour completed. Met the Head of Early Years.', type: 'Visit' },
{ when: '12 Sep, 8:48am', who: 'System', what: 'Enquiry received from the website contact form.', type: 'Enquiry' }];


export const APPLICATIONS = [
{ id: 'APP-2026-0418', child: 'Mark Otieno', parent: 'George Otieno', applyingClass: 'Grade 4', submitted: '16 Sep 2026', stage: 'Interview', status: 'Active' },
{ id: 'APP-2026-0416', child: 'Layla Ali', parent: 'Fatuma Ali', applyingClass: 'Grade 1', submitted: '14 Sep 2026', stage: 'Under Review', status: 'Active' },
{ id: 'APP-2026-0411', child: 'Blessing Wanyama', parent: 'Michael Wanyama', applyingClass: 'Grade 5', submitted: '09 Sep 2026', stage: 'Accepted', status: 'Offer sent' },
{ id: 'APP-2026-0404', child: 'Sifa Juma', parent: 'Rehema Juma', applyingClass: 'Grade 3', submitted: '02 Sep 2026', stage: 'Enrolled', status: 'Complete' },
{ id: 'APP-2026-0398', child: 'Ethan Barasa', parent: 'Collins Barasa', applyingClass: 'Grade 2', submitted: '29 Aug 2026', stage: 'Decision', status: 'Requires action' }];


export const APPLICATION_TIMELINE = [
{ stage: 'Submitted', date: '16 Sep 2026', desc: 'Application and all documents received.', state: 'complete' },
{ stage: 'Under Review', date: '17 Sep 2026', desc: 'Admissions office verified documents and previous school report.', state: 'complete' },
{ stage: 'Interview & Assessment', date: '26 Sep 2026, 9:00am', desc: 'Grade 4 English and Mathematics assessment at the Acacia Wing.', state: 'active' },
{ stage: 'Decision', date: 'Expected 02 Oct 2026', desc: 'Outcome released within 10 working days of assessment.', state: 'pending' },
{ stage: 'Accepted', date: '—', desc: 'Accept your place and pay the commitment fee to secure it.', state: 'pending' },
{ stage: 'Enrolled', date: '—', desc: 'Class placement, uniform fitting and portal accounts activated.', state: 'pending' }];


export const VISIT_SLOTS = [
{ time: '9:00 am', available: true },
{ time: '10:00 am', available: true },
{ time: '11:00 am', available: false },
{ time: '12:00 pm', available: false },
{ time: '2:00 pm', available: true },
{ time: '3:00 pm', available: true }];


export const BOOKED_VISITS = [
{ id: 'V-3081', parent: 'Fatuma Ali', date: '24 Sep 2026', time: '10:00 am', visitors: 2, reason: 'Campus tour — Grade 1', status: 'Confirmed' },
{ id: 'V-3078', parent: 'Sarah Chelimo', date: '25 Sep 2026', time: '9:00 am', visitors: 3, reason: 'ECD consultation', status: 'Confirmed' },
{ id: 'V-3074', parent: 'Collins Barasa', date: '19 Sep 2026', time: '2:00 pm', visitors: 2, reason: 'Fees and transport discussion', status: 'Completed' }];