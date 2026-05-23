import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Eye, Trash2 } from 'lucide-react';

export default function ItineraryCard({ itinerary, onDelete }) {
  const navigate = useNavigate();

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const start = formatDate(itinerary.startDate);
  const end = formatDate(itinerary.endDate);

  return (
    <div
      className="bg-surface rounded-md shadow-md overflow-hidden border border-border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/itinerary/${itinerary._id}`)}
    >
      <div className="px-6 pt-6 pb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="absolute -right-4 -bottom-4 opacity-[0.07] pointer-events-none"><Plane size={90} className="text-white" /></div>
        <p className="text-[10px] font-bold text-primary-light tracking-widest uppercase mb-2">Destination</p>
        <h3 className="text-[22px] font-bold text-white leading-tight">{itinerary.destination}</h3>
        {start && (
          <p className="text-[12px] text-white/70 mt-2 flex items-center gap-1.5">
            <Calendar size={11} />
            {start}{end ? ` → ${end}` : ''}
          </p>
        )}
      </div>

      <div className="px-6 py-5">
        <p className="text-[13px] text-text-muted leading-relaxed mb-4 line-clamp-2">{itinerary.summary || itinerary.title}</p>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-primary-dark bg-surface-2 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-border">
            <Calendar size={11} />
            {itinerary.days?.length || 0} days
          </span>

          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); navigate(`/itinerary/${itinerary._id}`); }} className="flex items-center gap-1.5 text-[12px] font-semibold text-primary bg-surface-2 rounded-sm px-3.5 py-1.5 cursor-pointer  transition-colors duration-200 hover:bg-border border-none">
              <Eye size={13} />
              View
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(itinerary._id); }} className="flex items-center gap-1.5 text-[12px] font-semibold text-error rounded-sm px-3.5 py-1.5 cursor-pointer  transition-colors duration-200 border-none" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}