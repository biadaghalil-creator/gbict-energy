// screens-misc.jsx — Account/Settings, Activity, VPP, Referral, Add-device sheet
const { useState: useM } = React;

/* ════════════════ ACCOUNT / SETTINGS ════════════════ */
function AccountScreen({ dark, onToggleDark, onOpen, onSignOut }) {
  const [auto, setAuto] = useM(true);
  const [mode, setMode] = useM('savings');
  const [notif, setNotif] = useM(true);
  let prof = {};
  try { prof = JSON.parse(localStorage.getItem('gbict_profile')) || {}; } catch (e) {}
  const pname = (prof.name || 'Lieke de Vries').trim();
  const pinit = (pname.split(/\s+/).map(w => w[0]).slice(0, 2).join('') || 'L').toUpperCase();
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 18 }}><div className="scr-eyebrow">Account</div><h1 className="scr-title" style={{ marginTop: 6 }}>You</h1></div>

        <div className="card-accent rise" onClick={() => onOpen('profile')} style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>{pinit}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{pname}</div>
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

        <button className="btn btn-ghost rise" style={{ animationDelay: '.26s', marginTop: 16, color: 'var(--sell)' }} onClick={() => { if (onSignOut) onSignOut(); }}>
          <Icon name="power" size={18} /> Sign out
        </button>
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
// Echte koppelbare merken. method: 'form' = credentials → /api/devices/connect,
// 'oauth' = redirect naar de koppelpagina, 'soon' = nog niet beschikbaar.
const CONNECT_BRANDS = [
  { key: 'battery_sessy', t: 'Sessy', s: 'Home battery', icon: 'battery', method: 'form',
    fields: [{ k: 'username', label: 'Sessy e-mail', type: 'email', ph: 'you@home.nl' }, { k: 'password', label: 'Sessy password', type: 'password', ph: '••••••••' }] },
  { key: 'ev', t: 'Electric car / charger', s: 'Tesla, Kia, VW, Renault… (V2G)', icon: 'car', method: 'oauth', url: '/api/ev/connect' },
  { key: 'meter_tibber', t: 'Tibber', s: 'Dynamic energy contract', icon: 'contract', method: 'form',
    fields: [{ k: 'token', label: 'Tibber access token', type: 'text', ph: 'Token from developer.tibber.com' }] },
  { key: 'solar_solaredge', t: 'SolarEdge', s: 'Solar inverter', icon: 'sun', method: 'form',
    fields: [{ k: 'apiKey', label: 'API key', type: 'text', ph: 'SolarEdge API key' }, { k: 'siteId', label: 'Site ID', type: 'text', ph: '1234567' }] },
  { key: 'solar_enphase', t: 'Enphase', s: 'Solar / battery', icon: 'sun', method: 'oauth', url: '/api/enphase/connect' },
  { key: 'solar_fronius', t: 'Fronius', s: 'Solar inverter (local)', icon: 'sun', method: 'form',
    fields: [{ k: 'ip', label: 'Inverter IP address', type: 'text', ph: '192.168.1.50' }] },
  { key: 'meter_homewizard', t: 'HomeWizard P1', s: 'Smart meter (local)', icon: 'meter', method: 'form',
    fields: [{ k: 'host', label: 'P1 IP address', type: 'text', ph: '192.168.1.x' }] },
  { key: 'battery_victron', t: 'Victron', s: 'Home battery', icon: 'battery', method: 'form',
    fields: [{ k: 'username', label: 'VRM e-mail', type: 'email', ph: 'you@home.nl' }, { k: 'password', label: 'VRM password', type: 'password', ph: '••••••••' }] },
  { key: 'solar_sma', t: 'SMA', s: 'Solar inverter', icon: 'sun', method: 'soon' },
];
function AddSheet({ onClose, onConnected }) {
  const [brand, setBrand] = useM(null);   // gekozen merk (form-flow)
  const [vals, setVals] = useM({});
  const [busy, setBusy] = useM(false);
  const [err, setErr] = useM('');
  const [intg, setIntg] = useM(null);     // welke OAuth-koppelingen zijn ingesteld
  React.useEffect(() => {
    let alive = true;
    fetch('/api/integrations/status', { cache: 'no-store' }).then((r) => r.ok ? r.json() : null)
      .then((d) => { if (alive) setIntg(d || {}); }).catch(() => { if (alive) setIntg({}); });
    return () => { alive = false; };
  }, []);
  const set = (k) => (e) => setVals((s) => ({ ...s, [k]: e.target.value }));

  // OAuth pas tonen als de provider echt geconfigureerd is, anders "coming soon".
  const oauthReady = (b) => b.key === 'ev' ? !!intg?.ev : b.key === 'solar_enphase' ? !!intg?.enphase : true;
  const isSoon = (b) => b.method === 'soon' || (b.method === 'oauth' && intg && !oauthReady(b));

  const pick = (b) => {
    setErr('');
    if (isSoon(b)) { setErr(b.t + ' komt binnenkort beschikbaar.'); return; }
    if (b.method === 'oauth') {
      if (!intg) { setErr('Even laden…'); return; }
      window.location.href = b.url;   // echte koppelpagina van de provider
      return;
    }
    setVals({}); setBrand(b);
  };

  const submit = async () => {
    if (!brand) return;
    for (const f of brand.fields) { if (!(vals[f.k] || '').trim()) { setErr('Vul "' + f.label + '" in'); return; } }
    setErr(''); setBusy(true);
    try {
      const res = await fetch('/api/devices/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: brand.key, config: vals }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data.error || 'Koppelen mislukt'); setBusy(false); return; }
      onConnected && onConnected();
    } catch { setErr('Geen verbinding. Probeer opnieuw.'); setBusy(false); }
  };

  const inp = { width: '100%', height: 50, borderRadius: 13, border: '1px solid var(--line)', background: 'var(--card)', padding: '0 14px', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
  const lab = { fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 };

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>{brand ? 'Connect ' + brand.t : 'Add a device'}</h2>
          <button className="orb" style={{ width: 38, height: 38, background: 'color-mix(in srgb,var(--ink) 6%, transparent)' }} onClick={brand ? () => { setBrand(null); setErr(''); } : onClose}><Icon name={brand ? 'chevL' : 'x'} size={19} /></button>
        </div>

        {!brand && (
          <>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 16px' }}>Pick a device — it links securely to your account.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CONNECT_BRANDS.map((b, i) => (
                <button key={i} className="card solid" onClick={() => pick(b)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, textAlign: 'left', cursor: 'pointer', border: '.5px solid var(--line)' }}>
                  <div className="row-ic"><Icon name={b.icon} size={21} /></div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>{b.t}</div><div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 1 }}>{b.s}{isSoon(b) ? ' · coming soon' : ''}</div></div>
                  <Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />
                </button>
              ))}
            </div>
            {err && <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', textAlign: 'center', margin: '14px 0 0' }}>{err}</p>}
          </>
        )}

        {brand && (
          <>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 16px' }}>Enter your {brand.t} details. We store them securely and only use them to read your data.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {brand.fields.map((f) => (
                <div key={f.k}>
                  <label style={lab}>{f.label}</label>
                  <input style={inp} type={f.type || 'text'} placeholder={f.ph || ''} value={vals[f.k] || ''} onChange={set(f.k)} autoCapitalize="none" autoCorrect="off" />
                </div>
              ))}
              {err && <p style={{ fontSize: 12.5, fontWeight: 600, color: '#C2702C', margin: '2px 0 0' }}>{err}</p>}
              <button className="btn btn-primary" disabled={busy} onClick={submit} style={{ marginTop: 4, opacity: busy ? 0.6 : 1 }}>{busy ? 'Connecting…' : 'Connect'}</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ════════════════ EDIT PROFILE ════════════════ */
function ProfileScreen() {
  const load = () => { try { return JSON.parse(localStorage.getItem('gbict_profile')) || {}; } catch (e) { return {}; } };
  const [p, setP] = useM(load);
  const [saved, setSaved] = useM(false);
  const v = (k, d) => (p[k] !== undefined ? p[k] : (d || ''));
  const set = (k) => (e) => { setP((s) => ({ ...s, [k]: e.target.value })); setSaved(false); };
  const save = () => { localStorage.setItem('gbict_profile', JSON.stringify(p)); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const name = v('name', '').trim();
  const init = (name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('') || '?').toUpperCase();
  const inp = { width: '100%', height: 50, borderRadius: 13, border: '1px solid var(--line)', background: 'var(--card)', padding: '0 14px', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
  const lab = { fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 };
  // render-helper (GEEN nieuwe component per render → input behoudt focus, toetsenbord springt niet)
  const field = (label, k, type, ph) => (
    <div style={{ marginBottom: 14 }}>
      <label style={lab}>{label}</label>
      <input style={inp} type={type || 'text'} value={v(k, '')} placeholder={ph || ''} onChange={set(k)} />
    </div>
  );
  return (
    <div className="screen">
      <div className="screen-scroll">
        <div className="rise" style={{ marginBottom: 18 }}><div className="scr-eyebrow">Account</div><h1 className="scr-title" style={{ marginTop: 6 }}>Edit profile</h1></div>

        <div className="rise" style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <div style={{ position: 'relative', width: 92, height: 92 }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, fontWeight: 700 }}>{init}</div>
            <button style={{ position: 'absolute', right: -2, bottom: -2, width: 32, height: 32, borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', cursor: 'pointer' }}><Icon name="plus" size={17} /></button>
          </div>
        </div>

        <div className="card solid card-pad rise" style={{ animationDelay: '.08s' }}>
          {field('Full name', 'name', 'text', 'Your name')}
          {field('Email', 'email', 'email', 'you@home.nl')}
          {field('Phone number', 'phone', 'tel', '+31 6 1234 5678')}
          {field('Home name', 'home', 'text', "e.g. Home")}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 10 }}>
            <div><label style={lab}>Postcode</label><input style={inp} value={v('post')} placeholder="1011 AB" onChange={set('post')} /></div>
            <div><label style={lab}>City</label><input style={inp} value={v('city')} placeholder="Amsterdam" onChange={set('city')} /></div>
          </div>
        </div>

        <button className="btn btn-primary rise" style={{ marginTop: 16, animationDelay: '.14s' }} onClick={save}>
          {saved ? <><Icon name="check" size={19} /> Saved</> : 'Save changes'}
        </button>
        <p style={{ fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center', margin: '12px 0 0' }}>Your details are stored on this device for the demo.</p>
      </div>
    </div>
  );
}

Object.assign(window, { AccountScreen, ActivityScreen, VPPScreen, ReferralScreen, AddSheet, ProfileScreen });
