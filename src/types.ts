export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number; // column
  y: number; // row
}

export type CollectibleType = 'date' | 'tasbih' | 'cat_fish' | 'lantern';

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: CollectibleType;
  points: number;
  label: string;
  collected: boolean;
}

export interface Decoration {
  x: number;
  y: number;
  type: 'tree' | 'palm' | 'bush_flower' | 'small_flower' | 'stone';
}

export interface ShiftingGate {
  id: string;
  x: number;
  y: number;
  isOpen: boolean;
  timerSeconds: number;
}

export type MazeVariantType = 
  | 'classic_madinatul'   // Mirrored from the uploaded reference picture
  | 'taman_kurma'         // Date palm garden with lush paths
  | 'shifting_magic'      // Maze with doors/walls shifting dynamically
  | 'senja_maghrib'       // Sunset lantern challenge
  | 'random_easy'         // Infinite random 9x9
  | 'random_medium'       // Infinite random 13x13
  | 'random_hard';        // Infinite random 17x17

export interface MazeVariantInfo {
  id: MazeVariantType;
  name: string;
  badge: string;
  description: string;
  width: number;
  height: number;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan' | 'Spesial';
  hasShiftingWalls?: boolean;
}

export interface LevelConfig {
  id: MazeVariantType;
  title: string;
  width: number;
  height: number;
  walls: boolean[][]; // true = wall, false = open path
  start: Position;
  goal: Position;
  decorations: Decoration[];
  collectibles: Collectible[];
  shiftingGates?: ShiftingGate[];
}

export interface GameStats {
  score: number;
  collectedCount: number;
  totalCollectibles: number;
  steps: number;
  timeSeconds: number;
  hintsUsed: number;
  stars: number;
}
