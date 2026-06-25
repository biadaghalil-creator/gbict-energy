const { useState: useS } = React;
const PRICE = [0.34, 0.3, 0.26, 0.22, 0.19, 0.18, 0.21, 0.32, 0.46, 0.52, 0.48, 0.4, 0.36, 0.33, 0.35, 0.42, 0.58, 0.72, 0.8, 0.74, 0.6, 0.5, 0.42, 0.37];
const NOW = 0.58;
const SCHEDULE = [
  { t: "02:00\u201305:00", icon: "arrowDn", label: "Charge battery", sub: "Cheapest window \xB7 \u20AC0.18/kWh", kind: "charge" },
  { t: "07:00\u201309:00", icon: "sun", label: "Solar + home use", sub: "Self-consumption", kind: "solar" },
  { t: "17:00\u201320:00", icon: "arrowUR", label: "Sell to grid", sub: "Peak price \xB7 \u20AC0.80/kWh", kind: "sell" }
];
function fmtEur(n, d = 2) {
  return n == null || isNaN(n) ? null : "\u20AC" + Number(n).toFixed(d);
}
function liveScheduleRows(sched) {
  if (!sched || !sched.length) return null;
  const blocks = [];
  sched.forEach((s) => {
    const kind = s.action === "discharge" ? "sell" : s.action === "charge" ? "charge" : "solar";
    const last = blocks[blocks.length - 1];
    if (last && last.kind === kind && s.hour === last.end) {
      last.end = s.hour + 1;
      last.prices.push(s.price);
    } else blocks.push({ kind, start: s.hour, end: s.hour + 1, prices: [s.price] });
  });
  const pick = blocks.filter((b) => b.kind !== "solar");
  const src = (pick.length ? pick : blocks).slice(0, 3);
  const pad = (h) => String(h % 24).padStart(2, "0") + ":00";
  return src.map((b) => {
    const avg = b.prices.reduce((a, c) => a + c, 0) / b.prices.length;
    return {
      kind: b.kind,
      icon: b.kind === "charge" ? "arrowDn" : b.kind === "sell" ? "arrowUR" : "sun",
      label: b.kind === "charge" ? "Charge battery" : b.kind === "sell" ? "Sell to grid" : "Solar + home use",
      sub: b.kind === "charge" ? "Cheapest window \xB7 \u20AC" + avg.toFixed(2) + "/kWh" : b.kind === "sell" ? "Peak price \xB7 \u20AC" + avg.toFixed(2) + "/kWh" : "Self-consumption",
      t: pad(b.start) + "\u2013" + pad(b.end)
    };
  });
}
function Greeting({ onOpen }) {
  let prof = {};
  try {
    prof = JSON.parse(localStorage.getItem("gbict_profile")) || {};
  } catch (e) {
  }
  const name = (prof.name || "").trim();
  const first = name.split(/\s+/)[0] || "";
  const home = prof.home || (first ? first + "'s home" : "My home");
  const init = (name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("") || "?").toUpperCase();
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0, flex: "0 1 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--ink-2)", fontWeight: 500 } }, "Good afternoon"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, home)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flex: "none" } }, /* @__PURE__ */ React.createElement("div", { className: "pill live" }, "Optimising"), /* @__PURE__ */ React.createElement("button", { onClick: () => onOpen && onOpen("profile"), "aria-label": "Edit profile", style: { width: 42, height: 42, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit" } }, init)));
}
function Ring({ pct, size = 130, sw = 12, run = true, label = "charged", center }) {
  const r = (size - sw) / 2, C = 2 * Math.PI * r;
  const val = useCountUp(pct, { run });
  const off = C * (1 - val / 100);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: size, height: size } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "color-mix(in srgb,var(--ink) 9%, transparent)", strokeWidth: sw }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: size / 2,
      cy: size / 2,
      r,
      fill: "none",
      stroke: "var(--accent)",
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeDasharray: C,
      strokeDashoffset: run ? off : C * (1 - pct / 100),
      style: { transition: "stroke-dashoffset 1.2s cubic-bezier(.22,.68,.32,1)" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, center || /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: size * 0.25, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em" } }, val, "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", marginTop: 2 } }, label))));
}
function PriceCard({ run, live }) {
  const tib = live == null ? void 0 : live.tibber;
  const hasPrices = !!((tib == null ? void 0 : tib.today) && tib.today.length);
  const pts = hasPrices ? tib.today.map((p) => p.total) : [];
  const cur = typeof (tib == null ? void 0 : tib.current) === "number" ? tib.current : null;
  const pad = (h) => String(h % 24).padStart(2, "0") + ":00";
  if (!hasPrices) {
    return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".16s" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink-2)" } }, "Power price today"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginTop: 3 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 24, fontWeight: 700, color: "var(--ink)" } }, cur != null ? "\u20AC" + cur.toFixed(2) : "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--ink-3)" } }, "/kWh now")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", margin: "12px 0 0" } }, live ? "Prices not available right now." : "Loading prices\u2026"));
  }
  const avg = pts.reduce((a, c) => a + c, 0) / pts.length;
  const price = cur != null ? cur : avg;
  const idx = cur != null ? tib.today.findIndex((p) => Math.abs(p.total - cur) < 1e-9) : -1;
  const nowPos = idx >= 0 ? (idx + 0.5) / tib.today.length : 0.5;
  const below = price <= avg;
  const lo = pts.indexOf(Math.min(...pts)), hi = pts.indexOf(Math.max(...pts));
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".16s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink-2)" } }, "Power price today"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginTop: 3 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 24, fontWeight: 700, color: "var(--ink)" } }, "\u20AC", price.toFixed(2)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--ink-3)" } }, "/kWh now"))), /* @__PURE__ */ React.createElement("div", { className: "pill", style: { background: below ? "var(--accent-tint)" : "color-mix(in srgb,var(--sell) 14%, transparent)" } }, /* @__PURE__ */ React.createElement(Icon, { name: below ? "arrowDn" : "arrowUR", size: 14 }), " ", below ? "Below average" : "Above average")), /* @__PURE__ */ React.createElement(PriceCurve, { points: pts, now: nowPos, run }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--ink-3)", marginTop: 8 } }, /* @__PURE__ */ React.createElement("span", null, "00:00"), /* @__PURE__ */ React.createElement("span", null, "cheapest ", pad(lo)), /* @__PURE__ */ React.createElement("span", null, "peak ", pad(hi)), /* @__PURE__ */ React.createElement("span", null, "24:00")));
}
function ScheduleCard({ run, onOpen, live }) {
  var _a, _b;
  const tint = { charge: "var(--accent-tint)", solar: "var(--sun-tint)", sell: "color-mix(in srgb,var(--sell) 14%, transparent)" };
  const col = { charge: "var(--accent-deep)", solar: "var(--sun)", sell: "var(--sell)" };
  const rows = liveScheduleRows((_b = (_a = live == null ? void 0 : live.tibber) == null ? void 0 : _a.optimization) == null ? void 0 : _b.schedule);
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".22s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("b", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink)" } }, "Today's plan"), /* @__PURE__ */ React.createElement("button", { onClick: onOpen, style: { border: "none", background: "none", color: "var(--accent)", fontWeight: 600, fontSize: 13, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 } }, "Why? ", /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 14 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } }, !rows && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", margin: "4px 0" } }, live ? "No plan yet \u2014 prices not available." : "Loading\u2026"), (rows || []).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "row", style: { padding: "11px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic", style: { background: tint[s.kind], color: col[s.kind], borderRadius: 12 } }, /* @__PURE__ */ React.createElement(Icon, { name: s.icon, size: 19 })), /* @__PURE__ */ React.createElement("div", { className: "row-tx" }, /* @__PURE__ */ React.createElement("b", null, s.label), /* @__PURE__ */ React.createElement("span", null, s.sub)), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 13, fontWeight: 600, color: "var(--ink-2)" } }, s.t)))));
}
function FlowStrip({ run, live }) {
  var _a, _b, _c;
  const ses = live == null ? void 0 : live.sessy;
  const kw = (w) => (Math.abs(w) / 1e3).toFixed(1) + " kW";
  let items;
  if (ses) {
    const solarW = (_a = ses.renewable_energy) != null ? _a : 0;
    const battW = (_b = ses.power) != null ? _b : 0;
    const homeW = Math.max(0, solarW - Math.max(0, battW) - Math.max(0, (_c = ses.grid_power) != null ? _c : 0));
    items = [
      { icon: "sun", v: kw(solarW), l: "Solar in", c: "var(--sun)" },
      { icon: "home", v: kw(homeW), l: "Home use", c: "var(--ink-2)" },
      { icon: "battery", v: (battW >= 0 ? "+" : "\u2212") + kw(battW), l: battW >= 0 ? "To battery" : "From battery", c: "var(--accent)" }
    ];
  } else {
    items = [
      { icon: "sun", v: "0.0 kW", l: "Solar in", c: "var(--sun)" },
      { icon: "home", v: "0.0 kW", l: "Home use", c: "var(--ink-2)" },
      { icon: "battery", v: "0.0 kW", l: "Battery", c: "var(--accent)" }
    ];
  }
  return /* @__PURE__ */ React.createElement("div", { className: "card solid rise", style: { animationDelay: ".12s", padding: "16px 8px", display: "flex" } }, items.map((it, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, i > 0 && /* @__PURE__ */ React.createElement("div", { style: { width: ".5px", background: "var(--line)", margin: "2px 0" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("div", { style: { color: it.c } }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 22 })), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 16, fontWeight: 700, color: "var(--ink)" } }, it.v), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-3)" } }, it.l)))));
}
function Dashboard({ variant = "classic", onOpen, run = true }) {
  const live = useLiveData();
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise" }, /* @__PURE__ */ React.createElement(Greeting, { onOpen })), variant === "classic" && /* @__PURE__ */ React.createElement(DashClassic, { onOpen, run, live }), variant === "focus" && /* @__PURE__ */ React.createElement(DashFocus, { onOpen, run, live }), variant === "timeline" && /* @__PURE__ */ React.createElement(DashTimeline, { onOpen, run, live })));
}
function DashClassic({ onOpen, run, live }) {
  var _a, _b, _c;
  const sv = live == null ? void 0 : live.savings, ses = live == null ? void 0 : live.sessy, sol = live == null ? void 0 : live.solar;
  const today = useCountUp((_a = sv == null ? void 0 : sv.today_eur) != null ? _a : 0, { run, decimals: 2 });
  const soc = ses && typeof ses.state_of_charge === "number" ? Math.round(ses.state_of_charge) : 0;
  const monthStr = fmtEur((_b = sv == null ? void 0 : sv.month_eur) != null ? _b : 0, 2);
  const totalStr = "\u20AC" + Math.round((_c = sv == null ? void 0 : sv.total_eur) != null ? _c : 0);
  const solarStr = sol && typeof sol.todayKwh === "number" ? sol.todayKwh.toFixed(1) + " kWh" : "0.0 kWh";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "card-accent rise", style: { padding: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, opacity: 0.85 } }, "Saved today"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 42, fontWeight: 700, letterSpacing: "-.03em", margin: "4px 0" } }, "\u20AC", today), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.85 } }, monthStr, " this month \xB7 ", totalStr, " all-time")), /* @__PURE__ */ React.createElement(Ring, { pct: soc, size: 86, sw: 9, run, center: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "battery", size: 20, style: { color: "#fff" } }), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 16, fontWeight: 700, marginTop: 3 } }, soc, "%")) }))), /* @__PURE__ */ React.createElement(FlowStrip, { run, live }), /* @__PURE__ */ React.createElement("div", { className: "grid2" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".14s" }, onClick: () => onOpen("savings") }, /* @__PURE__ */ React.createElement(Stat, { k: "This month", v: monthStr, d: "saved so far", dpos: true, sm: true })), /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".18s" }, onClick: () => onOpen("battery") }, /* @__PURE__ */ React.createElement(Stat, { k: "Solar today", v: solarStr, d: "generated", dpos: true, sm: true }))), /* @__PURE__ */ React.createElement(PriceCard, { run, live }), /* @__PURE__ */ React.createElement(ScheduleCard, { run, live, onOpen: () => onOpen("battery") }), /* @__PURE__ */ React.createElement(InsightsCard, { live }));
}
function InsightsCard({ live }) {
  var _a;
  const ai = live == null ? void 0 : live.insights;
  const tom = ai == null ? void 0 : ai.tomorrow;
  const fc = ai == null ? void 0 : ai.forecast;
  const anomalies = (ai == null ? void 0 : ai.anomalies) || [];
  const active = ai && !(fc == null ? void 0 : fc.learning);
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".28s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Icon, { name: "spark", size: 18, style: { color: "var(--accent)" } }), /* @__PURE__ */ React.createElement("b", { style: { fontSize: 15.5, fontWeight: 700, color: "var(--ink)" } }, "GBICT AI"), /* @__PURE__ */ React.createElement("span", { className: "pill", style: { marginLeft: "auto", height: 24, fontSize: 11, background: "var(--accent-tint)" } }, active ? "Active" : "Learning")), (tom == null ? void 0 : tom.available) ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 8px" } }, "Tomorrow we expect about ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--accent)" } }, "\u20AC", Number(tom.estSavingsEur).toFixed(2)), " in savings. Cheapest power between ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink)" } }, tom.cheapWindow), " \u2014 we charge then automatically.") : /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 8px" } }, "Tomorrow's prices usually arrive in the afternoon \u2014 we plan the cheapest window automatically."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13.5, color: "var(--ink-2)", margin: 0 } }, !fc || fc.learning ? `Usage forecast is learning\u2026 (${(_a = fc == null ? void 0 : fc.dataPoints) != null ? _a : 0} readings collected)` : /* @__PURE__ */ React.createElement(React.Fragment, null, "Expected usage: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink)" } }, fc.consumptionKwh, " kWh/day"))), anomalies.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 8, alignItems: "flex-start", marginTop: 8, padding: "10px 12px", borderRadius: 12, background: a.severity === "warn" ? "color-mix(in srgb,var(--sell) 12%, transparent)" : "var(--accent-tint)" } }, /* @__PURE__ */ React.createElement(Icon, { name: a.severity === "warn" ? "shield" : "spark", size: 16, style: { color: a.severity === "warn" ? "var(--sell)" : "var(--accent)", marginTop: 1 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45 } }, a.message))));
}
function DashFocus({ onOpen, run }) {
  const today = useCountUp(1.84, { run, decimals: 2 });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { textAlign: "center", padding: "14px 0 4px" } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow", style: { color: "var(--accent)" } }, "Saved today"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 76, fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", lineHeight: 1, margin: "6px 0" } }, "\u20AC", today), /* @__PURE__ */ React.createElement("div", { className: "pill live", style: { marginTop: 4 } }, "Battery discharging to grid")), /* @__PURE__ */ React.createElement("div", { className: "card solid rise", style: { animationDelay: ".12s", padding: 22, display: "flex", alignItems: "center", gap: 22 }, onClick: () => onOpen("battery") }, /* @__PURE__ */ React.createElement(Ring, { pct: 78, size: 120, run }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink)" } }, "Sessy battery"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 } }, "3.9 of 5.0 kWh stored. Selling at peak until 20:00."), /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, color: "var(--accent)", fontWeight: 600, fontSize: 13 } }, "Details ", /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 14 })))), /* @__PURE__ */ React.createElement("div", { className: "grid2" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".16s" } }, /* @__PURE__ */ React.createElement(Stat, { k: "This month", v: "\u20AC38.20", d: "\u2191 12%", dpos: true, sm: true })), /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".2s" } }, /* @__PURE__ */ React.createElement(Stat, { k: "Solar today", v: "8.4 kWh", d: "3.1 stored", dpos: true, sm: true }))), /* @__PURE__ */ React.createElement(PriceCard, { run }), /* @__PURE__ */ React.createElement(ForecastCard, { run }));
}
function DashTimeline({ onOpen, run }) {
  const tint = { charge: "var(--accent)", solar: "var(--sun)", sell: "var(--sell)" };
  const past = [true, true, false];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "grid2 rise" }, /* @__PURE__ */ React.createElement(Stat, { k: "Saved today", v: "\u20AC1.84", d: "live", dpos: true, sm: true }), /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid", style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Ring, { pct: 78, size: 56, sw: 7, run, center: /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 14, fontWeight: 700, color: "var(--ink)" } }, "78%") }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "stat-k" }, "Battery"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 650, color: "var(--ink)", marginTop: 3 } }, "3.9 kWh")))), /* @__PURE__ */ React.createElement("div", { className: "card solid rise", style: { animationDelay: ".12s", padding: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("b", { style: { fontSize: 17, fontWeight: 700, color: "var(--ink)" } }, "Live optimisation"), /* @__PURE__ */ React.createElement("div", { className: "pill live" }, "On")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", paddingLeft: 8 } }, SCHEDULE.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 16, position: "relative", paddingBottom: i < 2 ? 24 : 0 } }, i < 2 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 13, top: 28, bottom: 0, width: 2, background: past[i] ? "var(--accent)" : "var(--line)" } }), /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: past[i] ? tint[s.kind] : "var(--card-2)", color: past[i] ? "#fff" : "var(--ink-3)", border: past[i] ? "none" : "1.5px solid var(--line)", zIndex: 1 } }, /* @__PURE__ */ React.createElement(Icon, { name: past[i] ? "check" : s.icon, size: 15, sw: 2.2 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, paddingTop: 2 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("b", { style: { fontSize: 15, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 } }, s.label), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, color: "var(--ink-3)", whiteSpace: "nowrap", flex: "none" } }, s.t)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)", marginTop: 2 } }, s.sub))))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-sm", style: { width: "100%", marginTop: 18 }, onClick: () => onOpen("battery") }, "See decision log ", /* @__PURE__ */ React.createElement(Icon, { name: "chevR", size: 16 }))), /* @__PURE__ */ React.createElement(PriceCard, { run }), /* @__PURE__ */ React.createElement("div", { className: "grid2" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".18s" }, onClick: () => onOpen("savings") }, /* @__PURE__ */ React.createElement(Stat, { k: "This month", v: "\u20AC38.20", d: "\u2191 12%", dpos: true, sm: true })), /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".22s" } }, /* @__PURE__ */ React.createElement(Stat, { k: "Solar today", v: "8.4 kWh", d: "3.1 stored", dpos: true, sm: true }))));
}
function ForecastCard({ run, live }) {
  var _a;
  const tom = (_a = live == null ? void 0 : live.tibber) == null ? void 0 : _a.tomorrow;
  const head = /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 } }, /* @__PURE__ */ React.createElement(Icon, { name: "spark", size: 18, style: { color: "var(--accent)" } }), /* @__PURE__ */ React.createElement("b", { style: { fontSize: 15.5, fontWeight: 700, color: "var(--ink)" } }, "Tomorrow's forecast"));
  if (!tom || !tom.length) {
    return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".28s" } }, head, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 } }, "Tomorrow's prices usually arrive in the afternoon. We'll plan the cheapest window automatically once they're in."));
  }
  const vals = tom.map((p) => p.total);
  let bestStart = 0, best = Infinity;
  for (let i = 0; i + 4 <= vals.length; i++) {
    const s = vals.slice(i, i + 4).reduce((a, c) => a + c, 0);
    if (s < best) {
      best = s;
      bestStart = i;
    }
  }
  const pad = (h) => String(h % 24).padStart(2, "0") + ":00";
  const startH = new Date(tom[bestStart].startsAt).getHours();
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".28s" } }, head, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 } }, "Cheapest power between ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink)" } }, pad(startH), "\u2013", pad(startH + 4)), ". We'll charge the battery in that window automatically."));
}
function BatteryScreen({ run }) {
  var _a, _b, _c;
  const live = useLiveData();
  const ses = live == null ? void 0 : live.sessy, sv = live == null ? void 0 : live.savings;
  const soc = ses && typeof ses.state_of_charge === "number" ? Math.round(ses.state_of_charge) : 0;
  const cap = 5;
  const stored = (soc / 100 * cap).toFixed(1);
  const earnedStr = fmtEur((_a = sv == null ? void 0 : sv.today_eur) != null ? _a : 0, 2);
  const stateLabel = ses ? ses.system_state === "DISCHARGING" ? "Discharging to grid" : ses.system_state === "CHARGING" ? "Charging battery" : "Idle \xB7 optimising" : "No battery connected";
  const actions = ((_b = sv == null ? void 0 : sv.charge_count) != null ? _b : 0) + ((_c = sv == null ? void 0 : sv.discharge_count) != null ? _c : 0);
  const log = [];
  const tint = { charge: "var(--accent-tint)", solar: "var(--sun-tint)", sell: "color-mix(in srgb,var(--sell) 14%, transparent)" };
  const col = { charge: "var(--accent-deep)", solar: "var(--sun)", sell: "var(--sell)" };
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Device"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "Battery")), /* @__PURE__ */ React.createElement("div", { className: "card solid rise", style: { padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Ring, { pct: soc, size: 160, sw: 14, run, center: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 42, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em" } }, soc, "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)" } }, stored, " / ", cap.toFixed(1), " kWh")) }), /* @__PURE__ */ React.createElement("div", { className: "pill live", style: { marginTop: 6 } }, stateLabel)), /* @__PURE__ */ React.createElement("div", { className: "grid2", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".1s" } }, /* @__PURE__ */ React.createElement(Stat, { k: "Earned today", v: earnedStr, d: "from this battery", dpos: true, sm: true })), /* @__PURE__ */ React.createElement("div", { className: "rise", style: { animationDelay: ".14s" } }, /* @__PURE__ */ React.createElement(Stat, { k: "Actions today", v: String(actions), d: "charge + sell moves", dpos: true, sm: true }))), /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".18s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 18, style: { color: "var(--accent)" } }), /* @__PURE__ */ React.createElement("b", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink)" } }, "Decision log"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-3)", marginLeft: "auto" } }, "Last 30 days")), !log.length && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", margin: "4px 0" } }, "No activity yet \u2014 your battery's moves will show here."), log.map((l, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "row", style: { padding: "12px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic", style: { background: tint[l.kind], color: col[l.kind], borderRadius: 12 } }, /* @__PURE__ */ React.createElement(Icon, { name: l.kind === "sell" ? "arrowUR" : l.kind === "solar" ? "sun" : "arrowDn", size: 18 })), /* @__PURE__ */ React.createElement("div", { className: "row-tx" }, /* @__PURE__ */ React.createElement("b", null, l.label), /* @__PURE__ */ React.createElement("span", null, l.sub)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 13, fontWeight: 600, color: col[l.kind] } }, l.v), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 12, color: "var(--ink-3)", marginTop: 2 } }, l.t)))))));
}
function SavingsScreen({ run }) {
  var _a, _b, _c;
  const live = useLiveData();
  const sv = live == null ? void 0 : live.savings;
  const fmt = (n) => n == null ? "\u2014" : "\u20AC" + Number(n).toFixed(2);
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Insights"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "Savings")), /* @__PURE__ */ React.createElement("div", { className: "grid2 rise", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Stat, { k: "All-time saved", v: "\u20AC" + Math.round((_a = sv == null ? void 0 : sv.total_eur) != null ? _a : 0), d: "since you joined", dpos: true, sm: true }), /* @__PURE__ */ React.createElement(Stat, { k: "This month", v: fmt((_b = sv == null ? void 0 : sv.month_eur) != null ? _b : 0), d: "so far", dpos: true, sm: true })), /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".12s", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "stat-k" }, "Saved today"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 28, fontWeight: 700, color: "var(--ink)", marginTop: 4 } }, fmt((_c = sv == null ? void 0 : sv.today_eur) != null ? _c : 0)))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", margin: 0 } }, "The totals above are live. A day-by-day history chart is coming soon.")), /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid rise", style: { animationDelay: ".18s" } }, /* @__PURE__ */ React.createElement("b", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 } }, "Where it came from"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", margin: "6px 0 0" } }, "The breakdown (arbitrage, peak avoidance, solar self-use) appears once your battery has logged some activity."))));
}
const DEVICE_META = {
  battery_sessy: { icon: "battery", t: "Sessy", s: "Home battery" },
  battery_victron: { icon: "battery", t: "Victron", s: "Home battery" },
  battery_enphase: { icon: "battery", t: "Enphase", s: "Battery / solar" },
  battery_solaredge: { icon: "battery", t: "SolarEdge", s: "Battery / solar" },
  meter_tibber: { icon: "contract", t: "Tibber", s: "Dynamic contract" },
  meter_homewizard: { icon: "meter", t: "HomeWizard P1", s: "Smart meter" },
  solar_solaredge: { icon: "sun", t: "SolarEdge", s: "Solar inverter" },
  solar_fronius: { icon: "sun", t: "Fronius", s: "Solar inverter" },
  solar_enphase: { icon: "sun", t: "Enphase", s: "Solar inverter" },
  solar_sma: { icon: "sun", t: "SMA", s: "Solar inverter" },
  ev: { icon: "car", t: "Electric car", s: "Smart & V2G charging" }
};
function deviceMeta(d) {
  return DEVICE_META[d.type] || { icon: "plug", t: d.brand || d.name || d.type, s: "Connected device" };
}
function ConnectionsScreen({ onAdd, nonce }) {
  const [devices, setDevices] = useS(null);
  React.useEffect(() => {
    let alive = true;
    fetch("/api/devices", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((d) => {
      if (alive) setDevices(Array.isArray(d) ? d : []);
    }).catch(() => {
      if (alive) setDevices([]);
    });
    return () => {
      alive = false;
    };
  }, [nonce]);
  const disconnect = (id) => {
    setDevices((ds) => (ds || []).filter((d) => d.id !== id));
    fetch("/api/devices/disconnect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).catch(() => {
    });
  };
  const list = devices || [];
  return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "screen-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "rise", style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "scr-eyebrow" }, "Setup"), /* @__PURE__ */ React.createElement("h1", { className: "scr-title", style: { marginTop: 6 } }, "Connections")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-sm", style: { width: "auto" }, onClick: onAdd }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 18 }), " Add")), list.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "card solid rise card-pad", style: { animationDelay: ".08s", marginBottom: 14 } }, list.map((d) => {
    const m = deviceMeta(d);
    return /* @__PURE__ */ React.createElement(
      Row,
      {
        key: d.id,
        icon: m.icon,
        title: d.name || m.t,
        sub: m.s,
        right: /* @__PURE__ */ React.createElement("button", { onClick: () => disconnect(d.id), style: { border: "none", background: "none", color: "var(--ink-3)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } }, "Disconnect")
      }
    );
  })), devices && list.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "card solid rise card-pad", style: { animationDelay: ".08s", marginBottom: 14, textAlign: "center", padding: "26px 18px" } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic", style: { background: "var(--accent-tint)", margin: "0 auto 10px" } }, /* @__PURE__ */ React.createElement(Icon, { name: "plug", size: 22 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 650, color: "var(--ink)" } }, "No devices connected yet"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)", marginTop: 3 } }, "Connect your battery, solar, EV or contract to see live data.")), /* @__PURE__ */ React.createElement("button", { className: "card solid rise", onClick: onAdd, style: { animationDelay: ".16s", width: "100%", padding: 18, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1.5px dashed var(--line)", background: "transparent" } }, /* @__PURE__ */ React.createElement("div", { className: "row-ic", style: { background: "var(--accent-tint)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 22 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "left" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 650, color: "var(--ink)" } }, "Add a device"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)" } }, "Battery, EV, heat pump & more")))));
}
Object.assign(window, { Dashboard, BatteryScreen, SavingsScreen, ConnectionsScreen });
