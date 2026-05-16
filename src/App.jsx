import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { FeijoadaScreen } from './screens/FeijoadaScreen';
import { AgasalhoScreen } from './screens/AgasalhoScreen';
import { RestritoScreen } from './screens/RestritoScreen';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('feijoada');
  const [authedRestrito, setAuthedRestrito] = useState(false);

  function navigate(screen) {
    setActiveScreen(screen);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openSidebar() {
    setSidebarOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    setSidebarOpen(false);
    document.body.style.overflow = '';
  }

  const lockBadge = authedRestrito ? 'Ativo' : 'Login';

  return (
    <>
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={closeSidebar}
      />

      <MobileHeader onOpenSidebar={openSidebar} />

      <div className="app">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          activeScreen={activeScreen}
          onNavigate={navigate}
          lockBadgeLabel={lockBadge}
        />

        <main className="main">
          {activeScreen === 'feijoada'  && <FeijoadaScreen />}
          {activeScreen === 'agasalho'  && <AgasalhoScreen />}
          {activeScreen === 'restrito'  && <RestritoScreen onAuthChange={setAuthedRestrito} />}
        </main>
      </div>
    </>
  );
}
