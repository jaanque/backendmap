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

export type Database = {
  public: {
    Tables: {
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
