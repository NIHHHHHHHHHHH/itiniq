import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Star } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };


  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex md:hidden items-center justify-between px-5 py-4" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="flex items-center gap-3">
          <Globe size={30} className="text-white" />
          <div>
            <p className="text-white font-bold text-xl leading-tight">ITINIQ</p>
            <p className="text-white/60 text-base">Plan smarter with AI</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-[0_0_45%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px',}}/>
        <div className="absolute -right-8 -bottom-8 opacity-[0.04] pointer-events-none">
          <Globe size={260} className="text-white" />
        </div>

        <div className="relative flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Globe size={30} className="text-white" />
            </div>
            <span className="text-white font-bold text-5xl tracking-tight">ITINIQ</span>
          </div>

          <h2 className="text-white font-bold text-4xl leading-tight mb-4 max-w-75">Plan smarter.<br />Travel better.</h2>
          <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-md">Join thousands of travelers who build stunning itineraries from their booking documents in seconds.</p>

          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="text-accent-light fill-accent-light" />
              ))}
            </div>
            <p className="text-white/90 text-base leading-[1.7]">"Itiniq turned my messy booking emails into a perfect 10-day Paris itinerary in seconds. Absolute game changer."</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>SR</div>
              <div>
                <p className="text-white/80 text-sm font-medium">Sarah R.</p>
                <p className="text-white/50 text-sm">Paris trip, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-12 bg-bg">
        <div className="w-full max-w-100 animate-fade-in">
          <h2 className="text-5xl font-bold text-text-primary mb-2">Create account</h2>
          <p className="text-text-muted text-xl mb-8">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-base font-semibold text-text-primary mb-1.5">Full Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-sm text-[15px] text-text-primary bg-surface transition-colors duration-200 outline-none focus:border-primary"
              />
            </div>

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
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-sm text-[15px] text-text-primary bg-surface transition-colors duration-200 outline-none focus:border-primary"
              />
            </div>

            {error && (
              <p className="text-error text-sm -my-2">{error}</p>
            )}

            <Button type="submit" variant="accent" loading={loading} fullWidth>Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  );
}