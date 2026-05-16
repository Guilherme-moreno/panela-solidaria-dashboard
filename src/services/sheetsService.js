import Papa from 'papaparse';

const SHEET_ID = '1TyFVqSn-d-XPDnM9ETJ1kxzEwRmPQa45upbxwTcwCRc';

const SHEETS = {
  externos: '283184186',
};

function csvUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
}

function parseValor(raw) {
  if (!raw) return 0;
  const cleaned = String(raw)
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseQuantidade(raw) {
  if (!raw) return 0;
  const num = parseInt(String(raw).trim(), 10);
  return isNaN(num) ? 0 : num;
}

async function fetchSheet(gid) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvUrl(gid), {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

export async function fetchExternos() {
  const rows = await fetchSheet(SHEETS.externos);
  return rows.map((row) => ({
    data: row['Data']?.trim() || '',
    filho: row['Filho (a)']?.trim() || '',
    comprador: row['Comprador']?.trim() || '',
    tipo: row['Tipo']?.trim() || '',
    quantidade: parseQuantidade(row['Quantidade']),
    valor: parseValor(row['Valor']),
    observacao: row['Observação']?.trim() || '',
  }));
}
