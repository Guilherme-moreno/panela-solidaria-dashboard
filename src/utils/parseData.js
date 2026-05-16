export function calcStats(data) {
  const doacoes = data.filter((r) => r.tipo === 'Doação');
  const retiradas = data.filter((r) => r.tipo === 'Retirada');

  const totalArrecadado = doacoes.reduce((s, r) => s + r.valor, 0);
  const totalRetirado = retiradas.reduce((s, r) => s + r.valor, 0);
  const saldo = totalArrecadado - totalRetirado;
  const totalPorcoes = doacoes.reduce((s, r) => s + r.quantidade, 0);
  const uniqueDoadores = new Set(doacoes.map((r) => r.comprador).filter(Boolean)).size;

  return { totalArrecadado, totalRetirado, saldo, totalPorcoes, uniqueDoadores };
}

export function groupByFilho(data) {
  const map = {};
  data
    .filter((r) => r.tipo === 'Doação' && r.filho)
    .forEach((r) => {
      map[r.filho] = (map[r.filho] || 0) + r.valor;
    });

  return Object.entries(map)
    .map(([filho, total]) => ({ filho, total }))
    .sort((a, b) => b.total - a.total);
}

export function groupByTipo(data) {
  const map = {};
  data.forEach((r) => {
    if (!r.tipo) return;
    map[r.tipo] = (map[r.tipo] || 0) + r.valor;
  });
  return Object.entries(map).map(([tipo, total]) => ({ tipo, total }));
}

export function groupByData(data) {
  const map = {};
  data
    .filter((r) => r.tipo === 'Doação' && r.data)
    .forEach((r) => {
      map[r.data] = (map[r.data] || 0) + r.valor;
    });
  return Object.entries(map).map(([data, total]) => ({ data, total }));
}

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
