import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilIcon, PlusIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, StatusBadge, Textarea } from '../../components/ui/primitives';
import { DataTable, Tabs } from '../../components/ui/data';
import { ConfirmDialog, Modal } from '../../components/ui/feedback';
import { EVENTS, GALLERY, IMAGES, NEWS } from '../../data/school';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import { useApp } from '../../contexts/AppContext';
import type { ApiEvent } from '../../api/types';

const TABS = ['Events', 'Gallery', 'News'];

const EVENT_STATUS: Record<string, string> = {
  DRAFT: 'Planning', PUBLISHED: 'Scheduled', CANCELLED: 'Cancelled', COMPLETED: 'Completed'
};

function eventStatus(status?: string): string {
  if (!status) return 'Planning';
  return EVENT_STATUS[status] ?? status;
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtTime(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

type GalleryAlbum = { id: string; title: string; description?: string; status?: string; media_count?: number };
type CmsPost = { id: string; title: string; slug?: string; excerpt?: string; category?: string; status?: string; published_at?: string };

const emptyEvent = { title: '', description: '', event_type: 'School Event', start_time: '', end_time: '', venue: '', capacity: '', status: 'DRAFT' };
const emptyAlbum = { title: '', description: '', status: 'DRAFT' };
const emptyPost = { title: '', slug: '', excerpt: '', content: '', category: 'School News', status: 'DRAFT' };

export function AdminContent() {
  const { tab = 'Events' } = useParams();
  const navigate = useNavigate();
  const { toast } = useApp();

  const live = useApiLive();
  const events = useList<ApiEvent>('events/');
  const albums = useList<GalleryAlbum>('gallery/');
  const posts = useList<CmsPost>('cms/posts/');

  // ---- Events state ----
  const [showEvent, setShowEvent] = useState(false);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [eventBusy, setEventBusy] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [delEventId, setDelEventId] = useState<string | null>(null);
  const [delEventTitle, setDelEventTitle] = useState('');

  // ---- Gallery state ----
  const [showAlbum, setShowAlbum] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState<string | null>(null);
  const [albumBusy, setAlbumBusy] = useState(false);
  const [albumForm, setAlbumForm] = useState(emptyAlbum);
  const [delAlbumId, setDelAlbumId] = useState<string | null>(null);
  const [delAlbumTitle, setDelAlbumTitle] = useState('');

  // ---- News state ----
  const [showPost, setShowPost] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [postBusy, setPostBusy] = useState(false);
  const [postForm, setPostForm] = useState(emptyPost);
  const [delPostId, setDelPostId] = useState<string | null>(null);
  const [delPostTitle, setDelPostTitle] = useState('');

  // ---- Events CRUD ----
  const openAddEvent = () => { setEditEventId(null); setEventForm(emptyEvent); setShowEvent(true); };
  const openEditEvent = (r: any) => {
    const e = (events.data ?? []).find((x) => x.id === r.id);
    setEditEventId(r.id);
    setEventForm({
      title: e?.title || r.title,
      description: e?.description || '',
      event_type: e?.event_type || 'School Event',
      start_time: e?.start_time ? e.start_time.slice(0, 16) : '',
      end_time: e?.end_time ? (e.end_time as string).slice(0, 16) : '',
      venue: e?.venue || '',
      capacity: e?.capacity != null ? String(e.capacity) : '',
      status: e?.status || 'DRAFT'
    });
    setShowEvent(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.start_time) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Title and start time are required.' });
      return;
    }
    setEventBusy(true);
    try {
      const body: Record<string, unknown> = {
        title: eventForm.title,
        description: eventForm.description || undefined,
        event_type: eventForm.event_type,
        start_time: new Date(eventForm.start_time).toISOString(),
        end_time: eventForm.end_time ? new Date(eventForm.end_time).toISOString() : undefined,
        venue: eventForm.venue || undefined,
        capacity: eventForm.capacity ? Number(eventForm.capacity) : undefined,
        status: eventForm.status
      };
      if (editEventId) {
        await api.patch(`events/${editEventId}/`, body);
        toast({ tone: 'success', title: 'Event updated', body: `${eventForm.title} saved.` });
      } else {
        await api.post('events/', body);
        toast({ tone: 'success', title: 'Event created', body: `${eventForm.title} added to the calendar.` });
      }
      setShowEvent(false);
      events.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setEventBusy(false);
    }
  };

  const deleteEvent = async () => {
    if (!delEventId) return;
    setEventBusy(true);
    try {
      await api.delete(`events/${delEventId}/`);
      toast({ tone: 'success', title: 'Event deleted', body: `${delEventTitle} removed.` });
      setDelEventId(null);
      events.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setEventBusy(false);
    }
  };

  // ---- Gallery CRUD ----
  const openAddAlbum = () => { setEditAlbumId(null); setAlbumForm(emptyAlbum); setShowAlbum(true); };
  const openEditAlbum = (r: any) => {
    const a = (albums.data ?? []).find((x) => x.id === r.id);
    setEditAlbumId(r.id);
    setAlbumForm({ title: a?.title || r.title, description: a?.description || '', status: a?.status || 'DRAFT' });
    setShowAlbum(true);
  };

  const saveAlbum = async () => {
    if (!albumForm.title) {
      toast({ tone: 'warning', title: 'Missing title', body: 'Album title is required.' });
      return;
    }
    setAlbumBusy(true);
    try {
      const body = { title: albumForm.title, description: albumForm.description || undefined, status: albumForm.status };
      if (editAlbumId) {
        await api.patch(`gallery/${editAlbumId}/`, body);
        toast({ tone: 'success', title: 'Album updated', body: `${albumForm.title} saved.` });
      } else {
        await api.post('gallery/', body);
        toast({ tone: 'success', title: 'Album created', body: `${albumForm.title} created. Upload photos next.` });
      }
      setShowAlbum(false);
      albums.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setAlbumBusy(false);
    }
  };

  const publishAlbum = async (id: string, next: string) => {
    try {
      await api.patch(`gallery/${id}/`, { status: next });
      toast({ tone: 'success', title: next === 'PUBLISHED' ? 'Album published' : 'Album unpublished' });
      albums.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Update failed', body: e?.message || 'Try again.' });
    }
  };

  const deleteAlbum = async () => {
    if (!delAlbumId) return;
    setAlbumBusy(true);
    try {
      await api.delete(`gallery/${delAlbumId}/`);
      toast({ tone: 'success', title: 'Album deleted', body: `${delAlbumTitle} removed.` });
      setDelAlbumId(null);
      albums.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setAlbumBusy(false);
    }
  };

  // ---- News CRUD ----
  const openAddPost = () => { setEditPostId(null); setPostForm(emptyPost); setShowPost(true); };
  const openEditPost = (r: any) => {
    const p = (posts.data ?? []).find((x) => x.id === r.id);
    setEditPostId(r.id);
    setPostForm({
      title: p?.title || r.title,
      slug: p?.slug || '',
      excerpt: p?.excerpt || '',
      content: (p as any)?.content || '',
      category: p?.category || 'School News',
      status: p?.status || 'DRAFT'
    });
    setShowPost(true);
  };

  const savePost = async () => {
    if (!postForm.title || !postForm.content) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Title and content are required.' });
      return;
    }
    setPostBusy(true);
    try {
      const slug = postForm.slug || postForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const body = {
        title: postForm.title,
        slug,
        excerpt: postForm.excerpt || undefined,
        content: postForm.content,
        category: postForm.category,
        status: postForm.status
      };
      if (editPostId) {
        await api.patch(`cms/posts/${editPostId}/`, body);
        toast({ tone: 'success', title: 'Article updated', body: `${postForm.title} saved.` });
      } else {
        await api.post('cms/posts/', body);
        toast({ tone: 'success', title: 'Article created', body: `${postForm.title} added.` });
      }
      setShowPost(false);
      posts.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setPostBusy(false);
    }
  };

  const publishPost = async (id: string, next: string) => {
    try {
      await api.patch(`cms/posts/${id}/`, { status: next });
      toast({ tone: 'success', title: next === 'PUBLISHED' ? 'Article published' : 'Article unpublished' });
      posts.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Update failed', body: e?.message || 'Try again.' });
    }
  };

  const deletePost = async () => {
    if (!delPostId) return;
    setPostBusy(true);
    try {
      await api.delete(`cms/posts/${delPostId}/`);
      toast({ tone: 'success', title: 'Article deleted', body: `${delPostTitle} removed.` });
      setDelPostId(null);
      posts.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setPostBusy(false);
    }
  };

  // ---- Row data ----
  const eventRows: any[] = live
    ? (events.data ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      type: e.event_type || 'School Event',
      date: fmtDate(e.start_time),
      time: fmtTime(e.start_time),
      location: e.venue || '—',
      status: eventStatus(e.status)
    }))
    : EVENTS.map((e) => ({ id: e.id, title: e.title, type: e.type, date: e.date, time: e.time, location: e.location, status: e.status }));

  const albumRows: any[] = live
    ? (albums.data ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      photos: a.media_count ?? 0,
      status: a.status === 'PUBLISHED' ? 'Published' : a.status === 'DRAFT' ? 'Draft' : a.status
    }))
    : GALLERY.filter((g) => g.status === 'Published').map((g) => ({ id: g.id, title: g.title, photos: g.count, status: 'Published' }));

  const postRows: any[] = live
    ? (posts.data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category || '—',
      date: fmtDate(p.published_at),
      status: p.status === 'PUBLISHED' ? 'Published' : p.status === 'DRAFT' ? 'Draft' : p.status
    }))
    : NEWS.map((n) => ({ id: n.id, title: n.title, category: n.category, date: n.date, status: n.status }));

  const headerAction =
    tab === 'Events' ? <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAddEvent}>New event</Button>
    : tab === 'Gallery' ? <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAddAlbum}>New album</Button>
    : <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAddPost}>New article</Button>;

  return (
    <div>
      <PageHeader
        title="Content"
        subtitle="Events, gallery albums and news articles"
        actions={headerAction} />

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/admin/content/${t}`)} />
      </div>

      {tab === 'Events' && (
        <Card>
          <CardHeader title={`${eventRows.length} events`} subtitle="Create, edit or delete school events" />
          {live && events.error && <p className="px-5 pt-3 text-sm text-rose-600">{events.error}</p>}
          <DataTable
            columns={[
              { key: 'title', header: 'Event', render: (r: any) => <span className="font-medium">{r.title}</span> },
              { key: 'type', header: 'Type', hideOnMobile: true },
              { key: 'date', header: 'Date' },
              { key: 'time', header: 'Time', hideOnMobile: true },
              { key: 'location', header: 'Location', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: '',
                align: 'right' as const,
                render: (r: any) => (
                  <span className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditEvent(r); }}>
                      <PencilIcon size={14} />
                    </Button>
                    {live && (
                      <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDelEventId(r.id); setDelEventTitle(r.title); }}>
                        <Trash2Icon size={14} className="text-rose-600" />
                      </Button>
                    )}
                  </span>
                )
              }
            ]}
            rows={eventRows}
            mobileTitle={(r: any) => r.title}
            caption="Events" />
        </Card>
      )}

      {tab === 'Gallery' && (
        <Card>
          <CardHeader title={`${albumRows.length} albums`} subtitle="Create albums, upload photos, publish or unpublish" />
          {live && albums.error && <p className="px-5 pt-3 text-sm text-rose-600">{albums.error}</p>}
          <DataTable
            columns={[
              { key: 'title', header: 'Album', render: (r: any) => <span className="font-medium">{r.title}</span> },
              { key: 'photos', header: 'Photos', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: '',
                align: 'right' as const,
                render: (r: any) => (
                  <span className="flex items-center justify-end gap-1">
                    {live && (
                      <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        const st = (albums.data ?? []).find((x) => x.id === r.id)?.status;
                        publishAlbum(r.id, st === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
                      }}>
                        {r.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditAlbum(r); }}>
                      <PencilIcon size={14} />
                    </Button>
                    {live && (
                      <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDelAlbumId(r.id); setDelAlbumTitle(r.title); }}>
                        <Trash2Icon size={14} className="text-rose-600" />
                      </Button>
                    )}
                  </span>
                )
              }
            ]}
            rows={albumRows}
            mobileTitle={(r: any) => r.title}
            caption="Gallery albums" />
        </Card>
      )}

      {tab === 'News' && (
        <Card>
          <CardHeader title={`${postRows.length} articles`} subtitle="Add, edit, publish or delete news" />
          {live && posts.error && <p className="px-5 pt-3 text-sm text-rose-600">{posts.error}</p>}
          <DataTable
            columns={[
              { key: 'title', header: 'Article', render: (r: any) => <span className="font-medium">{r.title}</span> },
              { key: 'category', header: 'Category', hideOnMobile: true },
              { key: 'date', header: 'Published', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: '',
                align: 'right' as const,
                render: (r: any) => (
                  <span className="flex items-center justify-end gap-1">
                    {live && (
                      <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        const st = (posts.data ?? []).find((x) => x.id === r.id)?.status;
                        publishPost(r.id, st === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
                      }}>
                        {r.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditPost(r); }}>
                      <PencilIcon size={14} />
                    </Button>
                    {live && (
                      <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDelPostId(r.id); setDelPostTitle(r.title); }}>
                        <Trash2Icon size={14} className="text-rose-600" />
                      </Button>
                    )}
                  </span>
                )
              }
            ]}
            rows={postRows}
            mobileTitle={(r: any) => r.title}
            caption="News articles" />
        </Card>
      )}

      {/* Event modal */}
      <Modal
        open={showEvent}
        onClose={() => setShowEvent(false)}
        title={editEventId ? 'Edit event' : 'New event'}
        size="lg"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title" required className="sm:col-span-2">
            <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
          </Field>
          <Field label="Event type">
            <Select value={eventForm.event_type} onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}>
              <option>School Event</option>
              <option>Parent Event</option>
              <option>Sports</option>
              <option>Trip</option>
              <option>Exams</option>
              <option>Admissions</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </Field>
          <Field label="Starts" required>
            <Input type="datetime-local" value={eventForm.start_time} onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })} />
          </Field>
          <Field label="Ends">
            <Input type="datetime-local" value={eventForm.end_time} onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })} />
          </Field>
          <Field label="Venue">
            <Input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} />
          </Field>
          <Field label="Capacity">
            <Input type="number" min="0" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowEvent(false)}>Cancel</Button>
          <Button size="sm" disabled={eventBusy} onClick={saveEvent}>{eventBusy ? 'Saving…' : editEventId ? 'Save changes' : 'Create event'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delEventId}
        onClose={() => setDelEventId(null)}
        onConfirm={deleteEvent}
        title="Delete event?"
        body={`${delEventTitle} will be permanently removed from the calendar.`}
        confirmLabel={eventBusy ? 'Deleting…' : 'Delete event'}
        danger
      />

      {/* Album modal */}
      <Modal
        open={showAlbum}
        onClose={() => setShowAlbum(false)}
        title={editAlbumId ? 'Edit album' : 'New gallery album'}
      >
        <div className="space-y-4">
          <Field label="Album title" required>
            <Input value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} placeholder="Science Fair 2026" />
          </Field>
          <Field label="Description">
            <Textarea value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={albumForm.status} onChange={(e) => setAlbumForm({ ...albumForm, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowAlbum(false)}>Cancel</Button>
          <Button size="sm" disabled={albumBusy} onClick={saveAlbum}>{albumBusy ? 'Saving…' : editAlbumId ? 'Save changes' : 'Create album'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delAlbumId}
        onClose={() => setDelAlbumId(null)}
        onConfirm={deleteAlbum}
        title="Delete album?"
        body={`${delAlbumTitle} and its photos will be permanently removed.`}
        confirmLabel={albumBusy ? 'Deleting…' : 'Delete album'}
        danger
      />

      {/* Post modal */}
      <Modal
        open={showPost}
        onClose={() => setShowPost(false)}
        title={editPostId ? 'Edit article' : 'New news article'}
        size="lg"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title" required className="sm:col-span-2">
            <Input value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} />
          </Field>
          <Field label="Category">
            <Select value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}>
              <option>School News</option>
              <option>Academics</option>
              <option>School Life</option>
              <option>Notice</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={postForm.status} onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </Field>
          <Field label="Excerpt" className="sm:col-span-2">
            <Textarea value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} rows={2} />
          </Field>
          <Field label="Content" required className="sm:col-span-2">
            <Textarea value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} rows={6} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowPost(false)}>Cancel</Button>
          <Button size="sm" disabled={postBusy} onClick={savePost}>{postBusy ? 'Saving…' : editPostId ? 'Save changes' : 'Create article'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delPostId}
        onClose={() => setDelPostId(null)}
        onConfirm={deletePost}
        title="Delete article?"
        body={`${delPostTitle} will be permanently removed.`}
        confirmLabel={postBusy ? 'Deleting…' : 'Delete article'}
        danger
      />
    </div>
  );
}
