export function MobileHeader({ onOpenSidebar }) {
  return (
    <div className="mobile-header">
      <div className="brand" style={{ gap: 10 }}>
        <div
          className="brand-mark"
          style={{ width: 36, height: 36, flex: '0 0 36px', backgroundImage: "url('/assets/logo-panela-solidaria.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
        />
        <div className="brand-text">
          <span className="t1" style={{ fontSize: 15 }}>Panela Solidária</span>
          <span className="t2" style={{ fontSize: 9 }}>Aldeia Luz de Umbanda</span>
        </div>
      </div>
      <button className="btn-paineis" onClick={onOpenSidebar}>
        <svg style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }} viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        Painéis
      </button>
    </div>
  );
}
