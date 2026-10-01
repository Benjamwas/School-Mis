import React, { useEffect, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import api, { resolveMedia } from '../../api';
import type { MediaUpload } from '../../types';

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = () => api.get('/admin/media').then((res) => setMedia(res.data));
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        await api.post('/admin/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await load();
    } catch (err) {
      console.error(err);
      alert('One or more uploads failed (max 50MB, images/videos only).');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this file from the server?')) return;
    await api.delete(`/admin/media/${id}`);
    load();
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
        <label className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 cursor-pointer">
          <Upload className="h-4 w-4 mr-1" />
          {uploading ? 'Uploading...' : 'Upload Files'}
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {media.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 text-sm">
          No uploaded media yet. Files you upload here can be attached to events, blog posts, and the gallery.
          Existing images in <code className="text-xs">/images/</code> can still be used by path.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((m) => (
            <div key={m.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {m.mime_type.startsWith('video/') ? (
                <video src={resolveMedia(m.path)} className="w-full h-32 object-cover bg-black" controls />
              ) : (
                <img src={resolveMedia(m.path)} alt={m.alt || m.original_name} className="w-full h-32 object-cover bg-gray-100" />
              )}
              <div className="p-3">
                <div className="text-sm text-gray-800 truncate">{m.original_name}</div>
                <div className="text-xs text-gray-400 mb-2">{(m.size_bytes / 1024 / 1024).toFixed(2)} MB</div>
                <div className="flex items-center justify-between">
                  <button onClick={() => copyPath(m.path)} className="text-xs text-light-blue-600 hover:text-light-blue-700">
                    Copy path
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
