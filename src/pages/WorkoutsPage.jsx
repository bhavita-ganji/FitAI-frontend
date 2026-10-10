import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { workoutApi } from '../api/workoutApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';

export const WorkoutsPage = () => {
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'history'
  const [plans, setPlans] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Plan Form State
  const [planName, setPlanName] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planDiff, setPlanDiff] = useState('INTERMEDIATE');
  const [planDays, setPlanDays] = useState(3);
  const [selectedPlanExercises, setSelectedPlanExercises] = useState([]);

  // Session Logging State
  const [sessionName, setSessionName] = useState('Daily Training Session');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [sessionNotes, setSessionNotes] = useState('');
  const [loggedExerciseRows, setLoggedExerciseRows] = useState([]);

  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, sessionsRes, exRes] = await Promise.all([
        workoutApi.getPlans(),
        workoutApi.getSessions(0, 20),
        workoutApi.getExercises({ size: 50 }),
      ]);
      if (plansRes?.data) setPlans(plansRes.data);
      if (sessionsRes?.data?.content) setSessions(sessionsRes.data.content);
      if (exRes?.data?.content) setExercisesList(exRes.data.content);
    } catch {
      toast.error('Failed to load workout information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add exercise to plan builder
  const handleAddExerciseToPlan = (exerciseId) => {
    const ex = exercisesList.find((e) => e.id === Number(exerciseId));
    if (!ex) return;
    setSelectedPlanExercises([
      ...selectedPlanExercises,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        targetSets: 3,
        targetReps: 10,
        restSeconds: 60,
      },
    ]);
  };

  // Submit new Workout Plan
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planName) {
      toast.error('Please enter a plan name');
      return;
    }
    try {
      await workoutApi.createPlan({
        name: planName,
        description: planDesc,
        difficulty: planDiff,
        daysPerWeek: Number(planDays),
        planExercises: selectedPlanExercises,
      });
      toast.success('Workout plan created successfully!');
      setIsPlanModalOpen(false);
      setPlanName('');
      setPlanDesc('');
      setSelectedPlanExercises([]);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create plan');
    }
  };

  // Delete Plan
  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout plan?')) return;
    try {
      await workoutApi.deletePlan(id);
      toast.success('Plan deleted');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Cannot delete system template or unowned plan');
    }
  };

  // Setup Log Session Modal from a plan
  const handleStartPlanSession = (plan) => {
    setSessionName(plan.name + ' - Workout');
    const initialRows = [];
    if (plan.planExercises) {
      plan.planExercises.forEach((pe) => {
        for (let s = 1; s <= pe.targetSets; s++) {
          initialRows.push({
            exerciseId: pe.exerciseId,
            exerciseName: pe.exerciseName,
            setNumber: s,
            reps: pe.targetReps,
            weightKg: 40.0,
            completed: true,
          });
        }
      });
    }
    setLoggedExerciseRows(initialRows);
    setIsLogModalOpen(true);
  };

  // Submit Workout Session
  const handleSubmitSession = async (e) => {
    e.preventDefault();
    if (!sessionName) {
      toast.error('Session title is required');
      return;
    }
    try {
      await workoutApi.logSession({
        sessionName,
        sessionDate,
        durationMinutes: Number(durationMinutes),
        notes: sessionNotes,
        exerciseLogs: loggedExerciseRows,
      });
      toast.success('Workout session logged successfully!');
      setIsLogModalOpen(false);
      setLoggedExerciseRows([]);
      loadData();
      setActiveTab('history');
    } catch (err) {
      toast.error(err.message || 'Failed to log workout session');
    }
  };

  // Delete Session
  const handleDeleteSession = async (id) => {
    if (!window.confirm('Delete this logged session?')) return;
    try {
      await workoutApi.deleteSession(id);
      toast.success('Session deleted');
      loadData();
    } catch {
      toast.error('Failed to delete session');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Controls: Tabs and Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#FFFFFF',
          padding: '0.35rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          gap: '0.35rem',
        }}>
          <button
            onClick={() => setActiveTab('plans')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '9px',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'plans' ? 'var(--bg-sage-light)' : 'transparent',
              color: activeTab === 'plans' ? 'var(--color-primary)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Workout Routines ({plans.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '9px',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'history' ? 'var(--bg-sage-light)' : 'transparent',
              color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Logged History ({sessions.length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            onClick={() => {
              setLoggedExerciseRows([
                { exerciseId: exercisesList[0]?.id || 1, exerciseName: exercisesList[0]?.name || 'Barbell Back Squat', setNumber: 1, reps: 10, weightKg: 50, completed: true }
              ]);
              setIsLogModalOpen(true);
            }}
            icon={Plus}
          >
            Quick Log Workout
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsPlanModalOpen(true)}
            icon={Dumbbell}
          >
            Create Routine Plan
          </Button>
        </div>
      </div>

      {/* Tab 1: Workout Plans */}
      {activeTab === 'plans' && (
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <Skeleton height="220px" /><Skeleton height="220px" /><Skeleton height="220px" />
            </div>
          ) : plans.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title="No Workout Plans Found"
              description="Create a personalized progressive overload routine or choose from system templates."
              actionText="Create First Workout Plan"
              onAction={() => setIsPlanModalOpen(true)}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {plans.map((p) => (
                <Card key={p.id} padding="1.5rem">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{p.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {p.daysPerWeek} days/week • {p.isTemplate ? '⭐ System Template' : 'Personal Routine'}
                      </span>
                    </div>
                    <Badge variant={p.difficulty === 'ADVANCED' ? 'coral' : 'sage'}>
                      {p.difficulty}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {p.description || 'Structured strength and hypertrophy plan.'}
                  </p>

                  {/* Exercise list preview */}
                  <div style={{
                    padding: '0.85rem',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: '12px',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Prescribed Exercises ({p.planExercises?.length || 0}):
                    </span>
                    {p.planExercises && p.planExercises.length > 0 ? (
                      p.planExercises.slice(0, 4).map((pe, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 500 }}>{pe.exerciseName}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{pe.targetSets} sets × {pe.targetReps} reps</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No exercises added yet.</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {!p.isTemplate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(p.id)}
                        icon={Trash2}
                        style={{ color: 'var(--color-accent-coral)' }}
                      >
                        Delete
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartPlanSession(p)}
                      icon={CheckCircle2}
                      style={{ marginLeft: 'auto' }}
                    >
                      Start Workout
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Workout History */}
      {activeTab === 'history' && (
        <div>
          {loading ? (
            <Skeleton height="300px" />
          ) : sessions.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Logged Workouts"
              description="Complete and log your training sessions to see your volume trends here."
              actionText="Log a Workout Now"
              onAction={() => setIsLogModalOpen(true)}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map((s) => (
                <Card key={s.id} padding="1.5rem">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{s.sessionName}</h4>
                        <Badge variant="teal">Completed</Badge>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={14} /> {s.sessionDate}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} /> {s.durationMinutes} mins
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Flame size={14} color="var(--color-accent-coral)" /> {s.caloriesBurned} kcal
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSession(s.id)} icon={Trash2} style={{ color: 'var(--color-accent-coral)' }}>
                      Delete Log
                    </Button>
                  </div>

                  {s.notes && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                      "{s.notes}"
                    </p>
                  )}

                  {/* Sets breakdown */}
                  {s.exerciseLogs && s.exerciseLogs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {s.exerciseLogs.map((log, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-surface-subtle)',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <strong>{log.exerciseName}</strong>: Set {log.setNumber} — {log.reps} reps @ {log.weightKg} kg
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Workout Plan */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Create New Workout Routine"
        subtitle="Add custom exercises and target sets/reps"
        maxWidth="620px"
      >
        <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Plan Title"
            placeholder="e.g. Hypertrophy Pull Day"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />

          <Input
            label="Description"
            placeholder="Focus on lats, upper back, and biceps progressive overload"
            value={planDesc}
            onChange={(e) => setPlanDesc(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Difficulty Level</label>
              <select
                value={planDiff}
                onChange={(e) => setPlanDiff(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <Input
              label="Days Per Week"
              type="number"
              min="1"
              max="7"
              value={planDays}
              onChange={(e) => setPlanDays(e.target.value)}
            />
          </div>

          {/* Add Exercise Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Select Exercises from Library
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                id="exercisePickerSelect"
                style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                {exercisesList.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup} • {ex.equipment})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const sel = document.getElementById('exercisePickerSelect');
                  if (sel) handleAddExerciseToPlan(sel.value);
                }}
              >
                + Add
              </Button>
            </div>
          </div>

          {/* Selected Exercises Table */}
          {selectedPlanExercises.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Routine Exercises:</span>
              {selectedPlanExercises.map((pe, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{pe.exerciseName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{pe.targetSets} sets × {pe.targetReps} reps</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPlanExercises(selectedPlanExercises.filter((_, i) => i !== idx))}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-coral)', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Routine Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Log Workout Session */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Record Completed Workout Session"
        subtitle="Log sets, repetitions, and resistance lifted"
        maxWidth="680px"
      >
        <form onSubmit={handleSubmitSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <Input
              label="Session Title"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
            />
            <Input
              label="Date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              required
            />
            <Input
              label="Duration (min)"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
            />
          </div>

          <Input
            label="Workout Session Notes"
            placeholder="Felt great, pushed through last set of RDLs"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
          />

          {/* Add Set Row */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Exercise Sets Logged:</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const ex = exercisesList[0];
                  setLoggedExerciseRows([
                    ...loggedExerciseRows,
                    {
                      exerciseId: ex?.id || 1,
                      exerciseName: ex?.name || 'Exercise',
                      setNumber: loggedExerciseRows.length + 1,
                      reps: 10,
                      weightKg: 50.0,
                      completed: true,
                    },
                  ]);
                }}
              >
                + Add Set
              </Button>
            </div>

            {loggedExerciseRows.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                  gap: '0.5rem',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                }}
              >
                <select
                  value={row.exerciseId}
                  onChange={(e) => {
                    const ex = exercisesList.find((item) => item.id === Number(e.target.value));
                    const updated = [...loggedExerciseRows];
                    updated[idx].exerciseId = Number(e.target.value);
                    updated[idx].exerciseName = ex ? ex.name : '';
                    setLoggedExerciseRows(updated);
                  }}
                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                >
                  {exercisesList.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Set #"
                  value={row.setNumber}
                  onChange={(e) => {
                    const updated = [...loggedExerciseRows];
                    updated[idx].setNumber = Number(e.target.value);
                    setLoggedExerciseRows(updated);
                  }}
                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-light)', width: '100%' }}
                />

                <input
                  type="number"
                  placeholder="Reps"
                  value={row.reps}
                  onChange={(e) => {
                    const updated = [...loggedExerciseRows];
                    updated[idx].reps = Number(e.target.value);
                    setLoggedExerciseRows(updated);
                  }}
                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-light)', width: '100%' }}
                />

                <input
                  type="number"
                  step="0.5"
                  placeholder="Kg"
                  value={row.weightKg}
                  onChange={(e) => {
                    const updated = [...loggedExerciseRows];
                    updated[idx].weightKg = Number(e.target.value);
                    setLoggedExerciseRows(updated);
                  }}
                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-light)', width: '100%' }}
                />

                <button
                  type="button"
                  onClick={() => setLoggedExerciseRows(loggedExerciseRows.filter((_, i) => i !== idx))}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-coral)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Completed Workout
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
