import { useEffect } from 'react';

const menuItems = [
  { icon: '📊', label: 'Visão Geral', id: 'stats' },
  { icon: '📈', label: 'Gráficos', id: 'charts' },
  { icon: '💳', label: 'Transações', id: 'transactions' },
];

export function Sidebar({ isOpen, onClose, onReload, loading, lastUpdated }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    onClose();
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-orange-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <span className="font-bold text-white text-base">Painel</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-400 hover:bg-orange-300 text-white transition-colors text-lg font-bold"
            aria-label="Fechar painel"
          >
            ←
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Navegação
          </p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 active:bg-orange-100 transition-colors text-sm font-medium w-full text-left"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Ações
            </p>
            <button
              onClick={() => { onReload(); onClose(); }}
              disabled={loading}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 active:bg-orange-100 transition-colors text-sm font-medium w-full text-left disabled:opacity-50"
            >
              <span className={`text-base ${loading ? 'animate-spin inline-block' : ''}`}>🔄</span>
              Atualizar Dados
            </button>
          </div>
        </nav>

        {lastUpdated && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              Última atualização
            </p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">
              {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
