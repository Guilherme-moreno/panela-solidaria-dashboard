import { useState } from 'react';
import { useSheetData } from './hooks/useSheetData';
import { calcStats, groupByFilho, groupByTipo, formatBRL } from './utils/parseData';
import { StatCard } from './components/StatCard';
import { FilhosChart } from './components/FilhosChart';
import { TypeChart } from './components/TypeChart';
import { TransactionsTable } from './components/TransactionsTable';
import { Sidebar } from './components/Sidebar';

function Header({ lastUpdated, onReload, loading, onOpenSidebar }) {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSidebar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 active:bg-orange-700 transition-colors"
          >
            <span className="text-base">☰</span>
            <span>Painel</span>
          </button>
          <div className="hidden sm:flex w-9 h-9 rounded-full bg-orange-500 items-center justify-center text-white text-lg">
            🍲
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">Panela Solidária</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Feijoada 2026 · Dashboard de Doações</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="hidden md:block text-xs text-gray-400">
              Atualizado às {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={onReload}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 active:bg-orange-200 transition-colors disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Carregando dados da planilha...</p>
    </div>
  );
}

function ErrorState({ message, onReload }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
      <div className="text-4xl">⚠️</div>
      <p className="text-gray-700 font-medium">{message}</p>
      <p className="text-gray-400 text-sm max-w-md">
        Certifique-se de que a planilha está configurada como "Qualquer pessoa com o link pode visualizar" no Google Sheets.
      </p>
      <button
        onClick={onReload}
        className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}

export default function App() {
  const { data, loading, error, reload, lastUpdated } = useSheetData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = data.length ? calcStats(data) : null;
  const filhosData = data.length ? groupByFilho(data) : [];
  const tipoData = data.length ? groupByTipo(data) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onReload={reload}
        loading={loading}
        lastUpdated={lastUpdated}
      />

      <Header
        lastUpdated={lastUpdated}
        onReload={reload}
        loading={loading}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {loading && <LoadingState />}

        {error && !loading && <ErrorState message={error} onReload={reload} />}

        {!loading && !error && stats && (
          <>
            <div id="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 scroll-mt-20">
              <StatCard
                label="Total Arrecadado"
                value={formatBRL(stats.totalArrecadado)}
                sub={`${stats.uniqueDoadores} doadores únicos`}
                color="green"
                icon="💚"
              />
              <StatCard
                label="Total Retirado"
                value={formatBRL(stats.totalRetirado)}
                sub="Em retiradas"
                color="red"
                icon="📤"
              />
              <StatCard
                label="Saldo Atual"
                value={formatBRL(stats.saldo)}
                sub={stats.saldo >= 0 ? 'Superávit' : 'Déficit'}
                color={stats.saldo >= 0 ? 'green' : 'red'}
                icon="💰"
              />
              <StatCard
                label="Porções Doadas"
                value={stats.totalPorcoes.toLocaleString('pt-BR')}
                sub="Quantidade total"
                color="orange"
                icon="🍽️"
              />
            </div>

            <div id="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 scroll-mt-20">
              <FilhosChart data={filhosData} />
              <TypeChart data={tipoData} />
            </div>

            <div id="transactions" className="scroll-mt-20">
              <TransactionsTable data={data} />
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        Panela Solidária · Dados atualizados diretamente do Google Sheets
      </footer>
    </div>
  );
}
