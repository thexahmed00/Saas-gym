import PlanCard from './PlanCard';
import RevenueCard from './RevenueCard';
import { PLANS } from '../../data/seedData';
import { activeMembersPerPlan } from '../../utils/revenueUtils';

export default function Plans({ members }) {
  const counts = activeMembersPerPlan(members);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '38px',
          letterSpacing: '0.08em',
          color: '#f0f0f8',
          margin: 0,
          lineHeight: 1,
        }}>
          PLANS & REVENUE
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
          Pricing tiers and revenue breakdown
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {Object.values(PLANS).map(plan => (
          <PlanCard key={plan.id} plan={plan} activeCount={counts[plan.id] ?? 0} />
        ))}
      </div>

      {/* Revenue summary */}
      <RevenueCard members={members} />
    </div>
  );
}
