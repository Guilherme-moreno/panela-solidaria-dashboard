import Papa from 'papaparse';
import { parseValor } from '../utils/formatters';

const SHEETS_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkAt8JeuFvMilnNuUVf9EPZ82KJAPSqqbHl10GKSCSuD02TkkF5a8CRr2yYSD7Hg/pub';

function buildUrl() {
  const bust = Date.now() + '_' + Math.random().toString(36).slice(2);
  return `${SHEETS_BASE}?gid=1264987466&output=csv&cachebust=${bust}`;
}

export function fetchFeijoadaCSV() {
  return new Promise((resolve, reject) => {
    Papa.parse(buildUrl(), {
      download: true,
      skipEmptyLines: true,
      complete({ data: allRows }) {
        try {
          resolve(parseAllRows(allRows));
        } catch (e) {
          reject(e);
        }
      },
      error(err) {
        reject(new Error(err.message || 'Erro ao baixar planilha'));
      },
    });
  });
}

function parseAllRows(allRows) {
  const eventTitle = (allRows[0]?.[0] ?? '').trim();
  const headerIdx  = allRows.findIndex(r => r[0]?.trim() === 'Data');
  const startIdx   = headerIdx >= 0 ? headerIdx + 1 : 3;

  const rows = allRows
    .slice(startIdx)
    .filter(r => r.length >= 5 && r[0] && r[3])
    .map(r => ({
      data:       r[0].trim(),
      filho:      (r[1] ?? '').trim(),
      comprador:  (r[2] ?? '').trim(),
      tipo:       (r[3] ?? '').trim(),
      quantidade: parseInt(r[4]) || 0,
      valor:      parseValor(r[5] ?? ''),
      obs:        (r[6] ?? '').trim(),
    }))
    .filter(r => r.quantidade > 0 && r.tipo);

  return { eventTitle, rows };
}
