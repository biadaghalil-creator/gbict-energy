// screens-misc.jsx — Account/Settings, Activity, VPP, Referral, Add-device sheet
const { useState: useM } = React;

/* ════════════════ ACCOUNT / SETTINGS ════════════════ */
function AccountScreen({ dark, onToggleDark, onOpen }) {
  const [auto, setAuto] = useM(true);
  const [mode, setMode] = useM('savings');
  const [notif, setNotif] = useM(true);
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 18 }}><div className="scr-eyebrow">Account</div><h1 className="scr-title" style={{ marginTop: 6 }}>You</h1></div>

        <div className="card-accent rise" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Lieke de Vries</div>
            <div style={{ fontSize: 13, opacity: .85, marginTop: 2 }}>Pro plan · member since March</div>
          </div>
          <Icon name="chevR" size={20} />
        </div>

        <div className="card solid card-pad rise" style={{ animationDelay: '.08s', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div className="row-ic"><Icon name="power" size={20} /></div>
              <div><div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>Auto-optimise</div><div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Let GBICT run your battery</div></div>
            </div>
            <Toggle on={auto} onChange={setAuto} />
          </div>
          <hr className="divider" style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 10 }}>Optimisation mode</div>
          <div className="seg">
            {[['savings','Max savings'],['comfort','Comfort'],['eco','Eco']].map(m => <button key={m[0]} className={mode===m[0]?'on':''} onClick={()=>setMode(m[0])}>{m[1]}</button>)}
          </div>
        </div>

        <div className="card solid card-pad rise" style={{ animationDelay: '.14s', marginBottom: 14 }}>
          <Row icon="network" iconClass="" title="Virtual Power Plant" sub="Earn from grid balancing" right={<Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />} onClick={() => onOpen('vpp')} />
          <hr className="divider" />
          <Row icon="gift" title="Refer a friend" sub="Give €5, get €5" right={<Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />} onClick={() => onOpen('referral')} />
          <hr className="divider" />
          <Row icon="bell" title="Activity & alerts" sub="What your home did" right={<Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />} onClick={() => onOpen('activity')} />
        </div>

        <div className="card solid card-pad rise" style={{ animationDelay: '.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div className="row-ic muted"><Icon name={dark ? 'moon' : 'sun'} size={20} /></div>
              <div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>Dark appearance</div>
            </div>
            <Toggle on={dark} onChange={onToggleDark} />
          </div>
          <hr className="divider" style={{ margin: '14px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div className="row-ic muted"><Icon name="bell" size={20} /></div>
              <div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>Email notifications</div>
            </div>
            <Toggle on={notif} onChange={setNotif} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ ACTIVITY ════════════════ */
const FEED = [
  { day: 'Today', items: [
    { t: '13:40', icon: 'arrowUR', label: 'Sold 1.3 kWh to grid', sub: 'Peak price €0.80', v: '+€1.04', pos: true, kind: 'sell' },
    { t: '09:10', icon: 'sun', label: 'Running on solar', sub: 'Home fully self-powered', v: '', kind: 'solar' },
    { t: '04:55', icon: 'arrowDn', label: 'Battery charged to 92%', sub: 'Avg €0.18/kWh', v: '−€0.74', kind: 'charge' },
  ]},
  { day: 'Yesterday', items: [
    { t: '18:20', icon: 'arrowUR', label: 'Sold 2.1 kWh to grid', sub: 'Peak price €0.76', v: '+€1.60', pos: true, kind: 'sell' },
    { t: '03:00', icon: 'arrowDn', label: 'Battery charged to 100%', sub: 'Cheapest night window', v: '−€0.81', kind: 'charge' },
  ]},
];
function ActivityScreen() {
  const [f, setF] = useM('all');
  const tint = { charge: 'var(--accent-tint)', solar: 'var(--sun-tint)', sell: 'color-mix(in srgb,var(--sell) 14%, transparent)' };
  const col = { charge: 'var(--accent-deep)', solar: 'var(--sun)', sell: 'var(--sell)' };
  const match = (k) => f === 'all' || (f === 'charge' && k === 'charge') || (f === 'sell' && k === 'sell');
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Activity</div><h1 className="scr-title" style={{ marginTop: 6 }}>What your home did</h1></div>
        <div className="seg rise" style={{ marginBottom: 16, animationDelay: '.06s' }}>
          {[['all','All'],['charge','Charging'],['sell','Selling']].map(o => <button key={o[0]} className={f===o[0]?'on':''} onClick={()=>setF(o[0])}>{o[1]}</button>)}
        </div>
        {FEED.map((g, gi) => {
          const items = g.items.filter(it => match(it.kind));
          if (!items.length) return null;
          return (
            <div key={gi} className="rise" style={{ animationDelay: (.1 + gi*.06) + 's', marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: '.04em', textTransform: 'uppercase', margin: '0 4px 8px' }}>{g.day}</div>
              <div className="card solid card-pad">
                {items.map((it, i) => (
                  <div key={i} className="row" style={{ padding: '13px 0', borderTop: i ? '.5px solid var(--line)' : 'none' }}>
                    <div className="row-ic" style={{ background: tint[it.kind], color: col[it.kind], borderRadius: 12 }}><Icon name={it.icon} size={19} /></div>
                    <div className="row-tx"><b>{it.label}</b><span>{it.sub}</span></div>
                    <div style={{ textAlign: 'right' }}>{it.v && <div className="num" style={{ fontSize: 14, fontWeight: 700, color: it.pos ? 'var(--accent)' : 'var(--ink-2)' }}>{it.v}</div>}<div className="num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{it.t}</div></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════ VPP ════════════════ */
function VPPScreen({ run }) {
  const [joined, setJoined] = useM(false);
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Earn more</div><h1 className="scr-title" style={{ marginTop: 6 }}>Virtual Power Plant</h1></div>
        <div className="card-accent rise" style={{ padding: 24, marginBottom: 16 }}>
          <Icon name="network" size={30} />
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: '14px 0 8px' }}>Your battery, part of something bigger.</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, opacity: .9, margin: 0 }}>Join thousands of homes acting as one giant battery. We trade your spare capacity on the imbalance market — you earn, the grid stays stable.</p>
        </div>
        <div className="grid2 rise" style={{ animationDelay: '.1s', marginBottom: 14 }}>
          <Stat k="Extra / year" v="~€90" d="on top of savings" dpos sm />
          <Stat k="Homes pooled" v="4,210" d="and growing" dpos sm />
        </div>
        <div className="card solid card-pad rise" style={{ animationDelay: '.16s', marginBottom: 16 }}>
          <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: 4 }}>How you earn</b>
          {[['Standby reward', 'Paid just for being available', 'euro'],['Activation', 'Paid when we use your capacity', 'bolt2'],['Always protected', 'Your home needs always come first', 'shield']].map((r,i)=>(
            <Row key={i} icon={r[2]} title={r[0]} sub={r[1]} />
          ))}
        </div>
        <button className="btn btn-primary rise" style={{ animationDelay: '.22s' }} onClick={() => setJoined(!joined)}>
          {joined ? <><Icon name="check" size={19} /> You're enrolled</> : 'Join the VPP'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════ REFERRAL ════════════════ */
function ReferralScreen() {
  const [copied, setCopied] = useM(false);
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 16 }}><div className="scr-eyebrow">Share</div><h1 className="scr-title" style={{ marginTop: 6 }}>Give €5, get €5</h1></div>
        <div className="rise" style={{ textAlign: 'center', padding: '10px 0 20px' }}>
          <div style={{ width: 84, height: 84, borderRadius: 26, background: 'var(--accent-tint)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="gift" size={40} /></div>
          <p className="scr-sub" style={{ marginTop: 16, maxWidth: 290, marginInline: 'auto' }}>Friends get €5 credit when they connect a device. You get €5 once they do.</p>
        </div>
        <div className="card solid card-pad rise" style={{ animationDelay: '.1s', marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8 }}>Your code</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, height: 52, borderRadius: 14, border: '1.5px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, letterSpacing: '.12em', color: 'var(--ink)', background: 'var(--card-2)' }}>LIEKE-5</div>
            <button className="btn btn-primary" style={{ width: 96, height: 52 }} onClick={() => { setCopied(true); setTimeout(()=>setCopied(false),1600); }}>{copied ? <Icon name="check" size={20} /> : 'Copy'}</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }} className="rise">
          <button className="btn btn-ghost" style={{ flex: 1 }}><Icon name="share" size={18} /> WhatsApp</button>
          <button className="btn btn-ghost" style={{ flex: 1 }}><Icon name="share" size={18} /> Email</button>
        </div>
        <div className="card solid card-pad rise" style={{ animationDelay: '.18s', marginTop: 14, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div><div className="num" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>3</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>Friends joined</div></div>
          <div style={{ width: '.5px', background: 'var(--line)' }} />
          <div><div className="num" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent)' }}>€15</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>Credit earned</div></div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ ADD-DEVICE SHEET ════════════════ */
const DEVICE_TYPES = [
  { icon: 'battery', t: 'Home battery', s: 'Sessy, Victron, Tesla, Enphase…' },
  { icon: 'sun', t: 'Solar inverter', s: 'SolarEdge, Fronius, SMA…' },
  { icon: 'car', t: 'EV / charger', s: 'Smart & V2G charging' },
  { icon: 'heat', t: 'Heat pump', s: 'Tado & more' },
  { icon: 'meter', t: 'Smart meter', s: 'HomeWizard P1' },
  { icon: 'contract', t: 'Energy contract', s: 'Tibber & dynamic suppliers' },
];
function AddSheet({ onClose }) {
  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>Add a device</h2>
          <button className="orb" style={{ width: 38, height: 38, background: 'color-mix(in srgb,var(--ink) 6%, transparent)' }} onClick={onClose}><Icon name="x" size={19} /></button>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 16px' }}>Hardware-agnostic — pick a type to connect.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DEVICE_TYPES.map((d, i) => (
            <button key={i} className="card solid" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, textAlign: 'left', cursor: 'pointer', border: '.5px solid var(--line)' }}>
              <div className="row-ic"><Icon name={d.icon} size={21} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>{d.t}</div><div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 1 }}>{d.s}</div></div>
              <Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { AccountScreen, ActivityScreen, VPPScreen, ReferralScreen, AddSheet });
