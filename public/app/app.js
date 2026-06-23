const { useState: useA, useEffect: useEffA, useRef: useRefA } = React;
const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "accent": "#2F5D3A",
    "dark": false,
    "layout": "classic",
    "anim": true
  }
);
const ACCENTS = {
  "#2F5D3A": { deep: "#24492D", rgb: "74,118,48", tint: "#E7EEE0", darkAcc: "#93C081", darkRgb: "147,192,129" },
  // forest
  "#3A6E63": { deep: "#2C5650", rgb: "58,124,112", tint: "#E2EEEA", darkAcc: "#7FC3B4", darkRgb: "127,195,180" },
  // teal-sage
  "#5C6E33": { deep: "#475427", rgb: "110,134,55", tint: "#ECEEDC", darkAcc: "#B6C77E", darkRgb: "182,199,126" },
  // olive
  "#9C5A2C": { deep: "#7E4621", rgb: "178,120,68", tint: "#F3E7DA", darkAcc: "#E0A36A", darkRgb: "224,163,106" }
  // clay
};
const TABS = ["dashboard", "battery", "savings", "connections", "account"];
const DOCK = [
  { id: "dashboard", icon: "home" },
  { id: "battery", icon: "battery" },
  { id: "savings", icon: "savings" },
  { id: "connections", icon: "plug" },
  { id: "account", icon: "user", dot: true }
];
function Dock({ tab, onSelect }) {
  return /* @__PURE__ */ React.createElement("div", { className: "dock-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "dock" }, DOCK.map((d) => /* @__PURE__ */ React.createElement("button", { key: d.id, className: "orb" + (tab === d.id ? " active" : ""), onClick: () => onSelect(d.id), "aria-label": d.id }, /* @__PURE__ */ React.createElement(Icon, { name: d.icon, size: 23, sw: tab === d.id ? 2 : 1.8 }), d.dot && tab !== d.id && /* @__PURE__ */ React.createElement("span", { className: "dot" })))));
}
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dark = t.dark;
  const animOn = t.anim !== false;
  const accHex = t.accent || "#2F5D3A";
  const accDef = ACCENTS[accHex] || ACCENTS["#2F5D3A"];
  const acc = dark ? { main: accDef.darkAcc, deep: accDef.darkAcc, rgb: accDef.darkRgb, tint: "color-mix(in srgb," + accDef.darkAcc + " 16%, transparent)" } : { main: accHex, deep: accDef.deep, rgb: accDef.rgb, tint: accDef.tint };
  const [phase, setPhase] = useA("auth");
  const [tab, setTab] = useA("dashboard");
  const [stack, setStack] = useA([]);
  const [dir, setDir] = useA("tab");
  const [sheet, setSheet] = useA(false);
  const navSeq = useRefA(0);
  useEffA(() => {
    const r = document.documentElement.style;
    r.setProperty("--bg", dark ? "#14160F" : "#F3EEE3");
    r.setProperty("--accent-rgb", acc.rgb);
    document.documentElement.setAttribute("data-dir", (dark ? "d" : "l") + accHex);
  }, [dark, accHex, acc.rgb]);
  const flowCv = useRefA(null);
  useEffA(() => {
    if (!flowCv.current || !window.initEnergyFlow) return;
    const inst = window.initEnergyFlow(flowCv.current);
    if (!animOn && inst) inst.stop();
    return () => inst && inst.stop();
  }, [animOn, dark, accHex]);
  const current = stack.length ? stack[stack.length - 1] : tab;
  const open = (name) => {
    if (TABS.includes(name)) {
      setDir("tab");
      setStack([]);
      setTab(name);
    } else {
      setDir("push");
      setStack((s) => [...s, name]);
    }
    navSeq.current++;
  };
  const back = () => {
    setDir("pop");
    setStack((s) => s.slice(0, -1));
    navSeq.current++;
  };
  const selectTab = (id) => {
    setDir("tab");
    setStack([]);
    setTab(id);
    navSeq.current++;
  };
  const signOut = () => {
    setStack([]);
    setTab("dashboard");
    setSheet(false);
    setDir("tab");
    setPhase("auth");
    navSeq.current++;
  };
  const dockTab = stack.length ? null : tab;
  const renderScreen = () => {
    switch (current) {
      case "dashboard":
        return /* @__PURE__ */ React.createElement(Dashboard, { variant: t.layout || "classic", onOpen: open, run: animOn });
      case "battery":
        return /* @__PURE__ */ React.createElement(BatteryScreen, { run: animOn });
      case "savings":
        return /* @__PURE__ */ React.createElement(SavingsScreen, { run: animOn });
      case "connections":
        return /* @__PURE__ */ React.createElement(ConnectionsScreen, { onAdd: () => setSheet(true) });
      case "account":
        return /* @__PURE__ */ React.createElement(AccountScreen, { dark, onToggleDark: (v) => setTweak("dark", v), onOpen: open, onSignOut: signOut });
      case "profile":
        return /* @__PURE__ */ React.createElement(ProfileScreen, null);
      case "vpp":
        return /* @__PURE__ */ React.createElement(VPPScreen, { run: animOn });
      case "referral":
        return /* @__PURE__ */ React.createElement(ReferralScreen, null);
      case "activity":
        return /* @__PURE__ */ React.createElement(ActivityScreen, null);
      default:
        return /* @__PURE__ */ React.createElement(Dashboard, { variant: t.layout || "classic", onOpen: open, run: animOn });
    }
  };
  const dirClass = dir === "push" ? "scr-push" : dir === "pop" ? "scr-pop" : "scr-tab";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "theme " + (dark ? "dark" : "light") + (animOn ? " anim-on" : ""),
      style: {
        "--accent": acc.main,
        "--accent-deep": acc.deep,
        "--accent-rgb": acc.rgb,
        "--accent-tint": acc.tint,
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        color: "var(--ink)",
        overflow: "hidden",
        fontFamily: "'Satoshi', -apple-system, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased"
      }
    },
    /* @__PURE__ */ React.createElement("canvas", { ref: flowCv, className: "flow-bg" }),
    phase === "auth" && /* @__PURE__ */ React.createElement("div", { key: "auth" + navSeq.current, className: "scr-tab", style: { position: "absolute", inset: 0, zIndex: 5 } }, /* @__PURE__ */ React.createElement(AuthScreen, { onAuthed: (isSignup) => {
      setDir("tab");
      navSeq.current++;
      setPhase(isSignup ? "onboarding" : "app");
    } })),
    phase === "onboarding" && /* @__PURE__ */ React.createElement("div", { key: "onb" + navSeq.current, className: "scr-tab", style: { position: "absolute", inset: 0, zIndex: 5 } }, /* @__PURE__ */ React.createElement(Onboarding, { onDone: () => {
      setDir("tab");
      setTab("dashboard");
      navSeq.current++;
      setPhase("app");
    } })),
    phase === "app" && /* @__PURE__ */ React.createElement("div", { key: current + navSeq.current, className: dirClass + (stack.length ? " pushed" : ""), style: { position: "absolute", inset: 0, zIndex: 5 } }, stack.length > 0 && /* @__PURE__ */ React.createElement("button", { className: "backorb", onClick: back }, /* @__PURE__ */ React.createElement(Icon, { name: "chevL", size: 20 })), renderScreen()),
    phase === "app" && dockTab && /* @__PURE__ */ React.createElement(Dock, { tab: dockTab, onSelect: selectTab }),
    phase === "app" && sheet && /* @__PURE__ */ React.createElement(AddSheet, { onClose: () => setSheet(false) })
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
