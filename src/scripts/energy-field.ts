/**
 * Leichtgewichtiges Partikelnetz für den Hero: Knoten driften, nahe Knoten
 * werden verbunden, entlang der Verbindungen laufen "Energiepakete".
 * Läuft nur, wenn der Hero sichtbar ist und keine Bewegungsreduktion aktiv ist.
 */

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number };

const BRAND = "30, 239, 242";
const VOLT = "124, 140, 255";

export function initEnergyField(canvas: HTMLCanvasElement) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes: Node[] = [];
  let pulses: Pulse[] = [];
  let raf = 0;
  let running = false;
  const pointer = { x: -9999, y: -9999, active: false };

  const linkDistance = () => (width < 640 ? 120 : 165);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const density = width < 640 ? 14000 : 11000;
    const count = Math.min(90, Math.max(18, Math.round((width * height) / density)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.7,
    }));
    pulses = [];
  }

  function spawnPulse() {
    if (nodes.length < 2 || pulses.length > 14) return;
    const a = Math.floor(Math.random() * nodes.length);
    let b = Math.floor(Math.random() * nodes.length);
    if (a === b) b = (b + 1) % nodes.length;
    const dist = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
    if (dist > linkDistance()) return;
    pulses.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.01 });
  }

  function draw() {
    ctx!.clearRect(0, 0, width, height);
    const maxDist = linkDistance();

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;

      // Knoten weichen dem Zeiger leicht aus
      if (pointer.active) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 140 && d > 0.01) {
          const push = (1 - d / 140) * 0.9;
          n.x += (dx / d) * push;
          n.y += (dy / d) * push;
        }
      }
    }

    ctx!.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d > maxDist) continue;
        const alpha = (1 - d / maxDist) * 0.22;
        ctx!.strokeStyle = `rgba(${BRAND}, ${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(nodes[i].x, nodes[i].y);
        ctx!.lineTo(nodes[j].x, nodes[j].y);
        ctx!.stroke();
      }
    }

    for (const n of nodes) {
      const nearPointer =
        pointer.active && Math.hypot(n.x - pointer.x, n.y - pointer.y) < 160;
      ctx!.fillStyle = nearPointer ? `rgba(${BRAND}, 0.95)` : `rgba(${BRAND}, 0.45)`;
      ctx!.beginPath();
      ctx!.arc(n.x, n.y, n.r * (nearPointer ? 1.8 : 1), 0, Math.PI * 2);
      ctx!.fill();
    }

    pulses = pulses.filter((p) => p.t <= 1);
    for (const p of pulses) {
      p.t += p.speed;
      const from = nodes[p.a];
      const to = nodes[p.b];
      if (!from || !to) continue;
      const x = from.x + (to.x - from.x) * p.t;
      const y = from.y + (to.y - from.y) * p.t;
      const fade = Math.sin(p.t * Math.PI);
      const glow = ctx!.createRadialGradient(x, y, 0, x, y, 9);
      glow.addColorStop(0, `rgba(${VOLT}, ${0.85 * fade})`);
      glow.addColorStop(1, `rgba(${VOLT}, 0)`);
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(x, y, 9, 0, Math.PI * 2);
      ctx!.fill();
    }

    if (Math.random() < 0.05) spawnPulse();
    raf = requestAnimationFrame(draw);
  }

  /** Ein statisches Standbild für Nutzer mit reduzierter Bewegung. */
  function drawStill() {
    ctx!.clearRect(0, 0, width, height);
    const maxDist = linkDistance();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d > maxDist) continue;
        ctx!.strokeStyle = `rgba(${BRAND}, ${(1 - d / maxDist) * 0.18})`;
        ctx!.beginPath();
        ctx!.moveTo(nodes[i].x, nodes[i].y);
        ctx!.lineTo(nodes[j].x, nodes[j].y);
        ctx!.stroke();
      }
    }
    ctx!.fillStyle = `rgba(${BRAND}, 0.45)`;
    for (const n of nodes) {
      ctx!.beginPath();
      ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx!.fill();
    }
  }

  function start() {
    if (running) return;
    if (reduceMotion.matches) {
      drawStill();
      return;
    }
    running = true;
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();

  const onResize = debounce(() => {
    resize();
    if (!running) drawStill();
  }, 200);
  window.addEventListener("resize", onResize, { passive: true });

  canvas.addEventListener(
    "pointermove",
    (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    },
    { passive: true },
  );
  canvas.addEventListener("pointerleave", () => (pointer.active = false), {
    passive: true,
  });

  // Nicht im Hintergrund rendern
  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0.01 },
  );
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (canvas.getBoundingClientRect().bottom > 0) start();
  });

  reduceMotion.addEventListener("change", () => {
    stop();
    start();
  });
}

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
