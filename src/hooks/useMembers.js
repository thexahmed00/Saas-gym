import { useState } from 'react';
import { SEED_MEMBERS } from '../data/seedData';

/*
 * useMembers encapsulates all member state.
 * To migrate to Supabase/Firebase, replace useState with your
 * async data-fetching layer and expose the same { members, addMember } API.
 */
export function useMembers() {
  const [members, setMembers] = useState(SEED_MEMBERS);

  function addMember({ name, phone, plan }) {
    const nextId = members.length + 1;
    const fingerprintId = `FP-${String(nextId).padStart(3, '0')}`;
    const joinDate = new Date().toISOString().split('T')[0];
    const durationMap = { daily: 1, monthly: 30, quarterly: 90, annual: 365 };
    const exp = new Date();
    exp.setDate(exp.getDate() + (durationMap[plan] ?? 30));
    const expiryDate = exp.toISOString().split('T')[0];

    setMembers(prev => [
      ...prev,
      { id: nextId, name, phone, plan, fingerprintId, joinDate, expiryDate },
    ]);
  }

  return { members, addMember };
}
