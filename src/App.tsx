import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, BrainCircuit, Building2, CheckCircle2, ChevronDown, Leaf, MapPin, Rocket, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { z } from 'zod'
import './App.css'

const applicationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  role: z.string().trim().min(2).max(120),
  interest: z.enum(['residency', 'retreat', 'partner', 'investor', 'updates']),
  timing: z.string().trim().min(2).max(80),
  contribution: z.string().trim().min(20).max(1200),
})

type Status = { kind: 'idle' | 'success' | 'error'; message: string }

const pillars = [
  { icon: BrainCircuit, title: 'Build with AI', text: 'A focused home base for founders, engineers, researchers, and creative operators shipping useful technology.' },
  { icon: Users, title: 'Live intentionally', text: 'Curated residencies, shared rituals, quiet work, workshops, and a culture designed around trust and contribution.' },
  { icon: Leaf, title: 'Rooted in nature', text: 'Sixty-eight acres of Oregon countryside, with future modular lodging pursued carefully and legally.' },
]

const phases = [
  ['01', 'Control & diligence', 'Secure a contingent path to acquisition, verify zoning, event rights, utilities, insurance, and financing.'],
  ['02', 'Open the château', 'Launch legal founder residencies and curated company retreats using the existing estate.'],
  ['03', 'Pilot the capsules', 'After approvals, install 3–6 code-compliant capsules and validate hospitality economics.'],
  ['04', 'Grow the village', 'Expand in measured tranches, add fellowships, labs, programs, and long-term partnerships.'],
]

export function App() {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' })
  const [submitting, setSubmitting] = useState(false)

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const parsed = applicationSchema.safeParse(data)
    if (!parsed.success) {
      setStatus({ kind: 'error', message: 'Please complete every field with a valid email and at least a short contribution statement.' })
      return
    }
    const endpoint = import.meta.env.VITE_APPLICATION_ENDPOINT as string | undefined
    if (!endpoint) {
      setStatus({ kind: 'error', message: 'Applications are not open yet. The founding waitlist will activate after backend review.' })
      return
    }
    setSubmitting(true)
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) })
      if (!response.ok) throw new Error('Submission failed')
      form.reset()
      setStatus({ kind: 'success', message: 'Application received. We’ll review it and contact you as the project advances.' })
    } catch {
      setStatus({ kind: 'error', message: 'We could not submit your application. Please try again later.' })
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="site-shell">
    <header className="nav"><a className="brand" href="#top" aria-label="Aether Village home"><span>Æ</span><div>AETHER <small>VILLAGE</small></div></a><nav aria-label="Primary navigation"><a href="#vision">Vision</a><a href="#plan">Plan</a><a href="#apply">Apply</a></nav><a className="nav-cta" href="#apply">Join the founding circle <ArrowRight size={16}/></a></header>

    <main id="top">
      <section className="hero-section">
        <div className="aurora" aria-hidden="true"/><div className="hero-grid" aria-hidden="true"/>
        <div className="hero-content"><p className="eyebrow"><Sparkles size={15}/> A proposed AEV founder community · Oregon</p><h1>Build the future.<br/><em>Live differently.</em></h1><p className="hero-copy">A fairytale château, 68 acres, and a bold plan for an intentional community where entrepreneurs and AI builders create what comes next.</p><div className="hero-actions"><a className="button primary" href="#apply">Apply to join <ArrowRight size={18}/></a><a className="button ghost" href="#plan">Explore the plan <ChevronDown size={18}/></a></div><p className="fine-print">Feasibility-stage concept · No deposits or investment solicitation</p></div>
        <div className="hero-visual" aria-label="Concept illustration of Aether Village"><div className="moon"/><div className="castle"><i/><i/><i/><span/></div><div className="land land-one"/><div className="land land-two"/><div className="capsules"><b/><b/><b/><b/></div><div className="location-card"><MapPin size={18}/><div><strong>West Linn, Oregon</strong><span>68.48 acres · 30 min to Portland</span></div></div></div>
        <div className="stat-strip"><div><strong>68.48</strong><span>acres</span></div><div><strong>13,023</strong><span>square feet</span></div><div><strong>10</strong><span>bedrooms</span></div><div><strong>1</strong><span>shared mission</span></div></div>
      </section>

      <section id="vision" className="section vision"><div className="section-heading"><p className="eyebrow">The idea</p><h2>A village for people who refuse to think small.</h2><p>Aether Village brings ambitious people together in an environment built for deep work, unexpected collaboration, and meaningful lives.</p></div><div className="pillar-grid">{pillars.map(({icon: Icon,title,text}) => <article key={title}><span className="icon-wrap"><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="quote-band"><p>“Not another co-working space. A living laboratory for human potential.”</p><span>THE AETHER THESIS</span></section>

      <section id="plan" className="section plan"><div className="plan-intro"><p className="eyebrow">Built in phases</p><h2>Vision, with discipline.</h2><p>The château can anchor retreats and residencies. Capsules are a future phase—not a shortcut around Oregon land-use or building rules.</p><div className="reality-card"><ShieldCheck/><div><strong>Feasibility before fantasy</strong><p>The parcel is reported as EFU-zoned. Every residential, hospitality, infrastructure, and capsule use requires professional verification before capital is committed.</p></div></div></div><div className="timeline">{phases.map(([n,title,text]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section className="section model"><div className="section-heading light"><p className="eyebrow">The operating model</p><h2>More than rooms. An ecosystem.</h2></div><div className="model-grid"><article><Building2/><strong>Founder residencies</strong><p>Curated 1–6 month stays in the existing estate.</p></article><article><Rocket/><strong>Company retreats</strong><p>AI offsites, strategy intensives, and demo gatherings.</p></article><article><Sparkles/><strong>Capsule stays</strong><p>A small modular pilot only after all approvals.</p></article><article><BrainCircuit/><strong>Programs & labs</strong><p>Fellowships, workshops, and sponsored build sprints.</p></article></div><a className="text-link" href="https://capsulecastle.com/" target="_blank" rel="noreferrer">Explore the capsule concept <ArrowRight size={17}/></a></section>

      <section className="section numbers"><div className="section-heading"><p className="eyebrow">Honest underwriting</p><h2>The opportunity has to earn the dream.</h2></div><div className="number-grid"><article><span>Asking range checked</span><strong>$5.4M–$5.65M</strong><p>Before closing, diligence, improvements, and reserves.</p></article><article><span>Estate-only base NOI</span><strong>~$295K</strong><p>Illustrative, before acquisition debt and subject to legal-use validation.</p></article><article><span>Decision threshold</span><strong>≥1.25× DSCR</strong><p>Based on defensible revenue—not speculative capsule income.</p></article></div><p className="numbers-note">Preliminary figures only. The complete plan includes acquisition scenarios, pilot economics, risks, diligence gates, and a 120-day roadmap.</p></section>

      <section id="apply" className="section apply"><div className="apply-copy"><p className="eyebrow">Founding circle</p><h2>Could you belong here?</h2><p>We’re measuring serious interest from residents, retreat partners, builders, advisors, and aligned capital partners. Applications are non-binding.</p><ul><li><CheckCircle2/> Builders with a real craft</li><li><CheckCircle2/> People who contribute before they consume</li><li><CheckCircle2/> High agency, low ego, long-term orientation</li></ul></div><form onSubmit={submitApplication} noValidate><div className="field-row"><label>Full name<input name="name" autoComplete="name" required/></label><label>Email<input name="email" type="email" autoComplete="email" required/></label></div><label>What do you build or do?<input name="role" required placeholder="Founder, engineer, artist, operator…"/></label><div className="field-row"><label>How are you interested?<select name="interest" required defaultValue=""><option value="" disabled>Select one</option><option value="residency">Live here / residency</option><option value="retreat">Bring a team retreat</option><option value="partner">Build or advise</option><option value="investor">Discuss aligned capital</option><option value="updates">Follow the journey</option></select></label><label>Ideal timing<input name="timing" required placeholder="e.g. Spring 2027"/></label></div><label>What would you contribute to the community?<textarea name="contribution" required minLength={20} rows={5}/></label><button className="button primary form-button" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit application'} <ArrowRight size={18}/></button><p className="privacy">By applying, you agree that AEV may contact you about this project. No payment is requested. Application data will be used only for project evaluation.</p>{status.kind !== 'idle' && <p className={`form-status ${status.kind}`} role="status">{status.message}</p>}</form></section>
    </main>
    <footer><div className="brand"><span>Æ</span><div>AETHER <small>VILLAGE</small></div></div><p>A proposed American Eagle Ventures project.</p><p>Concept stage · Uses subject to diligence and government approval.</p></footer>
  </div>
}

export default App
