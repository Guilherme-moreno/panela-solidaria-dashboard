import { useState, useEffect } from 'react';
import { fetchExternos } from '../services/sheetsService';

export function useSheetData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchExternos();
      setData(rows);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Não foi possível carregar a planilha. Verifique se ela está pública.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, reload: load, lastUpdated };
}
