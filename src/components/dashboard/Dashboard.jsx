import { useMemo } from 'react';
import StatCard from './StatCard';
import RenewalTable from './RenewalTable';
import { memberStatus } from '../../utils/dateUtils';

export default function Dashboard({ members, checkInLog }) {
  const stats = useMemo(() => {
    const active  = members.filter(m => memberStatus(m.expiryDate) === 'active').length;
    const warning = members.filter(m => memberStatus(m.expiryDate) === 'warning').length;
    const expired = members.filter(m => memberStatus(m.expiryDate) === 'expired').length;
    const todayStr = new Date().toDateString();
    const todayIns = checkInLog.filter(c => new Date(c.timestamp).toDateString() === todayStr).length;
    return { total: members.length, active: active + warning, expired, todayIns };
  }, [members, checkInLog]);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '38px',
          letterSpacing: '0.08em',
          color: '#f0f0f8',
          margin: 0,
          lineHeight: 1,
        }}>
          DASHBOARD
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
          Overview of your gym's activity
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
        <StatCard label="Total Members"    value={stats.total}   />
        <StatCard label="Active"           value={stats.active}  />
        <StatCard label="Expired"          value={stats.expired} accent />
        <StatCard label="Today's Check-ins" value={stats.todayIns} sub="via biometric scanner" />
      </div>

      {/* Renewals table */}
      <div style={{
        background: '#111118',
        border: '1px solid #1e1e2e',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #1e1e2e',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '20px',
            letterSpacing: '0.08em',
            color: '#f0f0f8',
            margin: 0,
          }}>
            RENEWALS DUE SOON
          </h2>
          <span style={{
            fontSize: '11px',
            color: '#6b7280',
            background: '#1e1e2e',
            padding: '2px 8px',
            borderRadius: '99px',
          }}>
            ≤ 30 days
          </span>
        </div>
        <div style={{ padding: '0 8px' }}>
          <RenewalTable members={members} />
        </div>
      </div>
    </div>
  );
}
