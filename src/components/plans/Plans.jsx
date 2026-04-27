import PlanCard from './PlanCard';
import RevenueCard from './RevenueCard';
import { activeMembersPerPlan } from '../../utils/revenueUtils';

export default function Plans({ members, plans, onUpdatePrice, savingPlan }) {
  const counts = activeMembersPerPlan(members, plans);

  return (
    <div>
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
          Pricing tiers and revenue breakdown · click ✏ to edit a price
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {Object.values(plans).map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            activeCount={counts[plan.id] ?? 0}
            onUpdatePrice={onUpdatePrice}
            saving={savingPlan}
          />
        ))}
      </div>

      <RevenueCard members={members} plans={plans} />
    </div>
  );
}
