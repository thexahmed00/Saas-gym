const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',      icon: '▦' },
  { id: 'checkin',   label: 'Check-In',        icon: '⬡' },
  { id: 'members',   label: 'Members',          icon: '◈' },
  { id: 'plans',     label: 'Plans & Revenue',  icon: '◉' },
];

export default function Sidebar({ active, onNavigate, deviceConnected }) {
  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      background: '#0d0d14',
      borderRight: '1px solid #1e1e2e',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid #1e1e2e',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '28px',
          letterSpacing: '0.12em',
          color: '#e94560',
          lineHeight: 1,
        }}>
          IRON<span style={{ color: '#f0f0f8' }}>TRACK</span>
        </div>
        <div style={{ fontSize: '11px', color: '#4b5563', letterSpacing: '0.1em', marginTop: '4px' }}>
          GYM MANAGEMENT
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'rgba(233,69,96,0.12)' : 'transparent',
                color: isActive ? '#e94560' : '#9ca3af',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'background 0.15s, color 0.15s',
                letterSpacing: isActive ? '0.02em' : '0',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#e0e0e8';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <span style={{ fontSize: '16px', opacity: 0.85 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Morpho Device Status */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #1e1e2e',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: deviceConnected ? '#22c55e' : '#4b5563',
          boxShadow: deviceConnected ? '0 0 6px #22c55e' : 'none',
          flexShrink: 0,
          transition: 'background 0.3s',
        }} />
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: deviceConnected ? '#4ade80' : '#6b7280', letterSpacing: '0.06em' }}>
            MORPHO DEVICE
          </div>
          <div style={{ fontSize: '10px', color: '#4b5563' }}>
            {deviceConnected ? 'MSO 1300 E3 Connected' : 'Simulation Mode'}
          </div>
        </div>
      </div>
    </aside>
  );
}
