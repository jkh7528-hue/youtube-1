/** Decorative abstract control-panel / circuit schematic used on dark surfaces. */
export default function SchematicArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="40" y="40" width="400" height="400" rx="8" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="1.5" />
      <rect x="80" y="80" width="140" height="100" rx="4" stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.6" />
      <rect x="260" y="80" width="140" height="60" rx="4" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" />
      <rect x="80" y="220" width="90" height="90" rx="4" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" />
      <rect x="190" y="220" width="90" height="180" rx="4" stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.6" />
      <rect x="300" y="180" width="100" height="120" rx="4" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.45" />

      <circle cx="150" cy="130" r="22" stroke="#0EA5E9" strokeWidth="2" />
      <circle cx="150" cy="130" r="6" fill="#0EA5E9" />
      <circle cx="350" cy="240" r="16" stroke="#38BDF8" strokeWidth="2" />
      <circle cx="125" cy="265" r="4" fill="#38BDF8" />
      <circle cx="235" cy="260" r="4" fill="#0284C7" />
      <circle cx="235" cy="340" r="4" fill="#0284C7" />

      <path d="M172 130H260" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M330 140V180" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M125 220V180" stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M235 220V180" stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M280 260H300" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M170 265H190" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" />

      <g stroke="#0EA5E9" strokeOpacity="0.35">
        <line x1="310" y1="200" x2="390" y2="200" />
        <line x1="310" y1="215" x2="390" y2="215" />
        <line x1="310" y1="230" x2="390" y2="230" />
        <line x1="310" y1="245" x2="390" y2="245" />
        <line x1="310" y1="260" x2="390" y2="260" />
        <line x1="310" y1="275" x2="390" y2="275" />
      </g>
      <g stroke="#0284C7" strokeOpacity="0.4">
        <line x1="200" y1="235" x2="270" y2="235" />
        <line x1="200" y1="250" x2="270" y2="250" />
        <line x1="200" y1="380" x2="270" y2="380" />
      </g>
    </svg>
  );
}
