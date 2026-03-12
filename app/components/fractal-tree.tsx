"use client";

import { useEffect, useRef } from "react";

// ─── Types ─────────────────────────────────────────────

interface Branch {
  x1: number;
  y1: number;
  cpx: number; // bezier control point
  cpy: number;
  x2: number;
  y2: number;
  depth: number;
  maxDepth: number;
  drawStart: number;
  drawDuration: number;
  thickness: number;
  lineOpacity: number;
  nodeRadius: number;     // base radius, varies per node
  colorShift: number;     // 0=blue, 1=white — random per branch
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

interface Firefly {
  x: number;
  y: number;
  vx: number;       // base horizontal drift (wind)
  vy: number;       // base upward drift
  r: number;        // glow radius
  life: number;     // 0–1 current life
  lifeSpeed: number;// how fast life changes per frame
  phase: number;    // oscillation phase offset (unique per fly)
  oscAmp: number;   // oscillation amplitude
  oscFreq: number;  // oscillation frequency
  fading: boolean;  // true = fading out
}

// ─── Math helpers ──────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Trim a quadratic bezier to [0, t] — returns new endpoint and control point */
function trimBezier(
  x1: number, y1: number,
  cpx: number, cpy: number,
  x2: number, y2: number,
  t: number
): { endX: number; endY: number; ctrlX: number; ctrlY: number } {
  const mx1 = lerp(x1, cpx, t);
  const my1 = lerp(y1, cpy, t);
  const mx2 = lerp(cpx, x2, t);
  const my2 = lerp(cpy, y2, t);
  return {
    endX: lerp(mx1, mx2, t),
    endY: lerp(my1, my2, t),
    ctrlX: mx1,
    ctrlY: my1,
  };
}

// ─── Seeded PRNG ───────────────────────────────────────

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Tree construction ─────────────────────────────────

function buildTree(
  branches: Branch[],
  x: number, y: number,
  angle: number, length: number,
  depth: number, maxDepth: number,
  drawStart: number, drawDuration: number,
  rng: () => number
): void {
  if (depth === 0) return;

  const x2 = x + Math.cos(angle) * length;
  const y2 = y - Math.sin(angle) * length;

  // Organic control point — offset perpendicular to branch direction
  const midX = (x + x2) / 2;
  const midY = (y + y2) / 2;
  const perpX = -(y2 - y) / length;
  const perpY = (x2 - x) / length;
  const curvature = (rng() * 0.04 - 0.02) * length; // nearly straight; organic feel via angle/length variation
  const cpx = midX + perpX * curvature;
  const cpy = midY + perpY * curvature;

  // Thickness tapers from trunk → tips
  const thicknessFrac = depth / maxDepth;
  const thickness = Math.max(0.5, thicknessFrac * 2.2 + (rng() * 0.3 - 0.15));

  // Line opacity increases toward trunk
  const lineOpacity = Math.min(0.7, 0.15 + thicknessFrac * 0.55);

  // Node size: larger near trunk, small at tips, with per-node variation
  const nodeRadius = Math.max(1.8, (thicknessFrac * 5.5) + (rng() * 1.2 - 0.6));

  branches.push({
    x1: x, y1: y,
    cpx, cpy,
    x2, y2,
    depth, maxDepth,
    drawStart, drawDuration,
    thickness,
    lineOpacity,
    nodeRadius,
    colorShift: rng(),
  });

  // Independent random spread + length — asymmetric angles prevent mirroring
  // Moderate spread so accumulation over 8 levels never points branches downward
  const leftSpread  = (Math.PI / 180) * (40 + rng() * 10); // 15–25°
  const rightSpread = (Math.PI / 180) * (25 + rng() * 10); // independently random
  const leftLen  = 0.70 + rng() * 0.12; // 0.70–0.82
  const rightLen = 0.70 + rng() * 0.12; // independently random
  const nextDuration = drawDuration * 0.78;
  const nextStart = drawStart + drawDuration;

  buildTree(branches, x2, y2, angle + leftSpread,  length * leftLen,  depth - 1, maxDepth, nextStart, nextDuration, rng);
  buildTree(branches, x2, y2, angle - rightSpread, length * rightLen, depth - 1, maxDepth, nextStart, nextDuration, rng);
}

// ─── Node glow colors ──────────────────────────────────

/** Mix between cool blue and pure white based on colorShift (0–1) */
function nodeColors(colorShift: number, pulse: number) {
  // outer aura: deep blue
  const auraR = Math.round(lerp(40, 80, colorShift));
  const auraG = Math.round(lerp(100, 160, colorShift));
  const auraB = Math.round(lerp(220, 255, colorShift));

  // inner glow: light blue → white
  const glowR = Math.round(lerp(140, 210, colorShift));
  const glowG = Math.round(lerp(200, 230, colorShift));
  const glowB = 255;

  // pulse brightens the inner
  const brightMul = 0.8 + pulse * 0.2;

  return {
    aura: `${auraR},${auraG},${auraB}`,
    glow: `${Math.round(glowR * brightMul)},${Math.round(glowG * brightMul)},${glowB}`,
  };
}

// ─── Firefly helpers ───────────────────────────────────

function spawnFirefly(w: number, h: number): Firefly {
  // Spawn in the lower 65% of the canvas where the tree lives
  return {
    x: Math.random() * w,
    y: h * 0.35 + Math.random() * h * 0.65,
    vx: (Math.random() - 0.4) * 0.4,  // slight rightward bias like wind
    vy: -(0.3 + Math.random() * 0.5),  // drift upward
    r: 1.5 + Math.random() * 2.5,
    life: 0,
    lifeSpeed: 0.004 + Math.random() * 0.006,
    phase: Math.random() * Math.PI * 2,
    oscAmp: 0.4 + Math.random() * 1.2,  // how much it sways left/right
    oscFreq: 0.5 + Math.random() * 1.5,
    fading: false,
  };
}

function updateFireflies(flies: Firefly[], w: number, h: number, elapsed: number) {
  for (let i = flies.length - 1; i >= 0; i--) {
    const f = flies[i];

    // Wind sway oscillation perpendicular to drift
    const sway = Math.sin(elapsed * 0.001 * f.oscFreq + f.phase) * f.oscAmp;
    f.x += f.vx + sway * 0.05;
    f.y += f.vy;

    // Life cycle: fade in until 0.6, then start fading out
    if (!f.fading) {
      f.life += f.lifeSpeed;
      if (f.life >= 0.6 + Math.random() * 0.3) f.fading = true;
    } else {
      f.life -= f.lifeSpeed * 0.8;
    }

    // Remove when fully faded or drifted off-screen
    if (f.life <= 0 || f.y < -20 || f.x < -20 || f.x > w + 20) {
      flies.splice(i, 1);
    }
  }
}

// ─── Draw a single frame ───────────────────────────────

function drawFrame(
  ctx: CanvasRenderingContext2D,
  branches: Branch[],
  particles: Particle[],
  fireflies: Firefly[],
  elapsed: number,
  totalDuration: number,
  mouseX: number,
  mouseY: number,
  canvasW: number,
  canvasH: number,
  dpr: number,
  rootX: number,
  rootY: number
) {
  const postGrowth = elapsed > totalDuration;
  const glowFade = postGrowth ? Math.min(1, (elapsed - totalDuration) / 2000) : 0;

  // Reset transform, clear
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvasW, canvasH);

  // Apply parallax
  ctx.save();
  ctx.translate(mouseX * 0.012, mouseY * 0.008);

  // ── Particle field (background atmosphere) ──────────
  for (const p of particles) {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grad.addColorStop(0, `rgba(160,180,220,${p.opacity})`);
    grad.addColorStop(1, `rgba(160,180,220,0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ── Fireflies — blue glowing drifting embers ────────
  for (const f of fireflies) {
    const alpha = f.life;
    const pulse = (Math.sin(elapsed * 0.003 * f.oscFreq + f.phase) + 1) / 2;

    // Outer soft aura
    const auraR = f.r * 4;
    const ga = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, auraR);
    ga.addColorStop(0, `rgba(74,143,255,${alpha * (0.12 + pulse * 0.08)})`);
    ga.addColorStop(1, `rgba(74,143,255,0)`);
    ctx.beginPath(); ctx.arc(f.x, f.y, auraR, 0, Math.PI * 2);
    ctx.fillStyle = ga; ctx.fill();

    // Inner glow
    const gb = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.6);
    gb.addColorStop(0, `rgba(160,210,255,${alpha * (0.55 + pulse * 0.2)})`);
    gb.addColorStop(1, `rgba(74,143,255,0)`);
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = gb; ctx.fill();

    // Bright center dot
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,240,255,${alpha * (0.85 + pulse * 0.15)})`;
    ctx.fill();
  }

  // ── Root seed glow (always visible, fades in from start) ──
  const rootFade = Math.min(1, elapsed / 600);
  if (rootFade > 0) {
    const pulseRoot = postGrowth ? (Math.sin(elapsed * 0.0007) + 1) / 2 : 1;
    const rootGlowR = Math.round(lerp(30, 50, glowFade));

    const g1 = ctx.createRadialGradient(rootX, rootY, 0, rootX, rootY, 40 * rootFade);
    g1.addColorStop(0, `rgba(74,143,255,${0.18 * rootFade * (0.8 + pulseRoot * 0.2)})`);
    g1.addColorStop(1, `rgba(74,143,255,0)`);
    ctx.beginPath(); ctx.arc(rootX, rootY, 40 * rootFade, 0, Math.PI * 2);
    ctx.fillStyle = g1; ctx.fill();

    const g2 = ctx.createRadialGradient(rootX, rootY, 0, rootX, rootY, 14 * rootFade);
    g2.addColorStop(0, `rgba(180,220,255,${0.55 * rootFade})`);
    g2.addColorStop(1, `rgba(180,220,255,0)`);
    ctx.beginPath(); ctx.arc(rootX, rootY, 14 * rootFade, 0, Math.PI * 2);
    ctx.fillStyle = g2; ctx.fill();

    // center dot
    ctx.beginPath(); ctx.arc(rootX, rootY, 2.5 * rootFade, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240,250,255,${0.95 * rootFade})`;
    ctx.fill();

    // suppress unused var warning
    void rootGlowR;
  }

  // ── Branches ──────────────────────────────────────────
  for (const b of branches) {
    if (elapsed < b.drawStart) continue;

    const rawT = (elapsed - b.drawStart) / b.drawDuration;
    const t = smoothstep(Math.min(1, rawT));
    const fullyDrawn = rawT >= 1;

    // Sway offset post-growth
    let x2eff = b.x2;
    const y2eff = b.y2;
    let cpxEff = b.cpx;
    const cpyEff = b.cpy;
    if (postGrowth) {
      const phase = b.x1 * 0.005 + b.y1 * 0.003;
      const tipSway = Math.sin(elapsed * 0.0006 + phase) * (b.maxDepth - b.depth + 1) * 0.5;
      x2eff = b.x2 + tipSway;
      cpxEff = b.cpx + tipSway * 0.5;
    }

    // Compute rendered endpoint (full or partial bezier)
    let drawEndX: number, drawEndY: number, drawCtrlX: number, drawCtrlY: number;
    if (t >= 1) {
      drawEndX = x2eff; drawEndY = y2eff; drawCtrlX = cpxEff; drawCtrlY = cpyEff;
    } else {
      const trimmed = trimBezier(b.x1, b.y1, cpxEff, cpyEff, x2eff, y2eff, t);
      drawEndX = trimmed.endX; drawEndY = trimmed.endY;
      drawCtrlX = trimmed.ctrlX; drawCtrlY = trimmed.ctrlY;
    }

    // Branch glow (wider translucent line behind main)
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.quadraticCurveTo(drawCtrlX, drawCtrlY, drawEndX, drawEndY);
    ctx.strokeStyle = `rgba(150,190,255,${b.lineOpacity * 0.25})`;
    ctx.lineWidth = b.thickness * 2.8;
    ctx.lineCap = "round";
    ctx.stroke();

    // Main branch line
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.quadraticCurveTo(drawCtrlX, drawCtrlY, drawEndX, drawEndY);
    ctx.strokeStyle = `rgba(190,215,240,${b.lineOpacity})`;
    ctx.lineWidth = b.thickness;
    ctx.lineCap = "round";
    ctx.stroke();

    // ── Node glow at endpoint ───────────────────────
    // Node fades in as branch completes (last 30% of draw)
    const nodeFade = Math.min(1, Math.max(0, (rawT - 0.7) / 0.3));
    if (nodeFade <= 0) continue;

    const spatialPhase = b.x2 * 0.006 + b.y2 * 0.004;
    const pulse = fullyDrawn && postGrowth
      ? (Math.sin(elapsed * 0.0009 + spatialPhase) + 1) / 2
      : 0;

    const colors = nodeColors(b.colorShift, pulse);
    const nr = b.nodeRadius;

    // Extra glow boost post-growth
    const glowBoost = 1 + glowFade * pulse * 0.5;

    // Layer 1: wide outer aura
    const auraR = (nr * 4 + 6) * glowBoost;
    const g1 = ctx.createRadialGradient(drawEndX, drawEndY, 0, drawEndX, drawEndY, auraR);
    g1.addColorStop(0, `rgba(${colors.aura},${(0.06 + glowFade * 0.05) * nodeFade * glowBoost})`);
    g1.addColorStop(1, `rgba(${colors.aura},0)`);
    ctx.beginPath(); ctx.arc(drawEndX, drawEndY, auraR, 0, Math.PI * 2);
    ctx.fillStyle = g1; ctx.fill();

    // Layer 2: mid glow
    const midR = (nr * 2 + 2) * glowBoost;
    const g2 = ctx.createRadialGradient(drawEndX, drawEndY, 0, drawEndX, drawEndY, midR);
    g2.addColorStop(0, `rgba(${colors.glow},${(0.22 + glowFade * 0.12 + pulse * 0.08) * nodeFade})`);
    g2.addColorStop(0.5, `rgba(${colors.glow},${0.08 * nodeFade})`);
    g2.addColorStop(1, `rgba(${colors.glow},0)`);
    ctx.beginPath(); ctx.arc(drawEndX, drawEndY, midR, 0, Math.PI * 2);
    ctx.fillStyle = g2; ctx.fill();

    // Layer 3: bright inner
    const innerR = nr * 0.9;
    const g3 = ctx.createRadialGradient(drawEndX, drawEndY, 0, drawEndX, drawEndY, innerR);
    g3.addColorStop(0, `rgba(230,245,255,${(0.7 + pulse * 0.2) * nodeFade})`);
    g3.addColorStop(1, `rgba(200,230,255,0)`);
    ctx.beginPath(); ctx.arc(drawEndX, drawEndY, innerR, 0, Math.PI * 2);
    ctx.fillStyle = g3; ctx.fill();

    // Layer 4: sharp center dot — varies in shape slightly
    const dotR = Math.max(0.9, nr * 0.35);
    ctx.beginPath();
    ctx.arc(drawEndX, drawEndY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${(0.92 + pulse * 0.08) * nodeFade})`;
    ctx.fill();
  }

  ctx.restore();
}

// ─── Component ─────────────────────────────────────────

export function FractalTree({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    function setup() {
      if (!canvas) return;
      cancelAnimationFrame(rafId);

      const dpr = Math.min(devicePixelRatio, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const isMobile = w < 768;
      const depth = isMobile ? 6 : 8;
      const trunkLen = h * 0.13;
      const rootX = w / 2;
      const rootY = h;

      const rng = makeRng(137);
      const branches: Branch[] = [];
      buildTree(branches, rootX, rootY, Math.PI / 2, trunkLen, depth, depth, 0, 800, rng);

      const totalDuration = branches.reduce(
        (max, b) => Math.max(max, b.drawStart + b.drawDuration),
        0
      );

      // Flowing particle field — blurry soft blobs
      const particleCount = isMobile ? 120 : 200;
      const particles: Particle[] = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        r: 2 + Math.random() * 4.5, // larger = more blurry/out-of-focus
        opacity: 0.012 + Math.random() * 0.022,
      }));

      // Fireflies — seed a few at start, then trickle in over time
      const maxFireflies = isMobile ? 18 : 35;
      const fireflies: Firefly[] = Array.from({ length: 8 }, () => {
        const f = spawnFirefly(w, h);
        f.life = Math.random() * 0.5; // pre-seed at random life stages
        return f;
      });

      if (prefersReducedMotion) {
        drawFrame(ctx, branches, particles, fireflies, totalDuration + 3000, totalDuration, 0, 0, w, h, dpr, rootX, rootY);
        return;
      }

      const startTime = performance.now();

      function loop(now: number) {
        if (!ctx) return;
        const elapsed = now - startTime;

        // Update background particles
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x += w + 20;
          if (p.x > w + 10) p.x -= w + 20;
          if (p.y < -10) p.y += h + 20;
          if (p.y > h + 10) p.y -= h + 20;
        }

        // Update fireflies and trickle-spawn new ones
        updateFireflies(fireflies, w, h, elapsed);
        if (fireflies.length < maxFireflies && Math.random() < 0.04) {
          fireflies.push(spawnFirefly(w, h));
        }

        drawFrame(ctx, branches, particles, fireflies, elapsed, totalDuration, mouseX, mouseY, w, h, dpr, rootX, rootY);
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
    <div
      aria-hidden="true"
      className={`absolute inset-0 ${className ?? ""}`}
      style={{ touchAction: "pan-y" }}
    >
      <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
    </div>
  );
}
