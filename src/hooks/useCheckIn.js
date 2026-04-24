import { useState, useCallback } from 'react';
import { memberStatus } from '../utils/dateUtils';

/*
 * Scanner state machine: idle → scanning → success|denied|notFound → idle
 *
 * REAL INTEGRATION NOTE:
 * Replace simulateScan() with a WebSocket or polling handler that connects
 * to a local Node.js bridge running the MorphoKit SDK (MorphoSmart MSO 1300 E3).
 * The bridge should emit events like: { type: 'scan', fingerprintId: 'FP-001' }
 * Pass that fingerprintId into resolveScan() below instead of the random simulation.
 *
 * Compatible SDK ecosystem: Morpho MSO 1300 series (STQC certified),
 * also works with Mantra / Startek / Precision ISO-template fingerprints.
 */

export const SCAN_STATES = {
  IDLE: 'idle',
  SCANNING: 'scanning',
  SUCCESS: 'success',
  DENIED: 'denied',
  NOT_FOUND: 'notFound',
};

const SCAN_DURATION_MS = 2200;
const RESET_DELAY_MS   = 3000;

export function useCheckIn(members) {
  const [scanState, setScanState] = useState(SCAN_STATES.IDLE);
  const [scanResult, setScanResult] = useState(null); // { member, reason }
  const [checkInLog, setCheckInLog] = useState([]);

  const resolveScan = useCallback((member) => {
    if (!member) {
      setScanState(SCAN_STATES.NOT_FOUND);
      setScanResult({ reason: 'Fingerprint not registered' });
      return;
    }

    const status = memberStatus(member.expiryDate);
    if (status === 'expired') {
      setScanState(SCAN_STATES.DENIED);
      setScanResult({ member, reason: 'Membership expired' });
      return;
    }

    setScanState(SCAN_STATES.SUCCESS);
    setScanResult({ member });
    setCheckInLog(prev => [
      { id: Date.now(), member, timestamp: new Date() },
      ...prev,
    ]);
  }, []);

  const simulateScan = useCallback(() => {
    if (scanState !== SCAN_STATES.IDLE) return;
    setScanState(SCAN_STATES.SCANNING);
    setScanResult(null);

    setTimeout(() => {
      const roll = Math.random();
      const activeMembers  = members.filter(m => memberStatus(m.expiryDate) !== 'expired');
      const expiredMembers = members.filter(m => memberStatus(m.expiryDate) === 'expired');

      if (roll < 0.65 && activeMembers.length > 0) {
        // 65 % — success
        resolveScan(activeMembers[Math.floor(Math.random() * activeMembers.length)]);
      } else if (roll < 0.80 && expiredMembers.length > 0) {
        // 15 % — denied (expired member)
        resolveScan(expiredMembers[Math.floor(Math.random() * expiredMembers.length)]);
      } else {
        // 20 % — not found
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
