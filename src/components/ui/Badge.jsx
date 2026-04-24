const VARIANTS = {
  active:    { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)'  },
  warning:   { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', border: 'rgba(251,146,60,0.25)' },
  expired:   { bg: 'rgba(233,69,96,0.12)',  color: '#e94560', border: 'rgba(233,69,96,0.25)'  },
  daily:     { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  monthly:   { bg: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: 'rgba(14,165,233,0.25)' },
  quarterly: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  annual:    { bg: 'rgba(234,179,8,0.12)',  color: '#facc15', border: 'rgba(234,179,8,0.25)'  },
};

export default function Badge({ variant = 'active', label }) {
  const v = VARIANTS[variant] ?? VARIANTS.active;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
