import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Calendar, Share2, ChevronLeft, Activity } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import DayView from '@/components/itinerary/DayView';
import { useItinerary } from '@/hooks/useItinerary';
import Toast from '@/components/ui/Toast';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { itinerary, loading, error } = useItinerary(id);
  const [toast, setToast] = useState('');

 const handleShare = () => {
  if (!itinerary) return;
  const url = `${window.location.origin}/shared/${itinerary.shareToken}`;
  navigator.clipboard.writeText(url);
  setToast('Link copied to clipboard!');
};

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  if (loading) return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 rounded-full border-[3px] border-primary-light border-t-primary animate-spin" />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="text-center px-6 py-20">
        <p className="text-error text-base">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary bg-transparent border-none cursor-pointer text-sm hover:underline">← Back to Dashboard</button>
      </div>
    </div>
  );

  if (!itinerary) return null;

  const totalActivities = itinerary.days?.reduce((sum, d) => sum + (d.activities?.length || 0), 0);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
       {toast && <Toast message={toast} onClose={() => setToast('')} />}
        
      <div className="px-4 sm:px-6 py-10 sm:py-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
          <Plane size={220} className="text-white" />
        </div>

        <div className="max-w-205 mx-auto relative">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-white/65 bg-transparent border-none cursor-pointer text-sm mb-5  p-0 hover:text-white transition-colors duration-200">
            <ChevronLeft size={16} />
            Dashboard
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[36px] sm:text-[44px] font-bold text-white mb-4 leading-tight">{itinerary.destination}</h1>
              <div className="flex flex-wrap gap-2">
                {(formatDate(itinerary.startDate) || formatDate(itinerary.endDate)) && (
                  <span className="inline-flex items-center gap-2 text-[13px] text-white/80 bg-white/10 px-4 py-2 rounded-full">
                    <Calendar size={13} />
                    {formatDate(itinerary.startDate)}
                    {itinerary.endDate ? ` → ${formatDate(itinerary.endDate)}` : ''}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 text-[13px] text-white/80 bg-white/10 px-4 py-2 rounded-full">
                  <Activity size={13} />
                  {itinerary.days?.length || 0} days · {totalActivities} activities
                </span>
              </div>
            </div>

            <button onClick={handleShare} className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-sm  text-sm font-semibold border-none cursor-pointer shrink-0 hover:bg-accent-dark transition-colors duration-200">
              <Share2 size={15} />
              Share
            </button>
          </div>

          {itinerary.summary && (
            <p className="mt-6 text-[15px] text-white/80 leading-[1.75] max-w-150">{itinerary.summary}</p>
          )}
        </div>
      </div>

      <div className="max-w-205 mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {itinerary.days?.length > 0
          ? itinerary.days.map((day) => <DayView key={day.day} day={day} />)
          : (
            <p className="text-center text-text-muted">No days found in this itinerary.</p>
          )
        }
      </div>
    </div>
  );
}