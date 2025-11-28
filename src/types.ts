import type { Edge, Node } from '@xyflow/react';

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  flow_data: {
    initialNodes: Node[];
    initialEdges: Edge[];
  };
  created_at: string;
  steps?: { count: number }[]; // For aggregated count
}

export interface Step {
  id: string;
  scenario_id: string;
  order_index: number;
  title: string;
  content: string;
  active_node_id: string | null;
  active_edge_id: string | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  scenario_id: string;
  current_step_index: number;
  is_completed: boolean;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  scenario_id: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  sex: string | null;
  is_public: boolean | null;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'created_at'>;
        Update: Partial<Achievement>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, 'id' | 'earned_at'>;
        Update: Partial<UserAchievement>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'updated_at'>>;
      };
      scenarios: {
        Row: Scenario;
        Insert: Omit<Scenario, 'id' | 'created_at'>;
        Update: Partial<Scenario>;
      };
      steps: {
        Row: Step;
        Insert: Omit<Step, 'id'>;
        Update: Partial<Step>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'updated_at'>;
        Update: Partial<UserProgress>;
      };
      user_favorites: {
        Row: UserFavorite;
        Insert: Omit<UserFavorite, 'id' | 'created_at'>;
        Update: Partial<UserFavorite>;
      };
    };
  };
};
