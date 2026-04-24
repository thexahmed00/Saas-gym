export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false, style = {} }) {
  const base = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 0.15s, transform 0.1s',
    padding: '9px 18px',
    ...style,
  };

  const variants = {
    primary: {
      background: '#e94560',
      color: '#fff',
    },
    ghost: {
      background: 'transparent',
      color: '#e0e0e8',
      border: '1px solid #1e1e2e',
    },
    danger: {
      background: 'rgba(233,69,96,0.15)',
      color: '#e94560',
      border: '1px solid rgba(233,69,96,0.3)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
    >
      {children}
    </button>
  );
}
