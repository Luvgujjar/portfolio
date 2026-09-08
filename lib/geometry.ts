/**
 * A tiny 3D toolkit for the background scenes.
 *
 * The site only ever draws wireframes and points, so a full WebGL engine would
 * be far more weight than the visuals justify. These helpers give us just
 * enough — rotation, perspective projection, and a couple of parametric
 * shapes — to render everything onto a plain 2D canvas.
 */

export type Vec3 = { x: number; y: number; z: number };
export type Edge = [number, number];

export function rotate(p: Vec3, rx: number, ry: number, rz = 0): Vec3 {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);

  // X axis
  let y = p.y * cx - p.z * sx;
  let z = p.y * sx + p.z * cx;
  let x = p.x;

  // Y axis
  const x2 = x * cy + z * sy;
  z = -x * sy + z * cy;
  x = x2;

  // Z axis
  const x3 = x * cz - y * sz;
  y = x * sz + y * cz;
  x = x3;

  return { x, y, z };
}

export type Projected = { x: number; y: number; scale: number; z: number };

/**
 * Perspective projection. `depth` is the camera distance; points nearer the
 * camera get a larger scale, which callers reuse for size and opacity so the
 * wireframes read as genuinely three-dimensional.
 */
export function project(
  p: Vec3,
  cx: number,
  cy: number,
  fov: number,
  depth: number,
): Projected {
  const scale = fov / Math.max(fov + p.z + depth, 1);
  return { x: cx + p.x * scale, y: cy + p.y * scale, scale, z: p.z };
}

/** The 12 vertices and 30 edges of a regular icosahedron, radius-normalised. */
export function icosahedron(radius: number): { points: Vec3[]; edges: Edge[] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw: Vec3[] = [
    { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 },
    { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
    { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t },
    { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
    { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 },
    { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 },
  ];

  const norm = Math.hypot(1, t);
  const points = raw.map((p) => ({
    x: (p.x / norm) * radius,
    y: (p.y / norm) * radius,
    z: (p.z / norm) * radius,
  }));

  // Every edge of an icosahedron is the same length, so the shortest pairwise
  // distance identifies them all without hardcoding an index table.
  const dist = (a: Vec3, b: Vec3) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  let min = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      min = Math.min(min, dist(points[i], points[j]));
    }
  }
  const edges: Edge[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (dist(points[i], points[j]) < min * 1.05) edges.push([i, j]);
    }
  }

  return { points, edges };
}

/** A (p, q) torus knot sampled as a closed polyline. */
export function torusKnot(
  segments: number,
  radius: number,
  tube: number,
  p = 2,
  q = 3,
): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < segments; i++) {
    const u = (i / segments) * Math.PI * 2 * p;
    const r = radius * (2 + Math.cos((q * u) / p)) * 0.5;
    pts.push({
      x: r * Math.cos(u),
      y: r * Math.sin(u),
      z: tube * Math.sin((q * u) / p),
    });
  }
  return pts;
}

/** A flat lattice on the XZ plane, returned as a list of line segments. */
export function grid(size: number, divisions: number, y: number): Vec3[][] {
  const lines: Vec3[][] = [];
  const step = (size * 2) / divisions;
  for (let i = 0; i <= divisions; i++) {
    const v = -size + i * step;
    lines.push([{ x: v, y, z: -size }, { x: v, y, z: size }]);
    lines.push([{ x: -size, y, z: v }, { x: size, y, z: v }]);
  }
  return lines;
}

/** Deterministic pseudo-random so the point field is identical every render. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
