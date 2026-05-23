import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, Lock, FileText } from 'lucide-react';
import api from '@/services/api';
import FilePreview from '@/components/upload/FilePreview';
import Button from '@/components/ui/Button';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const validate = (selected) => {
    if (!selected) return;
    if (!ACCEPTED.includes(selected.type)) {
      setError('Only PDF, JPG, and PNG files are allowed');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleFileChange = (e) => validate(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    validate(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/api/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/processing/${data.data.upload._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-125 bg-surface rounded-lg shadow-lg p-8 sm:p-10 animate-fade-in-up">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, var(--color-surface-2), var(--color-border))' }}>
            <FileText size={30} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-text-primary mb-2">Upload your booking</h1>
          <p className="text-text-muted text-base max-w-xs">Flight ticket, hotel booking, or any travel document</p>
        </div>

        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`group flex flex-col items-center justify-center gap-3 p-8 sm:p-10 rounded-md cursor-pointer transition-all duration-200 border-2 border-dashed ${dragging ? 'border-primary bg-surface-2' : 'border-border bg-bg'}`}>
            <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-1 transition-colors duration-200 group-hover:bg-surface-2 border border-border">
              <CloudUpload size={22} className="text-primary" />
            </div>

            <div className="text-center">
              <p className="font-semibold text-text-primary text-[15px]">Drag & drop your file here</p>
              <p className="text-[13px] text-text-muted mt-1">
                or{' '}
                <span className="text-primary font-semibold">browse to upload</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {['PDF', 'JPG', 'PNG', 'Max 10 MB'].map((tag) => (
                <span key={tag} className="text-[11px] bg-surface-2 text-primary-dark  border border-border font-semibold px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden"/>
          </div>
        ) : (
          <FilePreview file={file} onRemove={() => setFile(null)} />
        )}

        {error && (
          <p className="text-error text-sm mt-3 text-center">{error}</p>
        )}

        <div className="mt-5">
          <Button variant="accent" loading={loading} disabled={!file} fullWidth onClick={handleUpload}>
            <CloudUpload size={17} className="mr-2" />
            Upload & Generate Itinerary
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-text-muted flex items-center justify-center gap-1.5">
          <Lock size={11} />
          Documents are processed securely and never shared
        </p>

      </div>
    </div>
  );
}