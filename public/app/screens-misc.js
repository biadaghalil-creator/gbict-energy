const { useState: useM } = React;
function AccountScreen({ dark, onToggleDark, onOpen, onSignOut }) {
  const [auto, setAuto] = useM(true);
  const [mode, setMode] = useM("savings");
  const [notif, setNotif] = useM(true);
  let prof = {};
  try {
    prof = JSON.parse(localStorage.getItem("gbict_profile")) || {};
  } catch (e) {
  }
  const pname = (prof.name || "Lieke de Vries").trim();
  const pinit = (pname.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "L").toUpperCase();
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Account"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "You")), /* @__PURE__ */ React.createElement("div", { className: "card-accent rise", onClick: () => onOpen("profile"), style: { padding: 20, display: "flex", alignItems: "center", gap: 16, marginBottom: 16, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 } }, pinit), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, pname), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.85, marginTop: 2 } }, "Pro plan \xB7 member since March")), /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".08s", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 13 } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic" }, /* @__PURE__ */ React.createElement(Icon, { name: "power", size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 650, color: "var(--ink)" } }, "Auto-optimise"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)" } }, "Let GBICT run your battery"))), /* @__PURE__ */ React.createElement(Toggle, { on: auto, onChange: setAuto })), /* @__PURE__ */ React.createElement("hr", { className: "divider", style: { margin: "16px 0" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 10 } }, "Optimisation mode"), /* @__PURE__ */ React.createElement("div", { className: "seg" }, [["savings", "Max savings"], ["comfort", "Comfort"], ["eco", "Eco"]].map((m) => /* @__PURE__ */ React.createElement("button", { key: m[0], className: mode === m[0] ? "on" : "", onClick: () => setMode(m[0]) }, m[1])))), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".14s", marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Row, { icon: "network", iconClass: "", title: "Virtual Power Plant", sub: "Earn from grid balancing", right: /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 18, style: { color: "var(--ink-3)" } }), onClick: () => onOpen("vpp") }), /* @__PURE__ */ React.createElement("hr", { className: "divider" }), /* @__PURE__ */ React.createElement(Row, { icon: "gift", title: "Refer a friend", sub: "Give \u20AC5, get \u20AC5", right: /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 18, style: { color: "var(--ink-3)" } }), onClick: () => onOpen("referral") }), /* @__PURE__ */ React.createElement("hr", { className: "divider" }), /* @__PURE__ */ React.createElement(Row, { icon: "bell", title: "Activity & alerts", sub: "What your home did", right: /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 18, style: { color: "var(--ink-3)" } }), onClick: () => onOpen("activity") })), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".2s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 13 } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic muted" }, /* @__PURE__ */ React.createElement(Icon, { name: dark ? "moon" : "sun", size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 650, color: "var(--ink)" } }, "Dark appearance")), /* @__PURE__ */ React.createElement(Toggle, { on: dark, onChange: onToggleDark })), /* @__PURE__ */ React.createElement("hr", { className: "divider", style: { margin: "14px 0" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 13 } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic muted" }, /* @__PURE__ */ React.createElement(Icon, { name: "bell", size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 650, color: "var(--ink)" } }, "Email notifications")), /* @__PURE__ */ React.createElement(Toggle, { on: notif, onChange: setNotif }))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost rise", style: { animationDelay: ".26s", marginTop: 16, color: "var(--sell)" }, onClick: () => {
    if (onSignOut) onSignOut();
  } }, /* @__PURE__ */ React.createElement(Icon, { name: "power", size: 18 }), " Sign out")));
}
const FEED = [
  { day: "Today", items: [
    { t: "13:40", icon: "arrowUR", label: "Sold 1.3 kWh to grid", sub: "Peak price \u20AC0.80", v: "+\u20AC1.04", pos: true, kind: "sell" },
    { t: "09:10", icon: "sun", label: "Running on solar", sub: "Home fully self-powered", v: "", kind: "solar" },
    { t: "04:55", icon: "arrowDn", label: "Battery charged to 92%", sub: "Avg \u20AC0.18/kWh", v: "\u2212\u20AC0.74", kind: "charge" }
  ] },
  { day: "Yesterday", items: [
    { t: "18:20", icon: "arrowUR", label: "Sold 2.1 kWh to grid", sub: "Peak price \u20AC0.76", v: "+\u20AC1.60", pos: true, kind: "sell" },
    { t: "03:00", icon: "arrowDn", label: "Battery charged to 100%", sub: "Cheapest night window", v: "\u2212\u20AC0.81", kind: "charge" }
  ] }
];
function ActivityScreen() {
  const [f, setF] = useM("all");
  const tint = { charge: "var(--accent-tint)", solar: "var(--sun-tint)", sell: "color-mix(in srgb,var(--sell) 14%, transparent)" };
  const col = { charge: "var(--accent-deep)", solar: "var(--sun)", sell: "var(--sell)" };
  const match = (k) => f === "all" || f === "charge" && k === "charge" || f === "sell" && k === "sell";
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Activity"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "What your home did")), /* @__PURE__ */ React.createElement("div", { className: "seg rise", style: { marginBottom: 16, animationDelay: ".06s" } }, [["all", "All"], ["charge", "Charging"], ["sell", "Selling"]].map((o) => /* @__PURE__ */ React.createElement("button", { key: o[0], className: f === o[0] ? "on" : "", onClick: () => setF(o[0]) }, o[1]))), FEED.map((g, gi) => {
    const items = g.items.filter((it) => match(it.kind));
    if (!items.length) return null;
    return /* @__PURE__ */ React.createElement("div", { key: gi, className: "rise", style: { animationDelay: 0.1 + gi * 0.06 + "s", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 700, color: "var(--ink-3)", letterSpacing: ".04em", textTransform: "uppercase", margin: "0 4px 8px" } }, g.day), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad" }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "row", style: { padding: "13px 0", borderTop: i ? ".5px solid var(--line)" : "none" } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic", style: { background: tint[it.kind], color: col[it.kind], borderRadius: 12 } }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 19 })), /* @__PURE__ */ React.createElement("div", { className: "row-tx" }, /* @__PURE__ */ React.createElement("b", null, it.label), /* @__PURE__ */ React.createElement("span", null, it.sub)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, it.v && /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 14, fontWeight: 700, color: it.pos ? "var(--accent)" : "var(--ink-2)" } }, it.v), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 12, color: "var(--ink-3)", marginTop: 2 } }, it.t))))));
  })));
}
function VPPScreen({ run }) {
  const [joined, setJoined] = useM(false);
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Earn more"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "Virtual Power Plant")), /* @__PURE__ */ React.createElement("div", { className: "card-accent rise", style: { padding: 24, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Icon, { name: "network", size: 30 }), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", margin: "14px 0 8px" } }, "Your battery, part of something bigger."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14.5, lineHeight: 1.55, opacity: 0.9, margin: 0 } }, "Join thousands of homes acting as one giant battery. We trade your spare capacity on the imbalance market \u2014 you earn, the grid stays stable.")), /* @__PURE__ */ React.createElement("div", { className: "grid2 rise", style: { animationDelay: ".1s", marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Stat, { k: "Extra / year", v: "~\u20AC90", d: "on top of savings", dpos: true, sm: true }), /* @__PURE__ */ React.createElement(Stat, { k: "Homes pooled", v: "4,210", d: "and growing", dpos: true, sm: true })), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".16s", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("b", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 4 } }, "How you earn"), [["Standby reward", "Paid just for being available", "euro"], ["Activation", "Paid when we use your capacity", "bolt2"], ["Always protected", "Your home needs always come first", "shield"]].map((r, i) => /* @__PURE__ */ React.createElement(Row, { key: i, icon: r[2], title: r[0], sub: r[1] }))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary rise", style: { animationDelay: ".22s" }, onClick: () => setJoined(!joined) }, joined ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 19 }), " You're enrolled") : "Join the VPP")));
}
function ReferralScreen() {
  const [copied, setCopied] = useM(false);
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Share"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "Give \u20AC5, get \u20AC5")), /* @__PURE__ */ React.createElement("div", { className: "rise", style: { textAlign: "center", padding: "10px 0 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 84, height: 84, borderRadius: 26, background: "var(--accent-tint)", color: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Icon, { name: "gift", size: 40 })), /* @__PURE__ */ React.createElement("p", { className: "scr-sub", style: { marginTop: 16, maxWidth: 290, marginInline: "auto" } }, "Friends get \u20AC5 credit when they connect a device. You get \u20AC5 once they do.")), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".1s", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 8 } }, "Your code"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 52, borderRadius: 14, border: "1.5px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, letterSpacing: ".12em", color: "var(--ink)", background: "var(--card-2)" } }, "LIEKE-5"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", style: { width: 96, height: 52 }, onClick: () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  } }, copied ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 20 }) : "Copy"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12 }, className: "rise" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Icon, { name: "share", size: 18 }), " WhatsApp"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Icon, { name: "share", size: 18 }), " Email")), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".18s", marginTop: 14, display: "flex", justifyContent: "space-around", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 26, fontWeight: 700, color: "var(--ink)" } }, "3"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 } }, "Friends joined")), /* @__PURE__ */ React.createElement("div", { style: { width: ".5px", background: "var(--line)" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 26, fontWeight: 700, color: "var(--accent)" } }, "\u20AC15"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 } }, "Credit earned")))));
}
const CONNECT_BRANDS = [
  {
    key: "battery_sessy",
    t: "Sessy",
    s: "Home battery",
    icon: "battery",
    method: "form",
    fields: [{ k: "username", label: "Sessy e-mail", type: "email", ph: "you@home.nl" }, { k: "password", label: "Sessy password", type: "password", ph: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }]
  },
  { key: "ev", t: "Electric car / charger", s: "Tesla, Kia, VW, Renault\u2026 (V2G)", icon: "car", method: "oauth", url: "/api/ev/connect" },
  {
    key: "meter_tibber",
    t: "Tibber",
    s: "Dynamic energy contract",
    icon: "contract",
    method: "form",
    fields: [{ k: "token", label: "Tibber access token", type: "text", ph: "Token from developer.tibber.com" }]
  },
  {
    key: "solar_solaredge",
    t: "SolarEdge",
    s: "Solar inverter",
    icon: "sun",
    method: "form",
    fields: [{ k: "apiKey", label: "API key", type: "text", ph: "SolarEdge API key" }, { k: "siteId", label: "Site ID", type: "text", ph: "1234567" }]
  },
  { key: "solar_enphase", t: "Enphase", s: "Solar / battery", icon: "sun", method: "oauth", url: "/api/enphase/connect" },
  {
    key: "solar_fronius",
    t: "Fronius",
    s: "Solar inverter (local)",
    icon: "sun",
    method: "form",
    fields: [{ k: "ip", label: "Inverter IP address", type: "text", ph: "192.168.1.50" }]
  },
  {
    key: "meter_homewizard",
    t: "HomeWizard P1",
    s: "Smart meter (local)",
    icon: "meter",
    method: "form",
    fields: [{ k: "host", label: "P1 IP address", type: "text", ph: "192.168.1.x" }]
  },
  {
    key: "battery_victron",
    t: "Victron",
    s: "Home battery",
    icon: "battery",
    method: "form",
    fields: [{ k: "username", label: "VRM e-mail", type: "email", ph: "you@home.nl" }, { k: "password", label: "VRM password", type: "password", ph: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }]
  },
  { key: "solar_sma", t: "SMA", s: "Solar inverter", icon: "sun", method: "soon" }
];
function AddSheet({ onClose, onConnected }) {
  const [brand, setBrand] = useM(null);
  const [vals, setVals] = useM({});
  const [busy, setBusy] = useM(false);
  const [err, setErr] = useM("");
  const set = (k) => (e) => setVals((s) => ({ ...s, [k]: e.target.value }));
  const pick = (b) => {
    setErr("");
    if (b.method === "soon") {
      setErr(b.t + " komt binnenkort beschikbaar.");
      return;
    }
    if (b.method === "oauth") {
      window.location.href = b.url;
      return;
    }
    setVals({});
    setBrand(b);
  };
  const submit = async () => {
    if (!brand) return;
    for (const f of brand.fields) {
      if (!(vals[f.k] || "").trim()) {
        setErr('Vul "' + f.label + '" in');
        return;
      }
    }
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/devices/connect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: brand.key, config: vals }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Koppelen mislukt");
        setBusy(false);
        return;
      }
      onConnected && onConnected();
    } catch {
      setErr("Geen verbinding. Probeer opnieuw.");
      setBusy(false);
    }
  };
  const inp = { width: "100%", height: 50, borderRadius: 13, border: "1px solid var(--line)", background: "var(--card)", padding: "0 14px", fontSize: 15, color: "var(--ink)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 6 };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sheet-scrim", onClick: onClose }), /* @__PURE__ */ React.createElement("div", { className: "sheet" }, /* @__PURE__ */ React.createElement("div", { className: "sheet-grab" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0, letterSpacing: "-.02em" } }, brand ? "Connect " + brand.t : "Add a device"), /* @__PURE__ */ React.createElement("button", { className: "orb", style: { width: 38, height: 38, background: "color-mix(in srgb,var(--ink) 6%, transparent)" }, onClick: brand ? () => {
    setBrand(null);
    setErr("");
  } : onClose }, /* @__PURE__ */ React.createElement(Icon, { name: brand ? "chevL" : "x", size: 19 }))), !brand && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--ink-2)", margin: "0 0 16px" } }, "Pick a device \u2014 it links securely to your account."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, CONNECT_BRANDS.map((b, i) => /* @__PURE__ */ React.createElement("button", { key: i, className: "card solid", onClick: () => pick(b), style: { display: "flex", alignItems: "center", gap: 14, padding: 14, textAlign: "left", cursor: "pointer", border: ".5px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic" }, /* @__PURE__ */ React.createElement(Icon, { name: b.icon, size: 21 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 650, color: "var(--ink)" } }, b.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)", marginTop: 1 } }, b.s, b.method === "soon" ? " \xB7 coming soon" : "")), /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 18, style: { color: "var(--ink-3)" } })))), err && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", textAlign: "center", margin: "14px 0 0" } }, err)), brand && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--ink-2)", margin: "0 0 16px" } }, "Enter your ", brand.t, " details. We store them securely and only use them to read your data."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, brand.fields.map((f) => /* @__PURE__ */ React.createElement("div", { key: f.k }, /* @__PURE__ */ React.createElement("label", { style: lab }, f.label), /* @__PURE__ */ React.createElement("input", { style: inp, type: f.type || "text", placeholder: f.ph || "", value: vals[f.k] || "", onChange: set(f.k), autoCapitalize: "none", autoCorrect: "off" }))), err && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, fontWeight: 600, color: "#C2702C", margin: "2px 0 0" } }, err), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", disabled: busy, onClick: submit, style: { marginTop: 4, opacity: busy ? 0.6 : 1 } }, busy ? "Connecting\u2026" : "Connect")))));
}
function ProfileScreen() {
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem("gbict_profile")) || {};
    } catch (e) {
      return {};
    }
  };
  const [p, setP] = useM(load);
  const [saved, setSaved] = useM(false);
  const v = (k, d) => p[k] !== void 0 ? p[k] : d || "";
  const set = (k) => (e) => {
    setP((s) => ({ ...s, [k]: e.target.value }));
    setSaved(false);
  };
  const save = () => {
    localStorage.setItem("gbict_profile", JSON.stringify(p));
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  const name = v("name", "").trim();
  const init = (name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "?").toUpperCase();
  const inp = { width: "100%", height: 50, borderRadius: 13, border: "1px solid var(--line)", background: "var(--card)", padding: "0 14px", fontSize: 15, color: "var(--ink)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 6 };
  const field = (label, k, type, ph) => /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: lab }, label), /* @__PURE__ */ React.createElement("input", { style: inp, type: type || "text", value: v(k, ""), placeholder: ph || "", onChange: set(k) }));
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Account"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "Edit profile")), /* @__PURE__ */ React.createElement("div", { className: "rise", style: { display: "flex", justifyContent: "center", marginBottom: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 92, height: 92 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 92, height: 92, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 34, fontWeight: 700 } }, init), /* @__PURE__ */ React.createElement("button", { style: { position: "absolute", right: -2, bottom: -2, width: 32, height: 32, borderRadius: "50%", background: "var(--card)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 17 })))), /* @__PURE__ */ React.createElement("div", { className: "card solid card-pad rise", style: { animationDelay: ".08s" } }, field("Full name", "name", "text", "Your name"), field("Email", "email", "email", "you@home.nl"), field("Phone number", "phone", "tel", "+31 6 1234 5678"), field("Home name", "home", "text", "e.g. Home"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: lab }, "Postcode"), /* @__PURE__ */ React.createElement("input", { style: inp, value: v("post"), placeholder: "1011 AB", onChange: set("post") })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: lab }, "City"), /* @__PURE__ */ React.createElement("input", { style: inp, value: v("city"), placeholder: "Amsterdam", onChange: set("city") })))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary rise", style: { marginTop: 16, animationDelay: ".14s" }, onClick: save }, saved ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 19 }), " Saved") : "Save changes"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: "var(--ink-3)", textAlign: "center", margin: "12px 0 0" } }, "Your details are stored on this device for the demo.")));
}
Object.assign(window, { AccountScreen, ActivityScreen, VPPScreen, ReferralScreen, AddSheet, ProfileScreen });
