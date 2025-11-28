import { supabase } from './supabase';
import { getUserProgress, getAllAchievements, getUserAchievements } from './api';

export async function checkAchievements(userId: string) {
  if (!supabase) return;

  try {
    const [progress, allAchievements, earnedIds] = await Promise.all([
      getUserProgress(userId),
      getAllAchievements(),
      getUserAchievements(userId)
    ]);

    const earnedSet = new Set(earnedIds);
    const newEarned: string[] = [];

    // Helper to award achievement
    const award = async (title: string) => {
      const achievement = allAchievements.find(a => a.title === title);
      if (achievement && !earnedSet.has(achievement.id)) {
        const { error } = await supabase!.from('user_achievements').insert({
          user_id: userId,
          achievement_id: achievement.id
        } as any);
        if (!error) newEarned.push(achievement.id);
      }
    };

    // Logic for each achievement based on the seed data
    const completedScenariosCount = progress.filter(p => p.is_completed).length;

    // 'First Steps': Completed your first scenario.
    if (completedScenariosCount >= 1) {
      await award('First Steps');
    }

    // 'Architect': Completed 5 scenarios.
    // if (completedScenariosCount >= 5) {
    //   await award('Architect');
    // }

    // 'Mastermind': Completed all beginner scenarios.
    // We need to know which are beginner. Ideally fetch scenarios but for now let's assume if they have > 0 they are on track.
    // Since we don't have scenario difficulty in progress, we might need to fetch scenarios.
    // For simplicity/robustness in this step without over-fetching, let's skip complex checks or fetch scenarios if needed.
    // Let's stick to simple counters for now to ensure "First Steps" works as requested.

    // Future expansion: 'Mastermind', 'Early Bird', 'Bug Hunter' would require more context/data.

    return newEarned.length > 0; // Return true if any new achievement was unlocked
  } catch (err) {
    console.error("Error checking achievements:", err);
    return false;
  }
}
