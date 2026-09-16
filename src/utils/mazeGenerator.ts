import { LevelConfig, MazeVariantType, MazeVariantInfo, Position, Collectible, Decoration, ShiftingGate } from '../types';

export const MAZE_VARIANTS: MazeVariantInfo[] = [
  {
    id: 'classic_madinatul',
    name: 'Labirin Klasik Madinatul Qura',
    badge: 'Sesuai Gambar 🎨',
    description: 'Bantu Zafran dan kucing kesayangannya menyusuri rute pohon rindang menuju gerbang masjid utama.',
    width: 13,
    height: 13,
    difficulty: 'Mudah'
  },
  {
    id: 'shifting_magic',
    name: 'Labirin Ajaib Berubah-Ubah',
    badge: 'Dinding Bergerak ⚡',
    description: 'Pintu gerbang labirin berpindah secara berkala! Perhatikan waktu gerbang sebelum tertutup.',
    width: 13,
    height: 13,
    difficulty: 'Spesial',
    hasShiftingWalls: true
  },
  {
    id: 'taman_kurma',
    name: 'Kebun Kurma & Bunga Melati',
    badge: 'Banyak Makanan Kucing 🐟',
    description: 'Petik kurma ajwa dan temukan ikan lezat untuk si meong di antara pohon palem hijau.',
    width: 11,
    height: 11,
    difficulty: 'Sedang'
  },
  {
    id: 'senja_maghrib',
    name: 'Menjelang Maghrib Berbintang',
    badge: 'Lentera Fanous 🏮',
    description: 'Suasana senja indah dengan lentera bercahaya dan jalanan labirin yang lebih menantang.',
    width: 15,
    height: 15,
    difficulty: 'Tantangan'
  },
  {
    id: 'random_easy',
    name: 'Labirin Ceria (Acak 9x9)',
    badge: 'Cepat & Seru 🐾',
    description: 'Variasi labirin baru yang selalu berbeda tiap ronde, ukuran pas untuk santai.',
    width: 9,
    height: 9,
    difficulty: 'Mudah'
  },
  {
    id: 'random_medium',
    name: 'Petualang Hebat (Acak 13x13)',
    badge: 'Eksplorasi 🧭',
    description: 'Variasi labirin acak berliku dengan banyak tikungan cerdik.',
    width: 13,
    height: 13,
    difficulty: 'Sedang'
  },
  {
    id: 'random_hard',
    name: 'Penjelajah Akbar (Acak 17x17)',
    badge: 'Tantangan Master 🏆',
    description: 'Labirin luas penuh teka-teki jalan untuk menguji ketangkasan Zafran & Kucing!',
    width: 17,
    height: 17,
    difficulty: 'Tantangan'
  }
];

/**
 * Procedural Maze Generation using Randomized Depth-First Search with backtracking.
 * Generates an odd-dimensioned grid where true = wall, false = open path.
 */
export function generateProceduralMaze(width: number, height: number): boolean[][] {
  // Ensure odd dimensions
  const w = width % 2 === 0 ? width + 1 : width;
  const h = height % 2 === 0 ? height + 1 : height;

  // Initialize with all walls (true)
  const grid: boolean[][] = Array.from({ length: h }, () => Array(w).fill(true));

  // Helper to check valid cell
  const isInside = (x: number, y: number) => x > 0 && x < w - 1 && y > 0 && y < h - 1;

  // DFS stack
  const stack: [number, number][] = [];
  const startX = 1;
  const startY = 1;

  grid[startY][startX] = false;
  stack.push([startX, startY]);

  const directions = [
    [0, -2], // UP
    [0, 2],  // DOWN
    [-2, 0], // LEFT
    [2, 0]   // RIGHT
  ];

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];

    // Find unvisited neighbors at step 2
    const neighbors: [number, number, number, number][] = [];
    for (const [dx, dy] of directions) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (isInside(nx, ny) && grid[ny][nx]) {
        neighbors.push([nx, ny, cx + dx / 2, cy + dy / 2]);
      }
    }

    if (neighbors.length > 0) {
      // Pick random neighbor
      const [nx, ny, wallX, wallY] = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[wallY][wallX] = false;
      grid[ny][nx] = false;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  // Create subtle loops so the maze has exciting alternative branches
  const extraOpenings = Math.floor((w * h) / 35);
  for (let i = 0; i < extraOpenings; i++) {
    const rx = 1 + Math.floor(Math.random() * (w - 2));
    const ry = 1 + Math.floor(Math.random() * (h - 2));
    if (grid[ry][rx]) {
      // Check if opening this connects two paths
      const horizontal = !grid[ry][rx - 1] && !grid[ry][rx + 1];
      const vertical = !grid[ry - 1][rx] && !grid[ry + 1][rx];
      if (horizontal || vertical) {
        grid[ry][rx] = false;
      }
    }
  }

  // Ensure entrance (top-left) and exit (bottom-right)
  grid[1][0] = false; // Left entrance
  grid[h - 2][w - 1] = false; // Right exit

  return grid;
}

/**
 * Solve shortest path using Breadth-First Search (BFS).
 * Used for cat companion hint navigation!
 */
export function findShortestPath(
  grid: boolean[][],
  start: Position,
  goal: Position,
  shiftingGates?: ShiftingGate[]
): Position[] {
  const h = grid.length;
  const w = grid[0].length;

  const queue: Position[] = [start];
  const visited: boolean[][] = Array.from({ length: h }, () => Array(w).fill(false));
  const parent: Map<string, Position> = new Map();

  visited[start.y][start.x] = true;

  const getKey = (p: Position) => `${p.x},${p.y}`;

  const closedGatesSet = new Set<string>();
  if (shiftingGates) {
    for (const g of shiftingGates) {
      if (!g.isOpen) {
        closedGatesSet.add(`${g.x},${g.y}`);
      }
    }
  }

  const dirs = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  let found = false;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr.x === goal.x && curr.y === goal.y) {
      found = true;
      break;
    }

    for (const d of dirs) {
      const nx = curr.x + d.x;
      const ny = curr.y + d.y;

      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        // Must not be wall, not visited, and not a closed shifting gate
        if (!grid[ny][nx] && !visited[ny][nx] && !closedGatesSet.has(`${nx},${ny}`)) {
          visited[ny][nx] = true;
          parent.set(getKey({ x: nx, y: ny }), curr);
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }

  if (!found) return [];

  // Reconstruct path
  const path: Position[] = [];
  let curr: Position | undefined = goal;
  while (curr && (curr.x !== start.x || curr.y !== start.y)) {
    path.push(curr);
    curr = parent.get(getKey(curr));
  }
  path.reverse();
  return path;
}

/**
 * Classic Madinatul Qura Preset (13x13)
 * Crafted to mirror the uploaded labirin.jpg layout with trees and mosque entrance!
 */
export function getClassicMadinatulLevel(): LevelConfig {
  const w = 13;
  const h = 13;
  // 1 = wall, 0 = path
  const ascii = [
    "1011111111111", // y=0: entrance at (1,0)
    "1000000100001", // y=1: path goes right & down
    "1110110101101", // y=2
    "1000100001001", // y=3
    "1011101111011", // y=4
    "1000100000001", // y=5
    "1110111011101", // y=6
    "1000001010001", // y=7
    "1011101010111", // y=8
    "1000100010001", // y=9
    "1110111011101", // y=10
    "1000000000100", // y=11: exit at (12,11)
    "1111111111111"  // y=12
  ];

  const walls: boolean[][] = ascii.map(row => row.split('').map(c => c === '1'));
  // Make sure entry and exit paths are open
  walls[0][1] = false;
  walls[11][12] = false;

  const decorations: Decoration[] = [
    { x: 10, y: 3, type: 'tree' },
    { x: 2, y: 9, type: 'tree' },
    { x: 5, y: 5, type: 'bush_flower' },
    { x: 6, y: 9, type: 'palm' },
    { x: 9, y: 1, type: 'small_flower' },
    { x: 3, y: 7, type: 'stone' }
  ];

  const collectibles: Collectible[] = [
    { id: 'c1', x: 4, y: 1, type: 'date', points: 50, label: 'Kurma Ajwa', collected: false },
    { id: 'c2', x: 8, y: 3, type: 'cat_fish', points: 75, label: 'Ikan Lezat Meong', collected: false },
    { id: 'c3', x: 3, y: 5, type: 'tasbih', points: 100, label: 'Tasbih Zikir', collected: false },
    { id: 'c4', x: 7, y: 7, type: 'date', points: 50, label: 'Kurma Ajwa', collected: false },
    { id: 'c5', x: 11, y: 7, type: 'lantern', points: 80, label: 'Lentera Madinah', collected: false }
  ];

  return {
    id: 'classic_madinatul',
    title: 'Labirin Klasik Madinatul Qura',
    width: w,
    height: h,
    walls,
    start: { x: 1, y: 0 },
    goal: { x: 12, y: 11 },
    decorations,
    collectibles
  };
}

/**
 * Shifting Magic Maze
 * Features special shifting gates that toggle between open and closed!
 */
export function getShiftingMagicLevel(): LevelConfig {
  const w = 13;
  const h = 13;
  const walls = generateProceduralMaze(w, h);

  // Pick 3 internal corridor points to be shifting gates
  const shiftingGates: ShiftingGate[] = [
    { id: 'sg1', x: 4, y: 5, isOpen: true, timerSeconds: 6 },
    { id: 'sg2', x: 8, y: 7, isOpen: false, timerSeconds: 7 },
    { id: 'sg3', x: 6, y: 9, isOpen: true, timerSeconds: 5 }
  ];

  // Ensure gate positions are open tiles in the base grid
  for (const g of shiftingGates) {
    walls[g.y][g.x] = false;
  }

  const decorations: Decoration[] = [
    { x: 2, y: 3, type: 'palm' },
    { x: 10, y: 2, type: 'bush_flower' },
    { x: 3, y: 10, type: 'tree' },
    { x: 9, y: 10, type: 'small_flower' }
  ];

  const collectibles: Collectible[] = [
    { id: 'sg_c1', x: 3, y: 1, type: 'cat_fish', points: 75, label: 'Ikan Ajaib Kucing', collected: false },
    { id: 'sg_c2', x: 5, y: 7, type: 'tasbih', points: 100, label: 'Tasbih Emas', collected: false },
    { id: 'sg_c3', x: 9, y: 5, type: 'date', points: 50, label: 'Kurma Manis', collected: false },
    { id: 'sg_c4', x: 7, y: 11, type: 'lantern', points: 80, label: 'Lentera Pelindung', collected: false }
  ];

  return {
    id: 'shifting_magic',
    title: 'Labirin Ajaib Berubah-Ubah',
    width: w,
    height: h,
    walls,
    start: { x: 1, y: 0 },
    goal: { x: w - 1, y: h - 2 },
    decorations,
    collectibles,
    shiftingGates
  };
}

/**
 * Taman Kurma Level (11x11)
 */
export function getTamanKurmaLevel(): LevelConfig {
  const w = 11;
  const h = 11;
  const walls = generateProceduralMaze(w, h);

  const decorations: Decoration[] = [
    { x: 2, y: 2, type: 'palm' },
    { x: 8, y: 2, type: 'palm' },
    { x: 5, y: 5, type: 'bush_flower' },
    { x: 2, y: 8, type: 'tree' },
    { x: 8, y: 8, type: 'palm' }
  ];

  const collectibles: Collectible[] = [
    { id: 'tk_1', x: 3, y: 1, type: 'date', points: 50, label: 'Kurma Sukari', collected: false },
    { id: 'tk_2', x: 1, y: 5, type: 'cat_fish', points: 75, label: 'Ikan Segar Meong', collected: false },
    { id: 'tk_3', x: 7, y: 5, type: 'date', points: 50, label: 'Kurma Medjool', collected: false },
    { id: 'tk_4', x: 5, y: 9, type: 'tasbih', points: 100, label: 'Tasbih Kayu Cendana', collected: false }
  ];

  return {
    id: 'taman_kurma',
    title: 'Kebun Kurma & Bunga Melati',
    width: w,
    height: h,
    walls,
    start: { x: 1, y: 0 },
    goal: { x: w - 1, y: h - 2 },
    decorations,
    collectibles
  };
}

/**
 * Senja Maghrib Level (15x15)
 */
export function getSenjaMaghribLevel(): LevelConfig {
  const w = 15;
  const h = 15;
  const walls = generateProceduralMaze(w, h);

  const decorations: Decoration[] = [
    { x: 2, y: 4, type: 'palm' },
    { x: 12, y: 3, type: 'tree' },
    { x: 6, y: 7, type: 'bush_flower' },
    { x: 10, y: 11, type: 'stone' },
    { x: 3, y: 12, type: 'palm' }
  ];

  const collectibles: Collectible[] = [
    { id: 'sm_1', x: 5, y: 1, type: 'lantern', points: 80, label: 'Lentera Senja', collected: false },
    { id: 'sm_2', x: 1, y: 7, type: 'cat_fish', points: 75, label: 'Ikan Tuna Kucing', collected: false },
    { id: 'sm_3', x: 9, y: 7, type: 'tasbih', points: 100, label: 'Tasbih Kristal', collected: false },
    { id: 'sm_4', x: 13, y: 9, type: 'lantern', points: 80, label: 'Lentera Hati', collected: false },
    { id: 'sm_5', x: 7, y: 13, type: 'date', points: 50, label: 'Kurma Ruthob', collected: false }
  ];

  return {
    id: 'senja_maghrib',
    title: 'Menjelang Maghrib Berbintang',
    width: w,
    height: h,
    walls,
    start: { x: 1, y: 0 },
    goal: { x: w - 1, y: h - 2 },
    decorations,
    collectibles
  };
}

/**
 * Generate generic procedural level of custom dimensions
 */
export function createProceduralLevel(
  variantId: MazeVariantType,
  title: string,
  width: number,
  height: number
): LevelConfig {
  const walls = generateProceduralMaze(width, height);
  const w = walls[0].length;
  const h = walls.length;

  // Find valid open tiles for items & decorations
  const openTiles: Position[] = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (!walls[y][x] && !(x === 1 && y === 1) && !(x === w - 2 && y === h - 2)) {
        openTiles.push({ x, y });
      }
    }
  }

  // Shuffle open tiles
  for (let i = openTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [openTiles[i], openTiles[j]] = [openTiles[j], openTiles[i]];
  }

  const collectibles: Collectible[] = [];
  const itemCount = Math.min(6, Math.max(3, Math.floor(openTiles.length / 10)));
  const types: Array<{ type: Collectible['type']; pts: number; name: string }> = [
    { type: 'date', pts: 50, name: 'Kurma Manis' },
    { type: 'cat_fish', pts: 75, name: 'Ikan Lezat Si Meong' },
    { type: 'tasbih', pts: 100, name: 'Tasbih Indah' },
    { type: 'lantern', pts: 80, name: 'Lentera Terang' }
  ];

  for (let i = 0; i < itemCount && openTiles.length > 0; i++) {
    const tile = openTiles.pop()!;
    const chosenType = types[i % types.length];
    collectibles.push({
      id: `proc_${i}_${Date.now()}`,
      x: tile.x,
      y: tile.y,
      type: chosenType.type,
      points: chosenType.pts,
      label: chosenType.name,
      collected: false
    });
  }

  const decorations: Decoration[] = [];
  const decCount = Math.min(5, Math.floor(openTiles.length / 8));
  const decTypes: Decoration['type'][] = ['tree', 'palm', 'bush_flower', 'small_flower', 'stone'];
  for (let i = 0; i < decCount && openTiles.length > 0; i++) {
    const tile = openTiles.pop()!;
    decorations.push({
      x: tile.x,
      y: tile.y,
      type: decTypes[i % decTypes.length]
    });
  }

  return {
    id: variantId,
    title,
    width: w,
    height: h,
    walls,
    start: { x: 1, y: 0 },
    goal: { x: w - 1, y: h - 2 },
    decorations,
    collectibles
  };
}

export function loadLevelConfig(variant: MazeVariantType): LevelConfig {
  switch (variant) {
    case 'classic_madinatul':
      return getClassicMadinatulLevel();
    case 'shifting_magic':
      return getShiftingMagicLevel();
    case 'taman_kurma':
      return getTamanKurmaLevel();
    case 'senja_maghrib':
      return getSenjaMaghribLevel();
    case 'random_easy':
      return createProceduralLevel('random_easy', 'Labirin Ceria (Acak 9x9)', 9, 9);
    case 'random_medium':
      return createProceduralLevel('random_medium', 'Petualang Hebat (Acak 13x13)', 13, 13);
    case 'random_hard':
      return createProceduralLevel('random_hard', 'Penjelajah Akbar (Acak 17x17)', 17, 17);
    default:
      return getClassicMadinatulLevel();
  }
}
