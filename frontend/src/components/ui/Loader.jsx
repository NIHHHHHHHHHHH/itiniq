export default function Loader({ size = 24, color = 'var(--color-primary)' }) {
  return (
    <span
      className="inline-block rounded-full border-2 border-transparent animate-spin shrink-0"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: color,
      }}
    />
  );
}