import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Calendar,
  Flame,
  Search,
  Settings,
  CheckCircle2,
  Apple,
  AlertTriangle,
  Heart,
  Activity,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';
import { nutritionApi } from '../api/nutritionApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

const INDIAN_PRESETS = [
  {
    id: 'dal-rice',
    name: 'Yellow Moong Dal Tadka + Brown Rice',
    cuisine: 'North / South Indian',
    calories: 320,
    protein: 13,
    carbs: 58,
    fat: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    tags: ['Vegetarian', 'High Fiber', 'Low Fat'],
    description: 'Classic comfort meal combining complete amino acid profile (lysine from dal + methionine from grain). Gentle on digestion.',
    matchedFood: 'Yellow Moong Dal Tadka',
  },
  {
    id: 'paneer-tikka',
    name: 'Tandoori Grilled Paneer Tikka Salad',
    cuisine: 'North Indian',
    calories: 260,
    protein: 18,
    carbs: 5,
    fat: 19.5,
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    tags: ['High Protein', 'Keto / Low-Carb', 'PCOS-Friendly'],
    description: 'Cottage cheese marinated in curd, turmeric, and ajwain. High calcium and leucine content for muscle repair.',
    matchedFood: 'Grilled Paneer Tikka',
  },
  {
    id: 'khichdi-curd',
    name: 'Moong Dal Khichdi with Fresh Curd',
    cuisine: 'Pan-Indian Ayurvedic',
    calories: 285,
    protein: 12.7,
    carbs: 43,
    fat: 7.3,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    tags: ['Gut Health', 'Probiotic', 'Recovery'],
    description: 'Slow-cooked yellow lentils and grain with cumin and ghee, served with probiotic curd. Ideal post-workout digestive recovery.',
    matchedFood: 'Moong Dal & Brown Rice Khichdi',
  },
  {
    id: 'chana-ragi',
    name: 'Punjabi Chana Masala + Ragi Roti',
    cuisine: 'Indian Fusion',
    calories: 360,
    protein: 12.6,
    carbs: 63,
    fat: 6.6,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    tags: ['Low GI', 'Diabetes-Friendly', 'Iron Rich'],
    description: 'High-fiber chickpea curry paired with calcium-rich finger millet flatbread. Satiating with steady glucose release.',
    matchedFood: 'Chana Masala (Chickpeas)',
  },
  {
    id: 'palak-paneer',
    name: 'Palak Paneer with Whole Wheat Phulka',
    cuisine: 'North Indian',
    calories: 350,
    protein: 16.5,
    carbs: 31,
    fat: 18,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    tags: ['Iron & Folate', 'Vegetarian', 'Muscle Support'],
    description: 'Blanched iron-rich spinach pureed with soft paneer cubes. High micronutrient density and steady energy.',
    matchedFood: 'Palak Paneer (Spinach Cottage Cheese)',
  },
  {
    id: 'sprouts-chaat',
    name: 'Sprouted Moong Chaat with Pomegranate',
    cuisine: 'Indian Street Health',
    calories: 145,
    protein: 9.2,
    carbs: 23,
    fat: 1.2,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tags: ['Low Calorie', 'Enzyme Rich', 'Snack'],
    description: 'Sprouted green moong tossed with lemon, black salt, cucumber, and pomegranate. Rich in bioavailable enzymes and vitamin C.',
    matchedFood: 'Sprouted Moong Bean Salad',
  },
];

export const NutritionPage = () => {
  const [activeTab, setActiveTab] = useState('journal'); // 'journal', 'presets', 'pcos', 'diabetes'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState(false);

  // Log Form State
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [mealType, setMealType] = useState('BREAKFAST');
  const [servings, setServings] = useState(1.0);
  const [foodSearch, setFoodSearch] = useState('');
  const [mealNotes, setMealNotes] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Targets State
  const [targetCalories, setTargetCalories] = useState(2200);
  const [targetProtein, setTargetProtein] = useState(140);
  const [targetCarbs, setTargetCarbs] = useState(250);
  const [targetFat, setTargetFat] = useState(65);
  const [targetWater, setTargetWater] = useState(2500);

  const toast = useToast();

  const loadDailySummary = async (date) => {
    setLoading(true);
    try {
      const [sumRes, foodsRes, goalRes] = await Promise.all([
        nutritionApi.getDailySummary(date),
        nutritionApi.getFoods({ size: 100 }),
        nutritionApi.getGoals(),
      ]);

      if (sumRes?.data) setSummary(sumRes.data);
      if (foodsRes?.data?.content) setFoodItems(foodsRes.data.content);
      if (goalRes?.data) {
        setTargetCalories(goalRes.data.dailyCaloriesTarget);
        setTargetProtein(goalRes.data.dailyProteinTarget);
        setTargetCarbs(goalRes.data.dailyCarbsTarget);
        setTargetFat(goalRes.data.dailyFatTarget);
        setTargetWater(goalRes.data.waterIntakeMlTarget || 2500);
      }
    } catch {
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailySummary(selectedDate);
  }, [selectedDate]);

  const handleLogMeal = async (e) => {
    e.preventDefault();
    if (!selectedFoodId) {
      toast.error('Please choose a food item');
      return;
    }

    try {
      await nutritionApi.logMeal({
        foodItemId: Number(selectedFoodId),
        mealType,
        entryDate: selectedDate,
        servings: Number(servings),
        notes: mealNotes,
      });
      toast.success('Food logged to daily nutrition journal!');
      setIsLogModalOpen(false);
      setSelectedFoodId('');
      setServings(1.0);
      setMealNotes('');
      loadDailySummary(selectedDate);
    } catch (err) {
      toast.error(err.message || 'Failed to log food');
    }
  };

  const handleQuickLogPreset = async (preset, targetSlot = 'LUNCH') => {
    const match = foodItems.find(
      (f) => f.name.toLowerCase().includes(preset.matchedFood.toLowerCase())
    );

    if (match) {
      try {
        await nutritionApi.logMeal({
          foodItemId: match.id,
          mealType: targetSlot,
          entryDate: selectedDate,
          servings: 1.0,
          notes: `Logged from FitAI Indian Presets: ${preset.name}`,
        });
        toast.success(`Logged ${preset.name} to ${targetSlot.toLowerCase()}!`);
        loadDailySummary(selectedDate);
      } catch (err) {
        toast.error('Failed to log preset meal');
      }
    } else {
      setFoodSearch(preset.name);
      setMealType(targetSlot);
      setIsLogModalOpen(true);
      toast.info(`Please pick or confirm ${preset.matchedFood}`);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await nutritionApi.deleteMeal(id);
      toast.success('Food entry removed');
      loadDailySummary(selectedDate);
    } catch {
      toast.error('Failed to remove entry');
    }
  };

  const handleUpdateTargets = async (e) => {
    e.preventDefault();
    try {
      await nutritionApi.updateGoals({
        dailyCaloriesTarget: Number(targetCalories),
        dailyProteinTarget: Number(targetProtein),
        dailyCarbsTarget: Number(targetCarbs),
        dailyFatTarget: Number(targetFat),
        waterIntakeMlTarget: Number(targetWater),
      });
      toast.success('Daily nutrition targets updated!');
      setIsTargetsModalOpen(false);
      loadDailySummary(selectedDate);
    } catch (err) {
      toast.error(err.message || 'Failed to update goals');
    }
  };

  const filteredFoods = foodItems.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    if (categoryFilter === 'ALL') return matchesSearch;
    if (categoryFilter === 'INDIAN') return matchesSearch && (f.category === 'INDIAN' || f.name.includes('Dal') || f.name.includes('Paneer') || f.name.includes('Ragi'));
    return matchesSearch && f.category === categoryFilter;
  });

  const mealSlots = [
    { type: 'BREAKFAST', title: '🍳 Breakfast', desc: 'Kickstart morning glycogen and metabolism' },
    { type: 'LUNCH', title: '🥗 Lunch', desc: 'Sustained energy and mid-day recovery' },
    { type: 'DINNER', title: '🥩 Dinner', desc: 'Evening protein synthesis and overnight repair' },
    { type: 'SNACK', title: '🍎 Snacks & Supplements', desc: 'Pre/post workout fuel and hydration' },
  ];

  const getEntriesForSlot = (type) => {
    return summary?.mealEntries?.filter((m) => m.mealType === type) || [];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '160px', padding: '0.55rem 0.85rem' }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          >
            Today
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTargetsModalOpen(true)}
            icon={Settings}
          >
            Adjust Targets
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (foodItems.length > 0 && !selectedFoodId) setSelectedFoodId(foodItems[0].id);
              setIsLogModalOpen(true);
            }}
            icon={Plus}
          >
            Log Food Item
          </Button>
        </div>
      </div>

      {/* Daily Progress Macro Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
      }}>
        <Card padding="1.25rem">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Calories</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {Math.round(summary?.totalCalories ?? 0)}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              / {summary?.targetCalories ?? 2200} kcal
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#EDF3EE', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, Math.round(((summary?.totalCalories ?? 0) / (summary?.targetCalories || 2200)) * 100))}%`,
              height: '100%',
              backgroundColor: 'var(--color-primary)',
            }} />
          </div>
        </Card>

        <Card padding="1.25rem">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>Protein</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {Math.round(summary?.totalProtein ?? 0)}g
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              / {summary?.targetProtein ?? 140}g
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#EDF3EE', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, Math.round(((summary?.totalProtein ?? 0) / (summary?.targetProtein || 140)) * 100))}%`,
              height: '100%',
              backgroundColor: 'var(--color-primary-light)',
            }} />
          </div>
        </Card>

        <Card padding="1.25rem">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent-teal)' }}>Carbohydrates</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {Math.round(summary?.totalCarbs ?? 0)}g
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              / {summary?.targetCarbs ?? 250}g
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#EDF3EE', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, Math.round(((summary?.totalCarbs ?? 0) / (summary?.targetCarbs || 250)) * 100))}%`,
              height: '100%',
              backgroundColor: 'var(--color-accent-teal)',
            }} />
          </div>
        </Card>

        <Card padding="1.25rem">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent-coral)' }}>Healthy Fats</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {Math.round(summary?.totalFat ?? 0)}g
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              / {summary?.targetFat ?? 65}g
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#EDF3EE', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, Math.round(((summary?.totalFat ?? 0) / (summary?.targetFat || 65)) * 100))}%`,
              height: '100%',
              backgroundColor: 'var(--color-accent-coral)',
            }} />
          </div>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '0.5rem',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('journal')}
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'journal' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'journal' ? '#FFFFFF' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          Daily Journal & Logging
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'presets' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'presets' ? '#FFFFFF' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          🍛 Indian Balanced Meals
        </button>
        <button
          onClick={() => setActiveTab('pcos')}
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'pcos' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'pcos' ? '#FFFFFF' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          🌸 PCOS & Hormonal Balance
        </button>
        <button
          onClick={() => setActiveTab('diabetes')}
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'diabetes' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'diabetes' ? '#FFFFFF' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          🩺 Diabetes & Glycemic Control
        </button>
      </div>

      {/* TAB 1: DAILY JOURNAL */}
      {activeTab === 'journal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mealSlots.map((slot) => {
            const entries = getEntriesForSlot(slot.type);
            const slotCalories = entries.reduce((acc, curr) => acc + curr.calculatedCalories, 0);

            return (
              <Card key={slot.type} padding="1.5rem">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{slot.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{slot.desc}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant="sage">{Math.round(slotCalories)} kcal</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMealType(slot.type);
                        if (foodItems.length > 0 && !selectedFoodId) setSelectedFoodId(foodItems[0].id);
                        setIsLogModalOpen(true);
                      }}
                      icon={Plus}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {entries.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.88rem',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>{entry.foodName}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            ({entry.servings} serving • {entry.servingSize * entry.servings}{entry.servingUnit})
                          </span>
                          {entry.notes && (
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>
                              Note: {entry.notes}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            <strong>{Math.round(entry.calculatedCalories)}</strong> kcal • {Math.round(entry.calculatedProtein)}g P • {Math.round(entry.calculatedCarbs)}g C • {Math.round(entry.calculatedFat)}g F
                          </span>
                          <button
                            onClick={() => handleDeleteMeal(entry.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-coral)', cursor: 'pointer', padding: '0.2rem' }}
                            title="Remove meal entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                    No food logged for this meal slot yet. Click "Add" or pick an Indian Balanced Preset above.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: INDIAN PRESET MEALS */}
      {activeTab === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#EBF4EE',
            borderRadius: '14px',
            border: '1px solid #D1E7D8',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <Sparkles size={28} color="var(--color-primary)" />
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)' }}>Indian Macro-Balanced Meal Presets</h4>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Carefully calculated authentic Indian meals optimized for leucine thresholds, complete amino acid pairing, and low glycemic curves. One-click instant logging into your daily journal!
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {INDIAN_PRESETS.map((preset) => (
              <Card key={preset.id} padding="0">
                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', backgroundColor: '#F0EFEA' }}>
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    gap: '0.35rem',
                  }}>
                    <Badge variant="sage">{preset.cuisine}</Badge>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{preset.name}</h4>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {preset.description}
                    </p>
                  </div>

                  {/* Nutrients Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}>
                    <span>🔥 {preset.calories} kcal</span>
                    <span style={{ color: 'var(--color-primary)' }}>💪 {preset.protein}g P</span>
                    <span style={{ color: 'var(--color-accent-teal)' }}>🌾 {preset.carbs}g C</span>
                    <span style={{ color: 'var(--color-accent-coral)' }}>🥑 {preset.fat}g F</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {preset.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: '#F3F4F6',
                          color: '#4B5563',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogPreset(preset, 'LUNCH')}
                    >
                      Log as Lunch
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickLogPreset(preset, 'DINNER')}
                    >
                      Log as Dinner
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PCOS & HORMONAL BALANCE GUIDE */}
      {activeTab === 'pcos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Medical Disclaimer Banner */}
          <div style={{
            padding: '1.15rem 1.4rem',
            backgroundColor: '#FFFBEB',
            borderRadius: '14px',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
          }}>
            <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#92400E', fontSize: '0.92rem' }}>Clinical Medical Disclaimer</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#B45309', lineHeight: '1.45' }}>
                This educational guidance is synthesized from peer-reviewed endocrine and sports nutrition literature (ACOG, Endocrine Society). It is designed to assist personal fitness and meal planning and does NOT constitute medical diagnosis, pharmacotherapy, or prescription. Always consult a licensed gynecologist or registered dietitian.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card padding="1.5rem">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Activity size={20} color="var(--color-primary)" />
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Insulin Resistance & Carbohydrate Quality</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Up to 70% of women with PCOS exhibit hyperinsulinemia. Elevated insulin drives ovarian theca cells to overproduce androgens (testosterone), contributing to irregular ovulation and acne.
              </p>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0.75rem 0 0 0' }}>
                <li>Prioritize whole complex carbs: <strong>Steel-cut oats, millets (ragi/jowar), lentils, sweet potatoes</strong>.</li>
                <li>Avoid isolated liquid sugars and refined flours (maida) that produce rapid insulin spikes.</li>
                <li>Aim for at least <strong>30-35g of daily fiber</strong> to blunt postprandial glycemic excursions.</li>
              </ul>
            </Card>

            <Card padding="1.5rem">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Heart size={20} color="var(--color-accent-coral)" />
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Myo-Inositol & Micronutrient Anchors</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Secondary messenger defects in inositol metabolism impair ovarian response. Strategic micronutrients support follicular maturation and thyroid-adrenal axis harmony.
              </p>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0.75rem 0 0 0' }}>
                <li>Incorporate inositol-rich foods: <strong>Citrus fruits, cantaloupe, beans, almonds, and walnuts</strong>.</li>
                <li>Omega-3 fatty acids (salmon, chia seeds, flaxseed) reduce systemic inflammatory markers (hs-CRP).</li>
                <li>Adequate magnesium and vitamin D3 optimization enhance peripheral glucose disposal.</li>
              </ul>
            </Card>

            <Card padding="1.5rem">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Apple size={20} color="var(--color-accent-teal)" />
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Smart Dietary Swaps for Indian Kitchens</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem', fontSize: '0.84rem' }}>
                <div style={{ padding: '0.6rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <strong>Swap:</strong> White Rice ➡️ <strong>Brown Basmati / Foxtail Millet</strong>
                </div>
                <div style={{ padding: '0.6rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <strong>Swap:</strong> Regular Chai with Sugar ➡️ <strong>Spearmint Tea / Cinnamon Infusion</strong>
                </div>
                <div style={{ padding: '0.6rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <strong>Swap:</strong> Fried Snacks (Samosa) ➡️ <strong>Roasted Chana or Makhana (Fox Nuts)</strong>
                </div>
              </div>
            </Card>

            <Card padding="1.5rem">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Exercise Prescription for Hormonal Health</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Chronic high-intensity cardio can chronically elevate cortisol. Resistance training 3-4 days per week stimulates muscle glucose uptake independent of insulin action.
              </p>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0.75rem 0 0 0' }}>
                <li>Focus on <strong>compound strength training</strong> (goblet squats, hip thrusts, rows).</li>
                <li>Pair with gentle zone-2 walking (8,000-10,000 steps daily) and restorative yoga.</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: DIABETES & GLYCEMIC CONTROL */}
      {activeTab === 'diabetes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Medical Disclaimer Banner */}
          <div style={{
            padding: '1.15rem 1.4rem',
            backgroundColor: '#FFFBEB',
            borderRadius: '14px',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
          }}>
            <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#92400E', fontSize: '0.92rem' }}>Clinical Medical Disclaimer</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#B45309', lineHeight: '1.45' }}>
                Information here aligns with American Diabetes Association (ADA) and ICMR nutritional consensus. Always coordinate dietary modifications and medication dosages (metformin, sulfonylureas, insulin) with your treating diabetologist.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card padding="1.5rem">
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>The "Never Eat Naked Carbs" Rule</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Consuming carbohydrates alone results in rapid enzymatic breakdown and steep glycemic spikes. Always accompany carbohydrates with:
              </p>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0.75rem 0 0 0' }}>
                <li><strong>Protein anchor:</strong> Paneer, eggs, chicken, Greek yogurt, or tofu.</li>
                <li><strong>Viscous fiber:</strong> Salad greens, cucumbers, broccoli, chia seeds.</li>
                <li><strong>Healthy lipid:</strong> 1-2 tsp cold-pressed olive or mustard oil, handful of almonds.</li>
              </ul>
            </Card>

            <Card padding="1.5rem">
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>10-Minute Post-Meal Walking Protocol</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Clinical studies published in <em>Diabetologia</em> demonstrate that a brisk 10 to 15 minute walk immediately following lunch and dinner activates soleus and skeletal muscle glucose transporters (GLUT4), attenuating blood glucose peaks by 22-30% compared to sitting.
              </p>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#EDF3EE', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                💡 Recommendation: Schedule a brisk 10-minute stroll after your largest meal of the day.
              </div>
            </Card>

            <Card padding="1.5rem">
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Glycemic Index Reference Guide</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem', backgroundColor: '#DCFCE7', borderRadius: '6px' }}>
                  <span>🟢 <strong>Low GI (&lt;55):</strong> Moong Dal, Ragi, Oats, Apples, Berries</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem', backgroundColor: '#FEF9C3', borderRadius: '6px' }}>
                  <span>🟡 <strong>Medium GI (56-69):</strong> Brown Basmati, Sweet Potato, Bananas</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem', backgroundColor: '#FEE2E2', borderRadius: '6px' }}>
                  <span>🔴 <strong>High GI (&gt;70):</strong> White Bread, Sticky Rice, Soda, Cornflakes</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal: Log Food Item */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Food to Nutrition Journal"
        subtitle="Select from seeded database or filtered Indian staples"
        maxWidth="580px"
      >
        <form onSubmit={handleLogMeal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Meal Slot</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack / Pre-Workout</option>
              </select>
            </div>

            <Input
              label="Servings Multiplier"
              type="number"
              step="0.25"
              min="0.25"
              max="20"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['ALL', 'INDIAN', 'PROTEIN', 'CARBS', 'HEALTHY_FATS', 'VEGETABLES'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: categoryFilter === cat ? 'var(--color-primary)' : '#FFFFFF',
                  color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-main)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Food Search and Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Input
              placeholder="Search food by name..."
              icon={Search}
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
            />

            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Food Item *</label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
              required
            >
              <option value="">-- Choose a food item --</option>
              {filteredFoods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.calories} kcal • {f.proteinGrams}g P / {f.servingSize}{f.servingUnit})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Cooked with ghee, added extra cucumber"
            value={mealNotes}
            onChange={(e) => setMealNotes(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log Food
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Adjust Targets */}
      <Modal
        isOpen={isTargetsModalOpen}
        onClose={() => setIsTargetsModalOpen(false)}
        title="Customize Daily Nutrition Targets"
        subtitle="Set personalized macronutrient goals and hydration targets"
        maxWidth="500px"
      >
        <form onSubmit={handleUpdateTargets} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <Input
            label="Daily Caloric Target (kcal)"
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(e.target.value)}
            required
          />

          <Input
            label="Daily Protein Target (grams)"
            type="number"
            value={targetProtein}
            onChange={(e) => setTargetProtein(e.target.value)}
            required
          />

          <Input
            label="Daily Carbohydrates Target (grams)"
            type="number"
            value={targetCarbs}
            onChange={(e) => setTargetCarbs(e.target.value)}
            required
          />

          <Input
            label="Daily Fat Target (grams)"
            type="number"
            value={targetFat}
            onChange={(e) => setTargetFat(e.target.value)}
            required
          />

          <Input
            label="Water Intake Target (ml)"
            type="number"
            value={targetWater}
            onChange={(e) => setTargetWater(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsTargetsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Targets
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
