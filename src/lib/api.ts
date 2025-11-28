import { supabase } from './supabase';
import type { Scenario, Step, UserProgress, Profile, Achievement } from '../types';

export async function getAllAchievements(): Promise<Achievement[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase.from('achievements').select('*').order('title');
  if (error) throw error;
  return data || [];
}

export async function getUserAchievements(userId: string): Promise<string[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data as any[]).map(ua => ua.achievement_id);
}

export async function getUserAchievementsWithDetails(userId: string): Promise<Achievement[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  // Supabase join syntax: user_achievements ( achievements (...) )
  // But strictly, foreign key is on user_achievements.achievement_id -> achievements.id
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievements(*)')
    .eq('user_id', userId);

  if (error) throw error;

  // Flatten the result
  return (data as any[]).map(item => item.achievements) as Achievement[];
}

export async function getScenariosByAuthor(authorId: string): Promise<Scenario[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  // Include step count
  const { data, error } = await supabase
    .from('scenarios')
    .select('*, steps(count)')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function updateProfile(userId: string, data: Partial<Profile>) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...data, updated_at: new Date().toISOString() } as any);

  if (error) throw error;
}

export async function getPublicProfiles(): Promise<Profile[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .order('first_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getScenarios(): Promise<Scenario[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  // Include step count
  const { data, error } = await supabase.from('scenarios').select('*, steps(count)');
  if (error) throw error;
  return data || [];
}

export async function getScenarioBySlug(slug: string): Promise<Scenario | null> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase.from('scenarios').select('*').eq('slug', slug).single();
  if (error) return null;
  return data;
}

export async function checkSlugAvailability(slug: string): Promise<boolean> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { count, error } = await supabase
    .from('scenarios')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug);

  if (error) throw error;
  return count === 0;
}

export async function createScenario(scenario: Omit<Scenario, 'id' | 'created_at'>): Promise<Scenario> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  // Note: RLS should handle user validation, but we assume the caller provides author_id if needed
  const { data, error } = await supabase
    .from('scenarios')
    .insert(scenario as any)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createSteps(steps: Omit<Step, 'id'>[]) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { error } = await supabase
    .from('steps')
    .insert(steps as any);

  if (error) throw error;
}

export async function getSteps(scenarioId: string): Promise<Step[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase.from('steps').select('*').eq('scenario_id', scenarioId).order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function saveUserProgress(userId: string, scenarioId: string, stepIndex: number, isCompleted: boolean) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  // Upsert progress
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        scenario_id: scenarioId,
        current_step_index: stepIndex,
        is_completed: isCompleted,
      } as any, // Cast to any because TS inference for upsert seems tricky here
      { onConflict: 'user_id,scenario_id' }
    );

  if (error) throw error;
}

export async function getSingleScenarioProgress(userId: string, scenarioId: string): Promise<UserProgress | null> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('scenario_id', scenarioId)
    .single();

    if (error && error.code !== 'PGRST116') return null; // PGRST116 is not found
    return data;
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('scenario_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data as any[]).map(f => f.scenario_id);
}

export async function setFavorite(userId: string, scenarioId: string, shouldBeFavorite: boolean) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  if (shouldBeFavorite) {
    // Add favorite
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, scenario_id: scenarioId } as any);

    // Ignore duplicate key error (already exists)
    if (error && error.code !== '23505') throw error;
  } else {
    // Remove favorite
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId);
    if (error) throw error;
  }
}
