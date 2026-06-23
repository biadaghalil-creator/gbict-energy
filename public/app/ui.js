const { useState, useEffect, useRef } = React;
const ICONS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5",
  battery: "M4 8h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm18 2.5v3",
  savings: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  plug: "M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  sun: "M12 4V2M12 22v-2M5 5 3.5 3.5M20.5 20.5 19 19M4 12H2M22 12h-2M5 19l-1.5 1.5M20.5 3.5 19 5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  zap: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  leaf: "M4 20s8 .5 12-3.5S20 4 20 4 7 3 5 11c-1.2 4.8 0 7 0 7ZM4 20 13 11",
  car: "M5 13 6.6 8.4A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13M5 13h14v4H5v-4ZM7 17v2M17 17v2M7 13.5h0M17 13.5h0",
  heat: "M12 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 0V5a2.5 2.5 0 0 1 5 0",
  meter: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 12l4-3",
  contract: "M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h5M9.5 16h5",
  plus: "M12 5v14M5 12h14",
  check: "M4 12.5 9.5 18 20 6",
  chevR: "M9 5l7 7-7 7",
  chevL: "M15 5l-7 7 7 7",
  arrowUR: "M7 17 17 7M8 7h9v9",
  arrowDn: "M12 5v14M6 13l6 6 6-6",
  bell: "M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM9.5 20a2.5 2.5 0 0 0 5 0",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7S10.5 3 8 4s.5 3 4 3ZM12 7s1.5-4 4-3-.5 3-4 3Z",
  share: "M16 6l-4-4-4 4M12 2v14M5 12v8h14v-8",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 13a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6 2 2 0 1 1 15 4.6a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 .9 2.7",
  x: "M6 6l12 12M18 6 6 18",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h0",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  cal: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M8 3v4M16 3v4",
  shield: "M12 3 20 6v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3Z",
  network: "M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 8v5M12 13l-5 3M12 13l5 3",
  sliders: "M4 6h11M19 6h1M4 12h1M9 12h11M4 18h7M15 18h5M15 4v4M5 10v4M11 16v4",
  trend: "M3 17 9 11l4 4 8-8M15 7h6v6",
  euro: "M15 8a4 4 0 1 0 0 8M6 10h6M6 14h6",
  bolt2: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  wifi: "M5 12.5a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0M12 20h0",
  power: "M12 3v9M6.5 6.5a8 8 0 1 0 11 0",
  refresh: "M21 12a9 9 0 1 1-3-6.7M21 4v4h-4",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  moon: "M20 14a8 8 0 1 1-9.5-9.7A6.5 6.5 0 0 0 20 14Z",
  mail: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 .5 9 6 9-6",
  lock: "M6 10V8a6 6 0 0 1 12 0v2M5 10h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff: "M3 3l18 18M10.6 10.6a3 3 0 0 0 4 4M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.3 4.2M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 2.9-.4"
};
function Icon({ name, size = 22, sw = 1.8, fill = "none", style }) {
  const d = ICONS[name] || ICONS.info;
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      style,
      stroke: "currentColor",
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    fill !== "none" && /* @__PURE__ */ React.createElement("path", { d, fill, stroke: "none" }),
    /* @__PURE__ */ React.createElement("path", { d })
  );
}
function Mark({ size = 26, color = "var(--accent)" }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 28 28", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M14 3 25 22H3L14 3Z", stroke: color, strokeWidth: "1.7", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M14 9.5 20 20H8L14 9.5Z", fill: color }));
}
function useCountUp(target, { run = true, dur = 1100, decimals = 0 } = {}) {
  const [v, setV] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) {
      setV(target);
      return;
    }
    let raf, start;
    const from = 0;
    const tick = (ts) => {
      if (start == null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(from + (target - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => setV(target), dur + 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fb);
    };
  }, [target, run, dur]);
  return decimals ? v.toFixed(decimals) : Math.round(v);
}
function StatusBar() {
  return /* @__PURE__ */ React.createElement("div", { className: "statusbar" }, /* @__PURE__ */ React.createElement("div", { className: "t num" }, "9:41"), /* @__PURE__ */ React.createElement("div", { className: "r" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "12", viewBox: "0 0 18 12", fill: "currentColor" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "7", width: "3", height: "5", rx: ".6" }), /* @__PURE__ */ React.createElement("rect", { x: "4.6", y: "4.6", width: "3", height: "7.4", rx: ".6" }), /* @__PURE__ */ React.createElement("rect", { x: "9.2", y: "2.3", width: "3", height: "9.7", rx: ".6" }), /* @__PURE__ */ React.createElement("rect", { x: "13.8", y: "0", width: "3", height: "12", rx: ".6" })), /* @__PURE__ */ React.createElement("svg", { width: "16", height: "12", viewBox: "0 0 16 12", fill: "currentColor" }, /* @__PURE__ */ React.createElement("path", { d: "M8 2.6c2.1 0 4 .8 5.4 2.2l1-1A9 9 0 0 0 8 1 9 9 0 0 0 1.6 3.8l1 1A7.5 7.5 0 0 1 8 2.6Z" }), /* @__PURE__ */ React.createElement("path", { d: "M8 6c1.2 0 2.3.5 3.1 1.3l1-1A6 6 0 0 0 8 4.6 6 6 0 0 0 3.9 6.3l1 1A4.4 4.4 0 0 1 8 6Z" }), /* @__PURE__ */ React.createElement("circle", { cx: "8", cy: "9.6", r: "1.4" })), /* @__PURE__ */ React.createElement("svg", { width: "25", height: "12", viewBox: "0 0 25 12", fill: "none" }, /* @__PURE__ */ React.createElement("rect", { x: "1", y: "1", width: "20", height: "10", rx: "3", stroke: "currentColor", strokeOpacity: ".4" }), /* @__PURE__ */ React.createElement("rect", { x: "2.6", y: "2.6", width: "15", height: "6.8", rx: "1.6", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M23 4v4c.8-.3 1.4-1 1.4-2S23.8 4.3 23 4Z", fill: "currentColor", fillOpacity: ".5" }))));
}
function Device({ children, flow = true, animOn = true, themeKey }) {
  const cv = useRef(null);
  useEffect(() => {
    if (!flow || !cv.current || !window.initEnergyFlow) return;
    const inst = window.initEnergyFlow(cv.current);
    if (!animOn && inst) inst.stop();
    return () => inst && inst.stop();
  }, [flow, animOn, themeKey]);
  return /* @__PURE__ */ React.createElement("div", { className: "device" }, /* @__PURE__ */ React.createElement("div", { className: "island" }), flow && /* @__PURE__ */ React.createElement("canvas", { ref: cv, className: "flow-bg" }), /* @__PURE__ */ React.createElement("div", { className: "flow-veil" }), /* @__PURE__ */ React.createElement(StatusBar, null), children, /* @__PURE__ */ React.createElement("div", { className: "home-ind" }));
}
function Stat({ k, v, d, dpos, sm }) {
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad solid" }, /* @__PURE__ */ React.createElement("div", { className: "stat-k" }, k), /* @__PURE__ */ React.createElement("div", { className: "stat-v num" + (sm ? " sm" : "") }, v), d && /* @__PURE__ */ React.createElement("div", { className: "stat-d " + (dpos ? "pos" : "neg") }, d));
}
function Row({ icon, iconClass, title, sub, val, valClass, right, onClick }) {
  return /* @__PURE__ */ React.createElement("div", { className: "row", onClick, style: onClick ? { cursor: "pointer" } : null }, icon && /* @__PURE__ */ React.createElement("div", { className: "row-ic " + (iconClass || "") }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "row-tx" }, /* @__PURE__ */ React.createElement("b", null, title), sub && /* @__PURE__ */ React.createElement("span", null, sub)), val && /* @__PURE__ */ React.createElement("div", { className: "row-val " + (valClass || "") }, val), right);
}
function Toggle({ on, onChange }) {
  return /* @__PURE__ */ React.createElement("button", { className: "tgl", "data-on": on ? "1" : "0", onClick: () => onChange(!on) }, /* @__PURE__ */ React.createElement("i", null));
}
function Bars({ data, run = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const id = setTimeout(() => {
      var _a;
      (_a = ref.current) == null ? void 0 : _a.querySelectorAll(".bar").forEach((b, i) => {
        var _a2, _b, _c, _d;
        b.style.height = (run ? (_b = (_a2 = data[i]) == null ? void 0 : _a2.h) != null ? _b : 0 : (_d = (_c = data[i]) == null ? void 0 : _c.h) != null ? _d : 0) + "%";
      });
    }, run ? 120 : 0);
    return () => clearTimeout(id);
  }, [data, run]);
  return /* @__PURE__ */ React.createElement("div", { className: "bars", ref }, data.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "bar " + (d.kind || "lo"), style: { height: run ? 0 : d.h + "%" } })));
}
function PriceCurve({ points, now = 0.5, run = true }) {
  const W = 320, H = 96, pad = 6;
  const n = points.length;
  const xs = (i) => pad + i / (n - 1) * (W - pad * 2);
  const ys = (v) => pad + (1 - v) * (H - pad * 2);
  let d = `M ${xs(0)} ${ys(points[0])}`;
  for (let i = 1; i < n; i++) {
    const x0 = xs(i - 1), y0 = ys(points[i - 1]), x1 = xs(i), y1 = ys(points[i]);
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  const area = d + ` L ${xs(n - 1)} ${H} L ${xs(0)} ${H} Z`;
  const nowX = pad + now * (W - pad * 2);
  const nowI = Math.round(now * (n - 1));
  const nowY = ys(points[nowI]);
  const ref = useRef(null);
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const len = p.getTotalLength();
    p.style.transition = "none";
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = run ? len : 0;
    requestAnimationFrame(() => {
      p.style.transition = "stroke-dashoffset 1.3s ease";
      p.style.strokeDashoffset = 0;
    });
    const fb = setTimeout(() => {
      p.style.strokeDashoffset = 0;
    }, 1600);
    return () => clearTimeout(fb);
  }, [run]);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: H, className: "price-track", preserveAspectRatio: "none" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "pcFill", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: "var(--accent)", stopOpacity: ".22" }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: "var(--accent)", stopOpacity: "0" }))), /* @__PURE__ */ React.createElement("path", { d: area, fill: "url(#pcFill)" }), /* @__PURE__ */ React.createElement("path", { ref, d, fill: "none", stroke: "var(--accent)", strokeWidth: "2.4", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: nowX, y1: "2", x2: nowX, y2: H - 2, stroke: "var(--ink-3)", strokeWidth: "1", strokeDasharray: "3 3", opacity: ".5" }), /* @__PURE__ */ React.createElement("circle", { className: "price-now-dot", cx: nowX, cy: nowY, r: "5.5", fill: "var(--accent)", stroke: "var(--card)", strokeWidth: "2.5" }));
}
function useLiveData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    const get = (u) => fetch(u, { cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null);
    Promise.all([
      get("/api/savings"),
      get("/api/sessy/status"),
      get("/api/tibber/prices"),
      get("/api/solar/production"),
      get("/api/ai/insights")
    ]).then(([savings, sessy, tibber, solar, insights]) => {
      if (alive) setData({ savings, sessy, tibber, solar, insights });
    });
    return () => {
      alive = false;
    };
  }, []);
  return data;
}
Object.assign(window, { Icon, Mark, useCountUp, useLiveData, StatusBar, Device, Stat, Row, Toggle, Bars, PriceCurve });
