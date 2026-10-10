import React from 'react';

export const MacroProgressRing = ({
  calories = 0,
  targetCalories = 2200,
  protein = 0,
  targetProtein = 140,
  carbs = 0,
  targetCarbs = 250,
  fat = 0,
  targetFat = 65,
}) => {
  const calPercent = Math.min(100, Math.round((calories / Math.max(1, targetCalories)) * 100));
  const proteinPercent = Math.min(100, Math.round((protein / Math.max(1, targetProtein)) * 100));
  const carbsPercent = Math.min(100, Math.round((carbs / Math.max(1, targetCarbs)) * 100));
  const fatPercent = Math.min(100, Math.round((fat / Math.max(1, targetFat)) * 100));

  const macros = [
    { name: 'Protein', current: protein, target: targetProtein, percent: proteinPercent, color: '#2D6A4F', unit: 'g' },
    { name: 'Carbs', current: carbs, target: targetCarbs, percent: carbsPercent, color: '#52B788', unit: 'g' },
    { name: 'Fat', current: fat, target: targetFat, percent: fatPercent, color: '#E07A5F', unit: 'g' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Calories Overview Banner */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-sage-light)',
        border: '1px solid rgba(45, 106, 79, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Daily Energy Balance
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {Math.round(calories)}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              / {targetCalories} kcal
            </span>
          </div>
        </div>

        {/* Circular Mini Progress */}
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: `conic-gradient(var(--color-primary) ${calPercent * 3.6}deg, #D4E3D8 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-sage-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.78rem',
            color: 'var(--color-primary)',
          }}>
            {calPercent}%
          </div>
        </div>
      </div>

      {/* Macronutrient Individual Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {macros.map((m) => (
          <div key={m.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                <strong>{Math.round(m.current)}</strong> / {m.target}{m.unit} ({m.percent}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#EDF3EE',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${m.percent}%`,
                height: '100%',
                backgroundColor: m.color,
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
