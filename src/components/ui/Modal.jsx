import { useEffect } from 'react';
import Button from './Button';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111118',
          border: '1px solid #1e1e2e',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          animation: 'fade-in 0.18s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '0.06em', color: '#f0f0f8', margin: 0 }}>
            {title}
          </h2>
          <Button variant="ghost" onClick={onClose} style={{ padding: '4px 10px', fontSize: '18px', lineHeight: 1 }}>
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
