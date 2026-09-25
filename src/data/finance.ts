import type { FeeItem, Payment } from '../types';

export const formatKES = (n: number) =>
'KES ' + n.toLocaleString('en-KE', { maximumFractionDigits: 0 });

export const FEE_BREAKDOWN: FeeItem[] = [
{ label: 'Tuition — Term 3', amount: 62000 },
{ label: 'Transport (Route 6 — Ruaka)', amount: 18000 },
{ label: 'Lunch programme', amount: 12000 },
{ label: 'Activity & clubs levy', amount: 6500 },
{ label: 'Learning materials', amount: 4500 }];


export const FEE_SUMMARY = {
  total: 103000,
  paid: 68000,
  balance: 35000,
  deadline: '30 September 2026',
  term: 'Term 3 · 2026'
};

export const PAYMENTS: Payment[] = [
{ id: 'pay1', date: '02 Sep 2026', amount: 40000, method: 'M-Pesa', reference: 'SALA7X92KQ', student: 'Wanjiru Kamau', term: 'Term 3 2026', receiptNo: 'RCT-2026-04182' },
{ id: 'pay2', date: '18 Aug 2026', amount: 28000, method: 'Bank Transfer', reference: 'KCB-8841207', student: 'Wanjiru Kamau', term: 'Term 3 2026', receiptNo: 'RCT-2026-03977' },
{ id: 'pay3', date: '06 May 2026', amount: 52000, method: 'M-Pesa', reference: 'SALA4M18PD', student: 'Wanjiru Kamau', term: 'Term 2 2026', receiptNo: 'RCT-2026-03104' },
{ id: 'pay4', date: '21 Apr 2026', amount: 51000, method: 'M-Pesa', reference: 'SALA2B77LT', student: 'Baraka Kamau', term: 'Term 2 2026', receiptNo: 'RCT-2026-02988' },
{ id: 'pay5', date: '14 Jan 2026', amount: 98000, method: 'Bank Transfer', reference: 'EQT-2210934', student: 'Wanjiru Kamau', term: 'Term 1 2026', receiptNo: 'RCT-2026-00412' }];


export const COLLECTIONS_TREND = [
{ month: 'Apr', collected: 18.4, target: 21 },
{ month: 'May', collected: 20.1, target: 21 },
{ month: 'Jun', collected: 16.8, target: 21 },
{ month: 'Jul', collected: 9.2, target: 12 },
{ month: 'Aug', collected: 22.6, target: 24 },
{ month: 'Sep', collected: 19.8, target: 24 }];


export const PAYMENT_METHOD_SPLIT = [
{ name: 'M-Pesa', value: 62 },
{ name: 'Bank Transfer', value: 29 },
{ name: 'Card', value: 9 }];


export const STUDENT_BALANCES = [
{ student: 'Wanjiru Kamau', className: 'Grade 4 Acacia', billed: 103000, paid: 68000, balance: 35000, status: 'Part paid' },
{ student: 'Amani Kiplagat', className: 'Grade 5 Acacia', billed: 103000, paid: 103000, balance: 0, status: 'Cleared' },
{ student: 'Neema Otieno', className: 'Grade 6 Cedar', billed: 108000, paid: 40000, balance: 68000, status: 'Overdue' },
{ student: 'Joy Mutiso', className: 'Grade 4 Acacia', billed: 103000, paid: 90000, balance: 13000, status: 'Part paid' },
{ student: 'Brian Ochieng', className: 'Grade 4 Acacia', billed: 103000, paid: 103000, balance: 0, status: 'Cleared' },
{ student: 'Aisha Hassan', className: 'Grade 4 Acacia', billed: 103000, paid: 55000, balance: 48000, status: 'Overdue' },
{ student: 'Zawadi Mbugua', className: 'Grade 3 Baobab', billed: 97000, paid: 97000, balance: 0, status: 'Cleared' },
{ student: 'Daniel Wekesa', className: 'Grade 2 Cedar', billed: 97000, paid: 60000, balance: 37000, status: 'Part paid' }];


export const FINANCE_SUMMARY = {
  collected: 86400000,
  outstanding: 14200000,
  today: 412000,
  invoicesRaised: 1148,
  clearedLearners: 742
};