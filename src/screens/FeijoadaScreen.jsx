import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useFeijoadaData } from '../hooks/useFeijoadaData';
import { fmtBR, fmtN, pct, fmtDateLabel, MONTH_LABEL } from '../utils/formatters';

const COLORS = { Doação: '#c79a44', Retirada: '#9a5226', Entrega: '#2d7a3e' };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#3a1d0a', border: '1px solid #c79a44', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f0e7d3', fontFamily: 'Manrope, sans-serif' }}>
      <p style={{ fontWeight: 600, marginBottom: 4, margin: '0 0 4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill ?? p.color, margin: '2px 0' }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

function RefreshBtn({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--green-700)', color: '#fff', padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'background .15s', opacity: loading ? .6 : 1 }}
    >
      <span style={loading ? { display: 'inline-block', animation: 'spin .8s linear infinite' } : {}}>↻</span>
      {loading ? 'Atualizando…' : 'Atualizar'}
    </button>
  );
}

export function FeijoadaScreen() {
  const { loading, error, eventTitle, data, lastUpdated, reload } = useFeijoadaData();

  const eventDate = eventTitle?.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ?? '—';
  const updatedAt = lastUpdated
    ? lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  const totalLinhas = data
    ? Object.values(data.byDate).reduce((s, d) => s + d.total, 0)
    : null;

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title serif">Feijoada <span className="accent">de Ogum</span></h1>
          <p className="page-sub">Pré-vendas consolidadas para a feijoada em homenagem ao Senhor Ogum. Cada prato vendido alimenta a casa e a comunidade.</p>
        </div>
        <div className="topbar-right">
          <div className="meta-pill">
            <span className="dot" />
            Evento: {eventDate} · Pré-venda
          </div>
          <div className="meta-pill" style={{ gap: 6, flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11 }}>
              <svg className="i" viewBox="0 0 24 24" style={{ opacity: .5, verticalAlign: 'middle', marginRight: 4 }}>
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
              Buscado às {updatedAt}
            </span>
            {totalLinhas !== null && (
              <span style={{ fontSize: 10, opacity: .7 }}>
                {loading ? '⟳ buscando...' : `${totalLinhas} pratos na planilha`}
              </span>
            )}
          </div>
          <RefreshBtn loading={loading} onClick={reload} />
        </div>
      </div>

      {data && !loading && (
        <div style={{ background: '#e3f0e6', border: '1px solid #b0d4ba', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#1f5a35', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✓</span>
          <span>Dados da planilha carregados às {updatedAt} · atualização automática a cada 30 min</span>
        </div>
      )}

      {loading && !data && (
        <div className="loading-state">
          <div className="spinner" /> Carregando dados…
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', color: 'var(--red)', padding: '40px 20px' }}>
          Erro ao carregar dados: {error}.<br />
          <small style={{ color: 'var(--muted)' }}>
            Verifique se a planilha está <b>publicada na web</b> (Arquivo → Compartilhar → Publicar na web → CSV).
          </small>
        </div>
      )}

      {data && <FeijoadaContent data={data} />}

      <div className="divider">
        <span className="em">⚔ <b>Saravá, Senhor Ogum</b> · da panela vem o axé ⚔</span>
      </div>
    </div>
  );
}

function FeijoadaContent({ data }) {
  const { totalPratos, totalValor, pratosDoacao, pratosRetirada, pratosEntrega, byDate, dateKeys } = data;

  const mediaDia = dateKeys.length ? totalValor / dateKeys.length : 0;

  const barData = dateKeys.map(dk => ({
    date: fmtDateLabel(dk),
    Doação: byDate[dk].doacao,
    'Retirar/Entregar': byDate[dk].retirada + byDate[dk].entrega,
  }));

  const pieData = [
    { name: 'Doação',   value: pratosDoacao,   fill: COLORS.Doação },
    { name: 'Retirar',  value: pratosRetirada, fill: COLORS.Retirada },
    { name: 'Entregar', value: pratosEntrega,  fill: COLORS.Entrega },
  ].filter(d => d.value > 0);

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><path d="M4 10h16M5 10v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6"/></svg>
          </div>
          <div className="label">Pratos vendidos</div>
          <div className="value">{fmtN(totalPratos)}<span className="unit">pratos</span></div>
          <span className="trend flat">{dateKeys.length} dias de pré-venda</span>
        </div>
        <div className="kpi green">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><path d="M12 3v18M7 7h7.5a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5H17"/></svg>
          </div>
          <div className="label">Valor arrecadado</div>
          <div className="value">{fmtBR(totalValor)}</div>
          <span className="trend flat">Média {fmtBR(mediaDia)}/dia</span>
        </div>
        <div className="kpi gold">
          <div className="ico-bg">
            <svg className="i i-lg" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div className="label">Para doação</div>
          <div className="value">{fmtN(pratosDoacao)}<span className="unit">pratos</span></div>
          <span className="trend flat">{pct(pratosDoacao, totalPratos)}% do total</span>
        </div>
        <div className="kpi">
          <div className="label">Para retirar / entregar</div>
          <div className="value">{fmtN(pratosRetirada + pratosEntrega)}<span className="unit">pratos</span></div>
          <span className="trend flat">{pct(pratosRetirada + pratosEntrega, totalPratos)}% do total</span>
        </div>
      </div>

      <div className="row">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Pré-vendas por dia</h3>
              <div className="sub">Doação · Retirada · Entrega</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe5d2" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#7a6451', fontSize: 11, fontFamily: 'Manrope' }} />
              <YAxis tick={{ fill: '#7a6451', fontSize: 11, fontFamily: 'Manrope' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#7a6451', fontFamily: 'Manrope', paddingTop: 8 }} />
              <Bar dataKey="Doação"           stackId="a" fill={COLORS.Doação}   radius={[0,0,0,0]} />
              <Bar dataKey="Retirar/Entregar" stackId="a" fill={COLORS.Retirada} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Destino dos pratos</h3>
              <div className="sub">Acumulado · pré-venda</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius="55%" outerRadius="75%" paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="#fff" strokeWidth={3} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#7a6451', fontFamily: 'Manrope', paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="panel-head">
          <div>
            <h3>Vendas por data</h3>
            <div className="sub">Resumo diário · pré-venda</div>
          </div>
        </div>
        <div style={{ overflow: 'auto', borderRadius: 10, border: '1px solid var(--line)' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Data</th>
                <th className="num">Doação</th>
                <th className="num">Retirada</th>
                <th className="num">Entrega</th>
                <th className="num">Total do dia</th>
                <th className="num">Valor</th>
              </tr>
            </thead>
            <tbody>
              {dateKeys.map(dk => {
                const row = byDate[dk];
                const [day, mon] = dk.split('/');
                const monLabel = (MONTH_LABEL[mon] || mon).toUpperCase();
                return (
                  <tr key={dk}>
                    <td>
                      <div className="ev">
                        <div className="dt">
                          <s>{monLabel}</s>
                          <b>{parseInt(day)}</b>
                        </div>
                        <div className="nm">
                          Vendas do dia
                          <small>{fmtDateLabel(dk)}</small>
                        </div>
                      </div>
                    </td>
                    <td className="num">{fmtN(row.doacao)}</td>
                    <td className="num">{fmtN(row.retirada)}</td>
                    <td className="num">{fmtN(row.entrega)}</td>
                    <td className="num strong">{fmtN(row.total)}</td>
                    <td className="num strong">{fmtBR(row.valor)}</td>
                  </tr>
                );
              })}
              <tr className="tot-row">
                <td>Total</td>
                <td className="num">{fmtN(pratosDoacao)}</td>
                <td className="num">{fmtN(pratosRetirada)}</td>
                <td className="num">{fmtN(pratosEntrega)}</td>
                <td className="num">{fmtN(totalPratos)}</td>
                <td className="num">{fmtBR(totalValor)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
