/* Shubh Express INC — interactive components (React) */
const { useState, useEffect, useRef } = React;

/* ----- Icons (tiny inline set; no overdrawn SVGs) ----- */
const Icon = ({ name, size = 22 }) => {
  const stroke = 'currentColor';
  const sw = 1.6;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'truck': return <svg {...common}><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case 'container': return <svg {...common}><rect x="3" y="7" width="18" height="10"/><path d="M8 7v10M12 7v10M16 7v10"/></svg>;
    case 'hazmat': return <svg {...common}><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>;
    case 'reefer': return <svg {...common}><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>;
    case 'car': return <svg {...common}><path d="M5 13l1.5-4h11L19 13"/><path d="M3 17h18v-4H3z"/><circle cx="7" cy="17" r="1.4"/><circle cx="17" cy="17" r="1.4"/></svg>;
    case 'stone': return <svg {...common}><path d="M4 18l4-8 4 5 3-4 5 7z"/></svg>;
    case 'recycle': return <svg {...common}><path d="M7 19l-3-3 3-3"/><path d="M4 16h10a3 3 0 0 0 2.6-4.5"/><path d="M17 5l3 3-3 3"/><path d="M20 8H10a3 3 0 0 0-2.6 4.5"/></svg>;
    case 'phone': return <svg {...common}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;
    case 'mail': return <svg {...common}><rect x="3" y="5" width="18" height="14"/><path d="M3 7l9 7 9-7"/></svg>;
    case 'pin': return <svg {...common}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'info': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>;
    case 'arrow': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'shield': return <svg {...common}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>;
    default: return null;
  }
};

/* ----- Nav ----- */
function Nav({ theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['about', 'services', 'terminals', 'contact'];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-25% 0px -65% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <ThemeToggle theme={theme} setTheme={setTheme}/>
        <a href="#top" className="brand">
          <img src="logo.png" alt="Shubh Express INC" className="brand-logo"/>
        </a>
        <div className="nav-links">
          <a href="#about" className={active === 'about' ? 'nav-active' : ''}>About</a>
          <a href="#services" className={active === 'services' ? 'nav-active' : ''}>Services</a>
          <a href="#terminals" className={active === 'terminals' ? 'nav-active' : ''}>Terminals</a>
          <a href="#contact" className={active === 'contact' ? 'nav-active' : ''}>Contact</a>
          <a href="privacy-policy.html" target="_blank">Privacy</a>
          <a href="#contact" className="nav-cta">Request Quote</a>
        </div>
      </div>
    </nav>
  );
}

/* ----- Hero ----- */
function StaggerWords({ text, delay = 0, gap = 0.06 }) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="h-word" style={{ animationDelay: `${delay + i * gap}s` }}>
      {w}{i < text.split(' ').length - 1 ? '\u00A0' : ''}
    </span>
  ));
}

function CountUp({ end, duration = 1400, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.floor(eased * end));
          if (p < 1) requestAnimationFrame(tick); else setN(end);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg"></div>
      <div className="container hero-inner">
        <div className="hero-meta">
          <span><b>LATHROP, CA</b> · OPERATIONS HQ</span>
          <span><b>MC #1056321</b> · USDOT #3320224</span>
          <span className="mono">37.8044°N · 121.2769°W</span>
        </div>
        <h1>
          <span className="h-line"><StaggerWords text="Moving freight," delay={0.05}/></span>
          <span className="h-line"><span className="hl"><StaggerWords text="on time." delay={0.35}/></span></span>
          <span className="h-line"><StaggerWords text="Every haul." delay={0.6}/></span>
        </h1>
        <p className="hero-sub" style={{opacity: 0, animation: 'rise 0.8s ease 0.95s forwards'}}>
          A West Coast drayage and intermodal carrier hauling out of the Port of Oakland and beyond.
          Owner-operated, terminal-credentialed, and built for the long haul.
        </p>
        <div className="hero-cta-row" style={{opacity: 0, animation: 'rise 0.8s ease 1.1s forwards'}}>
          <a href="#contact" className="btn btn-primary">Request a Quote <span className="arrow"><Icon name="arrow" size={16}/></span></a>
          <a href="#services" className="btn btn-ghost">View Services</a>
        </div>
      </div>
      <div className="stats">
        <div className="stats-inner">
          <Stat num={39} plus label="Trucks in Fleet"/>
          <Stat num={15} plus label="Owner-Operators"/>
          <Stat num={3} label="Port Terminals"/>
          <Stat static="24/7" label="Dispatch Support"/>
        </div>
      </div>
    </section>
  );
}
function Stat({ num, plus, label, static: isStatic }) {
  return (
    <div className="stat">
      <div className="stat-num">
        {isStatic ? isStatic : <CountUp end={num}/>}
        {plus && <span className="plus">+</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ----- Marquee ticker ----- */
function Marquee() {
  const items = [
    'Oakland', 'Stockton', 'Tracy', 'Lathrop', 'Sacramento', 'Fresno',
    'Long Beach', 'Los Angeles', 'San Diego', 'Reno', 'Portland', 'Seattle'
  ];
  const Row = () => (
    <div className="marquee-item">
      {items.map((c, i) => (
        <React.Fragment key={i}>
          <span>{c}</span>
          <span className="sep">◆</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track"><Row/><Row/></div>
    </div>
  );
}

/* ----- About ----- */
function About() {
  return (
    <section id="about" className="reveal-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>About / 01</div>
            <h2 style={{marginTop: 14}}>Built in the<br/>Central Valley.</h2>
          </div>
          <p className="lead">
            Shubh Express INC is a family-operated trucking company based in Lathrop, California.
            We move containerized freight between West Coast ports and inland warehouses — fast,
            credentialed, and accountable on every load.
          </p>
        </div>
        <div className="about-grid">
          <div className="about-copy">
            <p>
              From a single rig in our first year to a fleet of <strong>39+ trucks</strong> running drayage
              and intermodal lanes across California, Nevada, and the Pacific Northwest — growth has
              been earned one load at a time.
            </p>
            <p>
              Our operators hold all three Oakland terminal credentials, current TWIC cards, and clean
              CSA scores. We run HazMat-endorsed equipment, refrigerated trailers, and overweight-rated
              chassis for stone and recyclables.
            </p>
            <p>
              We're SmartWay-registered, CDTA-certified, and listed in good standing with the FMCSA.
              The certifications matter — but the relationships with shippers, brokers, and terminal
              operators are why the freight keeps moving.
            </p>
            <div className="badges">
              <span className="badge"><span className="b-dot"></span>SmartWay Partner</span>
              <span className="badge"><span className="b-dot"></span>CDTA Registered</span>
              <span className="badge"><span className="b-dot"></span>TWIC · Port-Cleared</span>
            </div>
          </div>
          <aside className="about-side">
            <div className="eyebrow" style={{color: 'var(--fg-mute)'}}>Company Snapshot</div>
            <h3 style={{marginTop: 10}}>By the numbers</h3>
            <div className="about-stats">
              <div className="about-stat"><div className="about-stat-k">USDOT</div><div className="about-stat-v">3320224</div></div>
              <div className="about-stat"><div className="about-stat-k">MC Number</div><div className="about-stat-v">1056321</div></div>
              <div className="about-stat"><div className="about-stat-k">Year Founded</div><div className="about-stat-v">2019</div></div>
              <div className="about-stat"><div className="about-stat-k">Fleet Size</div><div className="about-stat-v">39+</div></div>
              <div className="about-stat"><div className="about-stat-k">Service Lanes</div><div className="about-stat-v">CA · NV · OR</div></div>
              <div className="about-stat"><div className="about-stat-k">Operating Auth.</div><div className="about-stat-v">Active</div></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ----- Services ----- */
const SERVICES = [
  { n: '01', icon: 'container', title: 'Port Drayage', body: 'Container moves between Oakland terminals and inland customers across Northern California.', tags: ['SSA-B58', 'TraPac', 'Everport'] },
  { n: '02', icon: 'truck', title: 'Intermodal', body: 'Rail-to-truck transfers from BNSF and UP ramps with same-day pickup and pre-pulls.', tags: ['Rail', 'Pre-pull', 'Storage'] },
  { n: '03', icon: 'hazmat', title: 'HazMat Freight', body: 'Class 3 / 8 / 9 hauls with fully endorsed drivers, placard-ready trucks, and proper documentation.', tags: ['Class 3·8·9', 'Endorsed'] },
  { n: '04', icon: 'reefer', title: 'Refrigerated', body: 'Temperature-controlled reefer service for produce, dairy, and pharma — continuous temp logging.', tags: ['-20°F to 70°F', 'Temp logs'] },
  { n: '05', icon: 'car', title: 'Auto Export', body: 'Vehicle drayage to Port of Oakland for RoRo and container export, with VIN verification.', tags: ['RoRo', 'VIN check'] },
  { n: '06', icon: 'stone', title: 'Stone Import', body: 'Heavy-haul stone, granite, and tile slabs from port to fabricators — overweight chassis available.', tags: ['Overweight', 'Slabs'] },
  { n: '07', icon: 'recycle', title: 'Recyclables', body: 'Outbound scrap metal, paper, and OCC moves to West Coast export terminals on tight cutoffs.', tags: ['Scrap', 'OCC', 'Paper'] },
];
function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>Services / 02</div>
            <h2 style={{marginTop: 14}}>What we<br/>haul.</h2>
          </div>
          <p className="lead">
            Seven specialized lines of service, one operating standard. Every load is dispatched,
            tracked, and accounted for from gate-in to delivery.
          </p>
        </div>
        <div className="services-grid">
          {SERVICES.map(s => (
            <article key={s.n} className="svc">
              <div className="svc-arrow"><Icon name="arrow" size={18}/></div>
              <div className="svc-num">{s.n} / 07</div>
              <div className="svc-icon"><Icon name={s.icon} size={22}/></div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-body">{s.body}</div>
              <div className="svc-tags">
                {s.tags.map(t => <span key={t} className="svc-tag">{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- Terminals ----- */
function TerminalArt({ hue }) {
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
      <defs>
        <pattern id={`p-${hue}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="var(--bg-2)"/>
          <rect width="6" height="14" fill="var(--bg-3)"/>
        </pattern>
      </defs>
      <rect width="400" height="160" fill={`url(#p-${hue})`}/>
      <text x="20" y="140" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="var(--fg-mute)" letterSpacing="2">
        [ terminal yard · container stacks ]
      </text>
    </svg>
  );
}

/* ----- Theme Toggle ----- */
function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M8 1 A7 7 0 0 0 8 15 Z" fill="#111111"/>
        <path d="M8 1 A7 7 0 0 1 8 15 Z" fill="#eeeeee"/>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.35"/>
      </svg>
    </button>
  );
}
const TERMINALS = [
  { code: 'OAK · SSA-B58', name: 'SSA Terminal B58', loc: 'Berth 58 · Port of Oakland', wait: '~45 min', moves: '12–18 / day', hue: 0.08 },
  { code: 'OAK · TRAPAC', name: 'TraPac Oakland', loc: 'Berths 30–32 · Outer Harbor', wait: '~60 min', moves: '8–14 / day', hue: 0.06 },
  { code: 'OAK · EVERPORT', name: 'Everport Terminal', loc: 'Berths 20–24 · Howard Terminal', wait: '~50 min', moves: '10–16 / day', hue: 0.04 },
];
function Terminals() {
  return (
    <section id="terminals">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>Terminals / 03</div>
            <h2 style={{marginTop: 14}}>Port-cleared<br/>at three gates.</h2>
          </div>
          <p className="lead">
            We hold active credentials and a roster of TWIC-carded drivers at every major Oakland marine
            terminal — so your container moves the day it's ready, not the day after.
          </p>
        </div>

        <div className="term-explain">
          <div className="ex-mark"><Icon name="info" size={20}/></div>
          <p>
            <strong>What is drayage?</strong> Drayage is the short-haul leg that moves an ocean container
            from a marine terminal to a warehouse, rail ramp, or transload facility — usually within the
            same metro region. It's the most operationally sensitive part of the supply chain: appointment
            systems, gate hours, chassis availability, and dual-transactions all matter. We handle those
            details so the box keeps moving.
          </p>
        </div>

        <div className="terminals-grid">
          {TERMINALS.map(t => (
            <article key={t.code} className="term">
              <div className="term-img">
                <TerminalArt hue={t.hue}/>
                <div className="term-tag">{t.code}</div>
              </div>
              <div className="term-body">
                <div className="term-name">{t.name}</div>
                <div className="term-loc">{t.loc}</div>
                <div className="term-meta">
                  <div><b>{t.wait}</b>Avg. gate wait</div>
                  <div><b>{t.moves}</b>Daily moves</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- Contact / Quote ----- */
function Contact() {
  const [sent, setSent] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [flashConsent, setFlashConsent] = useState(false);
  const [shakeBtn, setShakeBtn] = useState(false);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    from: '', to: '', service: 'Port Drayage', message: ''
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const consentRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!consent) {
      setFlashConsent(true);
      setShakeBtn(true);
      setTimeout(() => setShakeBtn(false), 600);
      setTimeout(() => setFlashConsent(false), 1300);
      if (consentRef.current) consentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        access_key: 'a393dae7-f268-4d08-ab92-1226a49e0e2b',
        subject: `New Quote Request — ${form.service} — ${form.name}`,
        from_name: 'Shubh Express Website',
        botcheck: '',
        name: form.name,
        company: form.company || '(not provided)',
        email: form.email,
        phone: form.phone || '(not provided)',
        origin: form.from || '(not provided)',
        destination: form.to || '(not provided)',
        service: form.service,
        message: form.message || '(no message)',
        sms_consent: 'Yes — user agreed to SMS communications',
      };
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted({ ...form });
        setSent(true);
        setForm({ name: '', company: '', email: '', phone: '', from: '', to: '', service: 'Port Drayage', message: '' });
        setConsent(false);
      } else {
        setError(data.message || 'Submission failed. Please try again or call us directly.');
      }
    } catch (err) {
      setError('Network error. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="quote-wrap">
          <div className="quote-info">
            <div className="eyebrow"><span className="dot"></span>Contact / 04</div>
            <h2 style={{marginTop: 14}}>Get a quote.</h2>
            <p className="lead">
              Tell us about the load. Our dispatch team typically responds within two business hours
              during port operating windows.
            </p>
            <div className="contact-rows">
              <div className="contact-row">
                <div className="c-icon"><Icon name="pin" size={18}/></div>
                <div>
                  <div className="c-k">Headquarters</div>
                  <div className="c-v">1793 Holborn Dr<br/>Lathrop, CA 95330</div>
                </div>
              </div>
              <div className="contact-row">
                <div className="c-icon"><Icon name="phone" size={18}/></div>
                <div>
                  <div className="c-k">Dispatch — 24/7</div>
                  <div className="c-v">
                    <a href="tel:+12094071504">+1 (209) 407-1504</a><br/>
                    <a href="tel:+12094255340">+1 (209) 425-5340</a>
                  </div>
                </div>
              </div>
              <div className="contact-row">
                <div className="c-icon"><Icon name="mail" size={18}/></div>
                <div>
                  <div className="c-k">Email</div>
                  <div className="c-v">
                    <a href="mailto:dispatch@shubhexpress.com">dispatch@shubhexpress.com</a>
                  </div>
                </div>
              </div>
              <div className="contact-row">
                <div className="c-icon"><Icon name="clock" size={18}/></div>
                <div>
                  <div className="c-k">Office Hours</div>
                  <div className="c-v">Mon–Fri · 06:00–20:00 PT<br/>Dispatch on-call 24/7</div>
                </div>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="thank-you">
              <div className="ty-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="var(--orange)" strokeWidth="1.5"/>
                  <path d="M9 16l5 5 9-10" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="ty-eyebrow"><span className="dot" style={{background:'var(--blue)'}}></span>Quote Received</div>
              <h2 className="ty-heading">Thank you.</h2>
              <p className="ty-body">
                Your request has been received. Our dispatch team will get back to you within <strong>24–48 hours</strong>.
              </p>
              <button className="btn btn-ghost ty-reset" onClick={() => setSent(false)}>
                Submit another request <span className="arrow"><Icon name="arrow" size={15}/></span>
              </button>
            </div>
          ) : (
            <form className="quote-form" onSubmit={submit}>
              <div className="form-grid">
                <div className="field"><label>Full name *</label><input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Jane Patel"/></div>
                <div className="field"><label>Company</label><input value={form.company} onChange={e => update('company', e.target.value)} placeholder="Acme Logistics"/></div>
                <div className="field"><label>Email *</label><input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane@acme.com"/></div>
                <div className="field"><label>Phone</label><input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(555) 010-0100"/></div>
                <div className="field"><label>Origin (from)</label><input value={form.from} onChange={e => update('from', e.target.value)} placeholder="Port of Oakland — TraPac"/></div>
                <div className="field"><label>Destination (to)</label><input value={form.to} onChange={e => update('to', e.target.value)} placeholder="Tracy, CA"/></div>
                <div className="field full">
                  <label>Service</label>
                  <select value={form.service} onChange={e => update('service', e.target.value)}>
                    <option>Port Drayage</option>
                    <option>Intermodal</option>
                    <option>HazMat Freight</option>
                    <option>Refrigerated</option>
                    <option>Auto Export</option>
                    <option>Stone Import</option>
                    <option>Recyclables</option>
                  </select>
                </div>
                <div className="field full">
                  <label>Load details / message</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Container size, weight, pickup window, special handling, etc."/>
                </div>
              </div>

              <label ref={consentRef} className={`consent ${flashConsent ? 'flash' : ''}`} htmlFor="sms-consent">
                <input id="sms-consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>
                <span className="check">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="consent-text">
                  By checking this box, I agree to receive text messages from (Shubh express INC). Message frequency varies. Message &amp; data rates may apply. Phone numbers collected for SMS purposes will not be shared with third parties or affiliates for marketing purposes under any circumstances. Text HELP to + (209) 407-4107 for assistance. You can reply STOP to unsubscribe at any time. Please refer to our <a href="privacy-policy.html" target="_blank" style={{color:'var(--blue)'}}>privacy policy</a>.
                </span>
              </label>

              <input type="checkbox" name="botcheck" style={{display:'none'}} aria-hidden="true"/>

              <div className="form-actions">
                <span className="legal">By submitting you agree to our <a href="privacy-policy.html" target="_blank" style={{color:'var(--blue)'}}>privacy policy</a>. We never share your data.</span>
                <button className={`btn btn-primary ${shakeBtn ? 'shake' : ''}`} type="submit" disabled={loading}>
                  {loading ? 'Sending…' : <>Submit Quote <span className="arrow"><Icon name="arrow" size={16}/></span></>}
                </button>
              </div>
              {error && <div className="toast toast-error">✕ {error}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----- Privacy ----- */
const PRIVACY = [
  { h: 'Information We Collect', p: 'When you request a quote or post to the community board, we collect the details you provide — name, company, email, phone, origin/destination, and message. We also collect basic server logs (IP, timestamp, user agent) for security and abuse prevention.' },
  { h: 'How We Use It', p: 'Your information is used solely to respond to your quote, coordinate freight, send transactional updates, and operate the website. We never sell your data to third parties.' },
  { h: 'SMS Communications', p: 'If you opt in to text messages, we use your phone number only to send updates about your quote or load. Message frequency varies. Message and data rates may apply. Phone numbers collected for SMS purposes are never shared with third parties or affiliates for marketing purposes. Reply STOP to unsubscribe at any time.' },
  { h: 'Data Retention', p: 'Quote requests are kept for up to 24 months for operational and accounting purposes. You may request deletion at any time by emailing info@shubhexpress.com.' },
  { h: 'Third-Party Services', p: 'We use industry-standard providers for email and analytics. These vendors are bound by confidentiality agreements and applicable data-protection regulations.' },
  { h: 'Your Rights', p: 'You have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, contact info@shubhexpress.com.' },
];
function Privacy() {
  return (
    <section id="privacy">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>Privacy / 05</div>
            <h2 style={{marginTop: 14}}>Privacy<br/>policy.</h2>
          </div>
          <p className="lead">
            Last updated May 2026. We take your data seriously — here's exactly what we collect,
            how we use it, and how to reach us about it.
          </p>
        </div>
        <div className="privacy-grid">
          <aside className="privacy-toc">
            <ol>
              {PRIVACY.map(p => <li key={p.h}>{p.h}</li>)}
            </ol>
          </aside>
          <div className="privacy-body">
            {PRIVACY.map((p, i) => (
              <article key={p.h}>
                <h4>{String(i+1).padStart(2,'0')} · {p.h}</h4>
                <p>{p.p}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- Footer ----- */
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-col">
            <a href="#top" className="brand">
              <img src="logo.png" alt="Shubh Express INC" className="brand-logo brand-logo-footer"/>
            </a>
            <p className="foot-tag">
              A West Coast drayage and intermodal carrier. Family-owned, port-cleared, and committed
              to moving every load on time.
            </p>
          </div>
          <div className="foot-col">
            <h5>Site</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#terminals">Terminals</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="privacy-policy.html" target="_blank">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+12094071504">+1 (209) 407-1504</a></li>
              <li><a href="tel:+12094255340">+1 (209) 425-5340</a></li>
              <li><a href="mailto:dispatch@shubhexpress.com">dispatch@shubhexpress.com</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>HQ</h5>
            <ul>
              <li>1793 Holborn Dr</li>
              <li>Lathrop, CA 95330</li>
              <li style={{marginTop: 10, fontFamily:'JetBrains Mono, monospace', fontSize: 12, color: 'var(--fg-mute)'}}>USDOT #3320224</li>
              <li style={{fontFamily:'JetBrains Mono, monospace', fontSize: 12, color: 'var(--fg-mute)'}}>MC #1056321</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© 2026 Shubh Express INC · All Rights Reserved</div>
          <div>Designed for the long haul</div>
        </div>
      </div>
    </footer>
  );
}

/* ----- App ----- */
function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <React.Fragment>
      <Nav theme={theme} setTheme={setTheme}/>
      <Hero/>
      <Marquee/>
      <About/>
      <Services/>
      <Terminals/>
      <Contact/>
      <Privacy/>
      <Footer/>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
