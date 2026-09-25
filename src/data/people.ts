import type { Guardian, Student, Teacher } from '../types';

export const STUDENTS: Student[] = [
{ id: 's1', name: 'Wanjiru Kamau', admissionNo: 'SALA/2021/0418', className: 'Grade 4', stream: 'Acacia', age: 9, gender: 'Female', avatarInitials: 'WK', parentId: 'p1', status: 'Active' },
{ id: 's2', name: 'Baraka Kamau', admissionNo: 'SALA/2024/0912', className: 'Grade 1', stream: 'Baobab', age: 6, gender: 'Male', avatarInitials: 'BK', parentId: 'p1', status: 'Active' },
{ id: 's3', name: 'Amani Kiplagat', admissionNo: 'SALA/2020/0301', className: 'Grade 5', stream: 'Acacia', age: 10, gender: 'Male', avatarInitials: 'AK', parentId: 'p2', status: 'Active' },
{ id: 's4', name: 'Neema Otieno', admissionNo: 'SALA/2019/0177', className: 'Grade 6', stream: 'Cedar', age: 11, gender: 'Female', avatarInitials: 'NO', parentId: 'p3', status: 'Active' },
{ id: 's5', name: 'Joy Mutiso', admissionNo: 'SALA/2021/0455', className: 'Grade 4', stream: 'Acacia', age: 9, gender: 'Female', avatarInitials: 'JM', parentId: 'p4', status: 'Active' },
{ id: 's6', name: 'Brian Ochieng', admissionNo: 'SALA/2021/0462', className: 'Grade 4', stream: 'Acacia', age: 10, gender: 'Male', avatarInitials: 'BO', parentId: 'p5', status: 'Active' },
{ id: 's7', name: 'Aisha Hassan', admissionNo: 'SALA/2021/0470', className: 'Grade 4', stream: 'Acacia', age: 9, gender: 'Female', avatarInitials: 'AH', parentId: 'p6', status: 'Active' },
{ id: 's8', name: 'Kevin Mwangi', admissionNo: 'SALA/2021/0481', className: 'Grade 4', stream: 'Acacia', age: 10, gender: 'Male', avatarInitials: 'KM', parentId: 'p7', status: 'Active' },
{ id: 's9', name: 'Lucy Njeri', admissionNo: 'SALA/2021/0488', className: 'Grade 4', stream: 'Acacia', age: 9, gender: 'Female', avatarInitials: 'LN', parentId: 'p8', status: 'Active' },
{ id: 's10', name: 'Samuel Kiptoo', admissionNo: 'SALA/2021/0495', className: 'Grade 4', stream: 'Acacia', age: 10, gender: 'Male', avatarInitials: 'SK', parentId: 'p9', status: 'On Leave' },
{ id: 's11', name: 'Zawadi Mbugua', admissionNo: 'SALA/2022/0620', className: 'Grade 3', stream: 'Baobab', age: 8, gender: 'Female', avatarInitials: 'ZM', parentId: 'p10', status: 'Active' },
{ id: 's12', name: 'Daniel Wekesa', admissionNo: 'SALA/2023/0744', className: 'Grade 2', stream: 'Cedar', age: 7, gender: 'Male', avatarInitials: 'DW', parentId: 'p11', status: 'Active' }];


export const GUARDIANS: Guardian[] = [
{ id: 'p1', name: 'Grace Wanjiku Kamau', relationship: 'Mother', phone: '+254 722 481 903', email: 'grace.kamau@gmail.com', occupation: 'Pharmacist', address: 'Kiambu Road, Nairobi', childIds: ['s1', 's2'] },
{ id: 'p2', name: 'Dennis Kiplagat', relationship: 'Father', phone: '+254 733 220 118', email: 'd.kiplagat@outlook.com', occupation: 'Civil Engineer', address: 'Ruaka, Kiambu', childIds: ['s3'] },
{ id: 'p3', name: 'Everline Otieno', relationship: 'Mother', phone: '+254 711 908 442', email: 'ev.otieno@gmail.com', occupation: 'Banker', address: 'Garden Estate, Nairobi', childIds: ['s4'] },
{ id: 'p4', name: 'Peter Mutiso', relationship: 'Father', phone: '+254 720 334 771', email: 'pmutiso@gmail.com', occupation: 'Logistics Manager', address: 'Thindigua, Kiambu', childIds: ['s5'] },
{ id: 'p5', name: 'Millicent Ochieng', relationship: 'Mother', phone: '+254 726 551 200', email: 'milli.o@gmail.com', occupation: 'Nurse', address: 'Roysambu, Nairobi', childIds: ['s6'] },
{ id: 'p6', name: 'Hassan Abdi', relationship: 'Father', phone: '+254 714 660 819', email: 'h.abdi@gmail.com', occupation: 'Businessman', address: 'Parklands, Nairobi', childIds: ['s7'] },
{ id: 'p7', name: 'Josephine Mwangi', relationship: 'Mother', phone: '+254 738 112 004', email: 'jmwangi@gmail.com', occupation: 'Teacher', address: 'Kahawa Sukari', childIds: ['s8'] },
{ id: 'p8', name: 'Anthony Njeri', relationship: 'Father', phone: '+254 700 918 337', email: 'a.njeri@gmail.com', occupation: 'Accountant', address: 'Runda, Nairobi', childIds: ['s9'] },
{ id: 'p9', name: 'Ruth Kiptoo', relationship: 'Mother', phone: '+254 745 220 661', email: 'ruth.kiptoo@gmail.com', occupation: 'Lawyer', address: 'Muthaiga North', childIds: ['s10'] },
{ id: 'p10', name: 'Caroline Mbugua', relationship: 'Mother', phone: '+254 729 445 018', email: 'c.mbugua@gmail.com', occupation: 'Marketer', address: 'Ridgeways, Nairobi', childIds: ['s11'] },
{ id: 'p11', name: 'Wekesa Barasa', relationship: 'Father', phone: '+254 717 330 552', email: 'w.barasa@gmail.com', occupation: 'Surveyor', address: 'Ruiru, Kiambu', childIds: ['s12'] }];


export const TEACHERS: Teacher[] = [
{ id: 't1', name: 'Mr. Brian Kimani', role: 'Class Teacher', subjects: ['Mathematics', 'Science & Technology'], classes: ['Grade 4 Acacia'], email: 'b.kimani@salaschools.ac.ke', phone: '+254 712 004 118', staffNo: 'SALA-T-018', status: 'Active' },
{ id: 't2', name: 'Ms. Lydia Achieng', role: 'Subject Teacher', subjects: ['English'], classes: ['Grade 4 Acacia', 'Grade 5 Acacia', 'Grade 6 Cedar'], email: 'l.achieng@salaschools.ac.ke', phone: '+254 733 551 009', staffNo: 'SALA-T-024', status: 'Active' },
{ id: 't3', name: 'Mrs. Faith Wambui', role: 'Head of Department', subjects: ['Kiswahili'], classes: ['Grade 5 Acacia', 'Grade 6 Cedar'], email: 'f.wambui@salaschools.ac.ke', phone: '+254 720 887 331', staffNo: 'SALA-T-006', status: 'Active' },
{ id: 't4', name: 'Mr. Josphat Mule', role: 'Subject Teacher', subjects: ['Social Studies', 'CRE'], classes: ['Grade 4 Acacia', 'Grade 6 Cedar'], email: 'j.mule@salaschools.ac.ke', phone: '+254 701 220 774', staffNo: 'SALA-T-031', status: 'On Leave' },
{ id: 't5', name: 'Ms. Nancy Chebet', role: 'Class Teacher', subjects: ['Creative Arts'], classes: ['Grade 1 Baobab'], email: 'n.chebet@salaschools.ac.ke', phone: '+254 719 664 210', staffNo: 'SALA-T-040', status: 'Active' },
{ id: 't6', name: 'Mr. Elijah Mutua', role: 'Subject Teacher', subjects: ['Digital Literacy'], classes: ['Grade 4 Acacia', 'Grade 5 Acacia'], email: 'e.mutua@salaschools.ac.ke', phone: '+254 707 442 883', staffNo: 'SALA-T-052', status: 'Active' }];


export const CLASSES = [
{ id: 'c1', name: 'Grade 4 Acacia', teacher: 'Mr. Brian Kimani', learners: 26, room: 'Block B · Rm 12', average: 74, attendance: 96 },
{ id: 'c2', name: 'Grade 5 Acacia', teacher: 'Mrs. Faith Wambui', learners: 24, room: 'Block B · Rm 14', average: 71, attendance: 94 },
{ id: 'c3', name: 'Grade 6 Cedar', teacher: 'Mr. Josphat Mule', learners: 25, room: 'Block C · Rm 03', average: 77, attendance: 97 },
{ id: 'c4', name: 'Grade 3 Baobab', teacher: 'Ms. Nancy Chebet', learners: 23, room: 'Block A · Rm 08', average: 69, attendance: 95 },
{ id: 'c5', name: 'Grade 1 Baobab', teacher: 'Ms. Nancy Chebet', learners: 21, room: 'Block A · Rm 02', average: 72, attendance: 98 }];


export const CURRENT_PARENT = GUARDIANS[0];
export const CURRENT_STUDENT = STUDENTS[0];