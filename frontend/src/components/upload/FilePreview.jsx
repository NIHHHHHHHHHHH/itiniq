import { FileText, ImageIcon, X } from 'lucide-react';

export default function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/');
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-xl border border-border transition-all duration-200">
      <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shrink-0">
        {isImage
          ? <ImageIcon size={20} className="text-white" />
          : <FileText size={20} className="text-white" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base text-text-primary truncate">{file.name}</p>
        <p className="text-sm text-text-muted mt-0.5">{isImage ? 'Image' : 'PDF'} · {sizeMB} MB · Ready to upload</p>
      </div>

      <button onClick={onRemove} aria-label="Remove file" className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 hover:opacity-80">
        <X size={16} className="text-error" />
      </button>
    </div>
  );
}