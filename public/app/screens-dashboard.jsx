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

function Greeting({ onOpen }) {
  let prof = {};
  try { prof = JSON.parse(localStorage.getItem('gbict_profile')) || {}; } catch (e) {}
  const name = (prof.name || 'Lieke de Vries').trim();
  const home = prof.home || "Lieke's home";
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

function PriceCard({ run }) {
  return (
    <div className="card card-pad solid rise" style={{ animationDelay: '.16s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Power price today</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
            <span className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>€0.42</span>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>/kWh now</span>
          </div>
        </div>
        <div className="pill" style={{ background: 'var(--accent-tint)' }}><Icon name="arrowDn" size={14} /> Below average</div>
      </div>
      <PriceCurve points={PRICE} now={NOW} run={run} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8 }}>
        <span>00:00</span><span>cheapest 04:00</span><span>peak 18:00</span><span>24:00</span>
      </div>
    </div>
  );
}

function ScheduleCard({ run, onOpen }) {
  const tint = { charge: 'var(--accent-tint)', solar: 'var(--sun-tint)', sell: 'color-mix(in srgb,var(--sell) 14%, transparent)' };
  const col = { charge: 'var(--accent-deep)', solar: 'var(--sun)', sell: 'var(--sell)' };
  return (
    <div className="card card-pad solid rise" style={{ animationDelay: '.22s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Today's plan</b>
        <button onClick={onOpen} style={{ border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>Why? <Icon name="chevR" size={14} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SCHEDULE.map((s, i) => (
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

function FlowStrip({ run }) {
  // live energy split: solar → home / battery / grid
  const items = [
    { icon: 'sun', v: '2.1 kW', l: 'Solar in', c: 'var(--sun)' },
    { icon: 'home', v: '0.8 kW', l: 'Home use', c: 'var(--ink-2)' },
    { icon: 'battery', v: '+1.3 kW', l: 'To battery', c: 'var(--accent)' },
  ];
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
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise"><Greeting onOpen={onOpen} /></div>
        {variant === 'classic' && <DashClassic onOpen={onOpen} run={run} />}
        {variant === 'focus' && <DashFocus onOpen={onOpen} run={run} />}
        {variant === 'timeline' && <DashTimeline onOpen={onOpen} run={run} />}
      </div>
    </div>
  );
}

/* variant A — balanced cards */
function DashClassic({ onOpen, run }) {
  const today = useCountUp(1.84, { run, decimals: 2 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="card-accent rise" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: .85 }}>Saved today</div>
            <div className="num" style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', margin: '4px 0' }}>€{today}</div>
            <div style={{ fontSize: 13, opacity: .85 }}>€38.20 this month · €412 all-time</div>
          </div>
          <Ring pct={78} size={86} sw={9} run={run} center={<><Icon name="battery" size={20} style={{ color: '#fff' }} /><div className="num" style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>78%</div></>} />
        </div>
      </div>
      <FlowStrip run={run} />
      <div className="grid2">
        <div className="rise" style={{ animationDelay: '.14s' }} onClick={() => onOpen('savings')}><Stat k="This month" v="€38.20" d="↑ 12% vs last" dpos sm /></div>
        <div className="rise" style={{ animationDelay: '.18s' }} onClick={() => onOpen('battery')}><Stat k="Solar today" v="8.4 kWh" d="3.1 kWh stored" dpos sm /></div>
      </div>
      <PriceCard run={run} />
      <ScheduleCard run={run} onOpen={() => onOpen('battery')} />
      <ForecastCard run={run} />
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

function ForecastCard({ run }) {
  return (
    <div className="card card-pad solid rise" style={{ animationDelay: '.28s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Icon name="spark" size={18} style={{ color: 'var(--accent)' }} />
        <b style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>Tomorrow's forecast</b>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>
        Sunny, with very cheap power between <b style={{ color: 'var(--ink)' }}>01:00–05:00</b>. We'll fully charge overnight and expect to save about <b style={{ color: 'var(--accent)' }}>€2.10</b>.
      </p>
    </div>
  );
}

/* ════════════════ BATTERY DETAIL ════════════════ */
function BatteryScreen({ run }) {
  const log = [
    { t: '13:40', label: 'Started selling to grid', sub: 'Price €0.80 — above your €0.55 threshold', kind: 'sell', v: '−1.3 kW' },
    { t: '09:10', label: 'Switched to solar', sub: 'Generation covered the home', kind: 'solar', v: '0 kW' },
    { t: '04:55', label: 'Finished charging', sub: 'Reached 92% on cheap power', kind: 'charge', v: '+2.4 kW' },
    { t: '02:00', label: 'Started charging', sub: 'Cheapest 3-hour window', kind: 'charge', v: '+2.4 kW' },
  ];
  const tint = { charge: 'var(--accent-tint)', solar: 'var(--sun-tint)', sell: 'color-mix(in srgb,var(--sell) 14%, transparent)' };
  const col = { charge: 'var(--accent-deep)', solar: 'var(--sun)', sell: 'var(--sell)' };
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Device</div><h1 className="scr-title" style={{ marginTop: 6 }}>Battery</h1></div>
        <div className="card solid rise" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Ring pct={78} size={160} sw={14} run={run} center={<><div className="num" style={{ fontSize: 42, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>78%</div><div style={{ fontSize: 13, color: 'var(--ink-3)' }}>3.9 / 5.0 kWh</div></>} />
          <div className="pill live" style={{ marginTop: 6 }}>Selling to grid · €0.80/kWh</div>
        </div>
        <div className="grid2" style={{ marginBottom: 14 }}>
          <div className="rise" style={{ animationDelay: '.1s' }}><Stat k="Earned today" v="€1.84" d="from this battery" dpos sm /></div>
          <div className="rise" style={{ animationDelay: '.14s' }}><Stat k="Cycles" v="0.8" d="today · 312 total" dpos sm /></div>
        </div>
        <div className="card card-pad solid rise" style={{ animationDelay: '.18s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="shield" size={18} style={{ color: 'var(--accent)' }} />
            <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Decision log</b>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 'auto' }}>Last 30 days</span>
          </div>
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
  const [range, setRange] = useS('30d');
  const sets = {
    '7d': [40,55,38,72,60,84,50].map((h,i)=>({h, kind:i===5?'hi':'lo'})),
    '30d': Array.from({length:14},(_,i)=>({h: 30+Math.round(Math.abs(Math.sin(i*1.1))*60), kind: i%5===0?'hi':'lo'})),
    '90d': Array.from({length:12},(_,i)=>({h: 35+Math.round(Math.abs(Math.cos(i*0.9))*55), kind: i%4===0?'hi':'lo'})),
  };
  const totals = { '7d': '€11.40', '30d': '€38.20', '90d': '€121.60' };
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Insights</div><h1 className="scr-title" style={{ marginTop: 6 }}>Savings</h1></div>
        <div className="grid2 rise" style={{ marginBottom: 14 }}>
          <Stat k="All-time saved" v="€412" d="since March" dpos sm />
          <Stat k="CO₂ avoided" v="184 kg" d="≈ 9 trees" dpos sm />
        </div>
        <div className="card card-pad solid rise" style={{ animationDelay: '.12s', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div><div className="stat-k">Saved this period</div><div className="num" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{totals[range]}</div></div>
          </div>
          <Bars data={sets[range]} run={run} key={range} />
          <div className="seg" style={{ marginTop: 16 }}>
            {['7d','30d','90d'].map(r => <button key={r} className={range===r?'on':''} onClick={()=>setRange(r)}>{r==='7d'?'7 days':r==='30d'?'30 days':'90 days'}</button>)}
          </div>
        </div>
        <div className="card card-pad solid rise" style={{ animationDelay: '.18s' }}>
          <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>Where it came from</b>
          {[['Arbitrage (buy low, sell high)', '€226', 55], ['Avoided peak imports', '€121', 29], ['Solar self-use', '€65', 16]].map((r,i)=>(
            <div key={i} style={{ padding: '12px 0', borderTop: i? '.5px solid var(--line)':'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{r[0]}</span><span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{r[1]}</span></div>
              <div style={{ height: 7, borderRadius: 99, background: 'color-mix(in srgb,var(--ink) 7%, transparent)', overflow: 'hidden' }}><div style={{ height: '100%', width: run? r[2]+'%':r[2]+'%', background: 'var(--accent)', borderRadius: 99, transition: 'width 1s ease' }} /></div>
            </div>
          ))}
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
