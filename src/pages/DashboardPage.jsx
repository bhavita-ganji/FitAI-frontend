import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  UtensilsCrossed,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Droplets,
  Activity,
  BotMessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { workoutApi } from '../api/workoutApi';
import { nutritionApi } from '../api/nutritionApi';
import { analyticsApi } from '../api/analyticsApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { MacroProgressRing } from '../components/charts/MacroProgressRing';
import { ActivityBarChart } from '../components/charts/ActivityBarChart';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [plansRes, summaryRes, analyticsRes, sessionsRes] = await Promise.all([
          workoutApi.getPlans().catch(() => ({ data: [] })),
          nutritionApi.getDailySummary().catch(() => ({ data: null })),
          analyticsApi.getDashboardAnalytics(7).catch(() => ({ data: null })),
          workoutApi.getSessions(0, 5).catch(() => ({ data: { content: [] } })),
        ]);

        if (plansRes?.data) setPlans(plansRes.data);
        if (summaryRes?.data) setNutritionSummary(summaryRes.data);
        if (analyticsRes?.data) setAnalytics(analyticsRes.data);
        if (sessionsRes?.data?.content) setRecentSessions(sessionsRes.data.content);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const todayPlan = plans.length > 0 ? plans[0] : null;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Greeting Banner */}
      <div style={{
        padding: '2rem 2.25rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--bg-sage-light) 100%)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Calendar size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              {todayFormatted}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Hello, {user?.fullName?.split(' ')[0] || 'Athlete'} 👋
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '0.3rem', margin: 0 }}>
            You're making great progress! Ready to crush today's physical training goals?
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            onClick={() => navigate('/nutrition')}
            icon={Plus}
          >
            Log Meal
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/workouts')}
            icon={Dumbbell}
          >
            Start Workout
          </Button>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Metric 1 */}
        <Card padding="1.25rem">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Workouts Completed</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'var(--bg-sage-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {analytics?.totalWorkoutsCompleted ?? 0}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            {analytics?.totalMinutesExercised ?? 0} total active minutes
          </p>
        </Card>

        {/* Metric 2 */}
        <Card padding="1.25rem">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Consistency Rate</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#E8F7F0', color: 'var(--color-accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {analytics?.workoutConsistencyRate ? `${analytics.workoutConsistencyRate}%` : '85%'}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-accent-teal)', fontWeight: 600, margin: '0.2rem 0 0' }}>
            On track with 4x/wk target
          </p>
        </Card>

        {/* Metric 3 */}
        <Card padding="1.25rem">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Calories Consumed</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#FDF0ED', color: 'var(--color-accent-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {Math.round(nutritionSummary?.totalCalories ?? 0)}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Target: {nutritionSummary?.targetCalories ?? 2200} kcal
          </p>
        </Card>

        {/* Metric 4 */}
        <Card padding="1.25rem">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Daily Water Target</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#F0F5FA', color: '#4A6FA5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {(nutritionSummary?.targetWaterMl ? (nutritionSummary.targetWaterMl / 1000).toFixed(1) : '2.5')} L
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Hydration balance goal
          </p>
        </Card>
      </div>

      {/* Main Grid: Workouts & Activity Left | Nutrition & AI Coach Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.75rem',
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Today's Workout Card */}
          <Card
            title="Scheduled Training"
            subtitle="Today's structured workout routine"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/workouts')}>
                View All Plans
              </Button>
            }
          >
            {loading ? (
              <Skeleton height="110px" />
            ) : todayPlan ? (
              <div style={{
                padding: '1.25rem',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{todayPlan.name}</h4>
                  <Badge variant="sage">{todayPlan.difficulty}</Badge>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {todayPlan.description || 'Targeted strength adaptations with compound lifts.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {todayPlan.planExercises?.length || 4} Exercises • ~45 min
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/workouts')}
                    icon={ArrowRight}
                  >
                    Log Session
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.88rem' }}>No workout plan created yet.</p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/workouts')}>
                  Create a Plan
                </Button>
              </div>
            )}
          </Card>

          {/* Weekly Activity Volume Chart */}
          <Card
            title="Weekly Activity Volume"
            subtitle="Minutes of training over the past 7 days"
            action={<Badge variant="teal">Last 7 Days</Badge>}
          >
            {loading ? (
              <Skeleton height="220px" />
            ) : (
              <ActivityBarChart data={analytics?.activityTrends || []} />
            )}
          </Card>

          {/* Recent Workout Logs */}
          <Card
            title="Recent Workout Sessions"
            subtitle="Your logged training sessions"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/workouts')}>
                History
              </Button>
            }
          >
            {recentSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentSessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h5 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>{s.sessionName}</h5>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {s.sessionDate} • {s.durationMinutes} mins • {s.caloriesBurned} kcal
                      </span>
                    </div>
                    <Badge variant="teal">
                      <CheckCircle2 size={13} /> Completed
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '1rem 0' }}>
                No completed sessions logged yet.
              </p>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Daily Nutrition & Macros */}
          <Card
            title="Nutrition Summary"
            subtitle="Macronutrient progress against today's target"
            action={
              <Button variant="secondary" size="sm" onClick={() => navigate('/nutrition')}>
                Log Food
              </Button>
            }
          >
            {loading ? (
              <Skeleton height="200px" />
            ) : (
              <MacroProgressRing
                calories={nutritionSummary?.totalCalories ?? 0}
                targetCalories={nutritionSummary?.targetCalories ?? 2200}
                protein={nutritionSummary?.totalProtein ?? 0}
                targetProtein={nutritionSummary?.targetProtein ?? 140}
                carbs={nutritionSummary?.totalCarbs ?? 0}
                targetCarbs={nutritionSummary?.targetCarbs ?? 250}
                fat={nutritionSummary?.totalFat ?? 0}
                targetFat={nutritionSummary?.targetFat ?? 65}
              />
            )}
          </Card>

          {/* AI Fitness Assistant Recommendation Card */}
          <Card padding="1.75rem" style={{ background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F9F6 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BotMessageSquare size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>FitAI Coach Advice</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  RAG-Enhanced Scientific Insights
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              "To maximize muscle protein synthesis for your goal, prioritize consuming 25-35g of protein within 2 hours of your training session and ensure adequate slow-wave sleep."
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => navigate('/assistant')}
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>💬 "How should I structure my progressive overload?"</span>
                <ArrowRight size={14} color="var(--color-primary)" />
              </button>
              <button
                onClick={() => navigate('/assistant')}
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>💬 "How much protein should I eat per meal?"</span>
                <ArrowRight size={14} color="var(--color-primary)" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
