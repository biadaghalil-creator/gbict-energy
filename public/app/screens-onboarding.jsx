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

function Onboarding({ onDone, onLogin }) {
  const [step, setStep] = useStateOnb(0);
  const [picks, setPicks] = useStateOnb({ solar: true, battery: true, ev: false, contract: true });
  const [connected, setConnected] = useStateOnb(null);
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="screen">
      <div className="screen-scroll" key={step} style={{ paddingTop: 70, display: 'flex', flexDirection: 'column' }}>
        {step > 0 && (
          <div className="scr-tab" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <button className="orb" style={{ width: 40, height: 40, background: 'color-mix(in srgb,var(--ink) 6%, transparent)' }} onClick={back}><Icon name="chevL" size={20} /></button>
            <div style={{ flex: 1 }}><OnbProgress step={step} total={4} /></div>
          </div>
        )}

        {step === 0 && <OnbWelcome onNext={next} onLogin={onLogin} />}
        {step === 1 && <OnbSituation picks={picks} setPicks={setPicks} onNext={next} />}
        {step === 2 && <OnbConnect connected={connected} setConnected={setConnected} onNext={next} />}
        {step === 3 && <OnbDone picks={picks} onDone={onDone} />}
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
          {[['€420', 'saved / yr*'], ['100%', 'hands-off'], ['2 min', 'to set up']].map((s, i) => (
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
