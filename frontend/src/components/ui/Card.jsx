export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-(--radius-md) shadow-(--shadow-md)  border border-border ${className}`}>
      {children}
    </div>
  );
}