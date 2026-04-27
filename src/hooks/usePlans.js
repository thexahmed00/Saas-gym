import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../data/seedData';

function buildPlans(prices) {
  return Object.fromEntries(
    Object.entries(PLANS).map(([key, plan]) => {
      const price = prices?.[key] ?? plan.price;
      const monthlyRate =
        key === 'daily'     ? price * 30 :
        key === 'monthly'   ? price :
        key === 'quarterly' ? Math.round(price / 3) :
                              Math.round(price / 12);
      return [key, { ...plan, price, monthlyRate }];
    })
  );
}

export function usePlans(gymId) {
  const [prices, setPrices] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!gymId) return;
    supabase
      .from('gyms')
      .select('plan_prices')
      .eq('id', gymId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('[usePlans] fetch error:', error);
        else setPrices(data?.plan_prices ?? null);
      });
  }, [gymId]);

  async function updatePrice(planId, newPrice) {
    setSaving(true);
    const updated = { ...(prices ?? {}), [planId]: newPrice };
    // Optimistic update so UI reflects immediately
    setPrices(updated);
    const { error } = await supabase
      .rpc('update_gym_plan_prices', { new_prices: updated });
    if (error) {
      console.error('[usePlans] update error:', error);
      // Revert optimistic update on failure
      setPrices(prices);
    }
    setSaving(false);
    return !error;
  }

  return { plans: buildPlans(prices), saving, updatePrice };
}
