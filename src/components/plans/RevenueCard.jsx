import { formatINR } from '../../utils/revenueUtils';
import { memberStatus } from '../../utils/dateUtils';

export default function RevenueCard({ members, plans }) {
  const rows = Object.values(plans).map(plan => {
    const active = members.filter(
      m => m.plan === plan.id && memberStatus(m.expiryDate) !== 'expired'
    );
    return {
      plan,
      count: active.length,
      contribution: active.length * plan.monthlyRate,
    };
  }).filter(r => r.count > 0);

  const total = rows.reduce((s, r) => s + r.contribution, 0);

  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1e1e2e',
      borderRadius: '14px',
      padding: '24px 28px',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '20px',
          letterSpacing: '0.08em',
          color: '#f0f0f8',
          margin: '0 0 4px',
        }}>
          ESTIMATED MONTHLY REVENUE
        </h2>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
          Monthly-normalized across all active members
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {rows.map(({ plan, count, contribution }) => (
          <div key={plan.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            background: '#0d0d14',
            border: '1px solid #1a1a28',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#e0e0e8', fontWeight: 500 }}>{plan.label}</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{count} member{count !== 1 ? 's' : ''}</span>
            </div>
            <span style={{ fontSize: '14px', color: '#9ca3af', fontFamily: 'monospace' }}>
              {formatINR(contribution)}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(233,69,96,0.08)',
        border: '1px solid rgba(233,69,96,0.25)',
        borderRadius: '10px',
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '16px',
          letterSpacing: '0.1em',
          color: '#e94560',
        }}>
          TOTAL / MONTH
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '32px',
          color: '#e94560',
          letterSpacing: '0.03em',
        }}>
          {formatINR(total)}
        </span>
      </div>
    </div>
  );
}
