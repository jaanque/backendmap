-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: scenarios
create table scenarios (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  difficulty text default 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
  flow_data jsonb default '{"initialNodes": [], "initialEdges": []}'::jsonb,
  created_at timestamptz default now()
);

-- Table: steps
create table steps (
  id uuid primary key default uuid_generate_v4(),
  scenario_id uuid references scenarios(id) on delete cascade,
  order_index int not null,
  title text not null,
  content text,
  active_node_id text,
  active_edge_id text
);

-- Indexes
create index idx_scenarios_slug on scenarios(slug);
create index idx_steps_scenario_id on steps(scenario_id);
insert into scenarios (id, slug, title, description, difficulty, flow_data)
values (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'amazon-buy',
  'Compra en Amazon',
  'Descubre qué ocurre cuando haces clic en el botón de comprar. Desde el frontend hasta la base de datos.',
  'Beginner',
  '{
    "initialNodes": [
      { "id": "user", "type": "custom", "position": { "x": 100, "y": 100 }, "data": { "label": "User (Browser)", "icon": "monitor" } },
      { "id": "api-gateway", "type": "custom", "position": { "x": 350, "y": 100 }, "data": { "label": "API Gateway", "icon": "server" } },
      { "id": "order-service", "type": "custom", "position": { "x": 600, "y": 100 }, "data": { "label": "Order Service", "icon": "cpu" } },
      { "id": "db", "type": "custom", "position": { "x": 850, "y": 100 }, "data": { "label": "Database", "icon": "database" } }
    ],
    "initialEdges": [
      { "id": "e1", "source": "user", "target": "api-gateway" },
      { "id": "e2", "source": "api-gateway", "target": "order-service" },
      { "id": "e3", "source": "order-service", "target": "db" }
    ]
  }'::jsonb
);

insert into steps (scenario_id, order_index, title, content, active_node_id, active_edge_id)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Inicio de la Compra', 'El usuario hace clic en el botón "Comprar". El navegador prepara la solicitud HTTP con los detalles del producto.', 'user', null),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'API Gateway', 'La solicitud llega al API Gateway. Este componente actúa como la puerta de entrada, verificando la autenticación y enrutando la petición al servicio correcto.', 'api-gateway', 'e1'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, 'Procesamiento de la Orden', 'El servicio de órdenes recibe la petición. Aquí se valida el stock, se calcula el precio final y se inicia la transacción.', 'order-service', 'e2'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, 'Persistencia de Datos', 'Finalmente, la orden se guarda en la base de datos para asegurar que no se pierda la información.', 'db', 'e3');
