// app.jsx — router, orb-dock, transitions, theme/tweaks wiring
const { useState: useA, useEffect: useEffA, useRef: useRefA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2F5D3A",
  "dark": false,
  "layout": "classic",
  "anim": true
}/*EDITMODE-END*/;

// accent presets: hex -> derived deep / rgb(for flow particles) / tint
const ACCENTS = {
  '#2F5D3A': { deep: '#24492D', rgb: '74,118,48',  tint: '#E7EEE0', darkAcc: '#93C081', darkRgb: '147,192,129' }, // forest
  '#3A6E63': { deep: '#2C5650', rgb: '58,124,112', tint: '#E2EEEA', darkAcc: '#7FC3B4', darkRgb: '127,195,180' }, // teal-sage
  '#5C6E33': { deep: '#475427', rgb: '110,134,55', tint: '#ECEEDC', darkAcc: '#B6C77E', darkRgb: '182,199,126' }, // olive
  '#9C5A2C': { deep: '#7E4621', rgb: '178,120,68', tint: '#F3E7DA', darkAcc: '#E0A36A', darkRgb: '224,163,106' }, // clay
};

const TABS = ['dashboard', 'battery', 'savings', 'connections', 'account'];
const DOCK = [
  { id: 'dashboard', icon: 'home' },
  { id: 'battery', icon: 'battery' },
  { id: 'savings', icon: 'savings' },
  { id: 'connections', icon: 'plug' },
  { id: 'account', icon: 'user', dot: true },
];

function Dock({ tab, onSelect }) {
  return (
    <div className="dock-wrap">
      <div className="dock">
        {DOCK.map(d => (
          <button key={d.id} className={'orb' + (tab === d.id ? ' active' : '')} onClick={() => onSelect(d.id)} aria-label={d.id}>
            <Icon name={d.icon} size={23} sw={tab === d.id ? 2 : 1.8} />
            {d.dot && tab !== d.id && <span className="dot" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dark = t.dark;
  const animOn = t.anim !== false;
  const accHex = t.accent || '#2F5D3A';
  const accDef = ACCENTS[accHex] || ACCENTS['#2F5D3A'];
  const acc = dark
    ? { main: accDef.darkAcc, deep: accDef.darkAcc, rgb: accDef.darkRgb, tint: 'color-mix(in srgb,' + accDef.darkAcc + ' 16%, transparent)' }
    : { main: accHex, deep: accDef.deep, rgb: accDef.rgb, tint: accDef.tint };

  const [phase, setPhase] = useA('auth');       // 'auth' | 'onboarding' | 'app'
  const [booting, setBooting] = useA(true);     // checkt bestaande sessie bij openen
  const [tab, setTab] = useA('dashboard');
  const [stack, setStack] = useA([]);          // pushed sub-screens
  const [dir, setDir] = useA('tab');           // push | pop | tab
  const [sheet, setSheet] = useA(false);
  const navSeq = useRefA(0);

  // mirror theme vars onto :root so flow.js (reads documentElement) recolors
  useEffA(() => {
    const r = document.documentElement.style;
    r.setProperty('--bg', dark ? '#14160F' : '#F3EEE3');
    r.setProperty('--accent-rgb', acc.rgb);
    document.documentElement.setAttribute('data-dir', (dark ? 'd' : 'l') + accHex);
  }, [dark, accHex, acc.rgb]);

  // Energie-flow (de "stroom" bovenin) — schermvullende canvas op de achtergrond.
  const flowCv = useRefA(null);
  useEffA(() => {
    if (!flowCv.current || !window.initEnergyFlow) return;
    const inst = window.initEnergyFlow(flowCv.current);
    if (!animOn && inst) inst.stop();
    return () => inst && inst.stop();
  }, [animOn, dark, accHex]);

  // Bestaande sessie herstellen bij openen: cookie blijft staan, dus als je
  // ingelogd was, sla het login-scherm over en ga direct naar de app.
  useEffA(() => {
    let alive = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (alive && d && d.authed) setPhase('app'); })
      .catch(() => {})
      .finally(() => { if (alive) setBooting(false); });
    return () => { alive = false; };
  }, []);

  const current = stack.length ? stack[stack.length - 1] : tab;

  const open = (name) => {
    if (TABS.includes(name)) { setDir('tab'); setStack([]); setTab(name); }
    else { setDir('push'); setStack((s) => [...s, name]); }
    navSeq.current++;
  };
  const back = () => { setDir('pop'); setStack((s) => s.slice(0, -1)); navSeq.current++; };
  const selectTab = (id) => { setDir('tab'); setStack([]); setTab(id); navSeq.current++; };

  const signOut = () => {
    try { fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
    setStack([]); setTab('dashboard'); setSheet(false); setDir('tab'); setPhase('auth'); navSeq.current++;
  };

  const dockTab = stack.length ? null : tab;

  const renderScreen = () => {
    switch (current) {
      case 'dashboard': return <Dashboard variant={t.layout || 'classic'} onOpen={open} run={animOn} />;
      case 'battery': return <BatteryScreen run={animOn} />;
      case 'savings': return <SavingsScreen run={animOn} />;
      case 'connections': return <ConnectionsScreen onAdd={() => setSheet(true)} />;
      case 'account': return <AccountScreen dark={dark} onToggleDark={(v) => setTweak('dark', v)} onOpen={open} onSignOut={signOut} />;
      case 'profile': return <ProfileScreen />;
      case 'vpp': return <VPPScreen run={animOn} />;
      case 'referral': return <ReferralScreen />;
      case 'activity': return <ActivityScreen />;
      default: return <Dashboard variant={t.layout || 'classic'} onOpen={open} run={animOn} />;
    }
  };

  const dirClass = dir === 'push' ? 'scr-push' : dir === 'pop' ? 'scr-pop' : 'scr-tab';

  // Schermvullend: alleen de app zelf (geen showcase-canvas, geen nep-
  // telefoonframe, geen tweaks-paneel). De echte iPhone levert de statusbalk.
  return (
    <div className={'theme ' + (dark ? 'dark' : 'light') + (animOn ? ' anim-on' : '')}
         style={{ '--accent': acc.main, '--accent-deep': acc.deep, '--accent-rgb': acc.rgb, '--accent-tint': acc.tint,
                  position: 'fixed', inset: 0, background: 'var(--bg)', color: 'var(--ink)', overflow: 'hidden',
                  fontFamily: "'Satoshi', -apple-system, system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <canvas ref={flowCv} className="flow-bg" />
      {!booting && phase === 'auth' && (
        <div key={'auth' + navSeq.current} className="scr-tab" style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
          <AuthScreen onAuthed={(isSignup) => { setDir('tab'); navSeq.current++; setPhase(isSignup ? 'onboarding' : 'app'); }} />
        </div>
      )}
      {phase === 'onboarding' && (
        <div key={'onb' + navSeq.current} className="scr-tab" style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
          <Onboarding onDone={() => { setDir('tab'); setTab('dashboard'); navSeq.current++; setPhase('app'); }} />
        </div>
      )}
      {phase === 'app' && (
        <div key={current + navSeq.current} className={dirClass + (stack.length ? ' pushed' : '')} style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
          {stack.length > 0 && <button className="backorb" onClick={back}><Icon name="chevL" size={20} /></button>}
          {renderScreen()}
        </div>
      )}
      {phase === 'app' && dockTab && <Dock tab={dockTab} onSelect={selectTab} />}
      {phase === 'app' && sheet && <AddSheet onClose={() => setSheet(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
