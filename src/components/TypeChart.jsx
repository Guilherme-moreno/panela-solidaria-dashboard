import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatBRL } from '../utils/parseData';

const COLORS = {
  'Doação': '#2D6A4F',
  'Retirada': '#D62839',
  'Consumo na casa': '#F48C06',
  'Confirmar': '#9CA3AF',
  'Corrente - consumo': '#60A5FA',
};

const DEFAULT_COLORS = ['#E85D04', '#F48C06', '#FAA307', '#FFBA08', '#60A5FA'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }}>{formatBRL(payload[0].value)}</p>
    </div>
  );
}

export function TypeChart({ data }) {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-700 mb-4">Distribuição por Tipo</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="tipo"
            cx="50%"
            cy="45%"
            outerRadius={100}
            label={({ tipo, percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={COLORS[entry.tipo] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
