import { z } from 'zod'

interface Env {
  APPLICATIONS: D1Database
  ALLOWED_ORIGIN: string
  NOTIFICATION_EMAIL: string
  RESEND_API_KEY?: string
}

const applicationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  role: z.string().trim().min(2).max(120),
  interest: z.enum(['residency', 'retreat', 'partner', 'investor', 'updates']),
  timing: z.string().trim().min(2).max(80),
  contribution: z.string().trim().min(20).max(1200),
})

function json(body: object, status: number, origin: string): Response {
  return Response.json(body, { status, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' } })
}

async function notify(env: Env, application: z.infer<typeof applicationSchema>): Promise<void> {
  if (!env.RESEND_API_KEY) return
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'Aether Village <applications@aethervillage.org>', to: [env.NOTIFICATION_EMAIL], subject: `Aether Village application: ${application.name}`, text: `Name: ${application.name}\nEmail: ${application.email}\nRole: ${application.role}\nInterest: ${application.interest}\nTiming: ${application.timing}\n\nContribution:\n${application.contribution}` }) })
  if (!response.ok) throw new Error(`Notification provider returned ${response.status}`)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const corsOrigin = origin === env.ALLOWED_ORIGIN ? origin : env.ALLOWED_ORIGIN
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': corsOrigin, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } })
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/api/v1/applications') return json({ error: 'Not found' }, 404, corsOrigin)
    if (origin !== env.ALLOWED_ORIGIN) return json({ error: 'Origin not allowed' }, 403, corsOrigin)
    const contentLength = Number(request.headers.get('Content-Length') ?? 0)
    if (contentLength > 8192) return json({ error: 'Payload too large' }, 413, corsOrigin)
    let input: unknown
    try { input = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400, corsOrigin) }
    const parsed = applicationSchema.safeParse(input)
    if (!parsed.success) return json({ error: 'Invalid application' }, 400, corsOrigin)
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    await env.APPLICATIONS.prepare('INSERT INTO applications (id, name, email, role, interest, timing, contribution, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, parsed.data.name, parsed.data.email, parsed.data.role, parsed.data.interest, parsed.data.timing, parsed.data.contribution, createdAt).run()
    try { await notify(env, parsed.data) } catch (error) { console.error(JSON.stringify({ event: 'notification_failed', applicationId: id, error: error instanceof Error ? error.message : 'unknown' })) }
    return json({ id, received: true }, 201, corsOrigin)
  },
}
