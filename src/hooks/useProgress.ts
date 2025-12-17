import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LessonProgress {
  item_id: string;
  is_memorized: boolean;
  times_reviewed: number;
}

interface ProgressData {
  level: number;
  progress: LessonProgress[];
  totalItems: number;
  memorizedCount: number;
}

export const useProgress = () => {
  const { user } = useAuth();
  const [progressByLevel, setProgressByLevel] = useState<Record<number, ProgressData>>({});
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch lesson progress
      const { data: lessonData, error: lessonError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (lessonError) throw lessonError;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('current_level, total_points')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setCurrentLevel(profileData.current_level || 1);
        setTotalPoints(profileData.total_points || 0);
      }

      // Group progress by level
      const grouped: Record<number, LessonProgress[]> = {};
      lessonData?.forEach(item => {
        if (!grouped[item.level]) grouped[item.level] = [];
        grouped[item.level].push({
          item_id: item.item_id,
          is_memorized: item.is_memorized,
          times_reviewed: item.times_reviewed,
        });
      });

      // Calculate progress data
      const levelCounts: Record<number, number> = { 1: 40, 2: 80, 3: 25, 4: 30 };
      const progressData: Record<number, ProgressData> = {};
      
      [1, 2, 3, 4].forEach(level => {
        const progress = grouped[level] || [];
        const memorizedCount = progress.filter(p => p.is_memorized).length;
        progressData[level] = {
          level,
          progress,
          totalItems: levelCounts[level],
          memorizedCount,
        };
      });

      setProgressByLevel(progressData);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markAsMemorized = async (level: number, lessonType: string, itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          level,
          lesson_type: lessonType,
          item_id: itemId,
          is_memorized: true,
          times_reviewed: 1,
          last_reviewed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,level,lesson_type,item_id'
        });

      if (error) throw error;

      // Update points
      await supabase
        .from('profiles')
        .update({ 
          total_points: totalPoints + 10,
          last_activity_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setTotalPoints(prev => prev + 10);
      await fetchProgress();
    } catch (error) {
      console.error('Error marking as memorized:', error);
    }
  };

  const unmarkAsMemorized = async (level: number, lessonType: string, itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .update({ is_memorized: false })
        .eq('user_id', user.id)
        .eq('level', level)
        .eq('lesson_type', lessonType)
        .eq('item_id', itemId);

      if (error) throw error;
      await fetchProgress();
    } catch (error) {
      console.error('Error unmarking:', error);
    }
  };

  const updateLevel = async (newLevel: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ current_level: newLevel })
        .eq('user_id', user.id);

      if (error) throw error;
      setCurrentLevel(newLevel);
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  const isLevelUnlocked = (level: number): boolean => {
    if (level === 1) return true;
    const prevLevel = progressByLevel[level - 1];
    if (!prevLevel) return false;
    return prevLevel.memorizedCount >= prevLevel.totalItems * 0.7; // 70% to unlock
  };

  const getLevelProgress = (level: number): number => {
    const data = progressByLevel[level];
    if (!data || data.totalItems === 0) return 0;
    return Math.round((data.memorizedCount / data.totalItems) * 100);
  };

  return {
    progressByLevel,
    currentLevel,
    totalPoints,
    loading,
    markAsMemorized,
    unmarkAsMemorized,
    updateLevel,
    isLevelUnlocked,
    getLevelProgress,
    refreshProgress: fetchProgress,
  };
};
