import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plane, Calendar, Activity, Globe, Search, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import DayView from '@/components/itinerary/DayView';
import BoardingPassCard from '@/components/itinerary/BoardingPassCard';

export default function SharedView() {
  const { shareToken } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/itinerary/share/${shareToken}`);
        setItinerary(data.data.itinerary);
      } catch (err) {
        setError(err.response?.data?.message || 'Itinerary not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shareToken]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-[3px] border-primary-light border-t-primary animate-spin" />
    </div>
  );

  if (error || !itinerary) return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm px-4 sm:px-6 py-0 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Plane size={16} className="text-white" />
          </div>
          <span className="text-[18px] font-bold text-primary-dark tracking-tight">
            Itiniq
          </span>
          <span className="text-[10px] font-bold text-text-muted bg-surface-2 px-2 py-0.5 rounded-full border border-border ml-1 tracking-widest">
            SHARED
          </span>
        </div>
        <Link
          to="/register"
          className="text-[13px] font-semibold text-primary bg-surface-2 px-4 py-2 rounded-sm] border border-border hover:bg-border transition-colors duration-200"
        >
          Create free account
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-95">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Search size={36} className="text-primary" />
          </div>
          <h2 className="text-[24px] font-bold text-text-primary mb-3">
            Itinerary not found
          </h2>
          <p className="text-text-muted text-[15px] mb-8 leading-relaxed">
            {error || 'This link may have expired or been removed.'}
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-sm  text-sm font-semibold hover:bg-accent-dark transition-colors duration-200"
          >
            Create your own itinerary
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );

  const totalActivities = itinerary.days?.reduce((sum, d) => sum + (d.activities?.length || 0), 0);

  return (
    <div className="min-h-screen bg-bg">

  
      <header className="bg-surface border-b border-border shadow-sm sticky top-0 z-50 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Plane size={16} className="text-white" />
          </div>
          <span className="text-[18px] font-bold text-primary-dark tracking-tight">
            Itiniq
          </span>
          <span className="text-[10px] font-bold text-text-muted bg-surface-2 px-2 py-0.5 rounded-full border border-border ml-1 tracking-widest hidden sm:inline-flex">
            SHARED
          </span>
        </div>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary bg-surface-2 px-3 sm:px-4 py-2 rounded-sm border border-border hover:bg-border transition-colors duration-200"
        >
          Create free account
          <ArrowRight size={13} />
        </Link>
      </header>

      {/* Hero */}
      <div
        className="px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}
      >
        <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
          <Globe size={220} className="text-white" />
        </div>

        <div className="max-w-205 mx-auto relative animate-fade-in-up">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-primary-light tracking-widest uppercase mb-5 bg-white/10 px-3 py-1.5 rounded-full">
            <Globe size={12} />
            Shared Itinerary
          </div>

          <h1 className="text-[34px] sm:text-[44px] font-bold text-white mb-5 leading-tight">
            {itinerary.destination}
          </h1>

          <div className="flex flex-wrap gap-2 mb-5">
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

          {itinerary.summary && (
            <p className="text-[15px] text-white/80 leading-[1.75] max-w-150">
              {itinerary.summary}
            </p>
          )}
        </div>
      </div>
      
      {/* Boarding Pass */}
      <div className="max-w-205 mx-auto px-4 sm:px-6 pt-10">
        <BoardingPassCard itinerary={itinerary} />
      </div>
      
      {/* Days */}
      <div className="max-w-205 mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {itinerary.days?.map((day) => <DayView key={day.day} day={day} />)}
      </div>

      {/* Footer CTA */}
      <div className="bg-surface border-t border-border px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-120 mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Plane size={28} className="text-primary" />
          </div>
          <h3 className="text-[22px] sm:text-[26px] font-bold text-text-primary mb-3">
            Plan your own trip with Itiniq
          </h3>
          <p className="text-text-muted text-[15px] mb-8 leading-relaxed">
            Upload your booking documents and get a beautiful AI-generated itinerary in seconds.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-sm  text-[15px] font-semibold hover:bg-accent-dark transition-colors duration-200"
          >
            Get started for free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

    </div>
  );
}