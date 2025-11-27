import { supabase } from './supabase';
import type { Scenario, Step } from '../types';

const MOCK_SCENARIOS: Scenario[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    slug: 'amazon-buy',
    title: 'Compra en Amazon',
    description: 'Descubre qué ocurre cuando haces clic en el botón de comprar. Desde el frontend hasta la base de datos.',
    difficulty: 'Beginner',
    created_at: new Date().toISOString(),
    flow_data: {
      initialNodes: [
        { id: "user", type: "custom", position: { x: 100, y: 100 }, data: { label: "User (Browser)", icon: "monitor" } },
        { id: "api-gateway", type: "custom", position: { x: 350, y: 100 }, data: { label: "API Gateway", icon: "server" } },
        { id: "order-service", type: "custom", position: { x: 600, y: 100 }, data: { label: "Order Service", icon: "cpu" } },
        { id: "db", type: "custom", position: { x: 850, y: 100 }, data: { label: "Database", icon: "database" } }
      ],
      initialEdges: [
        { id: "e1", source: "user", target: "api-gateway" },
        { id: "e2", source: "api-gateway", "target": "order-service" },
        { id: "e3", "source": "order-service", "target": "db" }
      ]
    }
  }
];

const MOCK_STEPS: Step[] = [
  { id: '1', scenario_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', order_index: 1, title: 'Inicio de la Compra', content: 'El usuario hace clic en el botón "Comprar". El navegador prepara la solicitud HTTP con los detalles del producto.', active_node_id: 'user', active_edge_id: null },
  { id: '2', scenario_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', order_index: 2, title: 'API Gateway', content: 'La solicitud llega al API Gateway. Este componente actúa como la puerta de entrada, verificando la autenticación y enrutando la petición al servicio correcto.', active_node_id: 'api-gateway', active_edge_id: 'e1' },
  { id: '3', scenario_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', order_index: 3, title: 'Procesamiento de la Orden', content: 'El servicio de órdenes recibe la petición. Aquí se valida el stock, se calcula el precio final y se inicia la transacción.', active_node_id: 'order-service', active_edge_id: 'e2' },
  { id: '4', scenario_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', order_index: 4, title: 'Persistencia de Datos', content: 'Finalmente, la orden se guarda en la base de datos para asegurar que no se pierda la información.', active_node_id: 'db', active_edge_id: 'e3' }
];

export async function getScenarios(): Promise<Scenario[]> {
  if (supabase) {
    const { data, error } = await supabase.from('scenarios').select('*');
    if (error) throw error;
    return data || [];
  }
  return Promise.resolve(MOCK_SCENARIOS);
}

export async function getScenarioBySlug(slug: string): Promise<Scenario | null> {
  if (supabase) {
    const { data, error } = await supabase.from('scenarios').select('*').eq('slug', slug).single();
    if (error) return null; // Or throw
    return data;
  }
  return Promise.resolve(MOCK_SCENARIOS.find(s => s.slug === slug) || null);
}

export async function getSteps(scenarioId: string): Promise<Step[]> {
  if (supabase) {
    const { data, error } = await supabase.from('steps').select('*').eq('scenario_id', scenarioId).order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  return Promise.resolve(MOCK_STEPS.filter(s => s.scenario_id === scenarioId).sort((a, b) => a.order_index - b.order_index));
}
