import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { memberStatus } from '../utils/dateUtils';

/*
 * Scanner state machine: idle → scanning → success|denied|notFound → idle
 *
 * Electron mode: window.electronAPI present → IPC to main process → Morpho SDK
 * Browser mode: simulateScan() timeout fallback for Mac dev
 *
 * Compatible SDK ecosystem: Morpho MSO 1300 series (STQC certified),
 * also works with Mantra / Startek / Precision ISO-template fingerprints.
 */

export const SCAN_STATES = {
  IDLE:      'idle',
  SCANNING:  'scanning',
  SUCCESS:   'success',
  DENIED:    'denied',
  NOT_FOUND: 'notFound',
};

const SCAN_DURATION_MS = 2200;
const RESET_DELAY_MS   = 3000;

// PostgREST-aliased select for the join. Returns:
//   { id, timestamp, member: { id, name, plan, fingerprintId } }
const LOG_SELECT =
  'id, timestamp, member:members(id, name, plan, fingerprintId:fingerprint_id)';

export function useCheckIn(members, gymId) {
  const [scanState,  setScanState]  = useState(SCAN_STATES.IDLE);
  const [scanResult, setScanResult] = useState(null);
  const [checkInLog, setCheckInLog] = useState([]);

  // Load today's log on mount + when gym changes.
  const fetchTodayLog = useCallback(async () => {
    if (!gymId) { setCheckInLog([]); return; }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('check_ins')
      .select(LOG_SELECT)
      .eq('gym_id', gymId)
      .gte('timestamp', startOfDay.toISOString())
      .order('timestamp', { ascending: false });

    if (!error && data) {
      setCheckInLog(data.map(row => ({ ...row, timestamp: new Date(row.timestamp) })));
    }
  }, [gymId]);

  useEffect(() => { fetchTodayLog(); }, [fetchTodayLog]);

  const resolveScan = useCallback(async (member) => {
    if (!member) {
      setScanState(SCAN_STATES.NOT_FOUND);
      setScanResult({ reason: 'Fingerprint not registered' });
      return;
    }

    if (memberStatus(member.expiryDate) === 'expired') {
      setScanState(SCAN_STATES.DENIED);
      setScanResult({ member, reason: 'Membership expired' });
      return;
    }

    setScanState(SCAN_STATES.SUCCESS);
    setScanResult({ member });

    if (!gymId) return;

    const { data, error } = await supabase
      .from('check_ins')
      .insert({ gym_id: gymId, member_id: member.id })
      .select(LOG_SELECT)
      .single();

    if (!error && data) {
      setCheckInLog(prev => [{ ...data, timestamp: new Date(data.timestamp) }, ...prev]);
    }
  }, [gymId]);

  // Electron IPC: register scan result listener, re-register when members/resolveScan change.
  useEffect(() => {
    if (!window.electronAPI) return;
    const cleanup = window.electronAPI.onScanResult(({ type, fingerprintId }) => {
      const member = fingerprintId
        ? members.find(m => m.fingerprintId === fingerprintId) ?? null
        : null;
      resolveScan(type === 'notFound' ? null : member);
      setTimeout(() => {
        setScanState(SCAN_STATES.IDLE);
        setScanResult(null);
      }, RESET_DELAY_MS);
    });
    return cleanup;
  }, [members, resolveScan]);

  const simulateScan = useCallback(() => {
    if (scanState !== SCAN_STATES.IDLE) return;
    setScanState(SCAN_STATES.SCANNING);
    setScanResult(null);

    if (window.electronAPI) {
      // Electron: main process drives the scan, result arrives via onScanResult listener
      window.electronAPI.startScan();
      return;
    }

    // Browser fallback simulation
    setTimeout(() => {
      const roll = Math.random();
      const activeMembers  = members.filter(m => memberStatus(m.expiryDate) !== 'expired');
      const expiredMembers = members.filter(m => memberStatus(m.expiryDate) === 'expired');

      if (roll < 0.65 && activeMembers.length > 0) {
        resolveScan(activeMembers[Math.floor(Math.random() * activeMembers.length)]);
      } else if (roll < 0.80 && expiredMembers.length > 0) {
        resolveScan(expiredMembers[Math.floor(Math.random() * expiredMembers.length)]);
      } else {
        resolveScan(null);
      }

      setTimeout(() => {
        setScanState(SCAN_STATES.IDLE);
        setScanResult(null);
      }, RESET_DELAY_MS);
    }, SCAN_DURATION_MS);
  }, [scanState, members, resolveScan]);

  return { scanState, scanResult, checkInLog, simulateScan };
}
