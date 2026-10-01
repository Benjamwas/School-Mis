import React from 'react';
import api, { resolveMedia } from '../../api';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImagePicker = ({ value, onChange, label = 'Image URL or path' }: ImagePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [media, setMedia] = React.useState<Array<{ id: number; path: string; original_name: string }>>([]);
  const [uploading, setUploading] = React.useState(false);

  const openPicker = async () => {
    setOpen(true);
    try {
      const res = await api.get('/admin/media');
      setMedia(res.data);
    } catch {
      setMedia([]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/admin/media', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.path);
      setMedia((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed. Check file type and size (max 50MB).');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... or /uploads/..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="button"
          onClick={openPicker}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
        >
          Browse
        </button>
      </div>
      {value && (
        <img
          src={resolveMedia(value)}
          alt="Preview"
          className="mt-2 h-20 w-auto rounded border object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Media Library</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-3 border-b">
              <label className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md cursor-pointer hover:bg-red-700">
                {uploading ? 'Uploading...' : 'Upload new file'}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 md:grid-cols-4 gap-3">
              {media.length === 0 && (
                <p className="col-span-full text-center text-gray-500 text-sm">No uploads yet. Use existing image paths or upload files.</p>
              )}
              {media.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onChange(m.path); setOpen(false); }}
                  className={`rounded border-2 overflow-hidden text-left hover:border-red-500 ${value === m.path ? 'border-red-500' : 'border-transparent'}`}
                >
                  <img src={resolveMedia(m.path)} alt={m.original_name} className="w-full h-20 object-cover" />
                  <div className="p-1 text-xs text-gray-600 truncate">{m.original_name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
