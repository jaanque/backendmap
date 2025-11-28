import type { Step } from '../types';

export function getSimulationOutput(step: Step): string {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const title = step.title.toLowerCase();
  const content = step.content.toLowerCase();

  let log = `[${timestamp}] INFO: Processing step '${step.title}'...\n`;

  if (title.includes('request') || content.includes('sends')) {
    log += `[${timestamp}] OUT: POST /api/v1/resource HTTP/1.1\n`;
    log += `[${timestamp}] OUT: Host: internal-service\n`;
  } else if (title.includes('response') || title.includes('return') || content.includes('replies')) {
    if (content.includes('error') || title.includes('error') || title.includes('timeout')) {
      log += `[${timestamp}] IN: HTTP/1.1 500 Internal Server Error\n`;
      log += `[${timestamp}] ERR: Connection timed out or service unavailable.\n`;
    } else {
      log += `[${timestamp}] IN: HTTP/1.1 200 OK\n`;
      log += `[${timestamp}] IN: Content-Type: application/json\n`;
      log += `[${timestamp}] IN: { "status": "success", "data": { ... } }\n`;
    }
  } else if (title.includes('db') || title.includes('lookup') || content.includes('query')) {
    log += `[${timestamp}] DB: SELECT * FROM users WHERE id = ?\n`;
    log += `[${timestamp}] DB: 1 row returned (0.002s)\n`;
  } else if (title.includes('routing') || title.includes('load balancer')) {
    log += `[${timestamp}] LB: Round-robin selection -> node-3\n`;
    log += `[${timestamp}] LB: Forwarding traffic...\n`;
  } else if (title.includes('cache') || content.includes('redis')) {
    log += `[${timestamp}] CACHE: GET user:123\n`;
    if (title.includes('hit')) {
      log += `[${timestamp}] CACHE: HIT\n`;
    } else {
      log += `[${timestamp}] CACHE: MISS\n`;
    }
  } else if (title.includes('validation') || title.includes('verify')) {
      log += `[${timestamp}] SEC: Verifying signature...\n`;
      log += `[${timestamp}] SEC: Signature Valid.\n`;
  } else {
      log += `[${timestamp}] SYS: Executing logic for ${step.title}\n`;
      log += `[${timestamp}] SYS: Operation completed successfully.\n`;
  }

  return log;
}
