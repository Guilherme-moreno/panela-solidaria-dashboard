import { useState } from 'react';
import { formatBRL } from '../utils/parseData';

const TIPO_STYLE = {
  'Doação': 'bg-green-100 text-green-700',
  'Retirada': 'bg-red-100 text-red-700',
  'Consumo na casa': 'bg-amber-100 text-amber-700',
  'Confirmar': 'bg-gray-100 text-gray-600',
  'Corrente - consumo': 'bg-blue-100 text-blue-700',
};

export function TransactionsTable({ data }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.comprador.toLowerCase().includes(q) ||
      r.filho.toLowerCase().includes(q) ||
      r.tipo.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-700">
          Todas as Transações
          <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
        </h2>
        <input
          type="text"
          placeholder="Buscar por doador, responsável ou tipo..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:border-orange-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-2 pr-4 font-medium text-gray-500">Data</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">Doador</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">Responsável</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">Tipo</th>
              <th className="pb-2 pr-4 font-medium text-gray-500 text-right">Qtd</th>
              <th className="pb-2 font-medium text-gray-500 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">{row.data}</td>
                <td className="py-2.5 pr-4 text-gray-800 font-medium">{row.comprador || '—'}</td>
                <td className="py-2.5 pr-4 text-gray-600">{row.filho || '—'}</td>
                <td className="py-2.5 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_STYLE[row.tipo] || 'bg-gray-100 text-gray-600'}`}>
                    {row.tipo}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-gray-600 text-right">{row.quantidade || '—'}</td>
                <td className={`py-2.5 text-right font-semibold ${row.tipo === 'Retirada' ? 'text-red-600' : 'text-green-700'}`}>
                  {row.valor ? formatBRL(row.valor) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
