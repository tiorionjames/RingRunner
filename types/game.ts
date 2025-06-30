export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Character {
  position: Position;
  velocity: Velocity;
  size: Size;
  isJumping: boolean;
  isGrappling: boolean;
  direction: 'left' | 'right';
}

export interface Platform {
  id: string;
  position: Position;
  size: Size;
  type: 'normal' | 'moving' | 'breakable';
  movingProps?: {
    startX: number;
    endX: number;
    speed: number;
    direction: 1 | -1;
  };
}

export interface Ring {
  id: string;
  position: Position;
  collected: boolean;
}

export interface GrapplingHook {
  active: boolean;
  startPosition: Position;
  endPosition: Position;
  angle: number;
  length: number;
  attached: boolean;
  attachPoint: Position | null;
}

export interface GameState {
  character: Character;
  platforms: Platform[];
  rings: Ring[];
  grapplingHook: GrapplingHook;
  score: number;
  lives: number;
  gameOver: boolean;
  level: number;
  paused: boolean;
}
