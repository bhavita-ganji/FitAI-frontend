import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export const CalorieTrendChart = ({ data = [], targetCalories = 2200 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        No nutrition history available yet.
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
          <p style={{ color: 'var(--color-primary)', margin: '0.2rem 0 0 0' }}>
            Consumed: <strong>{Math.round(payload[0].value)} kcal</strong>
          </p>
          <p style={{ color: '#89939E', margin: '0.2rem 0 0 0' }}>
            Daily Target: <strong>{targetCalories} kcal</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="calorieColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary-light)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-primary-light)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDF2EE" vertical={false} />
          <XAxis dataKey="formattedDate" stroke="#89939E" fontSize={11} tickLine={false} />
          <YAxis stroke="#89939E" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={targetCalories} stroke="var(--color-accent-coral)" strokeDasharray="4 4" label={{ value: 'Target', fill: '#E07A5F', fontSize: 10, position: 'insideTopRight' }} />
          <Area type="monotone" dataKey="caloriesConsumed" stroke="var(--color-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#calorieColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
