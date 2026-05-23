import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-text-primary text-white px-6 py-3 rounded-sm text-sm font-medium shadow-lg z-9999 animate-fade-in whitespace-nowrap">
    {message}
    </div>
  );
}