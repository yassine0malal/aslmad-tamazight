export default function StarLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'var(--clay-canvas)', opacity: 0.95 }}
    >
      <div className="relative w-20 h-20">
        <svg className="absolute inset-0 w-full h-full animate-star-spin" viewBox="0 0 80 80" fill="none">
          <path
            d="M40 0L48.5 28.5L80 40L48.5 51.5L40 80L31.5 51.5L0 40L31.5 28.5L40 0Z"
            fill="var(--clay-ochre)"
          />
        </svg>
        <svg className="absolute inset-0 w-full h-full animate-star-spin-delayed" viewBox="0 0 80 80" fill="none">
          <path
            d="M40 0L48.5 28.5L80 40L48.5 51.5L40 80L31.5 51.5L0 40L31.5 28.5L40 0Z"
            fill="var(--clay-lavender)"
            style={{ opacity: 0.7 }}
          />
        </svg>
      </div>
    </div>
  );
}
