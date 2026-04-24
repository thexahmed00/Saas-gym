import { daysUntilExpiry, formatExpiry } from '../../utils/dateUtils';
import { PLANS } from '../../data/seedData';
import Badge from '../ui/Badge';

function urgencyBadge(days) {
  if (days < 0) {
    return <Badge variant="expired" label={`${Math.abs(days)}d overdue`} />;
  }
  if (days <= 7)  return <Badge variant="expired"  label={`${days}d left`} />;
  if (days <= 14) return <Badge variant="warning"  label={`${days}d left`} />;
  return              <Badge variant="active"   label={`${days}d left`} />;
}

const TH = ({ children, right }) => (
  <th style={{
    padding: '10px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#6b7280',
    textAlign: right ? 'right' : 'left',
    borderBottom: '1px solid #1e1e2e',
    background: '#0d0d14',
  }}>
    {children}
  </th>
);

const TD = ({ children, right }) => (
  <td style={{
    padding: '12px 14px',
    fontSize: '14px',
    color: '#e0e0e8',
    borderBottom: '1px solid #1a1a28',
    textAlign: right ? 'right' : 'left',
    verticalAlign: 'middle',
  }}>
    {children}
  </td>
);

export default function RenewalTable({ members }) {
  const due = members
    .map(m => ({ ...m, daysLeft: daysUntilExpiry(m.expiryDate) }))
    .filter(m => m.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (due.length === 0) {
    return (
      <div style={{ color: '#4b5563', fontSize: '14px', padding: '24px 0' }}>
        No renewals due in the next 30 days.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <TH>Member</TH>
            <TH>Plan</TH>
            <TH>Expiry</TH>
            <TH right>Status</TH>
          </tr>
        </thead>
        <tbody>
          {due.map(m => (
            <tr key={m.id}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <TD>
                <div style={{ fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{m.phone}</div>
              </TD>
              <TD><Badge variant={m.plan} label={PLANS[m.plan]?.label ?? m.plan} /></TD>
              <TD>{formatExpiry(m.expiryDate)}</TD>
              <TD right>{urgencyBadge(m.daysLeft)}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
