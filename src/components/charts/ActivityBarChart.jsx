import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ActivityBarChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        No workout activity logged for this period.
      </div>
    );
  }

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
          <p style={{ fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{label}</p>
          <p style={{ color: 'var(--color-primary)', margin: '0.2rem 0 0 0' }}>
            Duration: <strong>{payload[0].value} mins</strong>
          </p>
          {payload[1] && (
            <p style={{ color: 'var(--color-accent-coral)', margin: '0.2rem 0 0 0' }}>
              Calories: <strong>{payload[1].value} kcal</strong>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '230px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDF2EE" vertical={false} />
          <XAxis dataKey="day" stroke="#89939E" fontSize={12} tickLine={false} />
          <YAxis stroke="#89939E" fontSize={12} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
