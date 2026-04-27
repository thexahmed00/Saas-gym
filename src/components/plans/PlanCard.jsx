import { useState } from 'react';

const ACCENT = {
  daily:     { color: '#818cf8', border: 'rgba(99,102,241,0.3)',  bg: 'rgba(99,102,241,0.06)'  },
  monthly:   { color: '#38bdf8', border: 'rgba(14,165,233,0.3)',  bg: 'rgba(14,165,233,0.06)'  },
  quarterly: { color: '#c084fc', border: 'rgba(168,85,247,0.3)',  bg: 'rgba(168,85,247,0.06)'  },
  annual:    { color: '#facc15', border: 'rgba(234,179,8,0.3)',   bg: 'rgba(234,179,8,0.06)'   },
};

const PER_LABEL = { daily: 'day', monthly: 'month', quarterly: 'quarter', annual: 'year' };

export default function PlanCard({ plan, activeCount, onUpdatePrice, saving }) {
  const a = ACCENT[plan.id] ?? ACCENT.monthly;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState('');

  function startEdit() {
    setDraft(String(plan.price));
    setEditing(true);
  }

  async function commitEdit() {
    const val = parseInt(draft, 10);
    if (!isNaN(val) && val > 0 && val !== plan.price) {
      await onUpdatePrice(plan.id, val);
    }
    setEditing(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter')  commitEdit();
    if (e.key === 'Escape') setEditing(false);
  }

  return (
    <div
      style={{
        background: '#111118',
        border: `1px solid ${a.border}`,
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: '1 1 180px',
        transition: 'transform 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 28px ${a.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Edit button */}
      {!editing && (
        <button
          onClick={startEdit}
          title="Edit price"
          style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4b5563', fontSize: '14px', padding: '4px',
            lineHeight: 1,
          }}
          onMouseEnter={e => e.currentTarget.style.color = a.color}
          onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
        >
          ✏
        </button>
      )}

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '16px',
        letterSpacing: '0.14em',
        color: a.color,
      }}>
        {plan.label.toUpperCase()}
      </div>

      <div>
        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              color: '#f0f0f8',
              lineHeight: 1,
            }}>₹</span>
            <input
              autoFocus
              type="number"
              min="1"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKey}
              onBlur={commitEdit}
              style={{
                background: '#0d0d14',
                border: `1px solid ${a.color}`,
                borderRadius: '6px',
                color: '#f0f0f8',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '28px',
                width: '110px',
                padding: '2px 8px',
                outline: 'none',
              }}
            />
          </div>
        ) : (
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '42px',
            color: '#f0f0f8',
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}>
            ₹{plan.price.toLocaleString('en-IN')}
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          per {PER_LABEL[plan.id]}
          {editing && <span style={{ color: '#4b5563' }}> · Enter to save, Esc to cancel</span>}
        </div>
      </div>

      <div style={{
        background: a.bg,
        border: `1px solid ${a.border}`,
        borderRadius: '8px',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Active members</span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          color: a.color,
          letterSpacing: '0.04em',
        }}>
          {activeCount}
        </span>
      </div>

      {saving && (
        <div style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center' }}>Saving…</div>
      )}
    </div>
  );
}
