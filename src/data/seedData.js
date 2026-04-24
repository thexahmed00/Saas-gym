// Plan catalog — static config used across the app.
// Member rows now live in Supabase (see supabase/migrations/0001_initial.sql).
export const PLANS = {
  daily:     { id: 'daily',     label: 'Daily',     price: 150,    durationDays: 1,   monthlyRate: 150 * 30 },
  monthly:   { id: 'monthly',   label: 'Monthly',   price: 1500,   durationDays: 30,  monthlyRate: 1500 },
  quarterly: { id: 'quarterly', label: 'Quarterly', price: 4000,   durationDays: 90,  monthlyRate: Math.round(4000 / 3) },
  annual:    { id: 'annual',    label: 'Annual',    price: 12000,  durationDays: 365, monthlyRate: Math.round(12000 / 12) },
};
