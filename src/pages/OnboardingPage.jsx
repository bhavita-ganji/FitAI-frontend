import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Activity, Dumbbell, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [primaryGoal, setPrimaryGoal] = useState('STRENGTH');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('FEMALE');
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(68);
  const [targetWeightKg, setTargetWeightKg] = useState(65);
  const [activityLevel, setActivityLevel] = useState('MODERATELY_ACTIVE');
  const [experienceLevel, setExperienceLevel] = useState('INTERMEDIATE');
  const [preferredWorkoutDurationMinutes, setPreferredWorkoutDurationMinutes] = useState(45);
  const [dietaryPreferences, setDietaryPreferences] = useState('Balanced, High Protein');

  const { updateProfileState } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const goals = [
    { id: 'STRENGTH', title: 'Strength & Power', desc: 'Focus on heavy compound lifts and progressive overload' },
    { id: 'MUSCLE_GAIN', title: 'Muscle Hypertrophy', desc: 'Maximal muscle growth, volume splits, and targeted nutrition' },
    { id: 'WEIGHT_LOSS', title: 'Fat Loss & Leaning', desc: 'Caloric deficit, high protein retention, and conditioning' },
    { id: 'ENDURANCE', title: 'Endurance & Stamina', desc: 'Cardiovascular capacity, tempo pacing, and aerobic resilience' },
    { id: 'GENERAL_FITNESS', title: 'Holistic Health & Longevity', desc: 'Functional mobility, daily energy, and sustainable habits' },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      await userApi.updateProfile({
        primaryGoal,
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        targetWeightKg: Number(targetWeightKg),
        activityLevel,
        experienceLevel,
        preferredWorkoutDurationMinutes: Number(preferredWorkoutDurationMinutes),
        dietaryPreferences,
      });

      updateProfileState({ hasCompletedOnboarding: true });
      toast.success('Your personalized profile is configured! Welcome to FitAI.');
      navigate('/dashboard');
    } catch (err) {
      // Extract the actual backend error message from the JSON response body
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error;
      toast.error(backendMsg || err.message || 'Failed to save onboarding profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Progress Tracker */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Badge variant="sage" style={{ padding: '0.35rem 0.85rem', marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Personalization Setup
          </Badge>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Configure Your FitAI Profile</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Step {step} of 3: {step === 1 ? 'Primary Fitness Goal' : step === 2 ? 'Body Biometrics' : 'Training Routine'}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  height: '6px',
                  width: '60px',
                  borderRadius: '9999px',
                  backgroundColor: step >= s ? 'var(--color-primary)' : 'var(--border-light)',
                  transition: 'background-color 0.25s ease',
                }}
              />
            ))}
          </div>
        </div>

        <Card padding="2.5rem">
          {/* Step 1: Goal */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                What is your primary fitness aspiration?
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                FitAI adjusts your nutritional macronutrient ratios and workout volume around this goal.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setPrimaryGoal(g.id)}
                    style={{
                      padding: '1.1rem',
                      borderRadius: '14px',
                      border: `2px solid ${primaryGoal === g.id ? 'var(--color-primary)' : 'var(--border-light)'}`,
                      backgroundColor: primaryGoal === g.id ? 'var(--bg-sage-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{g.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{g.desc}</p>
                    </div>
                    {primaryGoal === g.id && <CheckCircle2 size={20} color="var(--color-primary)" />}
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                onClick={() => setStep(2)}
                icon={ArrowRight}
              >
                Next: Biometrics
              </Button>
            </div>
          )}

          {/* Step 2: Biometrics */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Physical Measurements
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Used to compute your baseline Basal Metabolic Rate (BMR) and recommended protein targets.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <Input
                  label="Current Age"
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other / Non-binary</option>
                  </select>
                </div>

                <Input
                  label="Height (cm)"
                  type="number"
                  min="50"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  required
                />

                <Input
                  label="Current Weight (kg)"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Input
                  label="Target Goal Weight (kg)"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  helperText="Your desired bodyweight for milestone progress tracking"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="outline" size="lg" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={() => setStep(3)} style={{ flex: 2 }} icon={ArrowRight}>
                  Next: Training Habits
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Habits & Finish */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Lifestyle & Training Routine
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Fine-tune your weekly active energy expenditure estimates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Daily Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
                  >
                    <option value="SEDENTARY">Sedentary (Desk job, little movement)</option>
                    <option value="LIGHTLY_ACTIVE">Lightly Active (1-3 workouts per week)</option>
                    <option value="MODERATELY_ACTIVE">Moderately Active (3-5 workouts per week)</option>
                    <option value="VERY_ACTIVE">Very Active (6-7 intense sessions per week)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Lifting Experience</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
                  >
                    <option value="BEGINNER">Beginner (&lt; 1 year of consistent lifting)</option>
                    <option value="INTERMEDIATE">Intermediate (1 - 3 years experience)</option>
                    <option value="ADVANCED">Advanced (3+ years consistent training)</option>
                  </select>
                </div>

                <Input
                  label="Preferred Workout Session Length (minutes)"
                  type="number"
                  min="20"
                  max="150"
                  value={preferredWorkoutDurationMinutes}
                  onChange={(e) => setPreferredWorkoutDurationMinutes(e.target.value)}
                />

                <Input
                  label="Dietary Preferences & Allergies"
                  placeholder="e.g. High Protein, Mediterranean, No Dairy"
                  value={dietaryPreferences}
                  onChange={(e) => setDietaryPreferences(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="outline" size="lg" onClick={() => setStep(2)} style={{ flex: 1 }}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleFinish}
                  isLoading={loading}
                  style={{ flex: 2 }}
                  icon={Sparkles}
                >
                  Generate My Custom Program
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
