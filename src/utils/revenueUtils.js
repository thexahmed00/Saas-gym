import { PLANS } from '../data/seedData';
import { memberStatus } from './dateUtils';

export function estimatedMonthlyRevenue(members) {
  return members
    .filter(m => memberStatus(m.expiryDate) !== 'expired')
    .reduce((sum, m) => sum + (PLANS[m.plan]?.monthlyRate ?? 0), 0);
}

export function activeMembersPerPlan(members) {
  const counts = {};
  Object.keys(PLANS).forEach(p => { counts[p] = 0; });
  members
    .filter(m => memberStatus(m.expiryDate) !== 'expired')
    .forEach(m => { if (counts[m.plan] !== undefined) counts[m.plan]++; });
  return counts;
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}
