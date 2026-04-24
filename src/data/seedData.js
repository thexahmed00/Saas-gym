export const PLANS = {
  daily:     { id: 'daily',     label: 'Daily',     price: 150,    durationDays: 1,   monthlyRate: 150 * 30 },
  monthly:   { id: 'monthly',   label: 'Monthly',   price: 1500,   durationDays: 30,  monthlyRate: 1500 },
  quarterly: { id: 'quarterly', label: 'Quarterly', price: 4000,   durationDays: 90,  monthlyRate: Math.round(4000 / 3) },
  annual:    { id: 'annual',    label: 'Annual',    price: 12000,  durationDays: 365, monthlyRate: Math.round(12000 / 12) },
};

// Dates relative to 2026-04-24 (today in this session)
export const SEED_MEMBERS = [
  {
    id: 1,
    name: 'Karthik Rao',
    phone: '+91 98491 23456',
    plan: 'daily',
    fingerprintId: 'FP-001',
    joinDate: '2026-04-01',
    expiryDate: '2026-04-30',  // 6 days remaining — urgent
  },
  {
    id: 2,
    name: 'Rohan Reddy',
    phone: '+91 99890 34567',
    plan: 'monthly',
    fingerprintId: 'FP-002',
    joinDate: '2026-04-10',
    expiryDate: '2026-05-10',  // 16 days remaining
  },
  {
    id: 3,
    name: 'Zainab Siddiqui',
    phone: '+91 97654 56789',
    plan: 'monthly',
    fingerprintId: 'FP-003',
    joinDate: '2026-03-01',
    expiryDate: '2026-04-01',  // 23 days overdue — expired
  },
  {
    id: 4,
    name: 'Priya Sharma',
    phone: '+91 98765 67890',
    plan: 'quarterly',
    fingerprintId: 'FP-004',
    joinDate: '2026-03-15',
    expiryDate: '2026-06-13',  // 50 days remaining
  },
  {
    id: 5,
    name: 'Arjun Iyer',
    phone: '+91 96321 78901',
    plan: 'annual',
    fingerprintId: 'FP-005',
    joinDate: '2026-01-15',
    expiryDate: '2027-01-15',  // way out
  },
];
