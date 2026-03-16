"use client";

import { useEffect, useRef } from "react";

// ─── Types ─────────────────────────────────────────────

interface KGNode {
  id: number;
  layer: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scatterX: number;
  scatterY: number;
  targetX: number;
  targetY: number;
  radius: number;
}

interface KGEdge {
  from: number;
  to: number;
}

interface Pulse {
  edgeIdx: number;
  t: number;    // 0→1 progress along edge
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

interface SimState {
  nodes: KGNode[];
  edges: KGEdge[];
  pulses: Pulse[];
  particles: Particle[];
}

// ─── Constants ─────────────────────────────────────────

// Five semantic layers: problem → method → code → insight → output
const LAYER_LABELS = ["PROBLEMS", "METHODS", "CODE", "INSIGHTS", "OUTPUTS"];

// Per-layer glow colors — distinctly differentiated cool tones
const LAYER_COLORS: [number, number, number][] = [
  [65,  130, 255], // strong blue    — problems
  [35,  215, 225], // vivid cyan     — methods
  [45,  235, 155], // vivid mint     — code
  [185, 105, 255], // strong violet  — insights
  [240, 190, 255], // pink-lavender  — outputs
];

const LOOP_MS = 26000;

// ─── Math helpers ──────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const tc = Math.max(0, Math.min(1, t));
  return tc * tc * (3 - 2 * tc);
}

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Phase blends ──────────────────────────────────────
// 0–1s    scatter
// 1–4s    organize into columns  ← fast convergence
// 4–20s   hold (pulses flow, labels visible)
// 20–25s  dissolve
// 25–26s  scatter pause

function getPhaseBlends(t: number) {
  const organizeBlend =
    t < 1000  ? 0 :
    t < 4000  ? smoothstep((t - 1000) / 3000) :
    t < 20000 ? 1 :
    t < 25000 ? 1 - smoothstep((t - 20000) / 5000) :
    0;

  const edgeAlpha =
    t < 2000  ? 0 :
    t < 4500  ? smoothstep((t - 2000) / 2500) :
    t < 20000 ? 1 :
    t < 24000 ? 1 - smoothstep((t - 20000) / 4000) :
    0;

  const labelAlpha =
    t < 3500  ? 0 :
    t < 5500  ? smoothstep((t - 3500) / 2000) :
    t < 20000 ? 1 :
    t < 24000 ? 1 - smoothstep((t - 20000) / 4000) :
    0;

  const pulseAlpha =
    t < 4000  ? 0 :
    t < 6000  ? smoothstep((t - 4000) / 2000) :
    t < 20000 ? 1 :
    t < 22000 ? 1 - smoothstep((t - 20000) / 2000) :
    0;

  const nodeGlow =
    t < 3000  ? 0 :
    t < 5500  ? smoothstep((t - 3000) / 2500) :
    t < 20000 ? 1 :
    t < 24000 ? 1 - smoothstep((t - 20000) / 4000) :
    0;

  return { organizeBlend, edgeAlpha, labelAlpha, pulseAlpha, nodeGlow };
}

// ─── Simulation builder ────────────────────────────────

function buildSimulation(w: number, h: number, rng: () => number): SimState {
  const isMobile = w < 640;

  // Nodes per layer: more in the middle to suggest transformation complexity
  const nodesPerLayer = isMobile ? [3, 3, 3, 3, 2] : [4, 5, 5, 4, 3];

  const padX = 40;
  const padY = 36;
  const colWidth = (w - padX * 2) / 5;

  const nodes: KGNode[] = [];
  const layerBuckets: number[][] = Array.from({ length: 5 }, () => []);
  let nid = 0;

  for (let layer = 0; layer < 5; layer++) {
    const count = nodesPerLayer[layer];
    const colCX = padX + (layer + 0.5) * colWidth;
    const usableH = h - padY * 2;
    const spacing = usableH / (count + 1);

    for (let i = 0; i < count; i++) {
      const sx = rng() * w;
      const sy = rng() * h;
      const tx = colCX + (rng() - 0.5) * colWidth * 0.38;
      const ty = padY + spacing * (i + 1) + (rng() - 0.5) * spacing * 0.25;

      layerBuckets[layer].push(nid);
      nodes.push({
        id: nid++,
        layer,
        x: sx, y: sy,
        vx: (rng() - 0.5) * 1.2,
        vy: (rng() - 0.5) * 1.2,
        scatterX: sx, scatterY: sy,
        targetX: tx, targetY: ty,
        radius: 2.3 + rng() * 1.4,
      });
    }
  }

  // Build directed edges (from → to, left to right)
  const edgeSet = new Set<string>();
  const edges: KGEdge[] = [];

  function addEdge(from: number, to: number) {
    const key = `${from}-${to}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from, to });
    }
  }

  // Adjacent layer connections: each node connects to 1–2 in next layer
  for (let layer = 0; layer < 4; layer++) {
    const froms = layerBuckets[layer];
    const tos = [...layerBuckets[layer + 1]].sort(() => rng() - 0.5);
    for (const from of froms) {
      const n = 1 + Math.floor(rng() * 2);
      for (let k = 0; k < Math.min(n, tos.length); k++) {
        addEdge(from, tos[k]);
      }
    }
    // Ensure every to-node has at least one incoming edge
    for (const to of tos) {
      const hasIncoming = edges.some((e) => e.to === to);
      if (!hasIncoming) {
        addEdge(froms[Math.floor(rng() * froms.length)], to);
      }
    }
  }

  // Sparse skip-layer edges (2→4, 1→3, 0→2) — "latent knowledge shortcuts"
  const skipPairs: [number, number][] = [[0, 2], [1, 3], [2, 4]];
  for (const [fl, tl] of skipPairs) {
    if (rng() > 0.45) {
      addEdge(
        layerBuckets[fl][Math.floor(rng() * layerBuckets[fl].length)],
        layerBuckets[tl][Math.floor(rng() * layerBuckets[tl].length)]
      );
    }
  }

  const particleCount = isMobile ? 35 : 55;
  const particles: Particle[] = Array.from({ length: particleCount }, () => ({
    x: rng() * w, y: rng() * h,
    vx: (rng() - 0.5) * 0.12, vy: (rng() - 0.5) * 0.08,
    r: 1.5 + rng() * 3.5,
    opacity: 0.006 + rng() * 0.012,
  }));

  return { nodes, edges, pulses: [], particles };
}

// ─── Draw a single frame ───────────────────────────────

function drawFrame(
  ctx: CanvasRenderingContext2D,
  state: SimState,
  loopT: number,
  mouseX: number,
  mouseY: number,
  w: number,
  h: number,
  dpr: number,
  elapsed: number
) {
  const { nodes, edges, pulses, particles } = state;
  const { organizeBlend, edgeAlpha, labelAlpha, pulseAlpha, nodeGlow } = getPhaseBlends(loopT);

  const padX = 40;
  const colWidth = (w - padX * 2) / 5;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(mouseX * 0.006, mouseY * 0.005);

  // Background particles
  for (const p of particles) {
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(160,180,220,${p.opacity})`);
    g.addColorStop(1, `rgba(160,180,220,0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  // Edges — very faint directed lines
  if (edgeAlpha > 0.005) {
    for (const e of edges) {
      const na = nodes[e.from];
      const nb = nodes[e.to];
      const [cr, cg, cb] = LAYER_COLORS[na.layer];
      const opacity = edgeAlpha * 0.08;

      // Directional gradient: slightly brighter at source, fades toward target
      const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
      grad.addColorStop(0, `rgba(${cr},${cg},${cb},${opacity * 1.4})`);
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},${opacity * 0.4})`);

      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  // Pulses — knowledge flowing through the graph
  if (pulseAlpha > 0.005) {
    for (const pulse of pulses) {
      if (pulse.edgeIdx >= edges.length) continue;
      const e = edges[pulse.edgeIdx];
      const na = nodes[e.from];
      const nb = nodes[e.to];
      const [cr, cg, cb] = LAYER_COLORS[na.layer];

      const px = lerp(na.x, nb.x, pulse.t);
      const py = lerp(na.y, nb.y, pulse.t);
      const alpha = pulseAlpha * (0.6 + 0.4 * Math.sin(elapsed * 0.003 + pulse.edgeIdx));

      // Outer glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, 6);
      glow.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.35})`);
      glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Bright core dot
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,245,255,${alpha * 0.9})`;
      ctx.fill();
    }
  }

  // Nodes
  for (const node of nodes) {
    const [cr, cg, cb] = LAYER_COLORS[node.layer];
    const pulse = (Math.sin(elapsed * 0.0009 + node.id * 0.75) + 1) / 2;
    const nr = node.radius;
    const glowMul = 0.3 + nodeGlow * 0.7;
    const organizedBoost = 0.6 + organizeBlend * 0.4;

    // Layer 1: soft outer aura
    const auraR = (nr * 3.5 + 5);
    const g1 = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, auraR);
    g1.addColorStop(0, `rgba(${cr},${cg},${cb},${0.09 * glowMul * organizedBoost})`);
    g1.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(node.x, node.y, auraR, 0, Math.PI * 2);
    ctx.fillStyle = g1;
    ctx.fill();

    // Layer 2: mid glow
    const midR = nr * 1.9 + 2;
    const midA = (0.2 + pulse * 0.08 + nodeGlow * 0.15) * glowMul;
    const g2 = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, midR);
    g2.addColorStop(0, `rgba(${cr},${cg},${cb},${midA})`);
    g2.addColorStop(0.5, `rgba(${cr},${cg},${cb},${midA * 0.25})`);
    g2.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(node.x, node.y, midR, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();

    // Layer 3: bright inner core
    const innerR = nr * 0.85;
    const innerA = 0.5 + nodeGlow * 0.4 + pulse * 0.1;
    const g3 = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, innerR);
    g3.addColorStop(0, `rgba(225,240,255,${innerA})`);
    g3.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(node.x, node.y, innerR, 0, Math.PI * 2);
    ctx.fillStyle = g3;
    ctx.fill();

    // Layer 4: sharp center dot
    ctx.beginPath();
    ctx.arc(node.x, node.y, Math.max(0.8, nr * 0.32), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.88 + pulse * 0.12})`;
    ctx.fill();
  }

  // Column labels — appear during hold phase (desktop only)
  if (labelAlpha > 0.005 && w >= 560) {
    ctx.font = "600 12px 'Courier New', monospace";
    ctx.letterSpacing = "0.14em";
    ctx.textAlign = "center";
    for (let layer = 0; layer < 5; layer++) {
      const [cr, cg, cb] = LAYER_COLORS[layer];
      const cx = padX + (layer + 0.5) * colWidth;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},${labelAlpha * 0.7})`;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(245,248,255,${labelAlpha})`;
      ctx.fillText(LAYER_LABELS[layer], cx, 14);
    }
    ctx.shadowBlur = 0;
    ctx.letterSpacing = "0";
  }

  ctx.restore();
}

// ─── Component ─────────────────────────────────────────

export function KnowledgeGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    function setup() {
      if (!canvas) return;
      cancelAnimationFrame(rafId);

      const dpr = Math.min(devicePixelRatio, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const state = buildSimulation(w, h, makeRng(42));

      if (prefersReducedMotion) {
        // Static: organized with labels at hold phase
        for (const node of state.nodes) {
          node.x = node.targetX;
          node.y = node.targetY;
        }
        drawFrame(ctx, state, 10000, 0, 0, w, h, dpr, 10000);
        return;
      }

      const startTime = performance.now();
      let lastLoopT = -1;
      let pulseSpawnTimer = 0;

      function loop(now: number) {
        if (!ctx) return;
        const elapsed = now - startTime;
        const loopT = elapsed % LOOP_MS;

        // On loop wrap: reset to scatter
        if (lastLoopT > loopT) {
          for (const node of state.nodes) {
            node.x = node.scatterX;
            node.y = node.scatterY;
            node.vx = (Math.random() - 0.5) * 1.2;
            node.vy = (Math.random() - 0.5) * 1.2;
          }
          state.pulses.length = 0;
        }
        lastLoopT = loopT;

        const { organizeBlend, pulseAlpha } = getPhaseBlends(loopT);

        // Background particles
        for (const p of state.particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x += w + 20;
          if (p.x > w + 10) p.x -= w + 20;
          if (p.y < -10) p.y += h + 20;
          if (p.y > h + 10) p.y -= h + 20;
        }

        // Spring physics: pull toward lerp(scatter, target, organizeBlend)
        for (const node of state.nodes) {
          const restX = lerp(node.scatterX, node.targetX, organizeBlend);
          const restY = lerp(node.scatterY, node.targetY, organizeBlend);

          const fx = (restX - node.x) * 0.06;
          const fy = (restY - node.y) * 0.06;

          // Mild repulsion from nearby nodes
          let rx = 0, ry = 0;
          for (const other of state.nodes) {
            if (other.id === node.id) continue;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < 25 * 25 && dSq > 0.01) {
              const d = Math.sqrt(dSq);
              rx += (dx / d) * (0.25 / dSq);
              ry += (dy / d) * (0.25 / dSq);
            }
          }

          node.vx = (node.vx + fx + rx) * 0.84;
          node.vy = (node.vy + fy + ry) * 0.84;
          node.x += node.vx;
          node.y += node.vy;
        }

        // Advance pulses
        for (let i = state.pulses.length - 1; i >= 0; i--) {
          state.pulses[i].t += state.pulses[i].speed;
          if (state.pulses[i].t > 1.1) state.pulses.splice(i, 1);
        }

        // Spawn new pulses during hold phase
        if (pulseAlpha > 0.1 && state.edges.length > 0) {
          pulseSpawnTimer++;
          if (pulseSpawnTimer >= 18) {
            pulseSpawnTimer = 0;
            const edgeIdx = Math.floor(Math.random() * state.edges.length);
            // Prefer edges going left→right (from lower layer to higher)
            const e = state.edges[edgeIdx];
            if (state.nodes[e.from].layer < state.nodes[e.to].layer) {
              state.pulses.push({
                edgeIdx,
                t: 0,
                speed: 0.007 + Math.random() * 0.008,
              });
            }
          }
          // Cap active pulses
          if (state.pulses.length > 12) state.pulses.splice(0, 1);
        }

        drawFrame(ctx, state, loopT, mouseX, mouseY, w, h, dpr, elapsed);
        rafId = requestAnimationFrame(loop);
      }

      rafId = requestAnimationFrame(loop);
    }

    setup();

    const ro = new ResizeObserver(setup);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`w-full h-full ${className ?? ""}`}>
      <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
    </div>
  );
}
