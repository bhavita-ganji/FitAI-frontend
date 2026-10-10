import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const WeightTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        No weight records available. Set your target weight in Profile.
      </div>
    );
  }

  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: typeof d.date === 'string' ? d.date.substring(5) : d.date,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '0.65rem 0.9rem',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          fontSize: '0.8rem',
        }}>
          <p style={{ fontWeight: 700, margin: 0 }}>Date: {label}</p>
          <p style={{ color: 'var(--color-accent-teal)', margin: '0.2rem 0 0 0' }}>
            Weight: <strong>{payload[0].value} kg</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDF2EE" vertical={false} />
          <XAxis dataKey="formattedDate" stroke="#89939E" fontSize={11} tickLine={false} />
          <YAxis stroke="#89939E" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke="var(--color-primary-light)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--color-primary)' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
