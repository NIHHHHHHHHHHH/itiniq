import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, FileText, Sparkles, Map } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const steps = [
    { icon: FileText, title: 'Upload your documents', desc: 'Flight tickets, hotel bookings, or any travel PDF' },
    { icon: Sparkles, title: 'AI extracts the details', desc: 'Dates, destinations, confirmations, all parsed instantly' },
    { icon: Map, title: 'Get your itinerary', desc: 'A day-by-day plan, shareable with anyone' },
  ];


  return (
    <div className="flex min-h-screen flex-col md:flex-row">

      <div className="flex md:hidden items-center justify-between px-5 py-4" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="flex items-center gap-3">
          <Plane size={30} className="text-white" />
          <div>
            <p className="text-white font-bold text-xl leading-tight">ITINIQ</p>
            <p className="text-white/60 text-base">AI travel itineraries</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-[0_0_45%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px', }}/>

        <div className="absolute -right-8 -bottom-8 opacity-[0.04] pointer-events-none"><Plane size={260} className="text-white" /></div>

        <div className="relative flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Plane size={30} className="text-white" />
            </div>
            <span className="text-white font-bold text-5xl tracking-tight">ITINIQ</span>
          </div>

          <h2 className="text-white font-bold text-4xl leading-tight mb-4 max-w-sm">Your bookings.<br />Beautiful Itineraries.</h2>
          <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-md">Upload any travel document and get a complete day-by-day plan in seconds, powered by AI.</p>

          <div className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }} >
                  <step.icon size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xl font-semibold mb-0.75">{step.title}</p>
                  <p className="text-white/60 text-base leading-normal">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-12 bg-bg">
        <div className="w-full max-w-100 animate-fade-in">
          <h2 className="text-5xl font-bold text-text-primary mb-2">Welcome back</h2>
          <p className="text-text-muted text-xl mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-base font-semibold text-text-primary mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-sm text-[15px] text-text-primary bg-surface transition-colors duration-200 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-text-primary mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-sm text-[15px] text-text-primary bg-surface transition-colors duration-200 outline-none focus:border-primary"
              />
            </div>

            {error && (
              <p className="text-error text-sm -my-2">{error}</p>
            )}

            <Button type="submit" variant="accent" loading={loading} fullWidth>Sign In</Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>

    </div>
  );
}