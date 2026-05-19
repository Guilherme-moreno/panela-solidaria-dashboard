export function AgasalhoScreen() {
  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title serif">Campanha <span className="accent">do Agasalho</span></h1>
          <p className="page-sub">Arrecadação de roupas, cobertores e calçados para distribuição às famílias atendidas pelo terreiro durante o inverno.</p>
        </div>
        <div className="topbar-right">
          <div className="meta-pill">
            <span className="dot" />
            Em andamento · meta jul 2026
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><path d="M4 7l4-3 2 2h4l2-2 4 3-2 4h-2v9H8v-9H6L4 7z"/></svg>
          </div>
          <div className="label">Total arrecadado</div>
          <div className="value">0<span className="unit">peças</span></div>
          <span className="trend flat">Dados em breve</span>
        </div>
        <div className="kpi green">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-7 11-7 11z" transform="translate(-2 0)"/></svg>
          </div>
          <div className="label">Famílias beneficiadas</div>
          <div className="value">0</div>
          <span className="trend flat">Dados em breve</span>
        </div>
        <div className="kpi gold">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          </div>
          <div className="label">Dias de campanha</div>
          <div className="value">0</div>
          <span className="trend flat">Encerra 31 jul</span>
        </div>
        <div className="kpi">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>
          </div>
          <div className="label">Pontos de coleta</div>
          <div className="value">0</div>
          <span className="trend flat">A definir</span>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="panel-head">
          <div>
            <h3>Arrecadação por categoria</h3>
            <div className="sub">Dados serão atualizados conforme a campanha avançar</div>
          </div>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 0', textAlign: 'center' }}>
          Nenhum dado disponível ainda.
        </div>
      </div>

      <div className="divider">
        <span className="em">✦ <b>Que ninguém sinta frio</b> · amor da Aldeia ✦</span>
      </div>
    </div>
  );
}
