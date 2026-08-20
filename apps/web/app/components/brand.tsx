type BrandProps = {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
};

export function Brand({ inverse = false, compact = false, className = '' }: BrandProps) {
  const source = compact
    ? inverse
      ? '/brand/mizant-mark-light.png'
      : '/brand/mizant-mark-dark.png'
    : inverse
      ? '/brand/mizant-logo-light.png'
      : '/brand/mizant-logo-dark.png';

  return (
    <img
      className={`mizant-brand ${compact ? 'mizant-brand--mark' : ''} ${className}`.trim()}
      src={source}
      alt="Mizant"
    />
  );
}
