import { Plane, Building2, Map, UtensilsCrossed, Palmtree, MapPin, Clock } from 'lucide-react';

const TYPE_CONFIG = {
  travel: { color: 'var(--color-primary)', bg: 'bg-[var(--color-surface-2)]', iconBg: 'var(--color-primary)', icon: Plane },
  accommodation: { color: 'var(--color-warning)', bg: 'bg-[#fff8e1]', iconBg: 'var(--color-warning)', icon: Building2 },
  sightseeing: { color: 'var(--color-success)', bg: 'bg-[#e8f8f2]', iconBg: 'var(--color-success)', icon: Map },
  dining: { color: 'var(--color-accent)', bg: 'bg-[#fff3e6]', iconBg: 'var(--color-accent)', icon: UtensilsCrossed },
  leisure: { color: 'var(--color-primary-light)', bg: 'bg-[#e6f7ff]', iconBg: 'var(--color-primary)',   icon: Palmtree },
};

export default function DayView({ day }) {
  return (
    <div className="mb-10 animate-fade-in-up">

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-[14px] bg-primary flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">{day.day}</div>
        <div>
          <h3 className="text-[20px] font-bold text-text-primary leading-tight">{day.title}</h3>
          {day.date && (
            <p className="text-[13px] text-text-muted mt-0.5 flex items-center gap-1.5">
              <Clock size={11} />
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className="ml-6 pl-6 border-l-2 border-primary-light">
        {day.activities?.map((activity, i) => {
          const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.leisure;
          const Icon = config.icon;
          return (
            <div key={i} className="relative mb-5 pl-4">
              <div
                className="absolute -left-8.25 top-4 w-3 h-3 rounded-full border-2 border-surface" style={{background: config.color, boxShadow: `0 0 0 2px ${config.color}`,}}/>

              <div className={`${config.bg} rounded-sm`} style={{ border: `1px solid ${config.color}22`, padding: '14px 16px' }}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: config.iconBg }}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm text-text-primary">{activity.title}</span>
                      {activity.time && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-surface px-2 py-0.5 rounded-full" style={{ color: config.color }}>
                          <Clock size={9} />
                          {activity.time}
                        </span>
                      )}
                    </div>
                    {activity.location && (
                      <p className="text-xs text-text-muted flex items-center gap-1"><MapPin size={10} />{activity.location}</p>
                    )}
                  </div>
                </div>
                <p className="text-[13px] text-text-muted leading-relaxed pl-11">{activity.description}</p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}