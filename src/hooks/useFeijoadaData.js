import { useState, useEffect, useCallback } from 'react';
import { fetchFeijoadaCSV } from '../services/sheetsService';
import { normDate, dateSortKey } from '../utils/formatters';

function processData(rows) {
  const totalPratos    = rows.reduce((s, r) => s + r.quantidade, 0);
  const totalValor     = rows.reduce((s, r) => s + r.valor, 0);
  const pratosDoacao   = rows.filter(r => r.tipo === 'Doação').reduce((s, r) => s + r.quantidade, 0);
  const pratosRetirada = rows.filter(r => r.tipo === 'Retirada').reduce((s, r) => s + r.quantidade, 0);
  const pratosEntrega  = rows.filter(r => r.tipo === 'Entrega').reduce((s, r) => s + r.quantidade, 0);

  const byDate = {};
  rows.forEach(r => {
    const d = normDate(r.data);
    if (!d) return;
    if (!byDate[d]) byDate[d] = { doacao: 0, retirada: 0, entrega: 0, total: 0, valor: 0 };
    byDate[d].total   += r.quantidade;
    byDate[d].valor   += r.valor;
    if (r.tipo === 'Doação')   byDate[d].doacao   += r.quantidade;
    if (r.tipo === 'Retirada') byDate[d].retirada += r.quantidade;
    if (r.tipo === 'Entrega')  byDate[d].entrega  += r.quantidade;
  });

  const dateKeys = Object.keys(byDate).sort((a, b) => dateSortKey(a) - dateSortKey(b));
  return { totalPratos, totalValor, pratosDoacao, pratosRetirada, pratosEntrega, byDate, dateKeys };
}

export function useFeijoadaData() {
  const [state, setState] = useState({ loading: true, error: null, eventTitle: '', data: null, lastUpdated: null });

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { eventTitle, rows } = await fetchFeijoadaCSV();
      const data = processData(rows);
      setState({ loading: false, error: null, eventTitle, data, lastUpdated: new Date() });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e.message }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
