import Sidebar from './Sidebar';

export default function Layout({ activePage, onNavigate, deviceConnected, children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: '#0a0a0f',
    }}>
      <Sidebar active={activePage} onNavigate={onNavigate} deviceConnected={deviceConnected} />

      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 36px',
      }}>
        {children}
      </main>
    </div>
  );
}
