export const MONTH_NUM = { jan:1,fev:2,mar:3,abr:4,mai:5,jun:6,jul:7,ago:8,set:9,out:10,nov:11,dez:12 };
export const MONTH_LABEL = { jan:'Jan',fev:'Fev',mar:'Mar',abr:'Abr',mai:'Mai',jun:'Jun',jul:'Jul',ago:'Ago',set:'Set',out:'Out',nov:'Nov',dez:'Dez' };

export const fmtBR = n => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtN  = n => n.toLocaleString('pt-BR');
export const pct   = (a, b) => b ? Math.round(a / b * 100) : 0;

export function parseValor(str) {
  if (!str) return 0;
  const c = str.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(c) || 0;
}

export function normDate(str) {
  if (!str) return '';
  str = str.trim().replace(/\.$/, '');
  const [day, month] = str.split(/[-\/]/);
  if (!day || !month) return str;
  return day.trim().padStart(2, '0') + '/' + month.trim().toLowerCase();
}

export function dateSortKey(d) {
  const [day, mon] = d.split('/');
  return (MONTH_NUM[mon] || 0) * 100 + parseInt(day);
}

export function fmtDateLabel(d) {
  const [day, mon] = d.split('/');
  return parseInt(day) + ' ' + (MONTH_LABEL[mon] || mon);
}
