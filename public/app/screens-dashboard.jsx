// screens-dashboard.jsx — Dashboard (3 variants) + Battery, Savings, Connections
const { useState: useS } = React;

/* shared demo data */
const PRICE = [.34,.30,.26,.22,.19,.18,.21,.32,.46,.52,.48,.40,.36,.33,.35,.42,.58,.72,.80,.74,.60,.50,.42,.37];
const NOW = 0.58; // ~14:00
const SCHEDULE = [
  { t: '02:00–05:00', icon: 'arrowDn', label: 'Charge battery', sub: 'Cheapest window · €0.18/kWh', kind: 'charge' },
  { t: '07:00–09:00', icon: 'sun', label: 'Solar + home use', sub: 'Self-consumption', kind: 'solar' },
  { t: '17:00–20:00', icon: 'arrowUR', label: 'Sell to grid', sub: 'Peak price · €0.80/kWh', kind: 'sell' },
];

/* helpers: format + live-schema → rijen (met demo-fallback bij geen data) */
function fmtEur(n, d = 2) { return (n == null || isNaN(n)) ? null : '€' + Number(n).toFixed(d); }
function liveScheduleRows(sched) {
  if (!sched || !sched.length) return null;
  const blocks = [];
  sched.forEach((s) => {
    const kind = s.action === 'discharge' ? 'sell' : s.action === 'charge' ? 'charge' : 'solar';
    const last = blocks[blocks.length - 1];
    if (last && last.kind === kind && s.hour === last.end) { last.end = s.hour + 1; last.prices.push(s.price); }
    else blocks.push({ kind, start: s.hour, end: s.hour + 1, prices: [s.price] });
  });
  const pick = blocks.filter((b) => b.kind !== 'solar');
  const src = (pick.length ? pick : blocks).slice(0, 3);
  const pad = (h) => String(h % 24).padStart(2, '0') + ':00';
  return src.map((b) => {
    const avg = b.prices.reduce((a, c) => a + c, 0) / b.prices.length;
    return {
      kind: b.kind,
      icon: b.kind === 'charge' ? 'arrowDn' : b.kind === 'sell' ? 'arrowUR' : 'sun',
      label: b.kind === 'charge' ? 'Charge battery' : b.kind === 'sell' ? 'Sell to grid' : 'Solar + home use',
      sub: b.kind === 'charge' ? ('Cheapest window · €' + avg.toFixed(2) + '/kWh')
        : b.kind === 'sell' ? ('Peak price · €' + avg.toFixed(2) + '/kWh') : 'Self-consumption',
      t: pad(b.start) + '–' + pad(b.end),
    };
  });
}

function Greeting({ onOpen }) {
  let prof = {};
  try { prof = JSON.parse(localStorage.getItem('gbict_profile')) || {}; } catch (e) {}
  const name = (prof.name || 'Lieke de Vries').trim();
  const first = name.split(/\s+/)[0] || 'Lieke';
  const home = prof.home || (first + "'s home");
  const init = (name.split(/\s+/).map(w => w[0]).slice(0, 2).join('') || 'L').toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
      <div style={{ minWidth: 0, flex: '0 1 auto' }}>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>Good afternoon</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{home}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
        <div className="pill live">Optimising</div>
        <button onClick={() => onOpen && onOpen('profile')} aria-label="Edit profile" style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{init}</button>
      </div>
    </div>
  );
}

/* battery ring */
function Ring({ pct, size = 130, sw = 12, run = true, label = 'charged', center }) {
  const r = (size - sw) / 2, C = 2 * Math.PI * r;
  const val = useCountUp(pct, { run });
  const off = C * (1 - val / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="color-mix(in srgb,var(--ink) 9%, transparent)" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={run ? off : C*(1-pct/100)} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.68,.32,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {center || <><div className="num" style={{ fontSize: size*.25, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>{val}%</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{label}</div></>}
      </div>
    </div>
  );
}

function PriceCard({ run, live }) {
  const tib = live?.tibber;
  const hasPrices = !!(tib?.today && tib.today.length);
  const pts = hasPrices ? tib.today.map((p) => p.total) : [];
  const cur = (typeof tib?.current === 'number') ? tib.current : null;
  const pad = (h) => String(h % 24).padStart(2, '0') + ':00';
  // nog aan het laden / geen prijzen → eerlijke lege staat, geen demo-curve
  if (!hasPrices) {
    return (
      <div className="card card-pad solid rise" style={{ animationDelay: '.16s' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Power price today</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
          <span className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{cur != null ? '€' + cur.toFixed(2) : '—'}</span>
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>/kWh now</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '12px 0 0' }}>{live ? 'Prices not available right now.' : 'Loading prices…'}</p>
      </div>
    );
  }
  const avg = pts.reduce((a, c) => a + c, 0) / pts.length;
  const price = cur != null ? cur : avg;
  const idx = cur != null ? tib.today.findIndex((p) => Math.abs(p.total - cur) < 1e-9) : -1;
  const nowPos = idx >= 0 ? (idx + 0.5) / tib.today.length : 0.5;
  const below = price <= avg;
  const lo = pts.indexOf(Math.min(...pts)), hi = pts.indexOf(Math.max(...pts));
  return (
    <div className="card card-pad solid rise" style={{ animationDelay: '.16s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Power price today</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
            <span className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>€{price.toFixed(2)}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>/kWh now</span>
          </div>
        </div>
        <div className="pill" style={{ background: below ? 'var(--accent-tint)' : 'color-mix(in srgb,var(--sell) 14%, transparent)' }}><Icon name={below ? 'arrowDn' : 'arrowUR'} size={14} /> {below ? 'Below average' : 'Above average'}</div>
      </div>
      <PriceCurve points={pts} now={nowPos} run={run} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8 }}>
        <span>00:00</span><span>cheapest {pad(lo)}</span><span>peak {pad(hi)}</span><span>24:00</span>
      </div>
    </div>
  );
}

function ScheduleCard({ run, onOpen, live }) {
  const tint = { charge: 'var(--accent-tint)', solar: 'var(--sun-tint)', sell: 'color-mix(in srgb,var(--sell) 14%, transparent)' };
  const col = { charge: 'var(--accent-deep)', solar: 'var(--sun)', sell: 'var(--sell)' };
  const rows = liveScheduleRows(live?.tibber?.optimization?.schedule);
  return (
    <div className="card card-pad solid rise" style={{ animationDelay: '.22s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Today's plan</b>
        <button onClick={onOpen} style={{ border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>Why? <Icon name="chevR" size={14} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!rows && <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '4px 0' }}>{live ? 'No plan yet — prices not available.' : 'Loading…'}</p>}
        {(rows || []).map((s, i) => (
          <div key={i} className="row" style={{ padding: '11px 0' }}>
            <div className="row-ic" style={{ background: tint[s.kind], color: col[s.kind], borderRadius: 12 }}><Icon name={s.icon} size={19} /></div>
            <div className="row-tx"><b>{s.label}</b><span>{s.sub}</span></div>
            <div className="num" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{s.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowStrip({ run, live }) {
  // live energy split: solar → home / battery / grid (echte Sessy-data indien aanwezig)
  const ses = live?.sessy;
  const kw = (w) => (Math.abs(w) / 1000).toFixed(1) + ' kW';
  let items;
  if (ses) {
    const solarW = ses.renewable_energy ?? 0;
    const battW = ses.power ?? 0;            // + = laden, − = ontladen
    const homeW = Math.max(0, solarW - Math.max(0, battW) - Math.max(0, ses.grid_power ?? 0));
    items = [
      { icon: 'sun', v: kw(solarW), l: 'Solar in', c: 'var(--sun)' },
      { icon: 'home', v: kw(homeW), l: 'Home use', c: 'var(--ink-2)' },
      { icon: 'battery', v: (battW >= 0 ? '+' : '−') + kw(battW), l: battW >= 0 ? 'To battery' : 'From battery', c: 'var(--accent)' },
    ];
  } else {
    items = [
      { icon: 'sun', v: '0.0 kW', l: 'Solar in', c: 'var(--sun)' },
      { icon: 'home', v: '0.0 kW', l: 'Home use', c: 'var(--ink-2)' },
      { icon: 'battery', v: '0.0 kW', l: 'Battery', c: 'var(--accent)' },
    ];
  }
  return (
    <div className="card solid rise" style={{ animationDelay: '.12s', padding: '16px 8px', display: 'flex' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ width: '.5px', background: 'var(--line)', margin: '2px 0' }} />}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{ color: it.c }}><Icon name={it.icon} size={22} /></div>
            <div className="num" style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{it.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{it.l}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ════════════════ DASHBOARD — 3 variants ════════════════ */
function Dashboard({ variant = 'classic', onOpen, run = true }) {
  const live = useLiveData();
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise"><Greeting onOpen={onOpen} /></div>
        {variant === 'classic' && <DashClassic onOpen={onOpen} run={run} live={live} />}
        {variant === 'focus' && <DashFocus onOpen={onOpen} run={run} live={live} />}
        {variant === 'timeline' && <DashTimeline onOpen={onOpen} run={run} live={live} />}
      </div>
    </div>
  );
}

/* variant A — balanced cards */
function DashClassic({ onOpen, run, live }) {
  const sv = live?.savings, ses = live?.sessy, sol = live?.solar;
  const today = useCountUp(sv?.today_eur ?? 0, { run, decimals: 2 });
  const soc = (ses && typeof ses.state_of_charge === 'number') ? Math.round(ses.state_of_charge) : 0;
  const monthStr = fmtEur(sv?.month_eur ?? 0, 2);
  const totalStr = '€' + Math.round(sv?.total_eur ?? 0);
  const solarStr = (sol && typeof sol.todayKwh === 'number') ? sol.todayKwh.toFixed(1) + ' kWh' : '0.0 kWh';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="card-accent rise" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: .85 }}>Saved today</div>
            <div className="num" style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', margin: '4px 0' }}>€{today}</div>
            <div style={{ fontSize: 13, opacity: .85 }}>{monthStr} this month · {totalStr} all-time</div>
          </div>
          <Ring pct={soc} size={86} sw={9} run={run} center={<><Icon name="battery" size={20} style={{ color: '#fff' }} /><div className="num" style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{soc}%</div></>} />
        </div>
      </div>
      <FlowStrip run={run} live={live} />
      <div className="grid2">
        <div className="rise" style={{ animationDelay: '.14s' }} onClick={() => onOpen('savings')}><Stat k="This month" v={monthStr} d="saved so far" dpos sm /></div>
        <div className="rise" style={{ animationDelay: '.18s' }} onClick={() => onOpen('battery')}><Stat k="Solar today" v={solarStr} d="generated" dpos sm /></div>
      </div>
      <PriceCard run={run} live={live} />
      <ScheduleCard run={run} live={live} onOpen={() => onOpen('battery')} />
      <ForecastCard run={run} live={live} />
    </div>
  );
}

/* variant B — one hero number + battery focus */
function DashFocus({ onOpen, run }) {
  const today = useCountUp(1.84, { run, decimals: 2 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="rise" style={{ textAlign: 'center', padding: '14px 0 4px' }}>
        <div className="scr-eyebrow" style={{ color: 'var(--accent)' }}>Saved today</div>
        <div className="num" style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-.04em', color: 'var(--ink)', lineHeight: 1, margin: '6px 0' }}>€{today}</div>
        <div className="pill live" style={{ marginTop: 4 }}>Battery discharging to grid</div>
      </div>
      <div className="card solid rise" style={{ animationDelay: '.12s', padding: 22, display: 'flex', alignItems: 'center', gap: 22 }} onClick={() => onOpen('battery')}>
        <Ring pct={78} size={120} run={run} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Sessy battery</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.5 }}>3.9 of 5.0 kWh stored. Selling at peak until 20:00.</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}>Details <Icon name="chevR" size={14} /></div>
        </div>
      </div>
      <div className="grid2">
        <div className="rise" style={{ animationDelay: '.16s' }}><Stat k="This month" v="€38.20" d="↑ 12%" dpos sm /></div>
        <div className="rise" style={{ animationDelay: '.2s' }}><Stat k="Solar today" v="8.4 kWh" d="3.1 stored" dpos sm /></div>
      </div>
      <PriceCard run={run} />
      <ForecastCard run={run} />
    </div>
  );
}

/* variant C — schedule timeline hero */
function DashTimeline({ onOpen, run }) {
  const tint = { charge: 'var(--accent)', solar: 'var(--sun)', sell: 'var(--sell)' };
  const past = [true, true, false];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="grid2 rise">
        <Stat k="Saved today" v="€1.84" d="live" dpos sm />
        <div className="card card-pad solid" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Ring pct={78} size={56} sw={7} run={run} center={<span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>78%</span>} />
          <div><div className="stat-k">Battery</div><div style={{ fontSize: 14, fontWeight: 650, color: 'var(--ink)', marginTop: 3 }}>3.9 kWh</div></div>
        </div>
      </div>
      <div className="card solid rise" style={{ animationDelay: '.12s', padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <b style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Live optimisation</b>
          <div className="pill live">On</div>
        </div>
        <div style={{ position: 'relative', paddingLeft: 8 }}>
          {SCHEDULE.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, position: 'relative', paddingBottom: i < 2 ? 24 : 0 }}>
              {i < 2 && <div style={{ position: 'absolute', left: 13, top: 28, bottom: 0, width: 2, background: past[i] ? 'var(--accent)' : 'var(--line)' }} />}
              <div style={{ width: 28, height: 28, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: past[i] ? tint[s.kind] : 'var(--card-2)', color: past[i] ? '#fff' : 'var(--ink-3)', border: past[i] ? 'none' : '1.5px solid var(--line)', zIndex: 1 }}>
                <Icon name={past[i] ? 'check' : s.icon} size={15} sw={2.2} />
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <b style={{ fontSize: 15, fontWeight: 650, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{s.label}</b>
                  <span className="num" style={{ fontSize: 13, color: 'var(--ink-3)', whiteSpace: 'nowrap', flex: 'none' }}>{s.t}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 18 }} onClick={() => onOpen('battery')}>See decision log <Icon name="chevR" size={16} /></button>
      </div>
      <PriceCard run={run} />
      <div className="grid2">
        <div className="rise" style={{ animationDelay: '.18s' }} onClick={() => onOpen('savings')}><Stat k="This month" v="€38.20" d="↑ 12%" dpos sm /></div>
        <div className="rise" style={{ animationDelay: '.22s' }}><Stat k="Solar today" v="8.4 kWh" d="3.1 stored" dpos sm /></div>
      </div>
    </div>
  );
}

function ForecastCard({ run, live }) {
  const tom = live?.tibber?.tomorrow;
  const head = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <Icon name="spark" size={18} style={{ color: 'var(--accent)' }} />
      <b style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>Tomorrow's forecast</b>
    </div>
  );
  if (!tom || !tom.length) {
    return (
      <div className="card card-pad solid rise" style={{ animationDelay: '.28s' }}>
        {head}
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>Tomorrow's prices usually arrive in the afternoon. We'll plan the cheapest window automatically once they're in.</p>
      </div>
    );
  }
  const vals = tom.map((p) => p.total);
  let bestStart = 0, best = Infinity;
  for (let i = 0; i + 4 <= vals.length; i++) { const s = vals.slice(i, i + 4).reduce((a, c) => a + c, 0); if (s < best) { best = s; bestStart = i; } }
  const pad = (h) => String(h % 24).padStart(2, '0') + ':00';
  const startH = new Date(tom[bestStart].startsAt).getHours();
  return (
    <div className="card card-pad solid rise" style={{ animationDelay: '.28s' }}>
      {head}
      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>
        Cheapest power between <b style={{ color: 'var(--ink)' }}>{pad(startH)}–{pad(startH + 4)}</b>. We'll charge the battery in that window automatically.
      </p>
    </div>
  );
}

/* ════════════════ BATTERY DETAIL ════════════════ */
function BatteryScreen({ run }) {
  const live = useLiveData();
  const ses = live?.sessy, sv = live?.savings;
  const soc = (ses && typeof ses.state_of_charge === 'number') ? Math.round(ses.state_of_charge) : 0;
  const cap = 5.0;
  const stored = ((soc / 100) * cap).toFixed(1);
  const earnedStr = fmtEur(sv?.today_eur ?? 0, 2);
  const stateLabel = ses
    ? (ses.system_state === 'DISCHARGING' ? 'Discharging to grid'
      : ses.system_state === 'CHARGING' ? 'Charging battery' : 'Idle · optimising')
    : 'No battery connected';
  const actions = (sv?.charge_count ?? 0) + (sv?.discharge_count ?? 0);
  const log = [];   // echte beslis-log API bestaat nog niet → lege staat tonen
  const tint = { charge: 'var(--accent-tint)', solar: 'var(--sun-tint)', sell: 'color-mix(in srgb,var(--sell) 14%, transparent)' };
  const col = { charge: 'var(--accent-deep)', solar: 'var(--sun)', sell: 'var(--sell)' };
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Device</div><h1 className="scr-title" style={{ marginTop: 6 }}>Battery</h1></div>
        <div className="card solid rise" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Ring pct={soc} size={160} sw={14} run={run} center={<><div className="num" style={{ fontSize: 42, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>{soc}%</div><div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{stored} / {cap.toFixed(1)} kWh</div></>} />
          <div className="pill live" style={{ marginTop: 6 }}>{stateLabel}</div>
        </div>
        <div className="grid2" style={{ marginBottom: 14 }}>
          <div className="rise" style={{ animationDelay: '.1s' }}><Stat k="Earned today" v={earnedStr} d="from this battery" dpos sm /></div>
          <div className="rise" style={{ animationDelay: '.14s' }}><Stat k="Actions today" v={String(actions)} d="charge + sell moves" dpos sm /></div>
        </div>
        <div className="card card-pad solid rise" style={{ animationDelay: '.18s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="shield" size={18} style={{ color: 'var(--accent)' }} />
            <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Decision log</b>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 'auto' }}>Last 30 days</span>
          </div>
          {!log.length && <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '4px 0' }}>No activity yet — your battery's moves will show here.</p>}
          {log.map((l, i) => (
            <div key={i} className="row" style={{ padding: '12px 0' }}>
              <div className="row-ic" style={{ background: tint[l.kind], color: col[l.kind], borderRadius: 12 }}><Icon name={l.kind === 'sell' ? 'arrowUR' : l.kind === 'solar' ? 'sun' : 'arrowDn'} size={18} /></div>
              <div className="row-tx"><b>{l.label}</b><span>{l.sub}</span></div>
              <div style={{ textAlign: 'right' }}><div className="num" style={{ fontSize: 13, fontWeight: 600, color: col[l.kind] }}>{l.v}</div><div className="num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{l.t}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════ SAVINGS ════════════════ */
function SavingsScreen({ run }) {
  const live = useLiveData();
  const sv = live?.savings;
  const fmt = (n) => (n == null ? '—' : '€' + Number(n).toFixed(2));
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Insights</div><h1 className="scr-title" style={{ marginTop: 6 }}>Savings</h1></div>
        <div className="grid2 rise" style={{ marginBottom: 14 }}>
          <Stat k="All-time saved" v={'€' + Math.round(sv?.total_eur ?? 0)} d="since you joined" dpos sm />
          <Stat k="This month" v={fmt(sv?.month_eur ?? 0)} d="so far" dpos sm />
        </div>
        <div className="card card-pad solid rise" style={{ animationDelay: '.12s', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div><div className="stat-k">Saved today</div><div className="num" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{fmt(sv?.today_eur ?? 0)}</div></div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>The totals above are live. A day-by-day history chart is coming soon.</p>
        </div>
        <div className="card card-pad solid rise" style={{ animationDelay: '.18s' }}>
          <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>Where it came from</b>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '6px 0 0' }}>The breakdown (arbitrage, peak avoidance, solar self-use) appears once your battery has logged some activity.</p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ CONNECTIONS ════════════════ */
const CONNECTED = [
  { icon: 'meter', t: 'HomeWizard P1', s: 'Smart meter', status: 'Live' },
  { icon: 'contract', t: 'Tibber', s: 'Dynamic contract', status: 'Live' },
  { icon: 'battery', t: 'Sessy', s: '5.0 kWh battery', status: 'Live' },
  { icon: 'sun', t: 'SolarEdge', s: '4.2 kWp array', status: 'Live' },
];
function ConnectionsScreen({ onAdd }) {
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div><div className="scr-eyebrow">Setup</div><h1 className="scr-title" style={{ marginTop: 6 }}>Connections</h1></div>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={onAdd}><Icon name="plus" size={18} /> Add</button>
        </div>
        <div className="card solid rise card-pad" style={{ animationDelay: '.08s', marginBottom: 14 }}>
          {CONNECTED.map((c,i)=>(
            <Row key={i} icon={c.icon} title={c.t} sub={c.s} right={<div className="pill live" style={{ height: 26, fontSize: 11.5 }}>{c.status}</div>} />
          ))}
        </div>
        <button className="card solid rise" onClick={onAdd} style={{ animationDelay: '.16s', width: '100%', padding: 18, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', border: '1.5px dashed var(--line)', background: 'transparent' }}>
          <div className="row-ic" style={{ background: 'var(--accent-tint)' }}><Icon name="plus" size={22} /></div>
          <div style={{ textAlign: 'left' }}><div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>Add a device</div><div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Battery, EV, heat pump & more</div></div>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, BatteryScreen, SavingsScreen, ConnectionsScreen });
