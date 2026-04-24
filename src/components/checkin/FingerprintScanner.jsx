import { SCAN_STATES } from '../../hooks/useCheckIn';
import { PLANS } from '../../data/seedData';

const STATE_CONFIG = {
  [SCAN_STATES.IDLE]: {
    ringColor:   '#2a2a3a',
    glowColor:   'transparent',
    iconColor:   '#6b7280',
    label:       'TAP TO SCAN',
    sublabel:    'Place finger on Morpho device',
    icon:        '⬡',
    animation:   'none',
  },
  [SCAN_STATES.SCANNING]: {
    ringColor:   '#3b82f6',
    glowColor:   'rgba(59,130,246,0.3)',
    iconColor:   '#60a5fa',
    label:       'SCANNING…',
    sublabel:    'Hold still',
    icon:        '⬡',
    animation:   'spin',
  },
  [SCAN_STATES.SUCCESS]: {
    ringColor:   '#22c55e',
    glowColor:   'rgba(34,197,94,0.35)',
    iconColor:   '#4ade80',
    label:       'ACCESS GRANTED',
    sublabel:    null,
    icon:        '✓',
    animation:   'glow-green',
  },
  [SCAN_STATES.DENIED]: {
    ringColor:   '#e94560',
    glowColor:   'rgba(233,69,96,0.4)',
    iconColor:   '#f87171',
    label:       'ACCESS DENIED',
    sublabel:    null,
    icon:        '✕',
    animation:   'glow-red',
  },
  [SCAN_STATES.NOT_FOUND]: {
    ringColor:   '#fb923c',
    glowColor:   'rgba(251,146,60,0.35)',
    iconColor:   '#fdba74',
    label:       'NOT FOUND',
    sublabel:    null,
    icon:        '?',
    animation:   'glow-orange',
  },
};

export default function FingerprintScanner({ scanState, scanResult, onScan }) {
  const cfg = STATE_CONFIG[scanState];
  const isIdle = scanState === SCAN_STATES.IDLE;
  const isScanning = scanState === SCAN_STATES.SCANNING;

  const outerRingStyle = {
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    border: `3px solid ${cfg.ringColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: isIdle ? 'pointer' : 'default',
    transition: 'border-color 0.4s, box-shadow 0.4s',
    boxShadow: cfg.glowColor !== 'transparent' ? `0 0 40px 8px ${cfg.glowColor}` : 'none',
    animation: isScanning ? 'pulse-ring 1.4s ease-in-out infinite' : 'none',
  };

  const spinnerStyle = isScanning ? {
    position: 'absolute',
    inset: '-6px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: '#3b82f6',
    borderRightColor: '#3b82f6',
    animation: 'spin 0.9s linear infinite',
  } : null;

  const innerCircle = {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: isIdle
      ? 'rgba(30,30,46,0.6)'
      : `radial-gradient(circle, rgba(0,0,0,0.4), rgba(0,0,0,0.7))`,
    border: `1px solid ${cfg.ringColor}33`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: scanState === SCAN_STATES.IDLE ? '56px' : '48px',
    color: cfg.iconColor,
    transition: 'all 0.4s',
    userSelect: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
      {/* Scanner ring */}
      <div style={outerRingStyle} onClick={isIdle ? onScan : undefined}>
        {spinnerStyle && <div style={spinnerStyle} />}
        <div style={innerCircle}>{cfg.icon}</div>
      </div>

      {/* Status label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          letterSpacing: '0.12em',
          color: cfg.iconColor,
        }}>
          {cfg.label}
        </div>
        {cfg.sublabel && (
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {cfg.sublabel}
          </div>
        )}
      </div>

      {/* Result card */}
      {scanResult && (
        <div style={{
          background: '#111118',
          border: `1px solid ${cfg.ringColor}44`,
          borderRadius: '12px',
          padding: '16px 24px',
          textAlign: 'center',
          minWidth: '220px',
          animation: 'fade-in 0.2s ease',
        }}>
          {scanResult.member ? (
            <>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#f0f0f8' }}>
                {scanResult.member.name}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                {PLANS[scanResult.member.plan]?.label ?? scanResult.member.plan} Plan
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {scanResult.member.fingerprintId}
              </div>
            </>
          ) : null}
          {scanResult.reason && (
            <div style={{ fontSize: '13px', color: cfg.iconColor, marginTop: scanResult.member ? '8px' : 0 }}>
              {scanResult.reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
