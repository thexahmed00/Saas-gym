import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PLANS } from '../../data/seedData';

const FIELD = ({ label, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <label style={{
      display: 'block',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#6b7280',
      marginBottom: '7px',
    }}>
      {label}
    </label>
    {children}
  </div>
);

const INPUT_STYLE = {
  width: '100%',
  background: '#0d0d14',
  border: '1px solid #1e1e2e',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#e0e0e8',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
};

const PLAN_COLORS = {
  daily:     { active: '#818cf8', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)' },
  monthly:   { active: '#38bdf8', bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.4)' },
  quarterly: { active: '#c084fc', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)' },
  annual:    { active: '#facc15', bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.4)'  },
};

export default function AddMemberModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', phone: '+91 ', plan: 'monthly' });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name = 'Name is required';
    if (form.phone.trim().length < 8) e.phone = 'Enter a valid phone number';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd(form);
    onClose();
  }

  return (
    <Modal title="ADD MEMBER" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FIELD label="Full Name">
          <input
            style={{ ...INPUT_STYLE, borderColor: errors.name ? '#e94560' : '#1e1e2e' }}
            value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}); }}
            placeholder="e.g. Rohan Reddy"
            autoFocus
          />
          {errors.name && <div style={{ color: '#e94560', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
        </FIELD>

        <FIELD label="Phone Number">
          <input
            style={{ ...INPUT_STYLE, borderColor: errors.phone ? '#e94560' : '#1e1e2e' }}
            value={form.phone}
            onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors({}); }}
            placeholder="+91 98XXX XXXXX"
          />
          {errors.phone && <div style={{ color: '#e94560', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</div>}
        </FIELD>

        <FIELD label="Membership Plan">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.values(PLANS).map(plan => {
              const clr = PLAN_COLORS[plan.id];
              const selected = form.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setForm(f => ({ ...f, plan: plan.id }))}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${selected ? clr.border : '#1e1e2e'}`,
                    background: selected ? clr.bg : '#0d0d14',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '14px', color: selected ? clr.active : '#e0e0e8' }}>
                    {plan.label}
                  </div>
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                    ₹{plan.price.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </FIELD>

        <div style={{
          fontSize: '12px',
          color: '#4b5563',
          background: '#0d0d14',
          border: '1px solid #1e1e2e',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '20px',
        }}>
          ℹ Fingerprint will be enrolled on next scanner tap.
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit">Add Member</Button>
        </div>
      </form>
    </Modal>
  );
}
