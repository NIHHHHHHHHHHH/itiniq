import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Search, Plane, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '@/services/api';

const STEPS = [
  { icon: FileText, label: 'Reading your document...'},
  { icon: Search, label: 'Extracting booking details...'},
  { icon: Plane, label: 'Crafting your itinerary...'},
];

export default function Processing() {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);

    const generate = async () => {
      try {
        const { data } = await api.post('/api/itinerary/generate', { uploadId });
        clearInterval(stepInterval);
        navigate(`/itinerary/${data.data.itinerary._id}`);
      } catch (err) {
        clearInterval(stepInterval);
        setError(err.response?.data?.message || 'Generation failed. Please try again.');
      }
    };

    generate();
    return () => clearInterval(stepInterval);
  }, [uploadId, navigate]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 sm:p-6">
      <div className="text-center w-full max-w-105">

        <div className="w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-7 shadow-sm"><Plane size={36} className="text-primary" /></div>
        <h2 className="text-[26px] sm:text-[28px] font-bold text-text-primary mb-2">Building your itinerary</h2>
        <p className="text-text-muted text-[15px] mb-10">Our AI is reading your documents and planning the perfect trip</p>

        <div className="flex flex-col gap-3 text-left">
          {STEPS.map((step, i) => {
            const done   = i < currentStep;
            const active = i === currentStep;
            const Icon   = step.icon;
            return (
              <div
                key={i}
                className={` flex items-center gap-4 px-5 py-4 rounded-md border transition-all duration-300
                  ${active
                    ? 'bg-surface border-primary shadow-sm': done
                      ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent opacity-40'
                  }
                `}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
                    background: active
                      ? 'var(--color-primary)': done
                        ? 'var(--color-surface-2)' : 'var(--color-surface-2)',
                  }}
                >
                  {done
                    ? <CheckCircle2 size={18} className="text-success" />
                    : <Icon size={16} className={active ? 'text-white' : 'text-primary'} />
                  }
                </div>

                <span className={`text-[15px] flex-1 ${active ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>
                  {step.label}
                </span>

                {active && (
                  <div className="w-4 h-4 rounded-full border-2 border-primary-light border-t-primary animate-spin shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-8 p-5 rounded-md text-left" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid var(--color-error)' }}>
            <p className="font-semibold text-error mb-1 text-[15px]">Something went wrong</p>
            <p className="text-error text-sm opacity-80 mb-4">{error}</p>
            <button onClick={() => navigate('/upload')} className="inline-flex items-center gap-2 text-[13px] font-semibold text-error bg-transparent border border-error rounded-sm px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <RefreshCw size={13} />
              Try again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}