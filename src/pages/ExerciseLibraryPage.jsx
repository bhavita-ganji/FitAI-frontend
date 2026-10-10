import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  Info,
  CheckCircle,
  Dumbbell,
  Home,
  Building2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { workoutApi } from '../api/workoutApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';

// Map movement names to high quality fitness imagery with graceful fallbacks
const EXERCISE_IMAGES = {
  'Barbell Back Squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
  'Flat Barbell Bench Press': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  'Conventional Deadlift': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  'Overhead Shoulder Press': 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=600&q=80',
  'Pull-Ups': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
  'Push-Ups (Standard / Incline)': 'https://images.unsplash.com/photo-1598971457999-ca8ef7d873c5?auto=format&fit=crop&w=600&q=80',
  'Incline Dumbbell Press': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
  'Romanian Deadlift (RDL)': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
  'Dumbbell Goblet Squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
  'Resistance Band Rows': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=600&q=80',
  'Bodyweight Glute Bridge': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
  'Mountain Climbers': 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=600&q=80',
  'HIIT Jump Rope Intervals': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
  'Dumbbell Bicep Curls': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  'Cable Lat Pulldown': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
};

const BEGINNER_REGRESSIONS = {
  'Pull-Ups': 'Band-Assisted Pull-Ups or Inverted Bodyweight Rows',
  'Barbell Back Squat': 'Dumbbell Goblet Squats or Bodyweight Box Squats',
  'Conventional Deadlift': 'Dumbbell Romanian Deadlifts with light loading',
  'Flat Barbell Bench Press': 'Floor Dumbbell Press or Elevated Incline Push-Ups',
  'Overhead Shoulder Press': 'Seated Dumbbell Overhead Press',
  'Bulgarian Split Squat': 'Static Lunges with hand supported on wall',
};

export const ExerciseLibraryPage = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [environment, setEnvironment] = useState('ALL'); // 'ALL', 'HOME', 'GYM'

  // Selected exercise for detailed modal
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Custom Exercise modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customMuscle, setCustomMuscle] = useState('CHEST');
  const [customEquip, setCustomEquip] = useState('DUMBBELL');
  const [customDiff, setCustomDiff] = useState('BEGINNER');
  const [customType, setCustomType] = useState('STRENGTH');
  const [customInstructions, setCustomInstructions] = useState('');
  const [customSafety, setCustomSafety] = useState('');

  const toast = useToast();

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await workoutApi.getExercises({
        search: search || undefined,
        muscleGroup: muscleGroup || undefined,
        equipment: equipment || undefined,
        difficulty: difficulty || undefined,
        size: 50,
      });
      if (res?.data?.content) {
        setExercises(res.data.content);
      }
    } catch {
      toast.error('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [muscleGroup, equipment, difficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExercises();
  };

  const handleCreateCustom = async (e) => {
    e.preventDefault();
    if (!customName) {
      toast.error('Exercise name is required');
      return;
    }
    try {
      await workoutApi.createExercise({
        name: customName,
        description: customDesc,
        muscleGroup: customMuscle,
        equipment: customEquip,
        difficulty: customDiff,
        exerciseType: customType,
        instructions: customInstructions,
        safetyTips: customSafety,
      });
      toast.success('Custom exercise saved to your library!');
      setIsAddModalOpen(false);
      setCustomName('');
      setCustomDesc('');
      setCustomInstructions('');
      setCustomSafety('');
      fetchExercises();
    } catch (err) {
      toast.error(err.message || 'Failed to create exercise');
    }
  };

  const muscles = ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY'];
  const equipOptions = ['BARBELL', 'DUMBBELL', 'BODYWEIGHT', 'RESISTANCE_BAND', 'CABLE', 'MACHINE'];

  // Filter based on Home vs Gym environment
  const filteredExercises = exercises.filter((ex) => {
    if (environment === 'HOME') {
      return ['BODYWEIGHT', 'DUMBBELL', 'RESISTANCE_BAND'].includes(ex.equipment);
    }
    if (environment === 'GYM') {
      return ['BARBELL', 'CABLE', 'MACHINE', 'DUMBBELL'].includes(ex.equipment);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '420px', width: '100%' }}>
          <Input
            placeholder="Search exercises by name..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={Plus}>
          Add Custom Exercise
        </Button>
      </div>

      {/* Environment Toggle: All vs Home vs Gym */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'var(--bg-surface-subtle)',
        padding: '0.4rem',
        borderRadius: '12px',
        width: 'fit-content',
      }}>
        <button
          onClick={() => setEnvironment('ALL')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: environment === 'ALL' ? '#FFFFFF' : 'transparent',
            color: environment === 'ALL' ? 'var(--color-primary)' : 'var(--text-muted)',
            boxShadow: environment === 'ALL' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          All Locations
        </button>
        <button
          onClick={() => setEnvironment('HOME')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: environment === 'HOME' ? '#FFFFFF' : 'transparent',
            color: environment === 'HOME' ? 'var(--color-primary)' : 'var(--text-muted)',
            boxShadow: environment === 'HOME' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <Home size={15} /> Home Workout Friendly
        </button>
        <button
          onClick={() => setEnvironment('GYM')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: environment === 'GYM' ? '#FFFFFF' : 'transparent',
            color: environment === 'GYM' ? 'var(--color-primary)' : 'var(--text-muted)',
            boxShadow: environment === 'GYM' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <Building2 size={15} /> Commercial Gym
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Muscle Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Target Muscle:
          </span>
          <button
            onClick={() => setMuscleGroup('')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: muscleGroup === '' ? 'var(--color-primary)' : 'var(--bg-surface-subtle)',
              color: muscleGroup === '' ? '#FFFFFF' : 'var(--text-muted)',
            }}
          >
            All Muscles
          </button>
          {muscles.map((m) => (
            <button
              key={m}
              onClick={() => setMuscleGroup(m)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: muscleGroup === m ? 'var(--color-primary)' : 'var(--bg-surface-subtle)',
                color: muscleGroup === m ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Equipment Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Equipment:
          </span>
          <button
            onClick={() => setEquipment('')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: equipment === '' ? 'var(--color-accent-teal)' : 'var(--bg-surface-subtle)',
              color: equipment === '' ? '#FFFFFF' : 'var(--text-muted)',
            }}
          >
            All Equipment
          </button>
          {equipOptions.map((eq) => (
            <button
              key={eq}
              onClick={() => setEquipment(eq)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: equipment === eq ? 'var(--color-accent-teal)' : 'var(--bg-surface-subtle)',
                color: equipment === eq ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              {eq.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Cards Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <Skeleton height="220px" /><Skeleton height="220px" /><Skeleton height="220px" /><Skeleton height="220px" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
          {filteredExercises.map((ex) => {
            const img = EXERCISE_IMAGES[ex.name] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80';

            return (
              <Card
                key={ex.id}
                padding="0"
                style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                onClick={() => setSelectedExercise(ex)}
              >
                {/* Visual Header */}
                <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#EDECE6' }}>
                  <img
                    src={img}
                    alt={ex.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                    <Badge variant="sage">{ex.muscleGroup}</Badge>
                    <Badge variant={ex.difficulty === 'ADVANCED' ? 'coral' : 'teal'}>{ex.difficulty}</Badge>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{ex.name}</h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {ex.description ? (ex.description.length > 95 ? ex.description.substring(0, 92) + '...' : ex.description) : 'Compound resistance movement.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Equipment: <strong>{ex.equipment.replace('_', ' ')}</strong>
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Cues & Form <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <Modal
          isOpen={Boolean(selectedExercise)}
          onClose={() => setSelectedExercise(null)}
          title={selectedExercise.name}
          subtitle={`${selectedExercise.muscleGroup} • ${selectedExercise.equipment.replace('_', ' ')} • ${selectedExercise.difficulty}`}
          maxWidth="620px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
              {selectedExercise.description}
            </p>

            {/* Beginner Alternative / Regression */}
            {BEGINNER_REGRESSIONS[selectedExercise.name] && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: '#EDF4EE', border: '1px solid #D5E7D9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--color-primary)' }}>Beginner Friendly Alternative:</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginLeft: '0.4rem' }}>
                    {BEGINNER_REGRESSIONS[selectedExercise.name]}
                  </span>
                </div>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                <Info size={17} /> Execution Form & Technique:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                {selectedExercise.instructions || 'Control eccentric lowering for 2-3 seconds, maintain neutral spine, and drive powerfully through midfoot.'}
              </p>
            </div>

            {/* Safety Tips */}
            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#FDF0ED', border: '1px solid #F8D3CB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-accent-coral)' }}>
                <ShieldAlert size={17} /> Safety & Joint Protection:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6A2A1E', lineHeight: 1.6, margin: 0 }}>
                {selectedExercise.safetyTips || 'Avoid excessive lumbar hyperextension, brace abdominal core, and use appropriate loads.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="primary" onClick={() => setSelectedExercise(null)}>
                Got it
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add Custom Exercise */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Exercise"
        subtitle="Contribute custom movement patterns to your library"
        maxWidth="580px"
      >
        <form onSubmit={handleCreateCustom} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <Input
            label="Exercise Name"
            placeholder="e.g. Incline Cable Flyes"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            required
          />

          <Input
            label="Description"
            placeholder="Upper pectoral isolation with continuous tension"
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Target Muscle</label>
              <select
                value={customMuscle}
                onChange={(e) => setCustomMuscle(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                {muscles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Equipment</label>
              <select
                value={customEquip}
                onChange={(e) => setCustomEquip(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                {equipOptions.map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Form & Step-by-Step Instructions"
            placeholder="1. Set pulleys at chest height. 2. Step forward into split stance..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
          />

          <Input
            label="Safety Warnings"
            placeholder="Avoid locking elbows or overextending backward at peak stretch"
            value={customSafety}
            onChange={(e) => setCustomSafety(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Exercise
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
