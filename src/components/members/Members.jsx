import { useState } from 'react';
import MembersTable from './MembersTable';
import AddMemberModal from './AddMemberModal';
import SyncDeviceModal from './SyncDeviceModal';
import Button from '../ui/Button';

export default function Members({ members, plans, onAddMember, onLinkFingerprint }) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSync, setShowSync] = useState(false);

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '38px',
            letterSpacing: '0.08em',
            color: '#f0f0f8',
            margin: 0,
            lineHeight: 1,
          }}>
            MEMBERS
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
            {members.length} total members
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" onClick={() => setShowSync(true)}>
            ⟳ Sync Device
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Member
          </Button>
        </div>
      </div>

      {/* Search bar + table card */}
      <div style={{
        background: '#111118',
        border: '1px solid #1e1e2e',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e2e' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or fingerprint ID…"
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#0d0d14',
              border: '1px solid #1e1e2e',
              borderRadius: '8px',
              padding: '9px 14px',
              fontSize: '14px',
              color: '#e0e0e8',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#e94560'}
            onBlur={e => e.target.style.borderColor = '#1e1e2e'}
          />
        </div>

        <MembersTable members={members} search={search} />
      </div>

      {showModal && (
        <AddMemberModal onClose={() => setShowModal(false)} onAdd={onAddMember} plans={plans} />
      )}

      {showSync && (
        <SyncDeviceModal
          members={members}
          onLinkFingerprint={onLinkFingerprint}
          onClose={() => setShowSync(false)}
        />
      )}
    </div>
  );
}
