import { Plane, Printer } from 'lucide-react';

const Field = ({ label, value, align = 'left' }) => (
  <div className={`text-${align}`}>
    <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/55 mb-1">
      {label}
    </p>
    <p className="text-[15px] font-semibold text-white leading-tight">
      {value || 'N/A'}
    </p>
  </div>
);

const Divider = () => (
  <div className="border-t-[1.5px] border-dashed border-white/20 my-5" />
);

const Barcode = ({ token }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex items-end gap-0.5 h-10">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i % 3 === 0 ? '3px' : '1.5px',
            height: i % 5 === 0 ? '40px' : i % 3 === 0 ? '32px' : '24px',
            background: `rgba(255,255,255,${i % 4 === 0 ? 0.9 : 0.4})`,
            borderRadius: '1px',
          }}
        />
      ))}
    </div>
    <p className="text-[10px] tracking-[3px] text-white/50 font-mono uppercase">
      {token?.slice(0, 16).toUpperCase() || 'SHARE TOKEN'}
    </p>
  </div>
);

const toCode = (city) => {
  if (!city) return '???';
  const match = city.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  return city.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
};

const toCity = (city) => {
  if (!city) return 'Unknown';
  return city.replace(/\s*\([A-Z]{3}\)/, '').trim();
};

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function BoardingPassCard({ itinerary }) {
  const extracted = itinerary?.uploadId?.extractedData || {};

  const originCode = toCode(extracted.origin);
  const destCode = toCode(extracted.destination || itinerary.destination);
  const originCity = toCity(extracted.origin) || 'Origin';
  const destCity = toCity(extracted.destination || itinerary.destination);

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="rounded-lg overflow-hidden relative shadow-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px', }} />

        <div className="px-8 py-7 relative">
      
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center"><Plane size={14} color="#fff" /></div>
              <span className="text-lg font-bold text-white">Itiniq</span>
            </div>
            <span className="text-[10px] font-bold tracking-[2px] text-white/50 uppercase">Travel Itinerary</span>
          </div>

          <div className="flex justify-between flex-wrap gap-4">
            <Field label="Passenger" value={extracted.passengerName} />
            <Field label="Booking Ref" value={extracted.bookingReference} align="right" />
          </div>

          <Divider />

          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-[42px] font-extrabold text-white leading-none tracking-[-1px]">{originCode}</p>
              <p className="text-[13px] text-white/60 mt-1">{originCity}</p>
            </div>

            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center w-full gap-2">
                <div className="flex-1 h-px bg-white/20" />
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Plane size={14} color="rgba(255,255,255,0.8)" />
                </div>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              {extracted.flightNumber && (
                <span className="text-[11px] text-white/50 tracking-[1px]">
                  {extracted.airline ? `${extracted.airline} · ` : ''}{extracted.flightNumber}
                </span>
              )}
            </div>

            <div className="text-right">
              <p className="text-[42px] font-extrabold text-white leading-none tracking-[-1px]">{destCode}</p>
              <p className="text-[13px] text-white/60 mt-1">{destCity}</p>
            </div>
          </div>

          <Divider />

          <div className="flex justify-between flex-wrap gap-4">
            <Field label="Departure" value={formatDate(extracted.departureDate || itinerary.startDate)} />
            <Field label="Return" value={formatDate(extracted.returnDate || itinerary.endDate)} align="center" />
            <Field label="Duration" value={itinerary.days?.length ? `${itinerary.days.length} Days` : null} align="right" />
          </div>

          <div className="-mx-8 my-6 h-6 relative flex items-center">
            <div className="w-6 h-6 rounded-full bg-bg absolute -left-3 shrink-0" />
            <div className="flex-1 mx-5 border-t-2 border-dashed border-white/20" />
            <div className="w-6 h-6 rounded-full bg-bg absolute -right-3" />
          </div>

          <div className="flex justify-center pt-1">
            <Barcode token={itinerary.shareToken} />
          </div>

        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 text-[13px] font-semibold text-text-muted bg-surface border border-border rounded-sm px-5 py-2 cursor-pointer transition-colors duration-200 hover:text-primary hover:border-primary">
          <Printer size={14} />
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}