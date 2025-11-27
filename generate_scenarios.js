import fs from 'fs';
import { randomUUID } from 'crypto';

const generateUUID = () => {
    return randomUUID();
};

const escapeSql = (str) => {
    return str.replace(/'/g, "''");
};

const scenarios = [];
const steps = [];

// --- Scenario 1: Simple (Ping Pong) ---
const simpleId = generateUUID();
const simpleFlow = {
    initialNodes: [
        { id: "ping", type: "custom", position: { x: 100, y: 100 }, data: { label: "Ping Service", icon: "server" } },
        { id: "pong", type: "custom", position: { x: 400, y: 100 }, data: { label: "Pong Service", icon: "server" } }
    ],
    initialEdges: [
        { id: "e1", source: "ping", target: "pong" },
        { id: "e2", source: "pong", target: "ping" }
    ]
};

scenarios.push({
    id: simpleId,
    slug: 'ping-pong',
    title: 'Ping Pong Protocol',
    description: 'A simple request-response cycle between two servers.',
    difficulty: 'Beginner',
    flow_data: JSON.stringify(simpleFlow)
});

steps.push(
    { scenario_id: simpleId, order_index: 1, title: 'Ping', content: 'Server A sends a Ping request to check availability.', active_node_id: 'ping', active_edge_id: null },
    { scenario_id: simpleId, order_index: 2, title: 'Pong', content: 'Server B receives the request and replies with Pong.', active_node_id: 'pong', active_edge_id: 'e1' },
    { scenario_id: simpleId, order_index: 3, title: 'Return', content: 'Server A receives the Pong response. Connection verified.', active_node_id: 'ping', active_edge_id: 'e2' }
);


// --- Scenario 2: Medium (Auth Flow) ---
const medId = generateUUID();
const medFlow = {
    initialNodes: [
        { id: "client", type: "custom", position: { x: 50, y: 150 }, data: { label: "Client App", icon: "monitor" } },
        { id: "lb", type: "custom", position: { x: 250, y: 150 }, data: { label: "Load Balancer", icon: "server" } },
        { id: "auth", type: "custom", position: { x: 450, y: 50 }, data: { label: "Auth Service", icon: "cpu" } },
        { id: "user-db", type: "custom", position: { x: 650, y: 50 }, data: { label: "User DB", icon: "database" } },
        { id: "app", type: "custom", position: { x: 450, y: 250 }, data: { label: "App Service", icon: "server" } },
        { id: "cache", type: "custom", position: { x: 650, y: 250 }, data: { label: "Redis Cache", icon: "database" } }
    ],
    initialEdges: [
        { id: "e1", source: "client", target: "lb" },
        { id: "e2", source: "lb", target: "auth" },
        { id: "e3", source: "auth", target: "user-db" },
        { id: "e4", source: "auth", target: "client" },
        { id: "e5", source: "client", target: "lb" },
        { id: "e6", source: "lb", target: "app" },
        { id: "e7", source: "app", target: "cache" }
    ]
};

scenarios.push({
    id: medId,
    slug: 'auth-flow-jwt',
    title: 'JWT Authentication Flow',
    description: 'Understand how a modern web app authenticates users and issues tokens.',
    difficulty: 'Intermediate',
    flow_data: JSON.stringify(medFlow)
});

steps.push(
    { scenario_id: medId, order_index: 1, title: 'Login Request', content: 'User enters credentials. Client sends POST /login.', active_node_id: 'client', active_edge_id: null },
    { scenario_id: medId, order_index: 2, title: 'Routing', content: 'Load Balancer routes the request to the Auth Service.', active_node_id: 'lb', active_edge_id: 'e1' },
    { scenario_id: medId, order_index: 3, title: 'Validation', content: 'Auth Service checks the credentials format.', active_node_id: 'auth', active_edge_id: 'e2' },
    { scenario_id: medId, order_index: 4, title: 'DB Lookup', content: 'Auth Service hashes the password and compares it with the User DB.', active_node_id: 'user-db', active_edge_id: 'e3' },
    { scenario_id: medId, order_index: 5, title: 'Token Issue', content: 'Credentials match. Auth Service generates a JWT signed with a secret.', active_node_id: 'auth', active_edge_id: null },
    { scenario_id: medId, order_index: 6, title: 'Response', content: 'Client receives the JWT and stores it in localStorage/cookies.', active_node_id: 'client', active_edge_id: 'e4' },
    { scenario_id: medId, order_index: 7, title: 'Authenticated Request', content: 'Client requests profile data, attaching the JWT in the headers.', active_node_id: 'client', active_edge_id: 'e5' },
    { scenario_id: medId, order_index: 8, title: 'Verification', content: 'App Service verifies the JWT signature before processing.', active_node_id: 'app', active_edge_id: 'e6' },
    { scenario_id: medId, order_index: 9, title: 'Cache Hit', content: 'App Service checks Redis for cached profile data.', active_node_id: 'cache', active_edge_id: 'e7' },
    { scenario_id: medId, order_index: 10, title: 'Complete', content: 'Data returned to user.', active_node_id: 'client', active_edge_id: null }
);


// --- Scenario 3: The 200 Step Challenge ---
const hardId = generateUUID();
const hardNodes = [];
const hardEdges = [];
const hardSteps = [];

const cols = 10;
// We need 200 nodes.
for (let i = 0; i < 200; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const nodeId = `node-${i}`;

    hardNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: c * 200, y: r * 150 },
        data: {
            label: `Svc-${i}`,
            icon: i % 5 === 0 ? "database" : (i % 3 === 0 ? "cloud" : "server")
        }
    });

    if (i > 0) {
        hardEdges.push({
            id: `edge-${i}`,
            source: `node-${i-1}`,
            target: nodeId
        });
    }

    hardSteps.push({
        scenario_id: hardId,
        order_index: i + 1,
        title: `Hop ${i+1}`,
        content: `Data packet travels from node ${i-1 < 0 ? 'Start' : i-1} to node ${i} in the mesh.`,
        active_node_id: nodeId,
        active_edge_id: i > 0 ? `edge-${i}` : null
    });
}

scenarios.push({
    id: hardId,
    slug: 'microservices-mesh-trace',
    title: 'The Mega-Mesh Trace (200 Steps)',
    description: 'A stress test for the visualization engine. Follow a packet through 200 microservices.',
    difficulty: 'Advanced',
    flow_data: JSON.stringify({ initialNodes: hardNodes, initialEdges: hardEdges })
});

steps.push(...hardSteps);


// --- Generate SQL ---

let sql = `-- Generated Seed Data for BackendMap\n\n`;

// Insert Scenarios
scenarios.forEach(s => {
    sql += `INSERT INTO scenarios (id, slug, title, description, difficulty, flow_data) VALUES (\n`;
    sql += `  '${s.id}', '${s.slug}', '${escapeSql(s.title)}', '${escapeSql(s.description)}', '${s.difficulty}', '${s.flow_data}'::jsonb\n`;
    sql += `) ON CONFLICT (slug) DO NOTHING;\n\n`;
});

// Insert Steps
steps.forEach(s => {
    sql += `INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (\n`;
    sql += `  '${s.scenario_id}', ${s.order_index}, '${escapeSql(s.title)}', '${escapeSql(s.content)}', '${s.active_node_id}', ${s.active_edge_id ? `'${s.active_edge_id}'` : 'NULL'}\n`;
    sql += `);\n`;
});

fs.writeFileSync('sqlscripts/extended_seed.sql', sql);
console.log('Successfully generated sqlscripts/extended_seed.sql');
