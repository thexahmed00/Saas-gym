export function today() {
  return new Date().toISOString().split('T')[0];
}

export function daysUntilExpiry(expiryDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  return Math.round((exp - now) / (1000 * 60 * 60 * 24));
}

// 'active' | 'warning' (≤30d) | 'expired'
export function memberStatus(expiryDate) {
  const days = daysUntilExpiry(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'warning';
  return 'active';
}

export function formatExpiry(expiryDate) {
  return new Date(expiryDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}
