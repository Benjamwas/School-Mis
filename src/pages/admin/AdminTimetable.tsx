import React, { useEffect, useMemo, useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Button, Card, CardHeader, Field, Input, PageHeader, Select, StatusBadge, cx } from '../../components/ui/primitives';
import { DataTable } from '../../components/ui/data';
import { ConfirmDialog, Modal } from '../../components/ui/feedback';
import { api } from '../../api/client';
import { useApiLive, useList, useObject } from '../../api/hooks';
import { useApp } from '../../contexts/AppContext';
import type { ApiClass, ApiTeachingAssignment } from '../../api/types';

const DAY_LABELS: Record<string, string> = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday' };
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

type Period = { id: string; name: string; start_time: string; end_time: string; display_order: number };
type Slot = {
  id: string;
  school_class: string;
  class_name?: string;
  period: string;
  period_name?: string;
  teaching_assignment?: string | null;
  subject_name?: string;
  teacher_name?: string;
  day_of_week: string;
  room?: string;
  status: string;
};
type WeekPayload = { periods: Period[]; days: string[]; slots: Slot[] };

const emptyPeriod = { name: '', start_time: '08:00', end_time: '08:40', display_order: 0 };
const emptySlot = { school_class: '', period: '', teaching_assignment: '', day_of_week: 'MON', room: '' };

export function AdminTimetable() {
  const { toast } = useApp();
  const live = useApiLive();
  const [tab, setTab] = useState<'Timetable' | 'Periods'>('Timetable');

  // ---------- Periods ----------
  const periods = useList<Period>('timetable/periods/');
  const [showPeriod, setShowPeriod] = useState(false);
  const [editPeriodId, setEditPeriodId] = useState<string | null>(null);
  const [periodBusy, setPeriodBusy] = useState(false);
  const [periodForm, setPeriodForm] = useState(emptyPeriod);
  const [delPeriodId, setDelPeriodId] = useState<string | null>(null);

  // ---------- Slots / timetable ----------
  const classes = useList<ApiClass>('schools/classes/');
  const teachingAssignments = useList<ApiTeachingAssignment>('subjects/teaching-assignments/');
  const [selectedClass, setSelectedClass] = useState('');
  const week = useObject<WeekPayload>(
    selectedClass ? `timetable/slots/week/?class_id=${selectedClass}` : 'timetable/slots/week/'
  );
  const [showSlot, setShowSlot] = useState(false);
  const [editSlotId, setEditSlotId] = useState<string | null>(null);
  const [slotBusy, setSlotBusy] = useState(false);
  const [slotForm, setSlotForm] = useState(emptySlot);
  const [delSlotId, setDelSlotId] = useState<string | null>(null);
  const [delSlotLabel, setDelSlotLabel] = useState('');

  // Auto-select first class
  useEffect(() => {
    if (!selectedClass && classes.data?.length) {
      setSelectedClass(classes.data[0].id);
    }
  }, [classes.data, selectedClass]);

  const slotMap = useMemo(() => {
    const map = new Map<string, Slot>();
    for (const s of week.data?.slots ?? []) {
      map.set(`${s.day_of_week}-${s.period}`, s);
    }
    return map;
  }, [week.data]);

  const periodList = week.data?.periods?.length
    ? week.data.periods
    : (periods.data ?? []);

  const classNames = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of classes.data ?? []) m.set(c.id, c.display_name || c.name);
    return m;
  }, [classes.data]);

  // ---------- Period CRUD ----------
  const openAddPeriod = () => { setEditPeriodId(null); setPeriodForm({ ...emptyPeriod, display_order: (periods.data?.length ?? 0) + 1 }); setShowPeriod(true); };
  const openEditPeriod = (r: Period) => {
    setEditPeriodId(r.id);
    setPeriodForm({ name: r.name, start_time: r.start_time?.slice(0, 5) ?? '', end_time: r.end_time?.slice(0, 5) ?? '', display_order: r.display_order });
    setShowPeriod(true);
  };

  const savePeriod = async () => {
    if (!periodForm.name || !periodForm.start_time || !periodForm.end_time) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Name, start and end time are required.' });
      return;
    }
    setPeriodBusy(true);
    try {
      const body = { name: periodForm.name, start_time: periodForm.start_time, end_time: periodForm.end_time, display_order: periodForm.display_order };
      if (editPeriodId) {
        await api.patch(`timetable/periods/${editPeriodId}/`, body);
        toast({ tone: 'success', title: 'Period updated' });
      } else {
        await api.post('timetable/periods/', body);
        toast({ tone: 'success', title: 'Period created', body: `${periodForm.name} added.` });
      }
      setShowPeriod(false);
      periods.refresh();
      week.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setPeriodBusy(false);
    }
  };

  const removePeriod = async () => {
    if (!delPeriodId) return;
    setPeriodBusy(true);
    try {
      await api.delete(`timetable/periods/${delPeriodId}/`);
      toast({ tone: 'success', title: 'Period deleted' });
      setDelPeriodId(null);
      periods.refresh();
      week.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setPeriodBusy(false);
    }
  };

  // ---------- Slot CRUD ----------
  const openAddSlot = (day?: string, periodId?: string) => {
    setEditSlotId(null);
    setSlotForm({
      ...emptySlot,
      school_class: selectedClass,
      day_of_week: day ?? 'MON',
      period: periodId ?? periodList[0]?.id ?? ''
    });
    setShowSlot(true);
  };

  const openEditSlot = (s: Slot) => {
    setEditSlotId(s.id);
    setSlotForm({
      school_class: s.school_class,
      period: s.period,
      teaching_assignment: s.teaching_assignment ?? '',
      day_of_week: s.day_of_week,
      room: s.room ?? ''
    });
    setShowSlot(true);
  };

  const saveSlot = async () => {
    if (!slotForm.school_class || !slotForm.period || !slotForm.teaching_assignment) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Class, period and teaching assignment are required.' });
      return;
    }
    setSlotBusy(true);
    try {
      const body = {
        school_class: slotForm.school_class,
        period: slotForm.period,
        teaching_assignment: slotForm.teaching_assignment,
        day_of_week: slotForm.day_of_week,
        room: slotForm.room || undefined
      };
      if (editSlotId) {
        await api.patch(`timetable/slots/${editSlotId}/`, body);
        toast({ tone: 'success', title: 'Slot updated' });
      } else {
        await api.post('timetable/slots/', body);
        toast({ tone: 'success', title: 'Slot added', body: 'Timetable updated.' });
      }
      setShowSlot(false);
      week.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setSlotBusy(false);
    }
  };

  const removeSlot = async () => {
    if (!delSlotId) return;
    setSlotBusy(true);
    try {
      await api.delete(`timetable/slots/${delSlotId}/`);
      toast({ tone: 'success', title: 'Slot removed' });
      setDelSlotId(null);
      week.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setSlotBusy(false);
    }
  };

  // Cell click: edit if slot exists, add if empty
  const onCellClick = (day: string, periodId: string) => {
    const existing = slotMap.get(`${day}-${periodId}`);
    if (existing) openEditSlot(existing);
    else openAddSlot(day, periodId);
  };

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Manage school periods and build the weekly timetable for each class."
        actions={
          tab === 'Periods' ? (
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAddPeriod}>Add period</Button>
          ) : (
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => openAddSlot()}>Add slot</Button>
          )
        } />

      {/* Tabs */}
      <div className="border-b border-line overflow-x-auto sala-scroll mb-6">
        <div className="flex gap-1 min-w-max">
          {(['Timetable', 'Periods'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cx(
                'relative px-4 py-2.5 text-[13.5px] font-medium rounded-t-md transition-colors',
                tab === t ? 'text-gold' : 'text-ink-muted hover:text-ink'
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold" />}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Timetable' && (
        <div className="space-y-6">
          {/* Class selector */}
          <Card className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <Field label="Class" className="min-w-[220px]">
                <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  {(classes.data ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.display_name || c.name}</option>
                  ))}
                  {(classes.data ?? []).length === 0 && <option value="">— no classes —</option>}
                </Select>
              </Field>
              <p className="text-[13px] text-ink-muted pb-2.5">
                {live && week.data?.slots
                  ? `${week.data.slots.length} slots scheduled · click a cell to edit or add`
                  : 'Select a class to view or build its timetable.'}
              </p>
            </div>
          </Card>

          {live && week.error && <p className="text-sm text-rose-600">{week.error}</p>}

          {/* Timetable grid */}
          <Card className="overflow-hidden">
            <CardHeader
              title="Weekly timetable"
              subtitle={selectedClass ? (classNames.get(selectedClass) ?? '') : 'Select a class'} />
            <div className="overflow-x-auto sala-scroll">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="bg-cream/60 border-b border-line">
                    <th scope="col" className="px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted w-32">
                      Period
                    </th>
                    {DAYS.map((d) => (
                      <th key={d} scope="col" className="px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
                        {DAY_LABELS[d]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periodList.map((p) => {
                    const pid = p.id ?? p.name;
                    const isBreak = /break|lunch/i.test(p.name);
                    return (
                      <tr key={pid} className={cx('border-b border-line/70 last:border-0', isBreak && 'bg-cream/40')}>
                        <th scope="row" className="px-4 py-3 text-left align-top">
                          <span className="block text-[13px] font-medium text-forest-700">{p.name}</span>
                          <span className="block text-[11px] text-ink-muted font-normal">{String(p.start_time).slice(0, 5)} – {String(p.end_time).slice(0, 5)}</span>
                        </th>
                        {DAYS.map((d) => {
                          if (isBreak) {
                            return <td key={d} className="px-3 py-2.5 text-[12px] text-ink-soft">—</td>;
                          }
                          const slot = slotMap.get(`${d}-${pid}`);
                          return (
                            <td key={d} className="px-2 py-2">
                              <button
                                type="button"
                                onClick={() => onCellClick(d, pid)}
                                className={cx(
                                  'w-full text-left rounded-xl px-3 py-2 text-[13px] transition-all duration-150 min-h-[52px]',
                                  slot
                                    ? 'bg-gold-50 text-gold-600 hover:bg-gold-100 border border-gold-200'
                                    : 'border border-dashed border-surface-border dark:border-white/15 text-ink-soft hover:border-gold/50 hover:bg-gold/5'
                                )}
                              >
                                {slot ? (
                                  <>
                                    <span className="block font-semibold">{slot.subject_name ?? '—'}</span>
                                    {slot.teacher_name && <span className="block text-[11px] text-ink-muted mt-0.5">{slot.teacher_name}</span>}
                                    {slot.room && <span className="block text-[10px] text-ink-soft">{slot.room}</span>}
                                  </>
                                ) : (
                                  <span className="text-[12px]">+ Add</span>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {periodList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-muted">
                        No periods defined. Go to the <strong>Periods</strong> tab to add school periods first.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === 'Periods' && (
        <Card>
          <CardHeader title={`${periods.data?.length ?? 0} school periods`} subtitle="Name, start time and end time for each lesson period" />
          {live && periods.error && <p className="px-5 pt-3 text-sm text-rose-600">{periods.error}</p>}
          <DataTable
            columns={[
              { key: 'name', header: 'Period', render: (r: any) => <span className="font-medium">{r.name}</span> },
              { key: 'start_time', header: 'Starts', render: (r: any) => String(r.start_time).slice(0, 5) },
              { key: 'end_time', header: 'Ends', render: (r: any) => String(r.end_time).slice(0, 5) },
              { key: 'display_order', header: 'Order' },
              {
                key: 'a',
                header: '',
                align: 'right' as const,
                render: (r: any) => (
                  <span className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openEditPeriod(r); }}
                      className="h-8 w-8 grid place-items-center rounded-lg text-gold hover:bg-gold/15 transition-colors"
                    >
                      <PencilIcon size={14} />
                    </button>
                    {live && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDelPeriodId(r.id); }}
                        className="h-8 w-8 grid place-items-center rounded-lg text-red-400 hover:bg-red-500/15 transition-colors"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    )}
                  </span>
                )
              }
            ]}
            rows={periods.data ?? []}
            mobileTitle={(r: any) => r.name}
            caption="School periods" />
        </Card>
      )}

      {/* Period modal */}
      <Modal
        open={showPeriod}
        onClose={() => setShowPeriod(false)}
        title={editPeriodId ? 'Edit period' : 'Add period'}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Period name" required className="sm:col-span-2">
            <Input value={periodForm.name} onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })} placeholder="Period 1" />
          </Field>
          <Field label="Start time" required>
            <Input type="time" value={periodForm.start_time} onChange={(e) => setPeriodForm({ ...periodForm, start_time: e.target.value })} />
          </Field>
          <Field label="End time" required>
            <Input type="time" value={periodForm.end_time} onChange={(e) => setPeriodForm({ ...periodForm, end_time: e.target.value })} />
          </Field>
          <Field label="Display order">
            <Input type="number" min="0" value={periodForm.display_order} onChange={(e) => setPeriodForm({ ...periodForm, display_order: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowPeriod(false)}>Cancel</Button>
          <Button size="sm" disabled={periodBusy} onClick={savePeriod}>
            {periodBusy ? 'Saving…' : editPeriodId ? 'Save changes' : 'Add period'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delPeriodId}
        onClose={() => setDelPeriodId(null)}
        onConfirm={removePeriod}
        title="Delete period?"
        body="Timetable slots using this period will also be removed."
        confirmLabel={periodBusy ? 'Deleting…' : 'Delete period'}
        danger
      />

      {/* Slot modal */}
      <Modal
        open={showSlot}
        onClose={() => setShowSlot(false)}
        title={editSlotId ? 'Edit timetable slot' : 'Add timetable slot'}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Class" required>
            <Select value={slotForm.school_class} onChange={(e) => setSlotForm({ ...slotForm, school_class: e.target.value })}>
              {(classes.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.display_name || c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Day" required>
            <Select value={slotForm.day_of_week} onChange={(e) => setSlotForm({ ...slotForm, day_of_week: e.target.value })}>
              {DAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
            </Select>
          </Field>
          <Field label="Period" required>
            <Select value={slotForm.period} onChange={(e) => setSlotForm({ ...slotForm, period: e.target.value })}>
              {periodList.map((p) => (
                <option key={p.id ?? p.name} value={p.id ?? ''}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Teaching assignment" required hint="Teacher · class · subject">
            <Select value={slotForm.teaching_assignment} onChange={(e) => setSlotForm({ ...slotForm, teaching_assignment: e.target.value })}>
              {(teachingAssignments.data ?? []).map((ta) => (
                <option key={ta.id} value={ta.id}>
                  {ta.subject_name} · {ta.class_name} · {ta.teacher_name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Room" className="sm:col-span-2">
            <Input value={slotForm.room} onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })} placeholder="Room 1A" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          {editSlotId && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 mr-auto"
              onClick={() => { setDelSlotId(editSlotId); setDelSlotLabel(`${slotForm.day_of_week} ${slotForm.period}`); setShowSlot(false); }}
            >
              <Trash2Icon size={14} /> Delete slot
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => setShowSlot(false)}>Cancel</Button>
          <Button size="sm" disabled={slotBusy} onClick={saveSlot}>
            {slotBusy ? 'Saving…' : editSlotId ? 'Save changes' : 'Add slot'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delSlotId}
        onClose={() => setDelSlotId(null)}
        onConfirm={removeSlot}
        title="Remove timetable slot?"
        body={`${delSlotLabel} will be removed from the timetable.`}
        confirmLabel={slotBusy ? 'Removing…' : 'Remove slot'}
        danger
      />
    </div>
  );
}
