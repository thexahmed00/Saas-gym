const ACCENT = {
  daily:     { color: '#818cf8', border: 'rgba(99,102,241,0.3)',  bg: 'rgba(99,102,241,0.06)'  },
  monthly:   { color: '#38bdf8', border: 'rgba(14,165,233,0.3)',  bg: 'rgba(14,165,233,0.06)'  },
  quarterly: { color: '#c084fc', border: 'rgba(168,85,247,0.3)',  bg: 'rgba(168,85,247,0.06)'  },
  annual:    { color: '#facc15', border: 'rgba(234,179,8,0.3)',   bg: 'rgba(234,179,8,0.06)'   },
};

export default function PlanCard({ plan, activeCount }) {
  const a = ACCENT[plan.id] ?? ACCENT.monthly;
  return (
    <div style={{
      background: '#111118',
      border: `1px solid ${a.border}`,
      borderRadius: '14px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: '1 1 180px',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 28px ${a.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '16px',
        letterSpacing: '0.14em',
        color: a.color,
      }}>
        {plan.label.toUpperCase()}
      </div>

      <div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '42px',
          color: '#f0f0f8',
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}>
          ₹{plan.price.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          per {plan.id === 'daily' ? 'day' : plan.id === 'monthly' ? 'month' : plan.id === 'quarterly' ? 'quarter' : 'year'}
        </div>
      </div>

      <div style={{
        background: a.bg,
        border: `1px solid ${a.border}`,
        borderRadius: '8px',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Active members</span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          color: a.color,
          letterSpacing: '0.04em',
        }}>
          {activeCount}
        </span>
      </div>
    </div>
  );
}
