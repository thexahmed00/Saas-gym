export default function StatCard({ label, value, accent = false, sub }) {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1e1e2e',
      borderRadius: '14px',
      padding: '22px 24px',
      flex: '1 1 160px',
    }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#6b7280',
        marginBottom: '10px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '48px',
        lineHeight: 1,
        color: accent ? '#e94560' : '#f0f0f8',
        letterSpacing: '0.02em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '6px' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
