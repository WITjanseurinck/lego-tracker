export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" rx="6" fill="var(--accent)" />
      <g fill="#0F1722" fillOpacity="0.16">
        <circle cx="9.5" cy="10.5" r="4.6" /><circle cx="20.5" cy="10.5" r="4.6" />
        <circle cx="9.5" cy="21.5" r="4.6" /><circle cx="20.5" cy="21.5" r="4.6" />
      </g>
      <g fill="var(--accent)">
        <circle cx="9.5" cy="9.5" r="4.2" /><circle cx="20.5" cy="9.5" r="4.2" />
        <circle cx="9.5" cy="20.5" r="4.2" /><circle cx="20.5" cy="20.5" r="4.2" />
      </g>
    </svg>
  );
}
