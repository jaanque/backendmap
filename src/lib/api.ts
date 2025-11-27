import { supabase } from './supabase';
import type { Scenario, Step } from '../types';

export async function getScenarios(): Promise<Scenario[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase.from('scenarios').select('*');
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

export async function getSteps(scenarioId: string): Promise<Step[]> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase.from('steps').select('*').eq('scenario_id', scenarioId).order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
}
