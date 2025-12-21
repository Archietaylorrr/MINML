import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
// Professional easing: quintic ease-in-out for ultra-smooth transitions
const smootherstep = (x: number) => { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };
// Cubic ease-out for natural deceleration
const easeOutCubic = (x: number) => { x = clamp01(x); return 1 - Math.pow(1 - x, 3); };
// Exponential ease-out for snappy initial movement
const easeOutExpo = (x: number) => { x = clamp01(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const hash2i = (x: number, y: number) => { let h = (Math.floor(x * 10) * 374761393) ^ (Math.floor(y * 10) * 668265263); h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967296; };
const seededRandom = (seed: number) => { let t = seed >>> 0; return () => { t += 0x6d2b79f5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
const fade = (t: number) => t * t * (3 - 2 * t);

const valueNoise2D = (width: number, height: number, cell: number, seed: number) => {
  const rand = seededRandom(seed);
  const gx = Math.ceil(width / cell) + 2;
  const gy = Math.ceil(height / cell) + 2;
  const grid = new Float32Array(gx * gy);
  for (let j = 0; j < gy; j++) for (let i = 0; i < gx; i++) grid[j * gx + i] = rand();
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    const j = Math.floor(y / cell); const fy = y / cell - j; const wy = fade(fy);
    for (let x = 0; x < width; x++) {
      const i = Math.floor(x / cell); const fx = x / cell - i; const wx = fade(fx);
      const v00 = grid[j * gx + i], v10 = grid[j * gx + (i + 1)], v01 = grid[(j + 1) * gx + i], v11 = grid[(j + 1) * gx + (i + 1)];
      const vx0 = v00 * (1 - wx) + v10 * wx; const vx1 = v01 * (1 - wx) + v11 * wx;
      out[y * width + x] = vx0 * (1 - wy) + vx1 * wy;
    }
  }
  return out;
};

const fbm = (width: number, height: number, seed: number) => {
  const octaves = [{ cell: 320, amp: 1.0, s: seed + 11 }, { cell: 180, amp: 0.7, s: seed + 23 }, { cell: 110, amp: 0.48, s: seed + 37 }, { cell: 70, amp: 0.3, s: seed + 51 }, { cell: 42, amp: 0.18, s: seed + 67 }, { cell: 26, amp: 0.1, s: seed + 83 }];
  const accum = new Float32Array(width * height);
  let ampSum = 0;
  for (const o of octaves) { const layer = valueNoise2D(width, height, o.cell, o.s); ampSum += o.amp; for (let k = 0; k < accum.length; k++) accum[k] += layer[k] * o.amp; }
  for (let k = 0; k < accum.length; k++) accum[k] /= ampSum;
  for (let k = 0; k < accum.length; k++) { let v = accum[k]; v = (v - 0.5) * 1.35 + 0.5; v = Math.max(0, Math.min(1, v)); v = v * v * (3 - 2 * v); accum[k] = v; }
  return accum;
};

interface ColorStop { t: number; c: [number, number, number]; }
const rampFromStops = (t: number, stops: ColorStop[]): [number, number, number] => {
  t = clamp01(t); let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) { if (t >= stops[i].t && t <= stops[i + 1].t) { a = stops[i]; b = stops[i + 1]; break; } }
  const u = (t - a.t) / Math.max(1e-9, b.t - a.t);
  const lerp = (x: number, y: number) => Math.round(x + (y - x) * u);
  return [lerp(a.c[0], b.c[0]), lerp(a.c[1], b.c[1]), lerp(a.c[2], b.c[2])];
};

// Data integration color ramp - refined cream/tan tones with subtle depth
const rampDem = (t: number) => rampFromStops(t, [
  { t: 0.0, c: [235, 230, 218] },  // warm cream base
  { t: 0.18, c: [218, 205, 182] }, // light tan
  { t: 0.38, c: [195, 172, 142] }, // medium tan
  { t: 0.58, c: [168, 142, 112] }, // warm brown
  { t: 0.78, c: [148, 120, 92] },  // darker brown
  { t: 1.0, c: [235, 230, 218] },  // back to cream
]);

// Deep learning heatmap - sophisticated teal to coral gradient
const rampHeat = (t: number) => rampFromStops(t, [
  { t: 0.0, c: [32, 45, 55] },     // deep slate base
  { t: 0.15, c: [40, 62, 72] },    // dark teal hint
  { t: 0.28, c: [58, 98, 102] },   // teal accent
  { t: 0.40, c: [78, 135, 125] },  // bright teal
  { t: 0.52, c: [115, 162, 148] }, // light teal
  { t: 0.62, c: [158, 178, 162] }, // teal-neutral
  { t: 0.72, c: [195, 175, 152] }, // warm neutral
  { t: 0.82, c: [208, 148, 105] }, // warm coral hint
  { t: 0.90, c: [198, 105, 62] },  // primary coral
  { t: 0.96, c: [212, 118, 72] },  // bright coral
  { t: 1.0, c: [225, 155, 115] },  // coral peak
]);

const makeDemColorDataURL = (width: number, height: number, field: Float32Array, seed: number) => {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!; const grain = valueNoise2D(width, height, 14, seed + 999);
  const img = ctx.createImageData(width, height); const d = img.data;
  for (let i = 0; i < field.length; i++) { let v = field[i] + (grain[i] - 0.5) * 0.06; v = Math.max(0, Math.min(1, v)); const [r, g, b] = rampDem(v); const idx = i * 4; d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255; }
  ctx.putImageData(img, 0, 0); return canvas.toDataURL('image/png');
};

const makeHillshadeDataURL = (width: number, height: number, field: Float32Array) => {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!; const img = ctx.createImageData(width, height); const d = img.data;
  const lx = -0.85, ly = -0.55, lz = 0.75; const L = Math.hypot(lx, ly, lz); const nlx = lx / L, nly = ly / L, nlz = lz / L;
  const scale = 2.7; const at = (x: number, y: number) => { x = Math.max(0, Math.min(width - 1, x)); y = Math.max(0, Math.min(height - 1, y)); return field[y * width + x]; };
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const dzdx = (at(x + 1, y) - at(x - 1, y)) * scale; const dzdy = (at(x, y + 1) - at(x, y - 1)) * scale;
    let nx = -dzdx, ny = -dzdy, nz = 1.0; const N = Math.hypot(nx, ny, nz); nx /= N; ny /= N; nz /= N;
    let shade = nx * nlx + ny * nly + nz * nlz; shade = Math.max(0, shade); shade = Math.pow(shade, 1.1);
    const g = Math.round((0.62 + shade * 0.32) * 255); const idx = (y * width + x) * 4; d[idx] = g; d[idx + 1] = g; d[idx + 2] = g; d[idx + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return canvas.toDataURL('image/png');
};

const hexPoints = (cx: number, cy: number, r: number): [number, number][] => { const pts: [number, number][] = []; for (let k = 0; k < 6; k++) { const ang = (Math.PI / 180) * (60 * k - 30); pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]); } return pts; };
const hexPointsString = (cx: number, cy: number, r: number) => hexPoints(cx, cy, r).map((p) => p.join(',')).join(' ');

const W = 1600, H = 900;
const FRAME = { x0: 80, y0: 70, x1: W - 80, y1: H - 70 };
const FRAME_W = FRAME.x1 - FRAME.x0, FRAME_H = FRAME.y1 - FRAME.y0;
const FIELD_W = 1300, FIELD_H = 730;
const DEM_SEED = 1337, HEAT_SEED = 4242;
const COUNTRIES_URL = 'https://unpkg.com/world-atlas@2/countries-110m.json';
const LAND_URL = 'https://unpkg.com/world-atlas@2/land-110m.json';
const SEARCH_WINDOW = { lon0: -126, lon1: -93, lat0: 24, lat1: 50 };
const CAND = { wDeg: 30, hDeg: 18, stepDeg: 2 };

export const PHASES = [
  { kicker: 'Data Integration', title: 'Global geological basemap', body: 'Coastlines, borders, and terrain establish the spatial foundation for analysis.' },
  { kicker: 'Data Integration', title: 'Raster data overlay', body: 'Geophysical datasets are integrated and clipped to land boundaries.' },
  { kicker: 'Feature Engineering', title: 'H3 hexagonal tiling', body: 'Coarse hex cells sample the data to create a discrete spatial feature grid.' },
  { kicker: 'Deep Learning', title: 'Region of interest', body: 'Target areas are identified for focused, higher-fidelity analysis.' },
  { kicker: 'Deep Learning', title: 'Zoom and enhance', body: 'The model focuses on promising regions with increased spatial resolution.' },
  { kicker: 'Deep Learning', title: 'Probability heatmap', body: 'Neural networks generate granular probability estimates across the region.' },
  { kicker: 'Predictions', title: 'Target identification', body: 'High-probability zones are merged into actionable exploration targets.' },
];

// Refined timing with gentle holds for professional pacing
const HOLD_START = 1.2, HOLD_END = 1.0;
const DURATIONS = [3.0, 2.8, 3.0, 2.8, 3.2, 3.4, 3.6];
const LOOP_SECONDS = DURATIONS.reduce((a, b) => a + b, 0) + HOLD_START + HOLD_END;

interface Rect { x: number; y: number; w: number; h: number; }
interface BBox { lon0: number; lat0: number; lon1: number; lat1: number; }

const fitRectToFrame = (srcRect: Rect, pad = 18) => { const fw = FRAME_W - 2 * pad, fh = FRAME_H - 2 * pad; const sx = srcRect.w > 0 ? fw / srcRect.w : 1, sy = srcRect.h > 0 ? fh / srcRect.h : 1; const s = Math.min(sx, sy); const srcCx = srcRect.x + srcRect.w / 2, srcCy = srcRect.y + srcRect.h / 2; const frameCx = (FRAME.x0 + FRAME.x1) / 2, frameCy = (FRAME.y0 + FRAME.y1) / 2; return { s, tx: frameCx - s * srcCx, ty: frameCy - s * srcCy }; };
const landDensityForBBox = (landFeature: any, bbox: BBox, samplesX = 11, samplesY = 7) => { let on = 0, tot = 0; for (let iy = 0; iy < samplesY; iy++) { const lat = bbox.lat0 + ((bbox.lat1 - bbox.lat0) * (iy + 0.5)) / samplesY; for (let ix = 0; ix < samplesX; ix++) { const lon = bbox.lon0 + ((bbox.lon1 - bbox.lon0) * (ix + 0.5)) / samplesX; tot++; if (d3.geoContains(landFeature, [lon, lat])) on++; } } return on / Math.max(1, tot); };
const pickLandDenseBBox = (landFeature: any): BBox => { let best: { bbox: BBox; totalScore: number } | null = null; for (let lon = SEARCH_WINDOW.lon0; lon <= SEARCH_WINDOW.lon1 - CAND.wDeg; lon += CAND.stepDeg) for (let lat = SEARCH_WINDOW.lat0; lat <= SEARCH_WINDOW.lat1 - CAND.hDeg; lat += CAND.stepDeg) { const bbox: BBox = { lon0: lon, lat0: lat, lon1: lon + CAND.wDeg, lat1: lat + CAND.hDeg }; const score = landDensityForBBox(landFeature, bbox); const cx = (bbox.lon0 + bbox.lon1) / 2, cy = (bbox.lat0 + bbox.lat1) / 2; const centerBias = 1 - 0.0025 * Math.abs(cx + 110) - 0.006 * Math.abs(cy - 38); const totalScore = score * Math.max(0.6, centerBias); if (!best || totalScore > best.totalScore) best = { bbox, totalScore }; } return best ? best.bbox : { lon0: -125, lat0: 28, lon1: -95, lat1: 46 }; };
const projectedRectFromLonLatBBox = (b: BBox, projection: d3.GeoProjection): Rect => { const p1 = projection([b.lon0, b.lat0])!, p2 = projection([b.lon1, b.lat0])!, p3 = projection([b.lon1, b.lat1])!, p4 = projection([b.lon0, b.lat1])!; const xs = [p1[0], p2[0], p3[0], p4[0]], ys = [p1[1], p2[1], p3[1], p4[1]]; return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
const edgeKey = (a: [number, number], b: [number, number]) => { const ax = a[0].toFixed(2), ay = a[1].toFixed(2), bx = b[0].toFixed(2), by = b[1].toFixed(2); return ax < bx || (ax === bx && ay <= by) ? `${ax},${ay}|${bx},${by}` : `${bx},${by}|${ax},${ay}`; };

interface HiHex { idx: number; r: number; c: number; cx: number; cy: number; value: number; fill: string; delay: number; verts: [number, number][]; }

const buildHotspotOutlines = (hotHexes: HiHex[]) => { const edgeCount = new Map<string, number>(); const edgeDir = new Map<string, [[number, number], [number, number]]>(); for (const h of hotHexes) { const v = h.verts; for (let i = 0; i < 6; i++) { const a = v[i], b = v[(i + 1) % 6]; const k = edgeKey(a, b); edgeCount.set(k, (edgeCount.get(k) || 0) + 1); if (!edgeDir.has(k)) edgeDir.set(k, [a, b]); } } const boundary: [[number, number], [number, number]][] = []; for (const [k, c] of edgeCount.entries()) if (c === 1) boundary.push(edgeDir.get(k)!); if (boundary.length === 0) return []; const pkey = (p: [number, number]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`; const outMap = new Map<string, [[number, number], [number, number]][]>(); for (const [a, b] of boundary) { const ka = pkey(a); if (!outMap.has(ka)) outMap.set(ka, []); outMap.get(ka)!.push([a, b]); } const used = new Set<string>(); const loops: [number, number][][] = []; const edgeId = (a: [number, number], b: [number, number]) => `${pkey(a)}>${pkey(b)}`; for (const [a0, b0] of boundary) { const eid0 = edgeId(a0, b0), eid0r = edgeId(b0, a0); if (used.has(eid0) || used.has(eid0r)) continue; const loop: [number, number][] = [a0]; let a = a0, b = b0; while (true) { used.add(edgeId(a, b)); loop.push(b); const kb = pkey(b); const candidates = (outMap.get(kb) || []).filter(([c, d]) => !used.has(edgeId(c, d)) && !used.has(edgeId(d, c))); if (candidates.length === 0) break; const prev = [b[0] - a[0], b[1] - a[1]]; const prevLen = Math.hypot(prev[0], prev[1]) || 1; let best = candidates[0], bestScore = -Infinity; for (const cand of candidates) { const dd = cand[1]; const vv = [dd[0] - b[0], dd[1] - b[1]]; const vLen = Math.hypot(vv[0], vv[1]) || 1; const dot = (prev[0] * vv[0] + prev[1] * vv[1]) / (prevLen * vLen); if (dot > bestScore) { bestScore = dot; best = cand; } } a = best[0]; b = best[1]; if (pkey(b) === pkey(loop[0])) { loop.push(loop[0]); break; } } if (loop.length >= 4) loops.push(loop); } return loops; };
const pathFromLoop = (loop: [number, number][]) => { if (loop.length === 0) return ''; let d = `M ${loop[0][0].toFixed(2)} ${loop[0][1].toFixed(2)}`; for (let i = 1; i < loop.length; i++) d += ` L ${loop[i][0].toFixed(2)} ${loop[i][1].toFixed(2)}`; return d + ' Z'; };
const stageFromTime = (loopT: number) => { let t = loopT; if (t < HOLD_START) return { stage: 0, phaseIndex: 0, phaseT: 0, loopProgress: t / LOOP_SECONDS }; t -= HOLD_START; let acc = 0; for (let i = 0; i < DURATIONS.length; i++) { const d = DURATIONS[i]; if (t < acc + d) { const u = (t - acc) / Math.max(1e-9, d); return { stage: i + u, phaseIndex: i, phaseT: u, loopProgress: loopT / LOOP_SECONDS }; } acc += d; } return { stage: 6, phaseIndex: 6, phaseT: 1, loopProgress: loopT / LOOP_SECONDS }; };

interface PipelineAnimationProps { onPhaseChange?: (phase: number, info: { kicker: string; title: string; body: string }) => void; onProgress?: (progress: number) => void; isPaused?: boolean; }

const PipelineAnimation: React.FC<PipelineAnimationProps> = ({ onPhaseChange, onProgress, isPaused = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const t0Ref = useRef<number>(performance.now());
  const pausedAtRef = useRef<number>(0);
  const lastPhaseIndexRef = useRef<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const d3ElementsRef = useRef<any>(null);

  const initializeVisualization = useCallback(async () => {
    if (!svgRef.current) return;
    try {
      const [world, landTopo] = await Promise.all([fetch(COUNTRIES_URL).then((r) => r.json()), fetch(LAND_URL).then((r) => r.json())]);
      const landFeature = topojson.feature(landTopo, (landTopo as any).objects.land);
      const borders = topojson.mesh(world, (world as any).objects.countries, (a: any, b: any) => a !== b);
      const projection = d3.geoNaturalEarth1().fitExtent([[FRAME.x0, FRAME.y0], [FRAME.x1, FRAME.y1]], { type: 'Sphere' });
      const path = d3.geoPath(projection);
      const graticule = d3.geoGraticule10();
      const demField = fbm(FIELD_W, FIELD_H, DEM_SEED);
      const heatBase = fbm(FIELD_W, FIELD_H, HEAT_SEED);
      const heatRemap = (v: number) => { const z = 1 / (1 + Math.exp(-(v - 0.62) * 8.0)); return clamp01(0.02 + 0.98 * z); };
      const heatField = new Float32Array(heatBase.length);
      for (let i = 0; i < heatField.length; i++) heatField[i] = heatRemap(heatBase[i]);
      const sampleFieldAtScreenXY = (field: Float32Array, x: number, y: number) => { const u = x / W, v = y / H; const fx = u * (FIELD_W - 1), fy = v * (FIELD_H - 1); const x0 = Math.floor(fx), y0 = Math.floor(fy); const x1 = Math.min(FIELD_W - 1, x0 + 1), y1 = Math.min(FIELD_H - 1, y0 + 1); const tx = fx - x0, ty = fy - y0; const i00 = field[y0 * FIELD_W + x0], i10 = field[y0 * FIELD_W + x1], i01 = field[y1 * FIELD_W + x0], i11 = field[y1 * FIELD_W + x1]; const a = i00 * (1 - tx) + i10 * tx, b = i01 * (1 - tx) + i11 * tx; return a * (1 - ty) + b * ty; };
      const sampleDemAtScreenXY = (x: number, y: number) => sampleFieldAtScreenXY(demField, x, y);
      const sampleHeatAtScreenXY = (x: number, y: number) => sampleFieldAtScreenXY(heatField, x, y);
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      const defs = svg.append('defs');
      defs.append('clipPath').attr('id', 'clip-frame').attr('clipPathUnits', 'userSpaceOnUse').append('rect').attr('x', FRAME.x0).attr('y', FRAME.y0).attr('width', FRAME_W).attr('height', FRAME_H);
      defs.append('clipPath').attr('id', 'clip-land').attr('clipPathUnits', 'userSpaceOnUse').append('path').attr('d', path(landFeature as any));
      const clipHex = defs.append('clipPath').attr('id', 'clip-hex-reveal').attr('clipPathUnits', 'userSpaceOnUse');
      const clipRect = clipHex.append('rect').attr('x', 0).attr('y', 0).attr('width', 0).attr('height', H);
      const clipHexHi = defs.append('clipPath').attr('id', 'clip-hex-hi-reveal').attr('clipPathUnits', 'userSpaceOnUse');
      const clipRectHi = clipHexHi.append('rect').attr('x', 0).attr('y', 0).attr('width', 0).attr('height', H);
      const gViewport = svg.append('g').attr('id', 'gViewport').attr('clip-path', 'url(#clip-frame)');
      const gBase = gViewport.append('g').attr('id', 'gBase');
      // Subtle grid lines - refined muted tones
      gBase.append('path').attr('d', path(graticule)).attr('fill', 'none').attr('stroke', 'hsl(200, 12%, 32%)').attr('stroke-width', 0.35).style('vector-effect', 'non-scaling-stroke').style('opacity', 0.7);
      // Coastlines - refined teal accent
      gBase.append('path').attr('d', path(landFeature as any)).attr('fill', 'none').attr('stroke', 'hsl(170, 30%, 42%)').attr('stroke-width', 0.9).style('vector-effect', 'non-scaling-stroke');
      // Borders - subtle separation
      gBase.append('path').attr('d', path(borders)).attr('fill', 'none').attr('stroke', 'hsl(200, 12%, 36%)').attr('stroke-width', 0.4).style('vector-effect', 'non-scaling-stroke').style('opacity', 0.8);
      const gDem = gViewport.append('g').attr('id', 'gDem').attr('clip-path', 'url(#clip-land)');
      const demURL = makeDemColorDataURL(FIELD_W, FIELD_H, demField, DEM_SEED);
      const shadeURL = makeHillshadeDataURL(FIELD_W, FIELD_H, demField);
      const demImg = gDem.append('image').attr('href', demURL).attr('x', 0).attr('y', 0).attr('width', W).attr('height', H).attr('preserveAspectRatio', 'none').style('opacity', 0);
      const shadeImg = gDem.append('image').attr('href', shadeURL).attr('x', 0).attr('y', 0).attr('width', W).attr('height', H).attr('preserveAspectRatio', 'none').style('opacity', 0).style('mix-blend-mode', 'multiply');
      const gHex = gViewport.append('g').attr('id', 'gHex').attr('clip-path', 'url(#clip-land)');
      const gHexReveal = gHex.append('g').attr('clip-path', 'url(#clip-hex-reveal)');
      const rCoarse = 7.2, dxC = Math.sqrt(3) * rCoarse, dyC = 1.5 * rCoarse;
      const coarseHexes: { cx: number; cy: number; fill: string; delay: number }[] = [];
      let rowC = 0;
      for (let y = -rCoarse; y <= H + rCoarse; y += dyC, rowC++) { const xOffset = rowC % 2 ? dxC / 2 : 0; for (let x = -rCoarse; x <= W + rCoarse; x += dxC) { const cx = x + xOffset, cy = y; const ll = projection.invert?.([cx, cy]); if (!ll) continue; if (d3.geoContains(landFeature as any, ll)) { const val = sampleDemAtScreenXY(cx, cy); const [rr, gg, bb] = rampDem(val); const jitter = hash2i(cx, cy); const sweep = clamp01(cx / W); coarseHexes.push({ cx, cy, fill: `rgb(${rr},${gg},${bb})`, delay: 0.55 * sweep + 0.45 * jitter }); } } }
      // Feature engineering hex grid - refined teal strokes with subtle fill
      const coarseSel = gHexReveal.selectAll('polygon.hex-cell').data(coarseHexes).enter().append('polygon').attr('points', (d) => hexPointsString(d.cx, d.cy, rCoarse)).attr('fill', (d) => d.fill).attr('stroke', 'hsl(170, 28%, 38%)').attr('stroke-width', 0.5).style('vector-effect', 'non-scaling-stroke').style('opacity', 0);
      const hexCoast = gViewport.append('path').attr('d', path(landFeature as any)).attr('fill', 'none').attr('stroke', 'hsl(170, 30%, 42%)').attr('stroke-width', 0.6).style('vector-effect', 'non-scaling-stroke').style('opacity', 0);
      const hexBorders = gViewport.append('path').attr('d', path(borders)).attr('fill', 'none').attr('stroke', 'hsl(200, 12%, 32%)').attr('stroke-width', 0.35).style('vector-effect', 'non-scaling-stroke').style('opacity', 0);
      const gOverlay = svg.append('g').attr('id', 'gOverlay');
      const SELECT_BBOX = pickLandDenseBBox(landFeature);
      const sel0 = projectedRectFromLonLatBBox(SELECT_BBOX, projection);
      // Selection rectangle - refined coral with subtle glow
      const selectGlow = gOverlay.append('rect').attr('x', sel0.x).attr('y', sel0.y).attr('width', sel0.w).attr('height', sel0.h).attr('fill', 'none').attr('stroke', 'hsl(16, 60%, 52%)').attr('stroke-width', 16).attr('stroke-opacity', 0.15).style('vector-effect', 'non-scaling-stroke').style('opacity', 0).style('filter', 'blur(4px)');
      const perimeterBase = 2 * (sel0.w + sel0.h);
      const selectRect = gOverlay.append('rect').attr('x', sel0.x).attr('y', sel0.y).attr('width', sel0.w).attr('height', sel0.h).attr('fill', 'hsl(16, 60%, 52%)').attr('fill-opacity', 0.06).attr('stroke', 'hsl(16, 60%, 52%)').attr('stroke-width', 2).attr('stroke-dasharray', perimeterBase).attr('stroke-dashoffset', perimeterBase).style('vector-effect', 'non-scaling-stroke').style('opacity', 0);
      svg.append('rect').attr('x', FRAME.x0).attr('y', FRAME.y0).attr('width', FRAME_W).attr('height', FRAME_H).attr('fill', 'none').attr('stroke', 'none');
      const zoomTarget = fitRectToFrame(sel0, 18);
      const gHexHi = gViewport.append('g').attr('id', 'gHexHi').attr('clip-path', 'url(#clip-land)');
      const gHexHiReveal = gHexHi.append('g').attr('clip-path', 'url(#clip-hex-hi-reveal)');
      const gHot = gViewport.append('g').attr('id', 'gHot').attr('clip-path', 'url(#clip-frame)');
      // Hotspot paths - refined coral with professional glow
      const hotFillPath = gHot.append('path').attr('fill', 'hsl(16, 60%, 52%)').attr('fill-opacity', 0.1).attr('stroke', 'none').style('opacity', 0);
      const hotOutlineGlow = gHot.append('path').attr('fill', 'none').attr('stroke', 'hsl(16, 55%, 50%)').attr('stroke-width', 18).attr('stroke-opacity', 0.18).style('vector-effect', 'non-scaling-stroke').attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').style('opacity', 0).style('filter', 'blur(6px)');
      const hotOutlinePath = gHot.append('path').attr('fill', 'none').attr('stroke', 'hsl(16, 60%, 52%)').attr('stroke-width', 3.5).style('vector-effect', 'non-scaling-stroke').attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').style('filter', 'drop-shadow(0 2px 12px hsla(16, 60%, 45%, 0.3))').style('opacity', 0);
      const rHi = 3.0, dxH = Math.sqrt(3) * rHi, dyH = 1.5 * rHi, padHi = 30;
      const hiBounds = { x0: sel0.x - padHi, y0: sel0.y - padHi, x1: sel0.x + sel0.w + padHi, y1: sel0.y + sel0.h + padHi };
      const hiHexes: HiHex[] = []; const indexByRC = new Map<string, number>(); let rIdx = 0;
      for (let y = hiBounds.y0 - rHi; y <= hiBounds.y1 + rHi; y += dyH, rIdx++) { const xOffset = rIdx % 2 ? dxH / 2 : 0; let cIdx = 0; for (let x = hiBounds.x0 - rHi; x <= hiBounds.x1 + rHi; x += dxH, cIdx++) { const cx = x + xOffset, cy = y; const ll = projection.invert?.([cx, cy]); if (!ll) continue; if (!d3.geoContains(landFeature as any, ll)) continue; const val = sampleHeatAtScreenXY(cx, cy); const [rr, gg, bb] = rampHeat(val); const sweep = clamp01((cx - hiBounds.x0) / Math.max(1, hiBounds.x1 - hiBounds.x0)); const jitter = hash2i(cx * 1.7, cy * 1.7); const idx = hiHexes.length; hiHexes.push({ idx, r: rIdx, c: cIdx, cx, cy, value: val, fill: `rgb(${rr},${gg},${bb})`, delay: 0.7 * sweep + 0.3 * jitter, verts: hexPoints(cx, cy, rHi) }); indexByRC.set(`${rIdx},${cIdx}`, idx); } }
      // Hi-res heatmap hexes - refined strokes
      const hiSel = gHexHiReveal.selectAll('polygon.hex-hi').data(hiHexes).enter().append('polygon').attr('points', (d) => d.verts.map((p) => p.join(',')).join(' ')).attr('fill', (d) => d.fill).attr('stroke', 'hsl(200, 15%, 28%)').attr('stroke-width', 0.4).style('vector-effect', 'non-scaling-stroke').style('opacity', 0);
      const HOT_Q = 0.92; const valuesSorted = hiHexes.map((d) => d.value).sort((a, b) => a - b); const HOT_THRESHOLD = valuesSorted[Math.floor(valuesSorted.length * HOT_Q)] ?? 0.8;
      const neighborCoords = (r: number, c: number): [number, number][] => { const odd = r % 2 === 1; return odd ? [[r, c + 1], [r, c - 1], [r - 1, c + 1], [r - 1, c], [r + 1, c + 1], [r + 1, c]] : [[r, c + 1], [r, c - 1], [r - 1, c], [r - 1, c - 1], [r + 1, c], [r + 1, c - 1]]; };
      const hotMask = new Array(hiHexes.length).fill(false); for (const h of hiHexes) if (h.value >= HOT_THRESHOLD) hotMask[h.idx] = true;
      const visited = new Array(hiHexes.length).fill(false); const clusters: number[][] = [];
      for (const h of hiHexes) { if (!hotMask[h.idx] || visited[h.idx]) continue; const q = [h.idx]; visited[h.idx] = true; const comp: number[] = []; while (q.length) { const id = q.pop()!; comp.push(id); const cur = hiHexes[id]; for (const [nr, nc] of neighborCoords(cur.r, cur.c)) { const nid = indexByRC.get(`${nr},${nc}`); if (nid === undefined) continue; if (!hotMask[nid] || visited[nid]) continue; visited[nid] = true; q.push(nid); } } if (comp.length >= 3) clusters.push(comp); }
      let outlinesD = '', fillsD = ''; for (const comp of clusters) { const hotHexesComp = comp.map((id) => hiHexes[id]); const loops = buildHotspotOutlines(hotHexesComp); for (const loop of loops) { const d = pathFromLoop(loop); outlinesD += d + ' '; fillsD += d + ' '; } }
      const dHot = outlinesD.trim(); hotOutlineGlow.attr('d', dHot); hotOutlinePath.attr('d', dHot); hotFillPath.attr('d', fillsD.trim());
      d3ElementsRef.current = { demImg, shadeImg, clipRect, coarseSel, hexCoast, hexBorders, selectRect, selectGlow, gViewport, clipRectHi, hiSel, hotOutlinePath, hotOutlineGlow, hotFillPath, sel0, perimeterBase, zoomTarget, hiBounds, HOT_THRESHOLD };
      setIsLoading(false);
      t0Ref.current = performance.now();
    } catch (err) { console.error(err); setError('Failed to load basemap data'); setIsLoading(false); }
  }, []);

  const applyStage = useCallback((stage: number) => {
    const els = d3ElementsRef.current; if (!els) return;
    const { demImg, shadeImg, clipRect, coarseSel, hexCoast, hexBorders, selectRect, selectGlow, gViewport, clipRectHi, hiSel, hotOutlinePath, hotOutlineGlow, hotFillPath, sel0, perimeterBase, zoomTarget, hiBounds, HOT_THRESHOLD } = els;
    
    // Use easeOutCubic for smoother, more professional transitions
    const demIn = easeOutCubic(stage / 1.0), demOut = easeOutCubic(clamp01((stage - 1.0) / 1.0)), demOpacity = demIn * (1 - demOut);
    const coarseIn = easeOutCubic(clamp01((stage - 1.0) / 1.0));
    const selIn = easeOutCubic(clamp01((stage - 2.0) / 1.0));
    const zoomIn = smootherstep(clamp01((stage - 3.0) / 1.0)); // Keep smootherstep for zoom
    const refineIn = easeOutCubic(clamp01((stage - 4.0) / 1.0));
    const hotIn = easeOutCubic(clamp01((stage - 5.0) / 1.0));
    
    demImg.style('opacity', demOpacity * 0.92); 
    shadeImg.style('opacity', demOpacity * 0.38);
    clipRect.attr('width', W * coarseIn); 
    const k = 8.0; // Slightly softer reveal curve
    const coarseAlpha = smootherstep(1 - refineIn);
    coarseSel.style('opacity', (d: any) => { const t = (coarseIn - d.delay) * k; return clamp01(1 / (1 + Math.exp(-t))) * coarseAlpha; });
    hexCoast.style('opacity', coarseIn * coarseAlpha * 0.9); 
    hexBorders.style('opacity', coarseIn * coarseAlpha * 0.7);
    selectRect.style('opacity', selIn); 
    selectGlow.style('opacity', selIn * 0.8);
    
    const targetRect = { x: FRAME.x0, y: FRAME.y0, w: FRAME_W, h: FRAME_H };
    const mx = mix(sel0.x, targetRect.x, zoomIn), my = mix(sel0.y, targetRect.y, zoomIn), mw = mix(sel0.w, targetRect.w, zoomIn), mh = mix(sel0.h, targetRect.h, zoomIn);
    selectRect.attr('x', mx).attr('y', my).attr('width', mw).attr('height', mh); 
    selectGlow.attr('x', mx).attr('y', my).attr('width', mw).attr('height', mh);
    selectRect.attr('stroke-dasharray', 2 * (mw + mh)).attr('stroke-dashoffset', stage < 3 ? perimeterBase * (1 - easeOutExpo(selIn)) : 0);
    gViewport.attr('transform', `translate(${mix(0, zoomTarget.tx, zoomIn)},${mix(0, zoomTarget.ty, zoomIn)}) scale(${mix(1, zoomTarget.s, zoomIn)})`);
    
    const sweepX = hiBounds.x0 + (hiBounds.x1 - hiBounds.x0) * refineIn; 
    clipRectHi.attr('x', hiBounds.x0).attr('y', 0).attr('width', Math.max(0, sweepX - hiBounds.x0)).attr('height', H);
    
    // Hot hexes get refined coral stroke, others fade gracefully
    hiSel.attr('stroke', (d: any) => d.value >= HOT_THRESHOLD ? 'hsl(16, 55%, 65%)' : 'hsl(200, 12%, 28%)')
         .attr('stroke-width', (d: any) => d.value >= HOT_THRESHOLD ? 0.8 : 0.35);
    hiSel.style('opacity', (d: any) => { 
      const t = (refineIn - d.delay) * 8.0; 
      const o = clamp01(1 / (1 + Math.exp(-t))); 
      if (hotIn <= 0.02) return o; 
      return o * (d.value >= HOT_THRESHOLD ? mix(1.0, 1.08, hotIn) : mix(1.0, 0.18, hotIn)); 
    });
    
    hotOutlinePath.style('opacity', hotIn); 
    hotOutlineGlow.style('opacity', hotIn * 0.9); 
    hotFillPath.style('opacity', hotIn * 0.7);
    const selFade = smootherstep(1 - hotIn * 0.85); 
    selectRect.style('opacity', selIn * selFade); 
    selectGlow.style('opacity', selIn * selFade * 0.75);
  }, []);

  useEffect(() => { if (isLoading || error || !d3ElementsRef.current) return; const render = (now: number) => { if (isPaused) { animationRef.current = requestAnimationFrame(render); return; } const elapsed = (now - t0Ref.current) / 1000; const loopT = elapsed % LOOP_SECONDS; const { stage, phaseIndex: newPhaseIndex, loopProgress: newLoopProgress } = stageFromTime(loopT); applyStage(stage); if (newPhaseIndex !== lastPhaseIndexRef.current) { lastPhaseIndexRef.current = newPhaseIndex; onPhaseChange?.(newPhaseIndex, PHASES[newPhaseIndex]); } onProgress?.(newLoopProgress); animationRef.current = requestAnimationFrame(render); }; animationRef.current = requestAnimationFrame(render); return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); }; }, [isLoading, error, isPaused, applyStage, onPhaseChange, onProgress]);
  useEffect(() => { if (isPaused) pausedAtRef.current = performance.now(); else if (pausedAtRef.current > 0) t0Ref.current += performance.now() - pausedAtRef.current; }, [isPaused]);
  useEffect(() => { initializeVisualization(); }, [initializeVisualization]);

  return (
    <div className="relative w-full h-full bg-surface-dark overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-dark">
          <div className="flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-surface-dark-foreground/20 border-t-primary/60 rounded-full animate-spin" />
            <div className="text-surface-dark-foreground/50 text-xs tracking-wide uppercase">Loading data</div>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-dark">
          <div className="text-destructive/80 text-sm">{error}</div>
        </div>
      )}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  );
};

export default PipelineAnimation;
