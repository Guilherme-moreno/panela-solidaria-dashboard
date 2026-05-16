import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { formatBRL } from '../utils/parseData';

const COLORS = ['#E85D04', '#F48C06', '#FAA307', '#FFBA08', '#E76F51', '#F4A261', '#E9C46A'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800">{payload[0].payload.filho}</p>
      <p className="text-orange-600">{formatBRL(payload[0].value)}</p>
    </div>
  );
}

export function FilhosChart({ data }) {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-700 mb-4">Arrecadação por Responsável</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="filho"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
