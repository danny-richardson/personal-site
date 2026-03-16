"use client";

import { useEffect, useRef } from "react";

// ─── Types ─────────────────────────────────────────────

interface CNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scatterX: number; // random rest position
  scatterY: number;
  targetX: number;  // cluster rest position
  targetY: number;
  clusterId: number;
  isCenter: boolean;
  radius: number;
}

interface CEdge {
  a: number;
  b: number;
}

interface Cluster {
  id: number;
  cx: number;
  cy: number;
  label: string;
  nodes: number[];
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
  nodes: CNode[];
  edges: CEdge[];
  clusters: Cluster[];
  particles: Particle[];
}

// ─── Constants ─────────────────────────────────────────

const PERSONA_LABELS = [
  "Color Maximalist",
  "Tech Enthusiast",
  "New Home Owner",
  "Budget Shopper",
  "DIY Creator",
  "Style Curator",
];

const LOOP_MS = 20000; // 20s total loop

// Per-cluster glow colors — all cool-toned, light, similar palette
const CLUSTER_COLORS: [number, number, number][] = [
  [100, 165, 255], // blue
  [80,  205, 215], // teal
  [160, 140, 255], // lavender
  [100, 215, 245], // sky
  [70,  220, 190], // mint
  [145, 160, 255], // periwinkle
];

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
// Timeline (20s loop):
//   0–1s    scatter  (blend = 0)
//   1–4s    converge (blend 0→1)  ← fast
//   4–13s   hold     (blend = 1, labels full)
//   13–18s  dissolve (blend 1→0, labels fade)
//   18–20s  scatter pause

function getPhaseBlends(t: number) {
  const convergeBlend =
    t < 1000  ? 0 :
    t < 4000  ? smoothstep((t - 1000) / 3000) :
    t < 13000 ? 1 :
    t < 18000 ? 1 - smoothstep((t - 13000) / 5000) :
    0;

  const labelAlpha =
    t < 3000  ? 0 :
    t < 5500  ? smoothstep((t - 3000) / 2500) :
    t < 12000 ? 1 :
    t < 16000 ? 1 - smoothstep((t - 12000) / 4000) :
    0;

  const nodeGlow =
    t < 2500  ? 0 :
    t < 5000  ? smoothstep((t - 2500) / 2500) :
    t < 12000 ? 1 :
    t < 16000 ? 1 - smoothstep((t - 12000) / 4000) :
    0;

  const edgeAlpha =
    t < 2000  ? 0 :
    t < 4500  ? smoothstep((t - 2000) / 2500) :
    t < 12000 ? 1 :
    t < 16000 ? 1 - smoothstep((t - 12000) / 4000) :
    0;

  return { convergeBlend, labelAlpha, nodeGlow, edgeAlpha };
}

// ─── Simulation builder ────────────────────────────────

function buildSimulation(w: number, h: number, rng: () => number): SimState {
  const isMobile = w < 768;
  const nodeCount = isMobile ? 36 : 54;
  const particleCount = isMobile ? 40 : 65;

  // 6 cluster centers in two staggered rows with jitter
  const rawCenters = [
    { x: w * 0.18, y: h * 0.30 },
    { x: w * 0.50, y: h * 0.22 },
    { x: w * 0.82, y: h * 0.30 },
    { x: w * 0.25, y: h * 0.72 },
    { x: w * 0.58, y: h * 0.78 },
    { x: w * 0.86, y: h * 0.68 },
  ];

  const jX = w * 0.06;
  const jY = h * 0.06;
  const centers = rawCenters.map((c) => ({
    x: Math.max(60, Math.min(w - 60, c.x + (rng() * 2 - 1) * jX)),
    y: Math.max(50, Math.min(h - 50, c.y + (rng() * 2 - 1) * jY)),
  }));

  // Assign nodes to clusters
  const clusterBuckets: number[][] = Array.from({ length: 6 }, () => []);
  const nodes: CNode[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const sx = rng() * w;
    const sy = rng() * h;

    let nearest = 0;
    let nearestD = Infinity;
    for (let c = 0; c < 6; c++) {
      const d = (sx - centers[c].x) ** 2 + (sy - centers[c].y) ** 2;
      if (d < nearestD) { nearestD = d; nearest = c; }
    }
    clusterBuckets[nearest].push(i);

    nodes.push({
      id: i,
      x: sx, y: sy,
      vx: (rng() - 0.5) * 1.2,
      vy: (rng() - 0.5) * 1.2,
      scatterX: sx, scatterY: sy,
      targetX: 0, targetY: 0,
      clusterId: nearest,
      isCenter: false,
      radius: 2.2 + rng() * 1.4,
    });
  }

  // Assign ring positions within each cluster
  const clusters: Cluster[] = [];
  for (let c = 0; c < 6; c++) {
    const members = clusterBuckets[c];
    const { x: cx, y: cy } = centers[c];

    members.forEach((ni, slot) => {
      const angle = (slot / members.length) * Math.PI * 2;
      const r = 18 + rng() * 26;
      nodes[ni].targetX = cx + Math.cos(angle) * r;
      nodes[ni].targetY = cy + Math.sin(angle) * r;
    });

    // Center node = member closest to cx/cy
    let centerId = members[0];
    let closestD = Infinity;
    for (const ni of members) {
      const d = (nodes[ni].scatterX - cx) ** 2 + (nodes[ni].scatterY - cy) ** 2;
      if (d < closestD) { closestD = d; centerId = ni; }
    }
    nodes[centerId].isCenter = true;
    nodes[centerId].targetX = cx;
    nodes[centerId].targetY = cy;
    nodes[centerId].radius = 3.8;

    clusters.push({ id: c, cx, cy, label: PERSONA_LABELS[c], nodes: members });
  }

  // Intra-cluster edges (nearby pairs within each cluster)
  const edges: CEdge[] = [];
  for (let c = 0; c < 6; c++) {
    const members = clusters[c].nodes;
    for (let ai = 0; ai < members.length; ai++) {
      for (let bi = ai + 1; bi < members.length; bi++) {
        const na = nodes[members[ai]];
        const nb = nodes[members[bi]];
        const d = Math.hypot(na.targetX - nb.targetX, na.targetY - nb.targetY);
        if (d < 52) {
          edges.push({ a: members[ai], b: members[bi] });
        }
      }
    }
  }

  const particles: Particle[] = Array.from({ length: particleCount }, () => ({
    x: rng() * w, y: rng() * h,
    vx: (rng() - 0.5) * 0.12, vy: (rng() - 0.5) * 0.08,
    r: 1.5 + rng() * 3.5,
    opacity: 0.006 + rng() * 0.012,
  }));

  return { nodes, edges, clusters, particles };
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
  const { nodes, edges, clusters, particles } = state;
  const { convergeBlend, labelAlpha, nodeGlow, edgeAlpha } = getPhaseBlends(loopT);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(mouseX * 0.006, mouseY * 0.005);

  // Background particles (very subtle depth)
  for (const p of particles) {
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(160,180,220,${p.opacity})`);
    g.addColorStop(1, `rgba(160,180,220,0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  // Edges — very faint
  if (edgeAlpha > 0.005) {
    for (const e of edges) {
      const na = nodes[e.a];
      const nb = nodes[e.b];
      const opacity = edgeAlpha * 0.09;

      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = `rgba(190,215,240,${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  // Nodes
  for (const node of nodes) {
    const [cr, cg, cb] = CLUSTER_COLORS[node.clusterId];
    const pulse = (Math.sin(elapsed * 0.0009 + node.id * 0.8) + 1) / 2;
    const nr = node.isCenter ? node.radius * 1.5 : node.radius;

    // Glow intensity ramps up when clustered
    const glowMul = 0.35 + nodeGlow * 0.65;
    const centerBoost = node.isCenter ? 1.5 : 1;

    // Layer 1: soft outer aura (cluster color)
    const auraR = (nr * 3.5 + 5) * centerBoost;
    const g1 = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, auraR);
    g1.addColorStop(0, `rgba(${cr},${cg},${cb},${0.08 * glowMul * centerBoost})`);
    g1.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(node.x, node.y, auraR, 0, Math.PI * 2);
    ctx.fillStyle = g1;
    ctx.fill();

    // Layer 2: mid glow (cluster color brighter)
    const midR = (nr * 1.8 + 2) * centerBoost;
    const midAlpha = (0.18 + pulse * 0.08 + nodeGlow * 0.14) * glowMul;
    const g2 = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, midR);
    g2.addColorStop(0, `rgba(${cr},${cg},${cb},${midAlpha * centerBoost})`);
    g2.addColorStop(0.5, `rgba(${cr},${cg},${cb},${midAlpha * 0.3})`);
    g2.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(node.x, node.y, midR, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();

    // Layer 3: bright inner core
    const innerR = nr * 0.85;
    const innerAlpha = 0.55 + nodeGlow * 0.35 + pulse * 0.1;
    const g3 = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, innerR);
    g3.addColorStop(0, `rgba(225,240,255,${innerAlpha})`);
    g3.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(node.x, node.y, innerR, 0, Math.PI * 2);
    ctx.fillStyle = g3;
    ctx.fill();

    // Layer 4: sharp white center dot
    ctx.beginPath();
    ctx.arc(node.x, node.y, Math.max(0.8, nr * 0.32), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.88 + pulse * 0.12})`;
    ctx.fill();
  }

  // Persona labels
  if (labelAlpha > 0.005) {
    ctx.font = "600 13px 'Courier New', monospace";
    ctx.letterSpacing = "0.12em";
    ctx.textAlign = "center";
    for (const cluster of clusters) {
      const alpha = labelAlpha;
      // Subtle text shadow / glow
      const [cr, cg, cb] = CLUSTER_COLORS[cluster.id];
      ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha * 0.6})`;
      ctx.shadowBlur = 8;
      ctx.fillStyle = `rgba(221,225,234,${alpha * 0.92})`;
      ctx.fillText(cluster.label.toUpperCase(), cluster.cx, cluster.cy - 52);
      ctx.shadowBlur = 0;
    }
    ctx.letterSpacing = "0";
  }

  ctx.restore();
}

// ─── Component ─────────────────────────────────────────

export function ClusterNetwork({ className }: { className?: string }) {
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

      const state = buildSimulation(w, h, makeRng(137));

      if (prefersReducedMotion) {
        // Static: nodes at cluster positions, hold phase
        for (const node of state.nodes) {
          node.x = node.targetX;
          node.y = node.targetY;
        }
        drawFrame(ctx, state, 10000, 0, 0, w, h, dpr, 10000);
        return;
      }

      const startTime = performance.now();
      let lastLoopT = -1;

      function loop(now: number) {
        if (!ctx) return;
        const elapsed = now - startTime;
        const loopT = elapsed % LOOP_MS;

        // On loop wrap: reset node positions to scatter
        if (lastLoopT > loopT) {
          for (const node of state.nodes) {
            node.x = node.scatterX;
            node.y = node.scatterY;
            node.vx = (Math.random() - 0.5) * 1.2;
            node.vy = (Math.random() - 0.5) * 1.2;
          }
        }
        lastLoopT = loopT;

        const { convergeBlend } = getPhaseBlends(loopT);

        // Update particles
        for (const p of state.particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x += w + 20;
          if (p.x > w + 10) p.x -= w + 20;
          if (p.y < -10) p.y += h + 20;
          if (p.y > h + 10) p.y -= h + 20;
        }

        // Spring physics: rest position interpolated between scatter and target
        for (const node of state.nodes) {
          const restX = lerp(node.scatterX, node.targetX, convergeBlend);
          const restY = lerp(node.scatterY, node.targetY, convergeBlend);

          // Spring toward rest
          const fx = (restX - node.x) * 0.06;
          const fy = (restY - node.y) * 0.06;

          // Gentle repulsion from neighbors
          let rx = 0, ry = 0;
          for (const other of state.nodes) {
            if (other.id === node.id) continue;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < 28 * 28 && dSq > 0.01) {
              const d = Math.sqrt(dSq);
              const f = 0.3 / dSq;
              rx += (dx / d) * f;
              ry += (dy / d) * f;
            }
          }

          node.vx = (node.vx + fx + rx) * 0.85;
          node.vy = (node.vy + fy + ry) * 0.85;
          node.x += node.vx;
          node.y += node.vy;
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
