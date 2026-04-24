import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../data/seedData';

/*
 * useMembers — reads from and writes to Supabase `members` table.
 *
 * Column aliasing keeps the JS-side API in camelCase (fingerprintId, expiryDate)
 * while the DB stays in snake_case. No mapping layer needed.
 */
const SELECT_COLS =
  'id, name, phone, plan, fingerprintId:fingerprint_id, joinDate:join_date, expiryDate:expiry_date';

export function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select(SELECT_COLS)
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
      setMembers([]);
    } else {
      setError(null);
      setMembers(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = useCallback(async ({ name, phone, plan }) => {
    // Pick next FP-XXX based on existing count (no member deletion in v1).
    const fingerprintId = `FP-${String(members.length + 1).padStart(3, '0')}`;
    const days = PLANS[plan]?.durationDays ?? 30;

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + days);
    const fmt = d => d.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('members')
      .insert({
        name,
        phone,
        plan,
        fingerprint_id: fingerprintId,
        join_date:   fmt(today),
        expiry_date: fmt(expiry),
      })
      .select(SELECT_COLS)
      .single();

    if (error) {
      setError(error.message);
      return null;
    }
    setMembers(prev => [...prev, data]);
    return data;
  }, [members.length]);

  return { members, loading, error, addMember, refetch: fetchMembers };
}
