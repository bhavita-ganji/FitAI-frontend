import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  LineChart,
  BotMessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BotMessageSquare,
      title: 'RAG-Powered AI Fitness Coach',
      description: 'Context-aware intelligence combining your personal biometrics with an evidence-based exercise science and clinical nutrition knowledge base.',
      badge: 'RAG Engine',
    },
    {
      icon: Dumbbell,
      title: 'Intelligent Workout Architect',
      description: 'Build customized progressive overload routines, choose from vetted full-body templates, and record detailed sets, reps, and weights.',
      badge: 'Workout Plans',
    },
    {
      icon: UtensilsCrossed,
      title: 'Precision Macro & Meal Planner',
      description: 'Effortlessly track meals across Breakfast, Lunch, Dinner, and Snacks with instant macronutrient breakdown and daily target comparisons.',
      badge: 'Nutrition',
    },
    {
      icon: LineChart,
      title: 'Performance & Biometric Analytics',
      description: 'Transform your logged workout volumes, daily calorie balances, and weight trends into actionable visual graphs powered by Recharts.',
      badge: 'Analytics',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <nav style={{
        height: '74px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="container-fit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
            }}>
              <HeartPulse size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                Fit<span style={{ color: 'var(--color-primary)' }}>AI</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1, fontWeight: 500 }}>
                Intelligent Fitness & Nutrition
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="container-fit">
          <Badge variant="sage" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> College Capstone Project — 10-Week Syllabus Showcase
          </Badge>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
            color: 'var(--text-main)',
          }}>
            Your AI-Powered Personal <span style={{ color: 'var(--color-primary)' }}>Fitness & Nutrition</span> Companion
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            FitAI blends real-time workout tracking and automated macronutrient planning with a Retrieval-Augmented Generation (RAG) AI assistant for evidence-based wellness guidance.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              icon={ArrowRight}
            >
              Start Free Journey
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/login')}
            >
              Explore Live Demo Account
            </Button>
          </div>

          {/* Social Proof & Metrics Strip */}
          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}>
            <div>
              <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>30+</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Vetted Exercises with Form Cues</p>
            </div>
            <div>
              <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent-teal)', margin: 0 }}>RAG</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Evidence-Based Knowledge Retrieval</p>
            </div>
            <div>
              <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent-coral)', margin: 0 }}>100%</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Persistent Relational Tracking</p>
            </div>
            <div>
              <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent-lavender)', margin: 0 }}>JWT</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Role-Based Security & Isolation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-surface-subtle)' }}>
        <div className="container-fit">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="teal" style={{ marginBottom: '0.75rem' }}>Full-Stack Capabilities</Badge>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Engineered for Holistic Wellness</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0.5rem auto 0' }}>
              Built with Spring Boot 3, React 18, and modern AI pipelines to solve real fitness adherence problems.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="card-white"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-sage-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={26} />
                  </div>
                  <Badge variant="sage" style={{ alignSelf: 'flex-start' }}>{f.badge}</Badge>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        padding: '3rem 0 2rem',
      }}>
        <div className="container-fit" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <HeartPulse size={24} color="var(--color-primary)" />
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>FitAI</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '1.5rem' }}>
            College Capstone Project: Comprehensive demonstration of modern full-stack development, Spring Security, JPA relationships, and RAG AI architectures.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
            © {new Date().getFullYear()} FitAI. Developed for academic demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};
