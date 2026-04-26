import { memberStatus, formatExpiry } from '../../utils/dateUtils';
import { PLANS } from '../../data/seedData';
import Badge from '../ui/Badge';

const TH = ({ children }) => (
  <th style={{
    padding: '10px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#6b7280',
    textAlign: 'left',
    borderBottom: '1px solid #1e1e2e',
    background: '#0d0d14',
    whiteSpace: 'nowrap',
  }}>
    {children}
  </th>
);

const TD = ({ children }) => (
  <td style={{
    padding: '12px 14px',
    fontSize: '14px',
    color: '#e0e0e8',
    borderBottom: '1px solid #1a1a28',
    verticalAlign: 'middle',
  }}>
    {children}
  </td>
);

export default function MembersTable({ members, search }) {
  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.fingerprintId.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  });

  if (filtered.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#4b5563', fontSize: '14px' }}>
        No members match "{search}"
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <TH>Name</TH>
            <TH>Phone</TH>
            <TH>Plan</TH>
            <TH>Fingerprint ID</TH>
            <TH>Expiry</TH>
            <TH>Status</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => {
            const status = memberStatus(m.expiryDate);
            return (
              <tr
                key={m.id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        objectFit: 'cover', border: '1px solid #1e1e2e', flexShrink: 0,
                      }} />
                    ) : (
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: '#1e1e2e', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '14px', flexShrink: 0,
                        color: '#4b5563',
                      }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                  </div>
                </TD>
                <TD>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af' }}>
                    {m.phone}
                  </span>
                </TD>
                <TD><Badge variant={m.plan} label={PLANS[m.plan]?.label ?? m.plan} /></TD>
                <TD>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    background: '#1e1e2e',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    color: '#9ca3af',
                  }}>
                    {m.fingerprintId}
                  </span>
                </TD>
                <TD>{formatExpiry(m.expiryDate)}</TD>
                <TD>
                  <Badge
                    variant={status}
                    label={status === 'active' ? 'Active' : status === 'warning' ? 'Expiring' : 'Expired'}
                  />
                </TD>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
