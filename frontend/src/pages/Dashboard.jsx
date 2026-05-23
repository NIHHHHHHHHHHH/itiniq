import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Globe, Plus } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { useItineraries } from '@/hooks/useItinerary';
import useAuth from '@/hooks/useAuth';

const SkeletonCard = () => (
  <div className="bg-surface rounded-md overflow-hidden border border-border">
    <div className="skeleton h-27.5" />
    <div className="px-6 py-5 flex flex-col gap-3">
      <div className="skeleton h-3.5 w-[60%]" />
      <div className="skeleton h-3 w-[90%]" />
      <div className="skeleton h-3 w-[70%]" />
    </div>
  </div>
);

const STATS = (itineraries) => [
  { label: 'Total Trips',  value: itineraries.length, icon: Plane, bg: 'bg-' },
  { label: 'Destinations', value: new Set(itineraries.map(i => i.destination)).size, icon: MapPin,   bg: 'bg-' },
  { label: 'Days Planned', value: itineraries.reduce((sum, i) => sum + (i.days?.length || 0), 0), icon: Calendar, bg: 'bg-' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { itineraries, loading, error, remove } = useItineraries();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this itinerary?')) return;
    const result = await remove(id);
    if (!result.success) alert(result.message);
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-300 mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-10 animate-fade-in">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary mb-2 flex items-center gap-3">
              Welcome back, {user?.name?.split(' ')[0]}
              <Plane size={28} className="text-primary" />
            </h1>
            <p className="text-text-muted text-base">
              {itineraries.length > 0
                ? `You have ${itineraries.length} itiner${itineraries.length === 1 ? 'y' : 'aries'} planned`
                : 'Ready to plan your next adventure?'}
            </p>
          </div>
          {!loading && itineraries.length > 0 && (
            <button onClick={() => navigate('/upload')} className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-sm text-sm font-semibold border-none cursor-pointer hover:bg-accent-dark transition-colors duration-200 ">
              <Plus size={16} />
              New Trip
            </button>
          )}
        </div>

        {!loading && itineraries.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-10 animate-fade-in delay-100">
            {STATS(itineraries).map((stat) => (
              <div key={stat.label} className="bg-surface rounded-md px-5 py-5 border border-border shadow-sm">
                <div className="w-9 h-9 rounded-xl bg- flex items-center justify-center mb-3"><stat.icon size={17} className="text-primary" /></div>
                <p className="text-[28px] font-bold text-primary leading-none mb-1">{stat.value}</p>
                <p className="text-3 text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-error mb-6">{error}</p>}

        {loading && (<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>)}

        {!loading && itineraries.length === 0 && (
          <div className="text-center px-6 py-20 bg-surface rounded-lg shadow-md border border-border animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl bg- flex items-center justify-center mx-auto mb-6"><Globe size={36} className="text-primary" /></div>
            <h2 className="text-[26px] text-text-primary mb-3">No trips yet</h2>
            <p className="text-text-muted text-[15px] mb-8 max-w-90 mx-auto">Upload your first booking document and let AI build your itinerary</p>
            <button onClick={() => navigate('/upload')} className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-sm  text-[15px] font-semibold border-none cursor-pointer transition-colors duration-200 hover:bg-accent-dark">
              <Plus size={16} />
              Upload your first booking
            </button>
          </div>
        )}
        
        {!loading && itineraries.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {itineraries.map((it, i) => (
              <div key={it._id} className={`animate-fade-in-up delay-${Math.min(i * 100, 400)}`}>
                <ItineraryCard itinerary={it} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}