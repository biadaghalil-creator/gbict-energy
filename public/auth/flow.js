/* Energy flow-field for the hero — particles streaming along a curling
   vector field, reading as live electric current with depth. Adapts to
   the active direction's --bg / --accent-rgb. Draws a full first frame
   so it looks intentional even if the animation clock is paused. */
(function () {
  function initEnergyFlow(canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, parts = [], raf = 0, t = 0, running = true;
    let bg = "255,255,255", acc = "77,124,15";

    function colors() {
      const cs = getComputedStyle(document.documentElement);
      acc = (cs.getPropertyValue("--accent-rgb").trim()) || acc;
      const b = (cs.getPropertyValue("--bg").trim()) || "#ffffff";
      // hex -> rgb
      const m = b.replace("#", "");
      if (m.length >= 6) {
        bg = parseInt(m.slice(0, 2), 16) + "," + parseInt(m.slice(2, 4), 16) + "," + parseInt(m.slice(4, 6), 16);
      }
    }
    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(1700, Math.round(w * h / 680));
      parts = [];
      for (let i = 0; i < n; i++) parts.push(spawn(true));
      // paint a base so a frozen first frame still has body
      ctx.fillStyle = "rgb(" + bg + ")"; ctx.fillRect(0, 0, w, h);
      // Warm up with EVEN coverage: re-seed every particle to a fresh uniform
      // random position each pass, advancing the clock between passes. This
      // fills the whole frame — top strip, corners, right edge — instead of
      // letting the curl field pile up in some zones and sweep others bare.
      for (let pass = 0; pass < 16; pass++) {
        for (const p of parts) { p.x = Math.random() * w; p.y = Math.random() * h; }
        t += 90;
        for (let s = 0; s < 16; s++) step(false);
      }
    }
    function spawn(any) {
      return { x: Math.random() * w, y: Math.random() * h, z: Math.random(), life: (any ? Math.random() : 1) * 95 + 22 };
    }
    // smooth curling angle field
    function angle(x, y) {
      return (Math.sin(x * 0.0019 + t * 0.00035) + Math.cos(y * 0.0021 - t * 0.00028)
            + 0.6 * Math.sin((x + y) * 0.0012 + t * 0.0002)) * 1.35;
    }
    function step(fade) {
      if (fade) { ctx.fillStyle = "rgba(" + bg + ",0.028)"; ctx.fillRect(0, 0, w, h); }
      ctx.lineCap = "round";
      for (const p of parts) {
        const a = angle(p.x, p.y);
        const sp = 0.5 + p.z * 1.6;
        const nx = p.x + Math.cos(a) * sp, ny = p.y + Math.sin(a) * sp;
        ctx.strokeStyle = "rgba(" + acc + "," + (0.14 + p.z * 0.36).toFixed(3) + ")";
        ctx.lineWidth = 0.6 + p.z * 1.6;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny; p.life -= 1;
        // wrap at edges (toroidal) so density stays uniform right up to the borders
        if (p.x < 0) p.x += w; else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h; else if (p.y > h) p.y -= h;
        if (p.life < 0) Object.assign(p, spawn(false));
      }
    }
    function loop() {
      if (!running) return;
      t += 16; step(true); raf = requestAnimationFrame(loop);
    }
    colors(); resize();
    const onResize = () => { colors(); resize(); };
    window.addEventListener("resize", onResize, { passive: true });
    const mo = new MutationObserver(() => { colors(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-dir"] });
    raf = requestAnimationFrame(loop);
    return { stop() { running = false; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); mo.disconnect(); } };
  }
  window.initEnergyFlow = initEnergyFlow;
})();
