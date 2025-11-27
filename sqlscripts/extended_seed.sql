-- Generated Seed Data for BackendMap

INSERT INTO scenarios (id, slug, title, description, difficulty, flow_data) VALUES (
  'f37341ac-71d7-4bb0-827d-39dac9043458', 'ping-pong', 'Ping Pong Protocol', 'A simple request-response cycle between two servers.', 'Beginner', '{"initialNodes":[{"id":"ping","type":"custom","position":{"x":100,"y":100},"data":{"label":"Ping Service","icon":"server"}},{"id":"pong","type":"custom","position":{"x":400,"y":100},"data":{"label":"Pong Service","icon":"server"}}],"initialEdges":[{"id":"e1","source":"ping","target":"pong"},{"id":"e2","source":"pong","target":"ping"}]}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO scenarios (id, slug, title, description, difficulty, flow_data) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 'auth-flow-jwt', 'JWT Authentication Flow', 'Understand how a modern web app authenticates users and issues tokens.', 'Intermediate', '{"initialNodes":[{"id":"client","type":"custom","position":{"x":50,"y":150},"data":{"label":"Client App","icon":"monitor"}},{"id":"lb","type":"custom","position":{"x":250,"y":150},"data":{"label":"Load Balancer","icon":"server"}},{"id":"auth","type":"custom","position":{"x":450,"y":50},"data":{"label":"Auth Service","icon":"cpu"}},{"id":"user-db","type":"custom","position":{"x":650,"y":50},"data":{"label":"User DB","icon":"database"}},{"id":"app","type":"custom","position":{"x":450,"y":250},"data":{"label":"App Service","icon":"server"}},{"id":"cache","type":"custom","position":{"x":650,"y":250},"data":{"label":"Redis Cache","icon":"database"}}],"initialEdges":[{"id":"e1","source":"client","target":"lb"},{"id":"e2","source":"lb","target":"auth"},{"id":"e3","source":"auth","target":"user-db"},{"id":"e4","source":"auth","target":"client"},{"id":"e5","source":"client","target":"lb"},{"id":"e6","source":"lb","target":"app"},{"id":"e7","source":"app","target":"cache"}]}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO scenarios (id, slug, title, description, difficulty, flow_data) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 'microservices-mesh-trace', 'The Mega-Mesh Trace (200 Steps)', 'A stress test for the visualization engine. Follow a packet through 200 microservices.', 'Advanced', '{"initialNodes":[{"id":"node-0","type":"custom","position":{"x":0,"y":0},"data":{"label":"Svc-0","icon":"database"}},{"id":"node-1","type":"custom","position":{"x":200,"y":0},"data":{"label":"Svc-1","icon":"server"}},{"id":"node-2","type":"custom","position":{"x":400,"y":0},"data":{"label":"Svc-2","icon":"server"}},{"id":"node-3","type":"custom","position":{"x":600,"y":0},"data":{"label":"Svc-3","icon":"cloud"}},{"id":"node-4","type":"custom","position":{"x":800,"y":0},"data":{"label":"Svc-4","icon":"server"}},{"id":"node-5","type":"custom","position":{"x":1000,"y":0},"data":{"label":"Svc-5","icon":"database"}},{"id":"node-6","type":"custom","position":{"x":1200,"y":0},"data":{"label":"Svc-6","icon":"cloud"}},{"id":"node-7","type":"custom","position":{"x":1400,"y":0},"data":{"label":"Svc-7","icon":"server"}},{"id":"node-8","type":"custom","position":{"x":1600,"y":0},"data":{"label":"Svc-8","icon":"server"}},{"id":"node-9","type":"custom","position":{"x":1800,"y":0},"data":{"label":"Svc-9","icon":"cloud"}},{"id":"node-10","type":"custom","position":{"x":0,"y":150},"data":{"label":"Svc-10","icon":"database"}},{"id":"node-11","type":"custom","position":{"x":200,"y":150},"data":{"label":"Svc-11","icon":"server"}},{"id":"node-12","type":"custom","position":{"x":400,"y":150},"data":{"label":"Svc-12","icon":"cloud"}},{"id":"node-13","type":"custom","position":{"x":600,"y":150},"data":{"label":"Svc-13","icon":"server"}},{"id":"node-14","type":"custom","position":{"x":800,"y":150},"data":{"label":"Svc-14","icon":"server"}},{"id":"node-15","type":"custom","position":{"x":1000,"y":150},"data":{"label":"Svc-15","icon":"database"}},{"id":"node-16","type":"custom","position":{"x":1200,"y":150},"data":{"label":"Svc-16","icon":"server"}},{"id":"node-17","type":"custom","position":{"x":1400,"y":150},"data":{"label":"Svc-17","icon":"server"}},{"id":"node-18","type":"custom","position":{"x":1600,"y":150},"data":{"label":"Svc-18","icon":"cloud"}},{"id":"node-19","type":"custom","position":{"x":1800,"y":150},"data":{"label":"Svc-19","icon":"server"}},{"id":"node-20","type":"custom","position":{"x":0,"y":300},"data":{"label":"Svc-20","icon":"database"}},{"id":"node-21","type":"custom","position":{"x":200,"y":300},"data":{"label":"Svc-21","icon":"cloud"}},{"id":"node-22","type":"custom","position":{"x":400,"y":300},"data":{"label":"Svc-22","icon":"server"}},{"id":"node-23","type":"custom","position":{"x":600,"y":300},"data":{"label":"Svc-23","icon":"server"}},{"id":"node-24","type":"custom","position":{"x":800,"y":300},"data":{"label":"Svc-24","icon":"cloud"}},{"id":"node-25","type":"custom","position":{"x":1000,"y":300},"data":{"label":"Svc-25","icon":"database"}},{"id":"node-26","type":"custom","position":{"x":1200,"y":300},"data":{"label":"Svc-26","icon":"server"}},{"id":"node-27","type":"custom","position":{"x":1400,"y":300},"data":{"label":"Svc-27","icon":"cloud"}},{"id":"node-28","type":"custom","position":{"x":1600,"y":300},"data":{"label":"Svc-28","icon":"server"}},{"id":"node-29","type":"custom","position":{"x":1800,"y":300},"data":{"label":"Svc-29","icon":"server"}},{"id":"node-30","type":"custom","position":{"x":0,"y":450},"data":{"label":"Svc-30","icon":"database"}},{"id":"node-31","type":"custom","position":{"x":200,"y":450},"data":{"label":"Svc-31","icon":"server"}},{"id":"node-32","type":"custom","position":{"x":400,"y":450},"data":{"label":"Svc-32","icon":"server"}},{"id":"node-33","type":"custom","position":{"x":600,"y":450},"data":{"label":"Svc-33","icon":"cloud"}},{"id":"node-34","type":"custom","position":{"x":800,"y":450},"data":{"label":"Svc-34","icon":"server"}},{"id":"node-35","type":"custom","position":{"x":1000,"y":450},"data":{"label":"Svc-35","icon":"database"}},{"id":"node-36","type":"custom","position":{"x":1200,"y":450},"data":{"label":"Svc-36","icon":"cloud"}},{"id":"node-37","type":"custom","position":{"x":1400,"y":450},"data":{"label":"Svc-37","icon":"server"}},{"id":"node-38","type":"custom","position":{"x":1600,"y":450},"data":{"label":"Svc-38","icon":"server"}},{"id":"node-39","type":"custom","position":{"x":1800,"y":450},"data":{"label":"Svc-39","icon":"cloud"}},{"id":"node-40","type":"custom","position":{"x":0,"y":600},"data":{"label":"Svc-40","icon":"database"}},{"id":"node-41","type":"custom","position":{"x":200,"y":600},"data":{"label":"Svc-41","icon":"server"}},{"id":"node-42","type":"custom","position":{"x":400,"y":600},"data":{"label":"Svc-42","icon":"cloud"}},{"id":"node-43","type":"custom","position":{"x":600,"y":600},"data":{"label":"Svc-43","icon":"server"}},{"id":"node-44","type":"custom","position":{"x":800,"y":600},"data":{"label":"Svc-44","icon":"server"}},{"id":"node-45","type":"custom","position":{"x":1000,"y":600},"data":{"label":"Svc-45","icon":"database"}},{"id":"node-46","type":"custom","position":{"x":1200,"y":600},"data":{"label":"Svc-46","icon":"server"}},{"id":"node-47","type":"custom","position":{"x":1400,"y":600},"data":{"label":"Svc-47","icon":"server"}},{"id":"node-48","type":"custom","position":{"x":1600,"y":600},"data":{"label":"Svc-48","icon":"cloud"}},{"id":"node-49","type":"custom","position":{"x":1800,"y":600},"data":{"label":"Svc-49","icon":"server"}},{"id":"node-50","type":"custom","position":{"x":0,"y":750},"data":{"label":"Svc-50","icon":"database"}},{"id":"node-51","type":"custom","position":{"x":200,"y":750},"data":{"label":"Svc-51","icon":"cloud"}},{"id":"node-52","type":"custom","position":{"x":400,"y":750},"data":{"label":"Svc-52","icon":"server"}},{"id":"node-53","type":"custom","position":{"x":600,"y":750},"data":{"label":"Svc-53","icon":"server"}},{"id":"node-54","type":"custom","position":{"x":800,"y":750},"data":{"label":"Svc-54","icon":"cloud"}},{"id":"node-55","type":"custom","position":{"x":1000,"y":750},"data":{"label":"Svc-55","icon":"database"}},{"id":"node-56","type":"custom","position":{"x":1200,"y":750},"data":{"label":"Svc-56","icon":"server"}},{"id":"node-57","type":"custom","position":{"x":1400,"y":750},"data":{"label":"Svc-57","icon":"cloud"}},{"id":"node-58","type":"custom","position":{"x":1600,"y":750},"data":{"label":"Svc-58","icon":"server"}},{"id":"node-59","type":"custom","position":{"x":1800,"y":750},"data":{"label":"Svc-59","icon":"server"}},{"id":"node-60","type":"custom","position":{"x":0,"y":900},"data":{"label":"Svc-60","icon":"database"}},{"id":"node-61","type":"custom","position":{"x":200,"y":900},"data":{"label":"Svc-61","icon":"server"}},{"id":"node-62","type":"custom","position":{"x":400,"y":900},"data":{"label":"Svc-62","icon":"server"}},{"id":"node-63","type":"custom","position":{"x":600,"y":900},"data":{"label":"Svc-63","icon":"cloud"}},{"id":"node-64","type":"custom","position":{"x":800,"y":900},"data":{"label":"Svc-64","icon":"server"}},{"id":"node-65","type":"custom","position":{"x":1000,"y":900},"data":{"label":"Svc-65","icon":"database"}},{"id":"node-66","type":"custom","position":{"x":1200,"y":900},"data":{"label":"Svc-66","icon":"cloud"}},{"id":"node-67","type":"custom","position":{"x":1400,"y":900},"data":{"label":"Svc-67","icon":"server"}},{"id":"node-68","type":"custom","position":{"x":1600,"y":900},"data":{"label":"Svc-68","icon":"server"}},{"id":"node-69","type":"custom","position":{"x":1800,"y":900},"data":{"label":"Svc-69","icon":"cloud"}},{"id":"node-70","type":"custom","position":{"x":0,"y":1050},"data":{"label":"Svc-70","icon":"database"}},{"id":"node-71","type":"custom","position":{"x":200,"y":1050},"data":{"label":"Svc-71","icon":"server"}},{"id":"node-72","type":"custom","position":{"x":400,"y":1050},"data":{"label":"Svc-72","icon":"cloud"}},{"id":"node-73","type":"custom","position":{"x":600,"y":1050},"data":{"label":"Svc-73","icon":"server"}},{"id":"node-74","type":"custom","position":{"x":800,"y":1050},"data":{"label":"Svc-74","icon":"server"}},{"id":"node-75","type":"custom","position":{"x":1000,"y":1050},"data":{"label":"Svc-75","icon":"database"}},{"id":"node-76","type":"custom","position":{"x":1200,"y":1050},"data":{"label":"Svc-76","icon":"server"}},{"id":"node-77","type":"custom","position":{"x":1400,"y":1050},"data":{"label":"Svc-77","icon":"server"}},{"id":"node-78","type":"custom","position":{"x":1600,"y":1050},"data":{"label":"Svc-78","icon":"cloud"}},{"id":"node-79","type":"custom","position":{"x":1800,"y":1050},"data":{"label":"Svc-79","icon":"server"}},{"id":"node-80","type":"custom","position":{"x":0,"y":1200},"data":{"label":"Svc-80","icon":"database"}},{"id":"node-81","type":"custom","position":{"x":200,"y":1200},"data":{"label":"Svc-81","icon":"cloud"}},{"id":"node-82","type":"custom","position":{"x":400,"y":1200},"data":{"label":"Svc-82","icon":"server"}},{"id":"node-83","type":"custom","position":{"x":600,"y":1200},"data":{"label":"Svc-83","icon":"server"}},{"id":"node-84","type":"custom","position":{"x":800,"y":1200},"data":{"label":"Svc-84","icon":"cloud"}},{"id":"node-85","type":"custom","position":{"x":1000,"y":1200},"data":{"label":"Svc-85","icon":"database"}},{"id":"node-86","type":"custom","position":{"x":1200,"y":1200},"data":{"label":"Svc-86","icon":"server"}},{"id":"node-87","type":"custom","position":{"x":1400,"y":1200},"data":{"label":"Svc-87","icon":"cloud"}},{"id":"node-88","type":"custom","position":{"x":1600,"y":1200},"data":{"label":"Svc-88","icon":"server"}},{"id":"node-89","type":"custom","position":{"x":1800,"y":1200},"data":{"label":"Svc-89","icon":"server"}},{"id":"node-90","type":"custom","position":{"x":0,"y":1350},"data":{"label":"Svc-90","icon":"database"}},{"id":"node-91","type":"custom","position":{"x":200,"y":1350},"data":{"label":"Svc-91","icon":"server"}},{"id":"node-92","type":"custom","position":{"x":400,"y":1350},"data":{"label":"Svc-92","icon":"server"}},{"id":"node-93","type":"custom","position":{"x":600,"y":1350},"data":{"label":"Svc-93","icon":"cloud"}},{"id":"node-94","type":"custom","position":{"x":800,"y":1350},"data":{"label":"Svc-94","icon":"server"}},{"id":"node-95","type":"custom","position":{"x":1000,"y":1350},"data":{"label":"Svc-95","icon":"database"}},{"id":"node-96","type":"custom","position":{"x":1200,"y":1350},"data":{"label":"Svc-96","icon":"cloud"}},{"id":"node-97","type":"custom","position":{"x":1400,"y":1350},"data":{"label":"Svc-97","icon":"server"}},{"id":"node-98","type":"custom","position":{"x":1600,"y":1350},"data":{"label":"Svc-98","icon":"server"}},{"id":"node-99","type":"custom","position":{"x":1800,"y":1350},"data":{"label":"Svc-99","icon":"cloud"}},{"id":"node-100","type":"custom","position":{"x":0,"y":1500},"data":{"label":"Svc-100","icon":"database"}},{"id":"node-101","type":"custom","position":{"x":200,"y":1500},"data":{"label":"Svc-101","icon":"server"}},{"id":"node-102","type":"custom","position":{"x":400,"y":1500},"data":{"label":"Svc-102","icon":"cloud"}},{"id":"node-103","type":"custom","position":{"x":600,"y":1500},"data":{"label":"Svc-103","icon":"server"}},{"id":"node-104","type":"custom","position":{"x":800,"y":1500},"data":{"label":"Svc-104","icon":"server"}},{"id":"node-105","type":"custom","position":{"x":1000,"y":1500},"data":{"label":"Svc-105","icon":"database"}},{"id":"node-106","type":"custom","position":{"x":1200,"y":1500},"data":{"label":"Svc-106","icon":"server"}},{"id":"node-107","type":"custom","position":{"x":1400,"y":1500},"data":{"label":"Svc-107","icon":"server"}},{"id":"node-108","type":"custom","position":{"x":1600,"y":1500},"data":{"label":"Svc-108","icon":"cloud"}},{"id":"node-109","type":"custom","position":{"x":1800,"y":1500},"data":{"label":"Svc-109","icon":"server"}},{"id":"node-110","type":"custom","position":{"x":0,"y":1650},"data":{"label":"Svc-110","icon":"database"}},{"id":"node-111","type":"custom","position":{"x":200,"y":1650},"data":{"label":"Svc-111","icon":"cloud"}},{"id":"node-112","type":"custom","position":{"x":400,"y":1650},"data":{"label":"Svc-112","icon":"server"}},{"id":"node-113","type":"custom","position":{"x":600,"y":1650},"data":{"label":"Svc-113","icon":"server"}},{"id":"node-114","type":"custom","position":{"x":800,"y":1650},"data":{"label":"Svc-114","icon":"cloud"}},{"id":"node-115","type":"custom","position":{"x":1000,"y":1650},"data":{"label":"Svc-115","icon":"database"}},{"id":"node-116","type":"custom","position":{"x":1200,"y":1650},"data":{"label":"Svc-116","icon":"server"}},{"id":"node-117","type":"custom","position":{"x":1400,"y":1650},"data":{"label":"Svc-117","icon":"cloud"}},{"id":"node-118","type":"custom","position":{"x":1600,"y":1650},"data":{"label":"Svc-118","icon":"server"}},{"id":"node-119","type":"custom","position":{"x":1800,"y":1650},"data":{"label":"Svc-119","icon":"server"}},{"id":"node-120","type":"custom","position":{"x":0,"y":1800},"data":{"label":"Svc-120","icon":"database"}},{"id":"node-121","type":"custom","position":{"x":200,"y":1800},"data":{"label":"Svc-121","icon":"server"}},{"id":"node-122","type":"custom","position":{"x":400,"y":1800},"data":{"label":"Svc-122","icon":"server"}},{"id":"node-123","type":"custom","position":{"x":600,"y":1800},"data":{"label":"Svc-123","icon":"cloud"}},{"id":"node-124","type":"custom","position":{"x":800,"y":1800},"data":{"label":"Svc-124","icon":"server"}},{"id":"node-125","type":"custom","position":{"x":1000,"y":1800},"data":{"label":"Svc-125","icon":"database"}},{"id":"node-126","type":"custom","position":{"x":1200,"y":1800},"data":{"label":"Svc-126","icon":"cloud"}},{"id":"node-127","type":"custom","position":{"x":1400,"y":1800},"data":{"label":"Svc-127","icon":"server"}},{"id":"node-128","type":"custom","position":{"x":1600,"y":1800},"data":{"label":"Svc-128","icon":"server"}},{"id":"node-129","type":"custom","position":{"x":1800,"y":1800},"data":{"label":"Svc-129","icon":"cloud"}},{"id":"node-130","type":"custom","position":{"x":0,"y":1950},"data":{"label":"Svc-130","icon":"database"}},{"id":"node-131","type":"custom","position":{"x":200,"y":1950},"data":{"label":"Svc-131","icon":"server"}},{"id":"node-132","type":"custom","position":{"x":400,"y":1950},"data":{"label":"Svc-132","icon":"cloud"}},{"id":"node-133","type":"custom","position":{"x":600,"y":1950},"data":{"label":"Svc-133","icon":"server"}},{"id":"node-134","type":"custom","position":{"x":800,"y":1950},"data":{"label":"Svc-134","icon":"server"}},{"id":"node-135","type":"custom","position":{"x":1000,"y":1950},"data":{"label":"Svc-135","icon":"database"}},{"id":"node-136","type":"custom","position":{"x":1200,"y":1950},"data":{"label":"Svc-136","icon":"server"}},{"id":"node-137","type":"custom","position":{"x":1400,"y":1950},"data":{"label":"Svc-137","icon":"server"}},{"id":"node-138","type":"custom","position":{"x":1600,"y":1950},"data":{"label":"Svc-138","icon":"cloud"}},{"id":"node-139","type":"custom","position":{"x":1800,"y":1950},"data":{"label":"Svc-139","icon":"server"}},{"id":"node-140","type":"custom","position":{"x":0,"y":2100},"data":{"label":"Svc-140","icon":"database"}},{"id":"node-141","type":"custom","position":{"x":200,"y":2100},"data":{"label":"Svc-141","icon":"cloud"}},{"id":"node-142","type":"custom","position":{"x":400,"y":2100},"data":{"label":"Svc-142","icon":"server"}},{"id":"node-143","type":"custom","position":{"x":600,"y":2100},"data":{"label":"Svc-143","icon":"server"}},{"id":"node-144","type":"custom","position":{"x":800,"y":2100},"data":{"label":"Svc-144","icon":"cloud"}},{"id":"node-145","type":"custom","position":{"x":1000,"y":2100},"data":{"label":"Svc-145","icon":"database"}},{"id":"node-146","type":"custom","position":{"x":1200,"y":2100},"data":{"label":"Svc-146","icon":"server"}},{"id":"node-147","type":"custom","position":{"x":1400,"y":2100},"data":{"label":"Svc-147","icon":"cloud"}},{"id":"node-148","type":"custom","position":{"x":1600,"y":2100},"data":{"label":"Svc-148","icon":"server"}},{"id":"node-149","type":"custom","position":{"x":1800,"y":2100},"data":{"label":"Svc-149","icon":"server"}},{"id":"node-150","type":"custom","position":{"x":0,"y":2250},"data":{"label":"Svc-150","icon":"database"}},{"id":"node-151","type":"custom","position":{"x":200,"y":2250},"data":{"label":"Svc-151","icon":"server"}},{"id":"node-152","type":"custom","position":{"x":400,"y":2250},"data":{"label":"Svc-152","icon":"server"}},{"id":"node-153","type":"custom","position":{"x":600,"y":2250},"data":{"label":"Svc-153","icon":"cloud"}},{"id":"node-154","type":"custom","position":{"x":800,"y":2250},"data":{"label":"Svc-154","icon":"server"}},{"id":"node-155","type":"custom","position":{"x":1000,"y":2250},"data":{"label":"Svc-155","icon":"database"}},{"id":"node-156","type":"custom","position":{"x":1200,"y":2250},"data":{"label":"Svc-156","icon":"cloud"}},{"id":"node-157","type":"custom","position":{"x":1400,"y":2250},"data":{"label":"Svc-157","icon":"server"}},{"id":"node-158","type":"custom","position":{"x":1600,"y":2250},"data":{"label":"Svc-158","icon":"server"}},{"id":"node-159","type":"custom","position":{"x":1800,"y":2250},"data":{"label":"Svc-159","icon":"cloud"}},{"id":"node-160","type":"custom","position":{"x":0,"y":2400},"data":{"label":"Svc-160","icon":"database"}},{"id":"node-161","type":"custom","position":{"x":200,"y":2400},"data":{"label":"Svc-161","icon":"server"}},{"id":"node-162","type":"custom","position":{"x":400,"y":2400},"data":{"label":"Svc-162","icon":"cloud"}},{"id":"node-163","type":"custom","position":{"x":600,"y":2400},"data":{"label":"Svc-163","icon":"server"}},{"id":"node-164","type":"custom","position":{"x":800,"y":2400},"data":{"label":"Svc-164","icon":"server"}},{"id":"node-165","type":"custom","position":{"x":1000,"y":2400},"data":{"label":"Svc-165","icon":"database"}},{"id":"node-166","type":"custom","position":{"x":1200,"y":2400},"data":{"label":"Svc-166","icon":"server"}},{"id":"node-167","type":"custom","position":{"x":1400,"y":2400},"data":{"label":"Svc-167","icon":"server"}},{"id":"node-168","type":"custom","position":{"x":1600,"y":2400},"data":{"label":"Svc-168","icon":"cloud"}},{"id":"node-169","type":"custom","position":{"x":1800,"y":2400},"data":{"label":"Svc-169","icon":"server"}},{"id":"node-170","type":"custom","position":{"x":0,"y":2550},"data":{"label":"Svc-170","icon":"database"}},{"id":"node-171","type":"custom","position":{"x":200,"y":2550},"data":{"label":"Svc-171","icon":"cloud"}},{"id":"node-172","type":"custom","position":{"x":400,"y":2550},"data":{"label":"Svc-172","icon":"server"}},{"id":"node-173","type":"custom","position":{"x":600,"y":2550},"data":{"label":"Svc-173","icon":"server"}},{"id":"node-174","type":"custom","position":{"x":800,"y":2550},"data":{"label":"Svc-174","icon":"cloud"}},{"id":"node-175","type":"custom","position":{"x":1000,"y":2550},"data":{"label":"Svc-175","icon":"database"}},{"id":"node-176","type":"custom","position":{"x":1200,"y":2550},"data":{"label":"Svc-176","icon":"server"}},{"id":"node-177","type":"custom","position":{"x":1400,"y":2550},"data":{"label":"Svc-177","icon":"cloud"}},{"id":"node-178","type":"custom","position":{"x":1600,"y":2550},"data":{"label":"Svc-178","icon":"server"}},{"id":"node-179","type":"custom","position":{"x":1800,"y":2550},"data":{"label":"Svc-179","icon":"server"}},{"id":"node-180","type":"custom","position":{"x":0,"y":2700},"data":{"label":"Svc-180","icon":"database"}},{"id":"node-181","type":"custom","position":{"x":200,"y":2700},"data":{"label":"Svc-181","icon":"server"}},{"id":"node-182","type":"custom","position":{"x":400,"y":2700},"data":{"label":"Svc-182","icon":"server"}},{"id":"node-183","type":"custom","position":{"x":600,"y":2700},"data":{"label":"Svc-183","icon":"cloud"}},{"id":"node-184","type":"custom","position":{"x":800,"y":2700},"data":{"label":"Svc-184","icon":"server"}},{"id":"node-185","type":"custom","position":{"x":1000,"y":2700},"data":{"label":"Svc-185","icon":"database"}},{"id":"node-186","type":"custom","position":{"x":1200,"y":2700},"data":{"label":"Svc-186","icon":"cloud"}},{"id":"node-187","type":"custom","position":{"x":1400,"y":2700},"data":{"label":"Svc-187","icon":"server"}},{"id":"node-188","type":"custom","position":{"x":1600,"y":2700},"data":{"label":"Svc-188","icon":"server"}},{"id":"node-189","type":"custom","position":{"x":1800,"y":2700},"data":{"label":"Svc-189","icon":"cloud"}},{"id":"node-190","type":"custom","position":{"x":0,"y":2850},"data":{"label":"Svc-190","icon":"database"}},{"id":"node-191","type":"custom","position":{"x":200,"y":2850},"data":{"label":"Svc-191","icon":"server"}},{"id":"node-192","type":"custom","position":{"x":400,"y":2850},"data":{"label":"Svc-192","icon":"cloud"}},{"id":"node-193","type":"custom","position":{"x":600,"y":2850},"data":{"label":"Svc-193","icon":"server"}},{"id":"node-194","type":"custom","position":{"x":800,"y":2850},"data":{"label":"Svc-194","icon":"server"}},{"id":"node-195","type":"custom","position":{"x":1000,"y":2850},"data":{"label":"Svc-195","icon":"database"}},{"id":"node-196","type":"custom","position":{"x":1200,"y":2850},"data":{"label":"Svc-196","icon":"server"}},{"id":"node-197","type":"custom","position":{"x":1400,"y":2850},"data":{"label":"Svc-197","icon":"server"}},{"id":"node-198","type":"custom","position":{"x":1600,"y":2850},"data":{"label":"Svc-198","icon":"cloud"}},{"id":"node-199","type":"custom","position":{"x":1800,"y":2850},"data":{"label":"Svc-199","icon":"server"}}],"initialEdges":[{"id":"edge-1","source":"node-0","target":"node-1"},{"id":"edge-2","source":"node-1","target":"node-2"},{"id":"edge-3","source":"node-2","target":"node-3"},{"id":"edge-4","source":"node-3","target":"node-4"},{"id":"edge-5","source":"node-4","target":"node-5"},{"id":"edge-6","source":"node-5","target":"node-6"},{"id":"edge-7","source":"node-6","target":"node-7"},{"id":"edge-8","source":"node-7","target":"node-8"},{"id":"edge-9","source":"node-8","target":"node-9"},{"id":"edge-10","source":"node-9","target":"node-10"},{"id":"edge-11","source":"node-10","target":"node-11"},{"id":"edge-12","source":"node-11","target":"node-12"},{"id":"edge-13","source":"node-12","target":"node-13"},{"id":"edge-14","source":"node-13","target":"node-14"},{"id":"edge-15","source":"node-14","target":"node-15"},{"id":"edge-16","source":"node-15","target":"node-16"},{"id":"edge-17","source":"node-16","target":"node-17"},{"id":"edge-18","source":"node-17","target":"node-18"},{"id":"edge-19","source":"node-18","target":"node-19"},{"id":"edge-20","source":"node-19","target":"node-20"},{"id":"edge-21","source":"node-20","target":"node-21"},{"id":"edge-22","source":"node-21","target":"node-22"},{"id":"edge-23","source":"node-22","target":"node-23"},{"id":"edge-24","source":"node-23","target":"node-24"},{"id":"edge-25","source":"node-24","target":"node-25"},{"id":"edge-26","source":"node-25","target":"node-26"},{"id":"edge-27","source":"node-26","target":"node-27"},{"id":"edge-28","source":"node-27","target":"node-28"},{"id":"edge-29","source":"node-28","target":"node-29"},{"id":"edge-30","source":"node-29","target":"node-30"},{"id":"edge-31","source":"node-30","target":"node-31"},{"id":"edge-32","source":"node-31","target":"node-32"},{"id":"edge-33","source":"node-32","target":"node-33"},{"id":"edge-34","source":"node-33","target":"node-34"},{"id":"edge-35","source":"node-34","target":"node-35"},{"id":"edge-36","source":"node-35","target":"node-36"},{"id":"edge-37","source":"node-36","target":"node-37"},{"id":"edge-38","source":"node-37","target":"node-38"},{"id":"edge-39","source":"node-38","target":"node-39"},{"id":"edge-40","source":"node-39","target":"node-40"},{"id":"edge-41","source":"node-40","target":"node-41"},{"id":"edge-42","source":"node-41","target":"node-42"},{"id":"edge-43","source":"node-42","target":"node-43"},{"id":"edge-44","source":"node-43","target":"node-44"},{"id":"edge-45","source":"node-44","target":"node-45"},{"id":"edge-46","source":"node-45","target":"node-46"},{"id":"edge-47","source":"node-46","target":"node-47"},{"id":"edge-48","source":"node-47","target":"node-48"},{"id":"edge-49","source":"node-48","target":"node-49"},{"id":"edge-50","source":"node-49","target":"node-50"},{"id":"edge-51","source":"node-50","target":"node-51"},{"id":"edge-52","source":"node-51","target":"node-52"},{"id":"edge-53","source":"node-52","target":"node-53"},{"id":"edge-54","source":"node-53","target":"node-54"},{"id":"edge-55","source":"node-54","target":"node-55"},{"id":"edge-56","source":"node-55","target":"node-56"},{"id":"edge-57","source":"node-56","target":"node-57"},{"id":"edge-58","source":"node-57","target":"node-58"},{"id":"edge-59","source":"node-58","target":"node-59"},{"id":"edge-60","source":"node-59","target":"node-60"},{"id":"edge-61","source":"node-60","target":"node-61"},{"id":"edge-62","source":"node-61","target":"node-62"},{"id":"edge-63","source":"node-62","target":"node-63"},{"id":"edge-64","source":"node-63","target":"node-64"},{"id":"edge-65","source":"node-64","target":"node-65"},{"id":"edge-66","source":"node-65","target":"node-66"},{"id":"edge-67","source":"node-66","target":"node-67"},{"id":"edge-68","source":"node-67","target":"node-68"},{"id":"edge-69","source":"node-68","target":"node-69"},{"id":"edge-70","source":"node-69","target":"node-70"},{"id":"edge-71","source":"node-70","target":"node-71"},{"id":"edge-72","source":"node-71","target":"node-72"},{"id":"edge-73","source":"node-72","target":"node-73"},{"id":"edge-74","source":"node-73","target":"node-74"},{"id":"edge-75","source":"node-74","target":"node-75"},{"id":"edge-76","source":"node-75","target":"node-76"},{"id":"edge-77","source":"node-76","target":"node-77"},{"id":"edge-78","source":"node-77","target":"node-78"},{"id":"edge-79","source":"node-78","target":"node-79"},{"id":"edge-80","source":"node-79","target":"node-80"},{"id":"edge-81","source":"node-80","target":"node-81"},{"id":"edge-82","source":"node-81","target":"node-82"},{"id":"edge-83","source":"node-82","target":"node-83"},{"id":"edge-84","source":"node-83","target":"node-84"},{"id":"edge-85","source":"node-84","target":"node-85"},{"id":"edge-86","source":"node-85","target":"node-86"},{"id":"edge-87","source":"node-86","target":"node-87"},{"id":"edge-88","source":"node-87","target":"node-88"},{"id":"edge-89","source":"node-88","target":"node-89"},{"id":"edge-90","source":"node-89","target":"node-90"},{"id":"edge-91","source":"node-90","target":"node-91"},{"id":"edge-92","source":"node-91","target":"node-92"},{"id":"edge-93","source":"node-92","target":"node-93"},{"id":"edge-94","source":"node-93","target":"node-94"},{"id":"edge-95","source":"node-94","target":"node-95"},{"id":"edge-96","source":"node-95","target":"node-96"},{"id":"edge-97","source":"node-96","target":"node-97"},{"id":"edge-98","source":"node-97","target":"node-98"},{"id":"edge-99","source":"node-98","target":"node-99"},{"id":"edge-100","source":"node-99","target":"node-100"},{"id":"edge-101","source":"node-100","target":"node-101"},{"id":"edge-102","source":"node-101","target":"node-102"},{"id":"edge-103","source":"node-102","target":"node-103"},{"id":"edge-104","source":"node-103","target":"node-104"},{"id":"edge-105","source":"node-104","target":"node-105"},{"id":"edge-106","source":"node-105","target":"node-106"},{"id":"edge-107","source":"node-106","target":"node-107"},{"id":"edge-108","source":"node-107","target":"node-108"},{"id":"edge-109","source":"node-108","target":"node-109"},{"id":"edge-110","source":"node-109","target":"node-110"},{"id":"edge-111","source":"node-110","target":"node-111"},{"id":"edge-112","source":"node-111","target":"node-112"},{"id":"edge-113","source":"node-112","target":"node-113"},{"id":"edge-114","source":"node-113","target":"node-114"},{"id":"edge-115","source":"node-114","target":"node-115"},{"id":"edge-116","source":"node-115","target":"node-116"},{"id":"edge-117","source":"node-116","target":"node-117"},{"id":"edge-118","source":"node-117","target":"node-118"},{"id":"edge-119","source":"node-118","target":"node-119"},{"id":"edge-120","source":"node-119","target":"node-120"},{"id":"edge-121","source":"node-120","target":"node-121"},{"id":"edge-122","source":"node-121","target":"node-122"},{"id":"edge-123","source":"node-122","target":"node-123"},{"id":"edge-124","source":"node-123","target":"node-124"},{"id":"edge-125","source":"node-124","target":"node-125"},{"id":"edge-126","source":"node-125","target":"node-126"},{"id":"edge-127","source":"node-126","target":"node-127"},{"id":"edge-128","source":"node-127","target":"node-128"},{"id":"edge-129","source":"node-128","target":"node-129"},{"id":"edge-130","source":"node-129","target":"node-130"},{"id":"edge-131","source":"node-130","target":"node-131"},{"id":"edge-132","source":"node-131","target":"node-132"},{"id":"edge-133","source":"node-132","target":"node-133"},{"id":"edge-134","source":"node-133","target":"node-134"},{"id":"edge-135","source":"node-134","target":"node-135"},{"id":"edge-136","source":"node-135","target":"node-136"},{"id":"edge-137","source":"node-136","target":"node-137"},{"id":"edge-138","source":"node-137","target":"node-138"},{"id":"edge-139","source":"node-138","target":"node-139"},{"id":"edge-140","source":"node-139","target":"node-140"},{"id":"edge-141","source":"node-140","target":"node-141"},{"id":"edge-142","source":"node-141","target":"node-142"},{"id":"edge-143","source":"node-142","target":"node-143"},{"id":"edge-144","source":"node-143","target":"node-144"},{"id":"edge-145","source":"node-144","target":"node-145"},{"id":"edge-146","source":"node-145","target":"node-146"},{"id":"edge-147","source":"node-146","target":"node-147"},{"id":"edge-148","source":"node-147","target":"node-148"},{"id":"edge-149","source":"node-148","target":"node-149"},{"id":"edge-150","source":"node-149","target":"node-150"},{"id":"edge-151","source":"node-150","target":"node-151"},{"id":"edge-152","source":"node-151","target":"node-152"},{"id":"edge-153","source":"node-152","target":"node-153"},{"id":"edge-154","source":"node-153","target":"node-154"},{"id":"edge-155","source":"node-154","target":"node-155"},{"id":"edge-156","source":"node-155","target":"node-156"},{"id":"edge-157","source":"node-156","target":"node-157"},{"id":"edge-158","source":"node-157","target":"node-158"},{"id":"edge-159","source":"node-158","target":"node-159"},{"id":"edge-160","source":"node-159","target":"node-160"},{"id":"edge-161","source":"node-160","target":"node-161"},{"id":"edge-162","source":"node-161","target":"node-162"},{"id":"edge-163","source":"node-162","target":"node-163"},{"id":"edge-164","source":"node-163","target":"node-164"},{"id":"edge-165","source":"node-164","target":"node-165"},{"id":"edge-166","source":"node-165","target":"node-166"},{"id":"edge-167","source":"node-166","target":"node-167"},{"id":"edge-168","source":"node-167","target":"node-168"},{"id":"edge-169","source":"node-168","target":"node-169"},{"id":"edge-170","source":"node-169","target":"node-170"},{"id":"edge-171","source":"node-170","target":"node-171"},{"id":"edge-172","source":"node-171","target":"node-172"},{"id":"edge-173","source":"node-172","target":"node-173"},{"id":"edge-174","source":"node-173","target":"node-174"},{"id":"edge-175","source":"node-174","target":"node-175"},{"id":"edge-176","source":"node-175","target":"node-176"},{"id":"edge-177","source":"node-176","target":"node-177"},{"id":"edge-178","source":"node-177","target":"node-178"},{"id":"edge-179","source":"node-178","target":"node-179"},{"id":"edge-180","source":"node-179","target":"node-180"},{"id":"edge-181","source":"node-180","target":"node-181"},{"id":"edge-182","source":"node-181","target":"node-182"},{"id":"edge-183","source":"node-182","target":"node-183"},{"id":"edge-184","source":"node-183","target":"node-184"},{"id":"edge-185","source":"node-184","target":"node-185"},{"id":"edge-186","source":"node-185","target":"node-186"},{"id":"edge-187","source":"node-186","target":"node-187"},{"id":"edge-188","source":"node-187","target":"node-188"},{"id":"edge-189","source":"node-188","target":"node-189"},{"id":"edge-190","source":"node-189","target":"node-190"},{"id":"edge-191","source":"node-190","target":"node-191"},{"id":"edge-192","source":"node-191","target":"node-192"},{"id":"edge-193","source":"node-192","target":"node-193"},{"id":"edge-194","source":"node-193","target":"node-194"},{"id":"edge-195","source":"node-194","target":"node-195"},{"id":"edge-196","source":"node-195","target":"node-196"},{"id":"edge-197","source":"node-196","target":"node-197"},{"id":"edge-198","source":"node-197","target":"node-198"},{"id":"edge-199","source":"node-198","target":"node-199"}]}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'f37341ac-71d7-4bb0-827d-39dac9043458', 1, 'Ping', 'Server A sends a Ping request to check availability.', 'ping', NULL
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'f37341ac-71d7-4bb0-827d-39dac9043458', 2, 'Pong', 'Server B receives the request and replies with Pong.', 'pong', 'e1'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'f37341ac-71d7-4bb0-827d-39dac9043458', 3, 'Return', 'Server A receives the Pong response. Connection verified.', 'ping', 'e2'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 1, 'Login Request', 'User enters credentials. Client sends POST /login.', 'client', NULL
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 2, 'Routing', 'Load Balancer routes the request to the Auth Service.', 'lb', 'e1'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 3, 'Validation', 'Auth Service checks the credentials format.', 'auth', 'e2'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 4, 'DB Lookup', 'Auth Service hashes the password and compares it with the User DB.', 'user-db', 'e3'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 5, 'Token Issue', 'Credentials match. Auth Service generates a JWT signed with a secret.', 'auth', NULL
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 6, 'Response', 'Client receives the JWT and stores it in localStorage/cookies.', 'client', 'e4'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 7, 'Authenticated Request', 'Client requests profile data, attaching the JWT in the headers.', 'client', 'e5'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 8, 'Verification', 'App Service verifies the JWT signature before processing.', 'app', 'e6'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 9, 'Cache Hit', 'App Service checks Redis for cached profile data.', 'cache', 'e7'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  'c0f9909a-3f0f-432d-91d5-9834b99e94ff', 10, 'Complete', 'Data returned to user.', 'client', NULL
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 1, 'Hop 1', 'Data packet travels from node Start to node 0 in the mesh.', 'node-0', NULL
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 2, 'Hop 2', 'Data packet travels from node 0 to node 1 in the mesh.', 'node-1', 'edge-1'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 3, 'Hop 3', 'Data packet travels from node 1 to node 2 in the mesh.', 'node-2', 'edge-2'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 4, 'Hop 4', 'Data packet travels from node 2 to node 3 in the mesh.', 'node-3', 'edge-3'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 5, 'Hop 5', 'Data packet travels from node 3 to node 4 in the mesh.', 'node-4', 'edge-4'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 6, 'Hop 6', 'Data packet travels from node 4 to node 5 in the mesh.', 'node-5', 'edge-5'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 7, 'Hop 7', 'Data packet travels from node 5 to node 6 in the mesh.', 'node-6', 'edge-6'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 8, 'Hop 8', 'Data packet travels from node 6 to node 7 in the mesh.', 'node-7', 'edge-7'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 9, 'Hop 9', 'Data packet travels from node 7 to node 8 in the mesh.', 'node-8', 'edge-8'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 10, 'Hop 10', 'Data packet travels from node 8 to node 9 in the mesh.', 'node-9', 'edge-9'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 11, 'Hop 11', 'Data packet travels from node 9 to node 10 in the mesh.', 'node-10', 'edge-10'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 12, 'Hop 12', 'Data packet travels from node 10 to node 11 in the mesh.', 'node-11', 'edge-11'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 13, 'Hop 13', 'Data packet travels from node 11 to node 12 in the mesh.', 'node-12', 'edge-12'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 14, 'Hop 14', 'Data packet travels from node 12 to node 13 in the mesh.', 'node-13', 'edge-13'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 15, 'Hop 15', 'Data packet travels from node 13 to node 14 in the mesh.', 'node-14', 'edge-14'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 16, 'Hop 16', 'Data packet travels from node 14 to node 15 in the mesh.', 'node-15', 'edge-15'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 17, 'Hop 17', 'Data packet travels from node 15 to node 16 in the mesh.', 'node-16', 'edge-16'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 18, 'Hop 18', 'Data packet travels from node 16 to node 17 in the mesh.', 'node-17', 'edge-17'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 19, 'Hop 19', 'Data packet travels from node 17 to node 18 in the mesh.', 'node-18', 'edge-18'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 20, 'Hop 20', 'Data packet travels from node 18 to node 19 in the mesh.', 'node-19', 'edge-19'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 21, 'Hop 21', 'Data packet travels from node 19 to node 20 in the mesh.', 'node-20', 'edge-20'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 22, 'Hop 22', 'Data packet travels from node 20 to node 21 in the mesh.', 'node-21', 'edge-21'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 23, 'Hop 23', 'Data packet travels from node 21 to node 22 in the mesh.', 'node-22', 'edge-22'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 24, 'Hop 24', 'Data packet travels from node 22 to node 23 in the mesh.', 'node-23', 'edge-23'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 25, 'Hop 25', 'Data packet travels from node 23 to node 24 in the mesh.', 'node-24', 'edge-24'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 26, 'Hop 26', 'Data packet travels from node 24 to node 25 in the mesh.', 'node-25', 'edge-25'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 27, 'Hop 27', 'Data packet travels from node 25 to node 26 in the mesh.', 'node-26', 'edge-26'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 28, 'Hop 28', 'Data packet travels from node 26 to node 27 in the mesh.', 'node-27', 'edge-27'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 29, 'Hop 29', 'Data packet travels from node 27 to node 28 in the mesh.', 'node-28', 'edge-28'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 30, 'Hop 30', 'Data packet travels from node 28 to node 29 in the mesh.', 'node-29', 'edge-29'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 31, 'Hop 31', 'Data packet travels from node 29 to node 30 in the mesh.', 'node-30', 'edge-30'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 32, 'Hop 32', 'Data packet travels from node 30 to node 31 in the mesh.', 'node-31', 'edge-31'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 33, 'Hop 33', 'Data packet travels from node 31 to node 32 in the mesh.', 'node-32', 'edge-32'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 34, 'Hop 34', 'Data packet travels from node 32 to node 33 in the mesh.', 'node-33', 'edge-33'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 35, 'Hop 35', 'Data packet travels from node 33 to node 34 in the mesh.', 'node-34', 'edge-34'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 36, 'Hop 36', 'Data packet travels from node 34 to node 35 in the mesh.', 'node-35', 'edge-35'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 37, 'Hop 37', 'Data packet travels from node 35 to node 36 in the mesh.', 'node-36', 'edge-36'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 38, 'Hop 38', 'Data packet travels from node 36 to node 37 in the mesh.', 'node-37', 'edge-37'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 39, 'Hop 39', 'Data packet travels from node 37 to node 38 in the mesh.', 'node-38', 'edge-38'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 40, 'Hop 40', 'Data packet travels from node 38 to node 39 in the mesh.', 'node-39', 'edge-39'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 41, 'Hop 41', 'Data packet travels from node 39 to node 40 in the mesh.', 'node-40', 'edge-40'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 42, 'Hop 42', 'Data packet travels from node 40 to node 41 in the mesh.', 'node-41', 'edge-41'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 43, 'Hop 43', 'Data packet travels from node 41 to node 42 in the mesh.', 'node-42', 'edge-42'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 44, 'Hop 44', 'Data packet travels from node 42 to node 43 in the mesh.', 'node-43', 'edge-43'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 45, 'Hop 45', 'Data packet travels from node 43 to node 44 in the mesh.', 'node-44', 'edge-44'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 46, 'Hop 46', 'Data packet travels from node 44 to node 45 in the mesh.', 'node-45', 'edge-45'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 47, 'Hop 47', 'Data packet travels from node 45 to node 46 in the mesh.', 'node-46', 'edge-46'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 48, 'Hop 48', 'Data packet travels from node 46 to node 47 in the mesh.', 'node-47', 'edge-47'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 49, 'Hop 49', 'Data packet travels from node 47 to node 48 in the mesh.', 'node-48', 'edge-48'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 50, 'Hop 50', 'Data packet travels from node 48 to node 49 in the mesh.', 'node-49', 'edge-49'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 51, 'Hop 51', 'Data packet travels from node 49 to node 50 in the mesh.', 'node-50', 'edge-50'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 52, 'Hop 52', 'Data packet travels from node 50 to node 51 in the mesh.', 'node-51', 'edge-51'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 53, 'Hop 53', 'Data packet travels from node 51 to node 52 in the mesh.', 'node-52', 'edge-52'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 54, 'Hop 54', 'Data packet travels from node 52 to node 53 in the mesh.', 'node-53', 'edge-53'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 55, 'Hop 55', 'Data packet travels from node 53 to node 54 in the mesh.', 'node-54', 'edge-54'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 56, 'Hop 56', 'Data packet travels from node 54 to node 55 in the mesh.', 'node-55', 'edge-55'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 57, 'Hop 57', 'Data packet travels from node 55 to node 56 in the mesh.', 'node-56', 'edge-56'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 58, 'Hop 58', 'Data packet travels from node 56 to node 57 in the mesh.', 'node-57', 'edge-57'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 59, 'Hop 59', 'Data packet travels from node 57 to node 58 in the mesh.', 'node-58', 'edge-58'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 60, 'Hop 60', 'Data packet travels from node 58 to node 59 in the mesh.', 'node-59', 'edge-59'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 61, 'Hop 61', 'Data packet travels from node 59 to node 60 in the mesh.', 'node-60', 'edge-60'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 62, 'Hop 62', 'Data packet travels from node 60 to node 61 in the mesh.', 'node-61', 'edge-61'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 63, 'Hop 63', 'Data packet travels from node 61 to node 62 in the mesh.', 'node-62', 'edge-62'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 64, 'Hop 64', 'Data packet travels from node 62 to node 63 in the mesh.', 'node-63', 'edge-63'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 65, 'Hop 65', 'Data packet travels from node 63 to node 64 in the mesh.', 'node-64', 'edge-64'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 66, 'Hop 66', 'Data packet travels from node 64 to node 65 in the mesh.', 'node-65', 'edge-65'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 67, 'Hop 67', 'Data packet travels from node 65 to node 66 in the mesh.', 'node-66', 'edge-66'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 68, 'Hop 68', 'Data packet travels from node 66 to node 67 in the mesh.', 'node-67', 'edge-67'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 69, 'Hop 69', 'Data packet travels from node 67 to node 68 in the mesh.', 'node-68', 'edge-68'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 70, 'Hop 70', 'Data packet travels from node 68 to node 69 in the mesh.', 'node-69', 'edge-69'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 71, 'Hop 71', 'Data packet travels from node 69 to node 70 in the mesh.', 'node-70', 'edge-70'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 72, 'Hop 72', 'Data packet travels from node 70 to node 71 in the mesh.', 'node-71', 'edge-71'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 73, 'Hop 73', 'Data packet travels from node 71 to node 72 in the mesh.', 'node-72', 'edge-72'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 74, 'Hop 74', 'Data packet travels from node 72 to node 73 in the mesh.', 'node-73', 'edge-73'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 75, 'Hop 75', 'Data packet travels from node 73 to node 74 in the mesh.', 'node-74', 'edge-74'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 76, 'Hop 76', 'Data packet travels from node 74 to node 75 in the mesh.', 'node-75', 'edge-75'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 77, 'Hop 77', 'Data packet travels from node 75 to node 76 in the mesh.', 'node-76', 'edge-76'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 78, 'Hop 78', 'Data packet travels from node 76 to node 77 in the mesh.', 'node-77', 'edge-77'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 79, 'Hop 79', 'Data packet travels from node 77 to node 78 in the mesh.', 'node-78', 'edge-78'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 80, 'Hop 80', 'Data packet travels from node 78 to node 79 in the mesh.', 'node-79', 'edge-79'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 81, 'Hop 81', 'Data packet travels from node 79 to node 80 in the mesh.', 'node-80', 'edge-80'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 82, 'Hop 82', 'Data packet travels from node 80 to node 81 in the mesh.', 'node-81', 'edge-81'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 83, 'Hop 83', 'Data packet travels from node 81 to node 82 in the mesh.', 'node-82', 'edge-82'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 84, 'Hop 84', 'Data packet travels from node 82 to node 83 in the mesh.', 'node-83', 'edge-83'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 85, 'Hop 85', 'Data packet travels from node 83 to node 84 in the mesh.', 'node-84', 'edge-84'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 86, 'Hop 86', 'Data packet travels from node 84 to node 85 in the mesh.', 'node-85', 'edge-85'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 87, 'Hop 87', 'Data packet travels from node 85 to node 86 in the mesh.', 'node-86', 'edge-86'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 88, 'Hop 88', 'Data packet travels from node 86 to node 87 in the mesh.', 'node-87', 'edge-87'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 89, 'Hop 89', 'Data packet travels from node 87 to node 88 in the mesh.', 'node-88', 'edge-88'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 90, 'Hop 90', 'Data packet travels from node 88 to node 89 in the mesh.', 'node-89', 'edge-89'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 91, 'Hop 91', 'Data packet travels from node 89 to node 90 in the mesh.', 'node-90', 'edge-90'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 92, 'Hop 92', 'Data packet travels from node 90 to node 91 in the mesh.', 'node-91', 'edge-91'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 93, 'Hop 93', 'Data packet travels from node 91 to node 92 in the mesh.', 'node-92', 'edge-92'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 94, 'Hop 94', 'Data packet travels from node 92 to node 93 in the mesh.', 'node-93', 'edge-93'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 95, 'Hop 95', 'Data packet travels from node 93 to node 94 in the mesh.', 'node-94', 'edge-94'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 96, 'Hop 96', 'Data packet travels from node 94 to node 95 in the mesh.', 'node-95', 'edge-95'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 97, 'Hop 97', 'Data packet travels from node 95 to node 96 in the mesh.', 'node-96', 'edge-96'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 98, 'Hop 98', 'Data packet travels from node 96 to node 97 in the mesh.', 'node-97', 'edge-97'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 99, 'Hop 99', 'Data packet travels from node 97 to node 98 in the mesh.', 'node-98', 'edge-98'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 100, 'Hop 100', 'Data packet travels from node 98 to node 99 in the mesh.', 'node-99', 'edge-99'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 101, 'Hop 101', 'Data packet travels from node 99 to node 100 in the mesh.', 'node-100', 'edge-100'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 102, 'Hop 102', 'Data packet travels from node 100 to node 101 in the mesh.', 'node-101', 'edge-101'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 103, 'Hop 103', 'Data packet travels from node 101 to node 102 in the mesh.', 'node-102', 'edge-102'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 104, 'Hop 104', 'Data packet travels from node 102 to node 103 in the mesh.', 'node-103', 'edge-103'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 105, 'Hop 105', 'Data packet travels from node 103 to node 104 in the mesh.', 'node-104', 'edge-104'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 106, 'Hop 106', 'Data packet travels from node 104 to node 105 in the mesh.', 'node-105', 'edge-105'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 107, 'Hop 107', 'Data packet travels from node 105 to node 106 in the mesh.', 'node-106', 'edge-106'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 108, 'Hop 108', 'Data packet travels from node 106 to node 107 in the mesh.', 'node-107', 'edge-107'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 109, 'Hop 109', 'Data packet travels from node 107 to node 108 in the mesh.', 'node-108', 'edge-108'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 110, 'Hop 110', 'Data packet travels from node 108 to node 109 in the mesh.', 'node-109', 'edge-109'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 111, 'Hop 111', 'Data packet travels from node 109 to node 110 in the mesh.', 'node-110', 'edge-110'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 112, 'Hop 112', 'Data packet travels from node 110 to node 111 in the mesh.', 'node-111', 'edge-111'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 113, 'Hop 113', 'Data packet travels from node 111 to node 112 in the mesh.', 'node-112', 'edge-112'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 114, 'Hop 114', 'Data packet travels from node 112 to node 113 in the mesh.', 'node-113', 'edge-113'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 115, 'Hop 115', 'Data packet travels from node 113 to node 114 in the mesh.', 'node-114', 'edge-114'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 116, 'Hop 116', 'Data packet travels from node 114 to node 115 in the mesh.', 'node-115', 'edge-115'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 117, 'Hop 117', 'Data packet travels from node 115 to node 116 in the mesh.', 'node-116', 'edge-116'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 118, 'Hop 118', 'Data packet travels from node 116 to node 117 in the mesh.', 'node-117', 'edge-117'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 119, 'Hop 119', 'Data packet travels from node 117 to node 118 in the mesh.', 'node-118', 'edge-118'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 120, 'Hop 120', 'Data packet travels from node 118 to node 119 in the mesh.', 'node-119', 'edge-119'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 121, 'Hop 121', 'Data packet travels from node 119 to node 120 in the mesh.', 'node-120', 'edge-120'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 122, 'Hop 122', 'Data packet travels from node 120 to node 121 in the mesh.', 'node-121', 'edge-121'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 123, 'Hop 123', 'Data packet travels from node 121 to node 122 in the mesh.', 'node-122', 'edge-122'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 124, 'Hop 124', 'Data packet travels from node 122 to node 123 in the mesh.', 'node-123', 'edge-123'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 125, 'Hop 125', 'Data packet travels from node 123 to node 124 in the mesh.', 'node-124', 'edge-124'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 126, 'Hop 126', 'Data packet travels from node 124 to node 125 in the mesh.', 'node-125', 'edge-125'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 127, 'Hop 127', 'Data packet travels from node 125 to node 126 in the mesh.', 'node-126', 'edge-126'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 128, 'Hop 128', 'Data packet travels from node 126 to node 127 in the mesh.', 'node-127', 'edge-127'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 129, 'Hop 129', 'Data packet travels from node 127 to node 128 in the mesh.', 'node-128', 'edge-128'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 130, 'Hop 130', 'Data packet travels from node 128 to node 129 in the mesh.', 'node-129', 'edge-129'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 131, 'Hop 131', 'Data packet travels from node 129 to node 130 in the mesh.', 'node-130', 'edge-130'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 132, 'Hop 132', 'Data packet travels from node 130 to node 131 in the mesh.', 'node-131', 'edge-131'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 133, 'Hop 133', 'Data packet travels from node 131 to node 132 in the mesh.', 'node-132', 'edge-132'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 134, 'Hop 134', 'Data packet travels from node 132 to node 133 in the mesh.', 'node-133', 'edge-133'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 135, 'Hop 135', 'Data packet travels from node 133 to node 134 in the mesh.', 'node-134', 'edge-134'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 136, 'Hop 136', 'Data packet travels from node 134 to node 135 in the mesh.', 'node-135', 'edge-135'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 137, 'Hop 137', 'Data packet travels from node 135 to node 136 in the mesh.', 'node-136', 'edge-136'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 138, 'Hop 138', 'Data packet travels from node 136 to node 137 in the mesh.', 'node-137', 'edge-137'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 139, 'Hop 139', 'Data packet travels from node 137 to node 138 in the mesh.', 'node-138', 'edge-138'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 140, 'Hop 140', 'Data packet travels from node 138 to node 139 in the mesh.', 'node-139', 'edge-139'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 141, 'Hop 141', 'Data packet travels from node 139 to node 140 in the mesh.', 'node-140', 'edge-140'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 142, 'Hop 142', 'Data packet travels from node 140 to node 141 in the mesh.', 'node-141', 'edge-141'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 143, 'Hop 143', 'Data packet travels from node 141 to node 142 in the mesh.', 'node-142', 'edge-142'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 144, 'Hop 144', 'Data packet travels from node 142 to node 143 in the mesh.', 'node-143', 'edge-143'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 145, 'Hop 145', 'Data packet travels from node 143 to node 144 in the mesh.', 'node-144', 'edge-144'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 146, 'Hop 146', 'Data packet travels from node 144 to node 145 in the mesh.', 'node-145', 'edge-145'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 147, 'Hop 147', 'Data packet travels from node 145 to node 146 in the mesh.', 'node-146', 'edge-146'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 148, 'Hop 148', 'Data packet travels from node 146 to node 147 in the mesh.', 'node-147', 'edge-147'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 149, 'Hop 149', 'Data packet travels from node 147 to node 148 in the mesh.', 'node-148', 'edge-148'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 150, 'Hop 150', 'Data packet travels from node 148 to node 149 in the mesh.', 'node-149', 'edge-149'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 151, 'Hop 151', 'Data packet travels from node 149 to node 150 in the mesh.', 'node-150', 'edge-150'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 152, 'Hop 152', 'Data packet travels from node 150 to node 151 in the mesh.', 'node-151', 'edge-151'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 153, 'Hop 153', 'Data packet travels from node 151 to node 152 in the mesh.', 'node-152', 'edge-152'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 154, 'Hop 154', 'Data packet travels from node 152 to node 153 in the mesh.', 'node-153', 'edge-153'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 155, 'Hop 155', 'Data packet travels from node 153 to node 154 in the mesh.', 'node-154', 'edge-154'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 156, 'Hop 156', 'Data packet travels from node 154 to node 155 in the mesh.', 'node-155', 'edge-155'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 157, 'Hop 157', 'Data packet travels from node 155 to node 156 in the mesh.', 'node-156', 'edge-156'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 158, 'Hop 158', 'Data packet travels from node 156 to node 157 in the mesh.', 'node-157', 'edge-157'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 159, 'Hop 159', 'Data packet travels from node 157 to node 158 in the mesh.', 'node-158', 'edge-158'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 160, 'Hop 160', 'Data packet travels from node 158 to node 159 in the mesh.', 'node-159', 'edge-159'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 161, 'Hop 161', 'Data packet travels from node 159 to node 160 in the mesh.', 'node-160', 'edge-160'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 162, 'Hop 162', 'Data packet travels from node 160 to node 161 in the mesh.', 'node-161', 'edge-161'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 163, 'Hop 163', 'Data packet travels from node 161 to node 162 in the mesh.', 'node-162', 'edge-162'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 164, 'Hop 164', 'Data packet travels from node 162 to node 163 in the mesh.', 'node-163', 'edge-163'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 165, 'Hop 165', 'Data packet travels from node 163 to node 164 in the mesh.', 'node-164', 'edge-164'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 166, 'Hop 166', 'Data packet travels from node 164 to node 165 in the mesh.', 'node-165', 'edge-165'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 167, 'Hop 167', 'Data packet travels from node 165 to node 166 in the mesh.', 'node-166', 'edge-166'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 168, 'Hop 168', 'Data packet travels from node 166 to node 167 in the mesh.', 'node-167', 'edge-167'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 169, 'Hop 169', 'Data packet travels from node 167 to node 168 in the mesh.', 'node-168', 'edge-168'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 170, 'Hop 170', 'Data packet travels from node 168 to node 169 in the mesh.', 'node-169', 'edge-169'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 171, 'Hop 171', 'Data packet travels from node 169 to node 170 in the mesh.', 'node-170', 'edge-170'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 172, 'Hop 172', 'Data packet travels from node 170 to node 171 in the mesh.', 'node-171', 'edge-171'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 173, 'Hop 173', 'Data packet travels from node 171 to node 172 in the mesh.', 'node-172', 'edge-172'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 174, 'Hop 174', 'Data packet travels from node 172 to node 173 in the mesh.', 'node-173', 'edge-173'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 175, 'Hop 175', 'Data packet travels from node 173 to node 174 in the mesh.', 'node-174', 'edge-174'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 176, 'Hop 176', 'Data packet travels from node 174 to node 175 in the mesh.', 'node-175', 'edge-175'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 177, 'Hop 177', 'Data packet travels from node 175 to node 176 in the mesh.', 'node-176', 'edge-176'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 178, 'Hop 178', 'Data packet travels from node 176 to node 177 in the mesh.', 'node-177', 'edge-177'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 179, 'Hop 179', 'Data packet travels from node 177 to node 178 in the mesh.', 'node-178', 'edge-178'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 180, 'Hop 180', 'Data packet travels from node 178 to node 179 in the mesh.', 'node-179', 'edge-179'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 181, 'Hop 181', 'Data packet travels from node 179 to node 180 in the mesh.', 'node-180', 'edge-180'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 182, 'Hop 182', 'Data packet travels from node 180 to node 181 in the mesh.', 'node-181', 'edge-181'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 183, 'Hop 183', 'Data packet travels from node 181 to node 182 in the mesh.', 'node-182', 'edge-182'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 184, 'Hop 184', 'Data packet travels from node 182 to node 183 in the mesh.', 'node-183', 'edge-183'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 185, 'Hop 185', 'Data packet travels from node 183 to node 184 in the mesh.', 'node-184', 'edge-184'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 186, 'Hop 186', 'Data packet travels from node 184 to node 185 in the mesh.', 'node-185', 'edge-185'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 187, 'Hop 187', 'Data packet travels from node 185 to node 186 in the mesh.', 'node-186', 'edge-186'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 188, 'Hop 188', 'Data packet travels from node 186 to node 187 in the mesh.', 'node-187', 'edge-187'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 189, 'Hop 189', 'Data packet travels from node 187 to node 188 in the mesh.', 'node-188', 'edge-188'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 190, 'Hop 190', 'Data packet travels from node 188 to node 189 in the mesh.', 'node-189', 'edge-189'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 191, 'Hop 191', 'Data packet travels from node 189 to node 190 in the mesh.', 'node-190', 'edge-190'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 192, 'Hop 192', 'Data packet travels from node 190 to node 191 in the mesh.', 'node-191', 'edge-191'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 193, 'Hop 193', 'Data packet travels from node 191 to node 192 in the mesh.', 'node-192', 'edge-192'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 194, 'Hop 194', 'Data packet travels from node 192 to node 193 in the mesh.', 'node-193', 'edge-193'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 195, 'Hop 195', 'Data packet travels from node 193 to node 194 in the mesh.', 'node-194', 'edge-194'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 196, 'Hop 196', 'Data packet travels from node 194 to node 195 in the mesh.', 'node-195', 'edge-195'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 197, 'Hop 197', 'Data packet travels from node 195 to node 196 in the mesh.', 'node-196', 'edge-196'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 198, 'Hop 198', 'Data packet travels from node 196 to node 197 in the mesh.', 'node-197', 'edge-197'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 199, 'Hop 199', 'Data packet travels from node 197 to node 198 in the mesh.', 'node-198', 'edge-198'
);
INSERT INTO steps (scenario_id, order_index, title, content, active_node_id, active_edge_id) VALUES (
  '26a63bd8-5d86-4552-803d-9bd57a2b0ddd', 200, 'Hop 200', 'Data packet travels from node 198 to node 199 in the mesh.', 'node-199', 'edge-199'
);
