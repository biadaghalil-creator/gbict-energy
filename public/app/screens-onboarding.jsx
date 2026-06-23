// screens-onboarding.jsx — 4-step intro: Welcome → Situation → First connection → Done
const { useState: useStateOnb } = React;

function OnbProgress({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 4px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 99,
          background: i <= step ? 'var(--accent)' : 'color-mix(in srgb,var(--ink) 12%, transparent)',
          transition: 'background .3s',
        }} />
      ))}
    </div>
  );
}

function Onboarding({ onDone }) {
  const [step, setStep] = useStateOnb(0);
  const [picks, setPicks] = useStateOnb({ solar: true, battery: true, ev: false, contract: true });
  const [connected, setConnected] = useStateOnb(null);
  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="screen">
      <div className="screen-scroll" key={step} style={{ paddingTop: 70, display: 'flex', flexDirection: 'column' }}>
        <div className="scr-tab" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          {step > 0
            ? <button className="orb" style={{ width: 40, height: 40, background: 'color-mix(in srgb,var(--ink) 6%, transparent)' }} onClick={back}><Icon name="chevL" size={20} /></button>
            : <span style={{ width: 40, height: 40, flex: 'none' }} />}
          <div style={{ flex: 1 }}><OnbProgress step={step} total={3} /></div>
        </div>

        {step === 0 && <OnbSituation picks={picks} setPicks={setPicks} onNext={next} />}
        {step === 1 && <OnbConnect connected={connected} setConnected={setConnected} onNext={next} />}
        {step === 2 && <OnbDone picks={picks} onDone={onDone} />}
      </div>
    </div>
  );
}

/* — Step 0 — */
function OnbWelcome({ onNext, onLogin }) {
  return (
    <div className="scr-tab" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, paddingTop: 30 }}>
        <div className="rise" style={{ display: 'flex', alignItems: 'center', gap: 11, animationDelay: '.05s' }}>
          <Mark size={34} />
          <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>GBICT <span style={{ color: 'var(--accent)' }}>Energy</span></span>
        </div>
        <h1 className="rise" style={{ fontSize: 40, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-.03em', color: 'var(--ink)', margin: 0, animationDelay: '.12s' }}>
          Your home,<br />running on<br /><span style={{ color: 'var(--accent)' }}>its own sun.</span>
        </h1>
        <p className="rise" style={{ fontSize: 16.5, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0, maxWidth: 320, animationDelay: '.2s' }}>
          Connect your battery, solar and dynamic contract. We charge when power is cheap, sell when it's dear — automatically.
        </p>
        <div className="rise" style={{ display: 'flex', gap: 22, animationDelay: '.28s' }}>
          {[['€340', 'saved / yr*'], ['100%', 'hands-off'], ['2 min', 'to set up']].map((s, i) => (
            <div key={i}>
              <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>{s[0]}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{s[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rise" style={{ display: 'flex', flexDirection: 'column', gap: 12, animationDelay: '.34s' }}>
        <button className="btn btn-primary" onClick={onNext}>Get started <Icon name="chevR" size={19} /></button>
        <button className="btn btn-ghost" onClick={onLogin}>I already have an account</button>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', margin: '2px 0 0' }}>*Typical home with a 5 kWh battery on a dynamic contract.</p>
      </div>
    </div>
  );
}

/* — Step 1 — */
const SITUATION = [
  { key: 'solar', icon: 'sun', t: 'Solar panels', s: 'Generate your own power' },
  { key: 'battery', icon: 'battery', t: 'Home battery', s: 'Store cheap, use later' },
  { key: 'ev', icon: 'car', t: 'Electric car', s: 'Smart & V2G charging' },
  { key: 'contract', icon: 'contract', t: 'Dynamic contract', s: 'Hourly market prices' },
];
function OnbSituation({ picks, setPicks, onNext }) {
  const toggle = (k) => setPicks({ ...picks, [k]: !picks[k] });
  return (
    <div className="scr-tab" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="rise"><div className="scr-eyebrow">Step 1 of 3</div>
        <h1 className="scr-title" style={{ marginTop: 8, fontSize: 30 }}>What's in your home?</h1>
        <p className="scr-sub" style={{ marginTop: 10 }}>Pick everything you have. You can add or change devices any time.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
        {SITUATION.map((o, i) => {
          const on = picks[o.key];
          return (
            <button key={o.key} className="card rise" onClick={() => toggle(o.key)}
              style={{ animationDelay: (.06 * i + .1) + 's', display: 'flex', alignItems: 'center', gap: 15, padding: 16, textAlign: 'left', cursor: 'pointer', border: on ? '1.5px solid var(--accent)' : '.5px solid var(--line)', background: on ? 'var(--accent-tint)' : 'color-mix(in srgb,var(--card) 88%, transparent)' }}>
              <div className="row-ic" style={{ background: on ? 'var(--accent)' : 'color-mix(in srgb,var(--ink) 7%, transparent)', color: on ? '#fff' : 'var(--ink-2)' }}><Icon name={o.icon} size={22} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 650, color: 'var(--ink)' }}>{o.t}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 1 }}>{o.s}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--accent)' : 'transparent', border: on ? 'none' : '1.5px solid var(--line)', color: '#fff' }}>{on && <Icon name="check" size={15} sw={2.4} />}</div>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <button className="btn btn-primary rise" style={{ animationDelay: '.4s' }} onClick={onNext}>Continue <Icon name="chevR" size={19} /></button>
    </div>
  );
}

/* — Step 2 — */
const PROVIDERS = [
  { key: 'p1', icon: 'meter', t: 'HomeWizard P1', s: 'Smart meter • reads your usage' },
  { key: 'tibber', icon: 'contract', t: 'Tibber', s: 'Dynamic energy contract' },
  { key: 'sessy', icon: 'battery', t: 'Sessy battery', s: '5 kWh home battery' },
];
function OnbConnect({ connected, setConnected, onNext }) {
  const [busy, setBusy] = useStateOnb(null);
  const pick = (k) => {
    if (connected) return;
    setBusy(k);
    setTimeout(() => { setBusy(null); setConnected(k); }, 1400);
  };
  return (
    <div className="scr-tab" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="rise"><div className="scr-eyebrow">Step 2 of 3</div>
        <h1 className="scr-title" style={{ marginTop: 8, fontSize: 30 }}>Connect your first device</h1>
        <p className="scr-sub" style={{ marginTop: 10 }}>We link securely through the maker's app — your login never touches our servers.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
        {PROVIDERS.map((o, i) => {
          const done = connected === o.key, loading = busy === o.key;
          return (
            <button key={o.key} className="card solid rise" onClick={() => pick(o.key)}
              style={{ animationDelay: (.06 * i + .1) + 's', display: 'flex', alignItems: 'center', gap: 15, padding: 16, textAlign: 'left', cursor: connected ? 'default' : 'pointer', opacity: connected && !done ? .5 : 1, border: done ? '1.5px solid var(--accent)' : '.5px solid var(--line)' }}>
              <div className="row-ic"><Icon name={o.icon} size={22} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 650, color: 'var(--ink)' }}>{o.t}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 1 }}>{o.s}</div>
              </div>
              {loading ? <Spinner /> : done ? <div className="row-ic" style={{ width: 28, height: 28, background: 'var(--accent)', color: '#fff' }}><Icon name="check" size={17} sw={2.4} /></div> : <Icon name="plus" size={20} style={{ color: 'var(--ink-3)' }} />}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      {connected
        ? <button className="btn btn-primary rise" onClick={onNext}>Continue <Icon name="chevR" size={19} /></button>
        : <button className="btn btn-ghost" onClick={onNext}>Skip for now</button>}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--line)" strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* — Step 3 — */
function OnbDone({ picks, onDone }) {
  const est = (picks.battery ? 260 : 0) + (picks.solar ? 90 : 0) + (picks.ev ? 140 : 0);
  return (
    <div className="scr-tab" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
      <div className="rise" style={{ display: 'flex', justifyContent: 'center', animationDelay: '.05s' }}>
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 14px 36px color-mix(in srgb,var(--accent) 44%, transparent)' }}>
          <Icon name="check" size={48} sw={2.6} />
        </div>
      </div>
      <div className="rise" style={{ textAlign: 'center', animationDelay: '.14s' }}>
        <h1 className="scr-title" style={{ fontSize: 32 }}>You're all set</h1>
        <p className="scr-sub" style={{ marginTop: 12, maxWidth: 300, marginInline: 'auto' }}>Optimisation starts tonight. We'll charge your battery in the cheapest hours while you sleep.</p>
      </div>
      <div className="card-accent rise" style={{ padding: 22, textAlign: 'center', animationDelay: '.22s' }}>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: .85, letterSpacing: '.04em', textTransform: 'uppercase' }}>Estimated first-year saving</div>
        <div className="num" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', margin: '6px 0 2px' }}>€{est}</div>
        <div style={{ fontSize: 13, opacity: .85 }}>based on the devices you connected</div>
      </div>
      <button className="btn btn-primary rise" style={{ animationDelay: '.3s' }} onClick={onDone}>Open my dashboard <Icon name="arrowUR" size={18} /></button>
    </div>
  );
}

Object.assign(window, { Onboarding });

/* ════════════════ AUTH — in-app sign in / create account ════════════════ */
const { useState: useAuthS } = React;

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useAuthS('login');     // 'login' | 'signup'
  const [show, setShow] = useAuthS(false);
  const [vals, setVals] = useAuthS({ name: '', email: '', password: '', phone: '', address: '' });
  const isSignup = mode === 'signup';
  const set = (k) => (e) => setVals((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e) => {
    if (e) e.preventDefault();
    const prof = {
      name: (vals.name || '').trim() || 'Lieke de Vries',
      email: (vals.email || '').trim(),
      phone: (vals.phone || '').trim(),
      address: (vals.address || '').trim(),
    };
    if (isSignup || vals.name || vals.email) {
      try {
        const prev = JSON.parse(localStorage.getItem('gbict_profile') || '{}');
        localStorage.setItem('gbict_profile', JSON.stringify({ ...prev, ...prof }));
      } catch (err) {}
    }
    onAuthed(isSignup);          // signup → onboarding, login → dashboard
  };

  const copy = isSignup
    ? { heading: 'Start saving.', sub: 'Create your account — it takes a minute.', submit: 'Create account', sso: 'Sign up with iDIN' }
    : { heading: 'Welcome back.', sub: 'Sign in and pick up where your home left off.', submit: 'Sign in', sso: 'Continue with iDIN' };

  const inputWrap = { position: 'relative' };
  const inputStyle = { width: '100%', height: 50, borderRadius: 13, border: '1px solid var(--line)', background: 'var(--card-2)', padding: '0 14px 0 42px', fontSize: 15, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  const leadIc = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none', display: 'flex' };
  const lab = { fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6, display: 'block' };

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* forest hero */}
      <div style={{ position: 'relative', flex: 'none', height: 312, padding: '84px 30px 0', color: '#fff', overflow: 'hidden', background: 'linear-gradient(160deg,var(--accent) 0%,var(--accent-deep) 100%)' }}>
        <div style={{ position: 'absolute', right: -90, top: -120, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,.16),transparent 64%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, height: 60, display: 'flex', alignItems: 'center' }}>
          {(typeof window !== 'undefined' && window.LOGO_SRC)
            ? <img src={window.LOGO_SRC} alt="GBICT Energy" style={{ height: 60, width: 'auto', display: 'block', filter: 'drop-shadow(0 8px 18px rgba(0,0,0,.28))' }} />
            : <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,.3)' }}><Mark size={32} color="#fff" /></div>}
        </div>
        <h1 style={{ position: 'relative', zIndex: 2, fontSize: 30, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.12, margin: '22px 0 8px' }}>{copy.heading}</h1>
        <p style={{ position: 'relative', zIndex: 2, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,.82)', margin: 0, maxWidth: 280 }}>{copy.sub}</p>
      </div>

      {/* rising sheet */}
      <div style={{ position: 'relative', zIndex: 6, flex: 1, marginTop: -30, background: 'var(--card)', borderRadius: '30px 30px 0 0', padding: '22px 26px 30px', boxShadow: '0 -18px 50px rgba(33,29,22,.16)', overflowY: 'auto' }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: 'color-mix(in srgb,var(--ink) 14%,transparent)', margin: '0 auto 18px' }} />

        {/* tabs */}
        <div style={{ display: 'flex', gap: 4, padding: 5, borderRadius: 15, background: 'color-mix(in srgb,var(--ink) 6%,transparent)', marginBottom: 20 }}>
          {[['login', 'Sign in'], ['signup', 'Create account']].map(([m, t]) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, border: 'none', height: 42, borderRadius: 11, fontSize: 14, fontWeight: 650, cursor: 'pointer', fontFamily: 'inherit', transition: '.18s', background: mode === m ? 'var(--card)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--ink-2)', boxShadow: mode === m ? '0 1px 3px rgba(33,29,22,.12)' : 'none' }}>{t}</button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }} autoComplete="off">
          {isSignup && (
            <div>
              <label style={lab}>Full name</label>
              <div style={inputWrap}><span style={leadIc}><Icon name="user" size={18} /></span><input style={inputStyle} type="text" placeholder="Lieke de Vries" value={vals.name} onChange={set('name')} /></div>
            </div>
          )}
          <div>
            <label style={lab}>Email</label>
            <div style={inputWrap}><span style={leadIc}><Icon name="mail" size={18} /></span><input style={inputStyle} type="email" placeholder="you@home.nl" value={vals.email} onChange={set('email')} /></div>
          </div>
          <div>
            <label style={lab}>Password</label>
            <div style={inputWrap}>
              <span style={leadIc}><Icon name="lock" size={18} /></span>
              <input style={inputStyle} type={show ? 'text' : 'password'} placeholder="••••••••" value={vals.password} onChange={set('password')} />
              <span onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', cursor: 'pointer', display: 'flex' }}><Icon name={show ? 'eyeOff' : 'eye'} size={18} /></span>
            </div>
          </div>
          {isSignup && (
            <div>
              <label style={lab}>Phone number</label>
              <div style={inputWrap}><span style={leadIc}><Icon name="bell" size={18} /></span><input style={inputStyle} type="tel" placeholder="+31 6 1234 5678" value={vals.phone} onChange={set('phone')} /></div>
            </div>
          )}
          {isSignup && (
            <div>
              <label style={lab}>Home address</label>
              <div style={inputWrap}><span style={leadIc}><Icon name="home" size={18} /></span><input style={inputStyle} type="text" placeholder="Keizersgracht 1, Amsterdam" value={vals.address} onChange={set('address')} /></div>
            </div>
          )}
          {!isSignup && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} /> Stay signed in</label>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>Forgot?</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>{copy.submit}</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: 'var(--ink-3)', fontSize: 12, fontWeight: 600 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />OR<span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
        <button className="btn" style={{ background: 'var(--card)', color: 'var(--ink)', border: '1px solid var(--line)' }} onClick={() => submit()}><Icon name="shield" size={18} /> {copy.sso}</button>
        {isSignup && <p style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--ink-3)', textAlign: 'center', margin: '14px 0 0' }}>By creating an account you agree to our Terms & Privacy Policy.</p>}
      </div>
    </div>
  );
}

Object.assign(window, { AuthScreen });
