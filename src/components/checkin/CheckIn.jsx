import FingerprintScanner from './FingerprintScanner';
import CheckInLog from './CheckInLog';

export default function CheckIn({ scanState, scanResult, checkInLog, onScan }) {
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
          BIOMETRIC CHECK-IN
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
          Morpho MSO 1300 E3 · Fingerprint verification
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '28px',
        alignItems: 'start',
      }}>
        {/* Scanner panel */}
        <div style={{
          background: '#111118',
          border: '1px solid #1e1e2e',
          borderRadius: '16px',
          padding: '48px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '420px',
        }}>
          <FingerprintScanner
            scanState={scanState}
            scanResult={scanResult}
            onScan={onScan}
          />
        </div>

        {/* Log panel */}
        <div style={{ minHeight: '420px' }}>
          <CheckInLog log={checkInLog} />
        </div>
      </div>
    </div>
  );
}
