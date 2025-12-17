import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StreakData {
  streakDays: number;
  lastActivityAt: string | null;
  isStreakActive: boolean;
  todayCompleted: boolean;
}

export const useStreak = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    streakDays: 0,
    lastActivityAt: null,
    isStreakActive: false,
    todayCompleted: false,
  });
  const [loading, setLoading] = useState(true);

  const checkStreak = useCallback(async () => {
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('streak_days, last_activity_at')
      .eq('user_id', user.id)
      .single();

    if (error || !profile) {
      setLoading(false);
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActivity = profile.last_activity_at ? new Date(profile.last_activity_at) : null;
    const lastActivityDay = lastActivity 
      ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate())
      : null;

    const todayCompleted = lastActivityDay?.getTime() === today.getTime();
    
    // Check if streak is still active (last activity was today or yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isStreakActive = lastActivityDay 
      ? (lastActivityDay.getTime() >= yesterday.getTime())
      : false;

    // If streak is broken (more than 1 day gap), reset it
    if (!isStreakActive && profile.streak_days > 0) {
      await supabase
        .from('profiles')
        .update({ streak_days: 0 })
        .eq('user_id', user.id);

      setStreakData({
        streakDays: 0,
        lastActivityAt: profile.last_activity_at,
        isStreakActive: false,
        todayCompleted: false,
      });
    } else {
      setStreakData({
        streakDays: profile.streak_days || 0,
        lastActivityAt: profile.last_activity_at,
        isStreakActive,
        todayCompleted,
      });
    }

    setLoading(false);
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return { newStreak: 0, isNewDay: false };

    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_days, last_activity_at')
      .eq('user_id', user.id)
      .single();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActivity = profile?.last_activity_at ? new Date(profile.last_activity_at) : null;
    const lastActivityDay = lastActivity 
      ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate())
      : null;

    // Already logged today
    if (lastActivityDay?.getTime() === today.getTime()) {
      return { newStreak: profile?.streak_days || 0, isNewDay: false };
    }

    // Check if continuing streak (last activity was yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isContinuingStreak = lastActivityDay?.getTime() === yesterday.getTime();

    const newStreakDays = isContinuingStreak 
      ? (profile?.streak_days || 0) + 1 
      : 1;

    await supabase
      .from('profiles')
      .update({ 
        streak_days: newStreakDays,
        last_activity_at: now.toISOString()
      })
      .eq('user_id', user.id);

    setStreakData({
      streakDays: newStreakDays,
      lastActivityAt: now.toISOString(),
      isStreakActive: true,
      todayCompleted: true,
    });

    return { newStreak: newStreakDays, isNewDay: true };
  }, [user]);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  return {
    ...streakData,
    loading,
    updateStreak,
    checkStreak,
  };
};
