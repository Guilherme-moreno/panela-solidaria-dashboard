const NAV_ITEMS = [
  {
    id: 'feijoada',
    label: 'Feijoada de Ogum',
    icon: (
      <svg className="i" viewBox="0 0 24 24">
        <path d="M4 10h16M5 10v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6M8 10V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M9 4c0 1 1 1 1 2M13 3c0 1 1 1 1 2"/>
      </svg>
    ),
  },
  {
    id: 'agasalho',
    label: 'Campanha do Agasalho',
    icon: (
      <svg className="i" viewBox="0 0 24 24">
        <path d="M4 7l4-3 2 2h4l2-2 4 3-2 4h-2v9H8v-9H6L4 7z"/>
      </svg>
    ),
  },
  {
    id: 'restrito',
    label: 'Restrito',
    locked: true,
    icon: (
      <svg className="i" viewBox="0 0 24 24">
        <rect x="4" y="11" width="16" height="9" rx="2"/>
        <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
      </svg>
    ),
  },
];

export function Sidebar({ isOpen, onClose, activeScreen, onNavigate, lockBadgeLabel }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div className="brand">
          <div className="brand-mark" style={{ backgroundImage: "url('/assets/logo-panela-solidaria.png')" }} />
          <div className="brand-text">
            <span className="t1">Panela Solidária</span>
            <span className="t2">Aldeia Luz de Umbanda</span>
          </div>
        </div>
        <button className="sidebar-close" onClick={onClose} aria-label="Fechar painel">←</button>
      </div>

      <nav className="nav">
        <span className="nav-label">Painéis</span>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${activeScreen === item.id ? 'active' : ''}${item.locked ? ' locked' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="ico">{item.icon}</span>
            {item.label}
            {item.locked && (
              <span className="badge-lock">{lockBadgeLabel ?? 'Login'}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="salve">
          <div className="salve-row">
            <span className="sg sg-mm">✦</span>
            <span>Salve, <b>Maria Mulambo</b>, Senhora das encruzilhadas!</span>
          </div>
        </div>
        <div className="foot-meta">
          Painel mantido pela <a href="#">Aldeia Luz de Umbanda</a>.<br />
          <span style={{ opacity: .6 }}>v3 · maio 2026</span>
        </div>
      </div>
    </aside>
  );
}
