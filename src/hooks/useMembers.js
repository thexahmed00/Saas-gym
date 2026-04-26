import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../data/seedData';

/*
 * useMembers — reads from and writes to Supabase `members` table,
 * scoped to a single gymId (the authenticated owner's gym).
 *
 * Column aliasing keeps the JS-side API in camelCase (fingerprintId, expiryDate)
 * while the DB stays in snake_case. No mapping layer needed.
 */
const SELECT_COLS =
  'id, name, phone, plan, fingerprintId:fingerprint_id, joinDate:join_date, expiryDate:expiry_date, photoUrl:photo_url';

export function useMembers(gymId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!gymId) { setMembers([]); setLoading(false); return; }

    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select(SELECT_COLS)
      .eq('gym_id', gymId)
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
      setMembers([]);
    } else {
      setError(null);
      setMembers(data ?? []);
    }
    setLoading(false);
  }, [gymId]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = useCallback(async ({ name, phone, plan, photoBlob }) => {
    if (!gymId) { setError('No active gym'); return null; }

    const fingerprintId = `FP-${String(members.length + 1).padStart(3, '0')}`;
    const days = PLANS[plan]?.durationDays ?? 30;

    const today  = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + days);
    const fmt = d => d.toISOString().split('T')[0];

    let photoUrl = null;
    if (photoBlob) {
      const path = `${gymId}/${Date.now()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from('member-photos')
        .upload(path, photoBlob, { contentType: 'image/jpeg' });
      if (!uploadErr) {
        const { data: { publicUrl } } = supabase.storage
          .from('member-photos')
          .getPublicUrl(path);
        photoUrl = publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('members')
      .insert({
        gym_id:         gymId,
        name,
        phone,
        plan,
        fingerprint_id: fingerprintId,
        join_date:      fmt(today),
        expiry_date:    fmt(expiry),
        photo_url:      photoUrl,
      })
      .select(SELECT_COLS)
      .single();

    if (error) { setError(error.message); return null; }
    setMembers(prev => [...prev, data]);
    return data;
  }, [gymId, members.length]);

  const linkFingerprint = useCallback(async (memberId, fingerprintId) => {
    const { data, error } = await supabase
      .from('members')
      .update({ fingerprint_id: fingerprintId })
      .eq('id', memberId)
      .eq('gym_id', gymId)
      .select(SELECT_COLS)
      .single();
    if (error) { setError(error.message); return false; }
    setMembers(prev => prev.map(m => m.id === memberId ? data : m));
    return true;
  }, [gymId]);

  return { members, loading, error, addMember, linkFingerprint, refetch: fetchMembers };
}
