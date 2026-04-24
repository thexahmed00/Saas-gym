import { formatTime } from '../../utils/dateUtils';
import { PLANS } from '../../data/seedData';
import Badge from '../ui/Badge';

export default function CheckInLog({ log }) {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1e1e2e',
      borderRadius: '14px',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #1e1e2e',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '18px',
          letterSpacing: '0.1em',
          color: '#f0f0f8',
          margin: 0,
        }}>
          TODAY'S LOG
        </h2>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          color: '#e94560',
          letterSpacing: '0.05em',
        }}>
          {log.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {log.length === 0 ? (
          <div style={{ padding: '24px 20px', color: '#4b5563', fontSize: '14px', textAlign: 'center' }}>
            No check-ins yet today
          </div>
        ) : (
          log.map(entry => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px',
                borderBottom: '1px solid #1a1a28',
                animation: 'fade-in 0.2s ease',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#f0f0f8' }}>
                  {entry.member.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  {formatTime(entry.timestamp)}
                </div>
              </div>
              <Badge variant={entry.member.plan} label={PLANS[entry.member.plan]?.label ?? entry.member.plan} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
