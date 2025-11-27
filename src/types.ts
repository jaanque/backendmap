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
    };
  };
};
