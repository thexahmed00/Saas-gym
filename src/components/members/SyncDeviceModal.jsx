import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const SELECT_STYLE = {
  width: '100%',
  background: '#0d0d14',
  border: '1px solid #1e1e2e',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  color: '#e0e0e8',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  cursor: 'pointer',
};

export default function SyncDeviceModal({ members, onLinkFingerprint, onClose }) {
  const [deviceUsers, setDeviceUsers] = useState([]);
  const [loadingDevice, setLoadingDevice] = useState(true);
  const [deviceError, setDeviceError] = useState(null);
  const [links, setLinks] = useState({});
  const [saving, setSaving] = useState(false);
  const isSimulated = !window.electronAPI;

  useEffect(() => {
    if (!window.electronAPI) {
      setDeviceError('Browser mode — showing simulated device data');
      setDeviceUsers([
        { uid: 1, userId: '1', name: 'Demo User 1' },
        { uid: 2, userId: '2', name: 'Demo User 2' },
      ]);
      setLoadingDevice(false);
      return;
    }
    window.electronAPI.getDeviceUsers()
      .then(users => {
        setDeviceUsers(users);
        const initial = {};
        users.forEach(u => {
          const matched = members.find(m => m.fingerprintId === String(u.userId));
          if (matched) initial[String(u.userId)] = matched.id;
        });
        setLinks(initial);
      })
      .catch(err => setDeviceError(err.message))
      .finally(() => setLoadingDevice(false));
  }, [members]);

  async function handleApply() {
    setSaving(true);
    for (const [deviceUserId, memberId] of Object.entries(links)) {
      if (!memberId) continue;
      await onLinkFingerprint(memberId, deviceUserId);
    }
    setSaving(false);
    onClose();
  }

  const pendingCount = Object.values(links).filter(Boolean).length;

  return (
    <Modal title="SYNC DEVICE" onClose={onClose} maxWidth="600px">

      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '20px',
        padding: '10px 14px',
        background: '#0d0d14',
        border: '1px solid #1e1e2e',
        borderRadius: '10px',
        fontSize: '13px', color: '#9ca3af',
      }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: deviceError && !isSimulated ? '#e94560' : '#22c55e',
          flexShrink: 0,
        }} />
        {isSimulated
          ? 'Browser mode — simulated ZKTeco data'
          : deviceError
          ? deviceError
          : `ZKTeco LX50 connected · ${deviceUsers.length} user${deviceUsers.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Table */}
      {loadingDevice ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          Reading device…
        </div>
      ) : deviceUsers.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          No users enrolled on device.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Device ID', 'Name on Device', 'Link to Member'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#6b7280',
                    borderBottom: '1px solid #1e1e2e', background: '#0d0d14',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deviceUsers.map(u => {
                const uid = String(u.userId);
                const alreadyLinked = members.find(m => m.fingerprintId === uid);
                return (
                  <tr key={u.uid}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a28', verticalAlign: 'middle' }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: '12px',
                        background: '#1e1e2e', padding: '2px 8px',
                        borderRadius: '6px', color: '#e94560',
                      }}>{uid}</span>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a28', fontSize: '13px', color: '#9ca3af', verticalAlign: 'middle' }}>
                      {u.name || <span style={{ color: '#4b5563' }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a28', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {alreadyLinked && (
                          <span style={{ fontSize: '11px', color: '#22c55e', whiteSpace: 'nowrap' }}>✓ linked</span>
                        )}
                        <select
                          value={links[uid] || ''}
                          onChange={e => setLinks(prev => ({ ...prev, [uid]: e.target.value }))}
                          style={SELECT_STYLE}
                        >
                          <option value="">— Not linked —</option>
                          {members.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
        <Button
          variant="primary"
          onClick={handleApply}
          disabled={saving || pendingCount === 0}
          type="button"
        >
          {saving ? 'Saving…' : `Apply ${pendingCount} Link${pendingCount !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </Modal>
  );
}
