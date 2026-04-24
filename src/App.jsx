import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CheckIn from './components/checkin/CheckIn';
import Members from './components/members/Members';
import Plans from './components/plans/Plans';
import { useMembers } from './hooks/useMembers';
import { useCheckIn } from './hooks/useCheckIn';

const PAGES = { dashboard: Dashboard, checkin: CheckIn, members: Members, plans: Plans };

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const { members, loading, error, addMember } = useMembers();
  const { scanState, scanResult, checkInLog, simulateScan } = useCheckIn(members);

  const PageComponent = PAGES[activePage];
  const pageProps = {
    dashboard: { members, checkInLog },
    checkin:   { scanState, scanResult, checkInLog, onScan: simulateScan },
    members:   { members, onAddMember: addMember },
    plans:     { members },
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      deviceConnected={false}
    >
      {loading
        ? <StatusScreen text="Loading from Supabase…" />
        : error
        ? <StatusScreen text={`Connection error: ${error}`} accent />
        : <PageComponent {...pageProps[activePage]} />}
    </Layout>
  );
}

function StatusScreen({ text, accent = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', color: accent ? '#e94560' : '#6b7280',
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '20px', letterSpacing: '0.1em',
    }}>
      {text}
    </div>
  );
}
