import Loader from './Loader';

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
}) {
  const base = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-[var(--radius-sm)]
    font-[var(--font-body)] text-[15px] font-semibold
    transition-all duration-200 border-none
    ${disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
    accent:  'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]',
    outline: 'bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-surface-2)]',
    ghost:   'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]}`}
    >
      {loading && <Loader size={16} color="currentColor" />}
      {children}
    </button>
  );
}