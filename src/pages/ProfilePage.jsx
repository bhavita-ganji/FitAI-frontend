import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Scale,
  Activity,
  Target,
  Shield,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';

export const ProfilePage = () => {
  const { user, updateProfileState } = useAuth();
  const [profile, setProfile] = useState({
    age: '',
    gender: 'FEMALE',
    heightCm: '',
    weightKg: '',
    targetWeightKg: '',
    activityLevel: 'MODERATELY_ACTIVE',
    experienceLevel: 'INTERMEDIATE',
    preferredWorkoutDurationMinutes: 45,
    primaryGoal: 'STRENGTH',
    dietaryPreferences: '',
    healthNotes: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        if (res?.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      } catch {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        ...profile,
        age: profile.age ? Number(profile.age) : null,
        heightCm: profile.heightCm ? Number(profile.heightCm) : null,
        weightKg: profile.weightKg ? Number(profile.weightKg) : null,
        targetWeightKg: profile.targetWeightKg ? Number(profile.targetWeightKg) : null,
        preferredWorkoutDurationMinutes: profile.preferredWorkoutDurationMinutes
          ? Number(profile.preferredWorkoutDurationMinutes)
          : 45,
      });

      if (res?.data) {
        setProfile(res.data);
        updateProfileState({ hasCompletedOnboarding: true });
        toast.success('Profile and biometrics updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      {/* Header Profile Identity Card */}
      <Card padding="2rem">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-sage-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-sm)',
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{user?.fullName || 'User'}</h2>
              <Badge variant={user?.role === 'ROLE_ADMIN' ? 'coral' : 'sage'}>
                {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Athlete'}
              </Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              {user?.email} • Account ID: #{user?.id}
            </p>
          </div>
        </div>
      </Card>

      {/* Main Settings Form */}
      <Card
        title="Biometric & Fitness Parameters"
        subtitle="Used by FitAI algorithms for tailored caloric and workout recommendations"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Goal & Preferences */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Primary Goal</label>
              <select
                value={profile.primaryGoal || 'GENERAL_FITNESS'}
                onChange={(e) => setProfile({ ...profile, primaryGoal: e.target.value })}
                style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                <option value="STRENGTH">Strength & Power</option>
                <option value="MUSCLE_GAIN">Hypertrophy (Muscle Gain)</option>
                <option value="WEIGHT_LOSS">Weight Loss & Conditioning</option>
                <option value="ENDURANCE">Endurance & Stamina</option>
                <option value="GENERAL_FITNESS">General Health & Longevity</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Activity Level</label>
              <select
                value={profile.activityLevel || 'MODERATELY_ACTIVE'}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                <option value="SEDENTARY">Sedentary (Little or no exercise)</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active (1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately Active (3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very Active (6-7 days/week intense)</option>
              </select>
            </div>
          </div>

          {/* Physical Dimensions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
            <Input
              label="Age"
              type="number"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Gender</label>
              <select
                value={profile.gender || 'FEMALE'}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other / Non-binary</option>
              </select>
            </div>

            <Input
              label="Height (cm)"
              type="number"
              value={profile.heightCm || ''}
              onChange={(e) => setProfile({ ...profile, heightCm: e.target.value })}
            />

            <Input
              label="Current Weight (kg)"
              type="number"
              step="0.1"
              value={profile.weightKg || ''}
              onChange={(e) => setProfile({ ...profile, weightKg: e.target.value })}
            />

            <Input
              label="Target Goal Weight (kg)"
              type="number"
              step="0.1"
              value={profile.targetWeightKg || ''}
              onChange={(e) => setProfile({ ...profile, targetWeightKg: e.target.value })}
            />
          </div>

          {/* Preferences and Notes */}
          <Input
            label="Dietary Preferences / Cuisine (e.g., High Protein, Indian Vegetarian, Low Carb)"
            value={profile.dietaryPreferences || ''}
            onChange={(e) => setProfile({ ...profile, dietaryPreferences: e.target.value })}
          />

          <Input
            label="Health & Condition Notes (e.g., PCOS, Diabetic carbohydrate sensitivity, joint notes)"
            value={profile.healthNotes || ''}
            onChange={(e) => setProfile({ ...profile, healthNotes: e.target.value })}
            helperText="Educational suggestions will adjust macro recommendations accordingly."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={saving}
              icon={Save}
            >
              Save Profile Updates
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
