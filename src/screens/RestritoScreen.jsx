import { useState } from 'react';

const CREDS = { user: 'dirigente', pass: 'aldeia2026' };

export function RestritoScreen() {
  const [authed, setAuthed] = useState(() => {
    try { return !!sessionStorage.getItem('panela_auth'); } catch { return false; }
  });
  const [who, setWho] = useState(() => {
    try { return sessionStorage.getItem('panela_auth') || ''; } catch { return ''; }
  });
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    if (user.trim().toLowerCase() === CREDS.user && pass === CREDS.pass) {
      setErr('');
      setAuthed(true);
      setWho(user.trim().toLowerCase());
      try { sessionStorage.setItem('panela_auth', user.trim().toLowerCase()); } catch {}
    } else {
      setErr('Usuário ou senha incorretos. Tente novamente.');
      setPass('');
    }
  }

  function handleLogout() {
    setAuthed(false);
    setWho('');
    setUser('');
    setPass('');
    try { sessionStorage.removeItem('panela_auth'); } catch {}
  }

  if (!authed) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <div className="seal" style={{ backgroundImage: "url('/assets/logo-panela-solidaria.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          <h2 className="serif">Área Restrita</h2>
          <p>Acesso reservado a dirigentes e coordenação da Panela Solidária.</p>
          <form onSubmit={handleLogin} noValidate>
            <div className="field">
              <label htmlFor="userInput">Usuário</label>
              <input
                id="userInput"
                type="text"
                autoComplete="username"
                placeholder="ex: dirigente"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="passInput">Senha</label>
              <input
                id="passInput"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
            </div>
            {err && <div className="err">{err}</div>}
            <button className="btn" type="submit" style={{ marginTop: 8 }}>
              <svg className="i i-lg" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M4 12h11M20 4v16"/></svg>
              Entrar
            </button>
          </form>
          <div className="hint">Demo · usuário <b>dirigente</b> · senha <b>aldeia2026</b></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button className="btn ghost" onClick={handleLogout} style={{ width: 'auto', padding: '8px 14px', position: 'absolute', top: 0, right: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <svg className="i" viewBox="0 0 24 24"><path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M10 12h11l-3-3M21 12l-3 3"/></svg>
        Sair
      </button>
      <div className="topbar">
        <div>
          <h1 className="page-title serif">Visão <span className="accent">consolidada</span></h1>
          <p className="page-sub">Dados financeiros, custos e despesas dos projetos. Conteúdo confidencial.</p>
        </div>
        <div className="topbar-right">
          <div className="meta-pill" style={{ background: 'var(--green-800)', color: '#f4e7d2', borderColor: 'var(--green-700)' }}>
            <svg className="i" viewBox="0 0 24 24" style={{ color: 'var(--gold-soft)' }}>
              <rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
            Sessão autenticada · {who}
          </div>
        </div>
      </div>
      <div className="restricted-grid">
        <div className="stat-pill">
          <div className="lb">Receita bruta (2026)</div>
          <div className="vl">—</div>
          <div className="sb">Dados em breve</div>
        </div>
        <div className="stat-pill">
          <div className="lb">Custos de produção</div>
          <div className="vl">—</div>
          <div className="sb">Dados em breve</div>
        </div>
        <div className="stat-pill">
          <div className="lb">Resultado líquido</div>
          <div className="vl">—</div>
          <div className="sb">Dados em breve</div>
        </div>
      </div>
      <div className="divider">
        <span className="em">⚜ <b>Confidencial</b> · conselho da casa ⚜</span>
      </div>
    </div>
  );
}
