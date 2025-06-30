import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Platform, Ring, Position } from '@/types/game';
import { CHARACTER_SIZE, INITIAL_LIVES, SCREEN_DIMENSIONS } from '@/constants/game';
import { generateLevel } from '@/utils/levelGenerator';

const initialGameState: GameState = {
  character: {
    position: { x: 50, y: SCREEN_DIMENSIONS.height - 200 },
    velocity: { x: 0, y: 0 },
    size: { width: CHARACTER_SIZE, height: CHARACTER_SIZE },
    isJumping: false,
    isGrappling: false,
    direction: 'right',
  },
  platforms: [],
  rings: [],
  grapplingHook: {
    active: false,
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 },
    angle: 0,
    length: 0,
    attached: false,
    attachPoint: null,
  },
  score: 0,
  lives: INITIAL_LIVES,
  gameOver: false,
  level: 1,
  paused: false,
};

export const useGameStore = create<GameState & {
  initGame: () => void;
  moveCharacter: (direction: 'left' | 'right' | 'none') => void;
  jump: () => void;
  updatePhysics: () => void;
  collectRing: (ringId: string) => void;
  loseLife: () => void;
  resetGame: () => void;
  togglePause: () => void;
  shootGrapplingHook: (targetPosition: Position) => void;
  releaseGrapplingHook: () => void;
  nextLevel: () => void;
}>()(
  persist(
    (set, get) => ({
      ...initialGameState,

      initGame: () => {
        const { level, platforms, rings } = generateLevel(1);
        set({
          ...initialGameState,
          level,
          platforms,
          rings,
        });
      },

      moveCharacter: (direction) => {
        set((state) => {
          const velocity = { ...state.character.velocity };

          if (direction === 'left') {
            velocity.x = -5;
          } else if (direction === 'right') {
            velocity.x = 5;
          } else {
            velocity.x = 0;
          }

          return {
            character: {
              ...state.character,
              velocity,
              direction: direction === 'none' ? state.character.direction : direction,
            }
          };
        });
      },

      jump: () => {
        set((state) => {
          if (state.character.isJumping) return state;

          return {
            character: {
              ...state.character,
              velocity: {
                ...state.character.velocity,
                y: -16, // Jump force
              },
              isJumping: true,
            }
          };
        });
      },

      updatePhysics: () => {
        set((state) => {
          if (state.gameOver || state.paused) return state;

          const character = { ...state.character };
          const grapplingHook = { ...state.grapplingHook };

          // Apply gravity if not attached to grappling hook
          if (!grapplingHook.attached) {
            character.velocity.y += 0.7; // Gravity
          } else {
            // Pull character towards grappling point
            const attachPoint = grapplingHook.attachPoint!;
            const dx = attachPoint.x - character.position.x;
            const dy = attachPoint.y - character.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 10) {
              character.velocity.x += (dx / distance) * 0.5;
              character.velocity.y += (dy / distance) * 0.5;
            } else {
              // If close enough to the attach point, stop pulling
              grapplingHook.attached = false;
              grapplingHook.active = false;
            }
          }

          // Update character position
          character.position.x += character.velocity.x;
          character.position.y += character.velocity.y;

          // Check platform collisions
          let onPlatform = false;
          for (const platform of state.platforms) {
            if (
              character.position.y + character.size.height >= platform.position.y &&
              character.position.y + character.size.height <= platform.position.y + 10 &&
              character.position.x + character.size.width > platform.position.x &&
              character.position.x < platform.position.x + platform.size.width &&
              character.velocity.y > 0
            ) {
              character.position.y = platform.position.y - character.size.height;
              character.velocity.y = 0;
              character.isJumping = false;
              onPlatform = true;
            }
          }

          if (!onPlatform && character.velocity.y === 0) {
            character.isJumping = true;
          }

          // Check boundaries
          if (character.position.x < 0) character.position.x = 0;
          if (character.position.x + character.size.width > SCREEN_DIMENSIONS.width) {
            character.position.x = SCREEN_DIMENSIONS.width - character.size.width;
          }

          // Check if character fell off the screen
          if (character.position.y > SCREEN_DIMENSIONS.height) {
            // Call loseLife and return early
            setTimeout(() => get().loseLife(), 0);
            return state;
          }

          // Check if all rings are collected
          const allRingsCollected = state.rings.every(ring => ring.collected);
          if (allRingsCollected && state.rings.length > 0) {
            setTimeout(() => get().nextLevel(), 0);
            return state;
          }

          // Update grappling hook position if active
          if (grapplingHook.active && !grapplingHook.attached) {
            const angle = grapplingHook.angle;
            const speed = 15;

            grapplingHook.length += speed;
            grapplingHook.endPosition = {
              x: grapplingHook.startPosition.x + Math.cos(angle) * grapplingHook.length,
              y: grapplingHook.startPosition.y + Math.sin(angle) * grapplingHook.length,
            };

            // Check if grappling hook hit a platform
            for (const platform of state.platforms) {
              if (
                grapplingHook.endPosition.x >= platform.position.x &&
                grapplingHook.endPosition.x <= platform.position.x + platform.size.width &&
                grapplingHook.endPosition.y >= platform.position.y &&
                grapplingHook.endPosition.y <= platform.position.y + platform.size.height
              ) {
                grapplingHook.attached = true;
                grapplingHook.attachPoint = { ...grapplingHook.endPosition };
                break;
              }
            }

            // Check if grappling hook went off screen
            if (
              grapplingHook.endPosition.x < 0 ||
              grapplingHook.endPosition.x > SCREEN_DIMENSIONS.width ||
              grapplingHook.endPosition.y < 0 ||
              grapplingHook.endPosition.y > SCREEN_DIMENSIONS.height ||
              grapplingHook.length > SCREEN_DIMENSIONS.width * 0.7 // Max length
            ) {
              grapplingHook.active = false;
            }
          }

          // Update grappling hook start position with character
          if (grapplingHook.active) {
            grapplingHook.startPosition = {
              x: character.position.x + character.size.width / 2,
              y: character.position.y + character.size.height / 2,
            };
          }

          return {
            character,
            grapplingHook,
          };
        });
      },

      collectRing: (ringId) => {
        set((state) => {
          const rings = state.rings.map(ring =>
            ring.id === ringId ? { ...ring, collected: true } : ring
          );

          return {
            rings,
            score: state.score + 10,
          };
        });
      },

      loseLife: () => {
        set((state) => {
          const lives = state.lives - 1;

          if (lives <= 0) {
            return {
              ...state,
              lives: 0,
              gameOver: true,
            };
          }

          // Reset character position
          return {
            ...state,
            lives,
            character: {
              ...state.character,
              position: { x: 50, y: SCREEN_DIMENSIONS.height - 200 },
              velocity: { x: 0, y: 0 },
              isJumping: false,
              isGrappling: false,
            },
            grapplingHook: {
              ...initialGameState.grapplingHook,
            },
          };
        });
      },

      resetGame: () => {
        const { level, platforms, rings } = generateLevel(1);
        set({
          ...initialGameState,
          level,
          platforms,
          rings,
        });
      },

      togglePause: () => {
        set((state) => ({
          paused: !state.paused,
        }));
      },

      shootGrapplingHook: (targetPosition) => {
        set((state) => {
          if (state.grapplingHook.active) return state;

          const startPosition = {
            x: state.character.position.x + state.character.size.width / 2,
            y: state.character.position.y + state.character.size.height / 2,
          };

          const dx = targetPosition.x - startPosition.x;
          const dy = targetPosition.y - startPosition.y;
          const angle = Math.atan2(dy, dx);

          return {
            grapplingHook: {
              active: true,
              startPosition,
              endPosition: { ...startPosition },
              angle,
              length: 0,
              attached: false,
              attachPoint: null,
            },
            character: {
              ...state.character,
              isGrappling: true,
            },
          };
        });
      },

      releaseGrapplingHook: () => {
        set((state) => ({
          grapplingHook: {
            ...initialGameState.grapplingHook,
          },
          character: {
            ...state.character,
            isGrappling: false,
          },
        }));
      },

      nextLevel: () => {
        set((state) => {
          const nextLevel = state.level + 1;
          const { platforms, rings } = generateLevel(nextLevel);

          return {
            level: nextLevel,
            platforms,
            rings,
            character: {
              ...initialGameState.character,
            },
            grapplingHook: {
              ...initialGameState.grapplingHook,
            },
          };
        });
      },
    }),
    {
      name: 'platformer-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        score: state.score,
        level: state.level,
      }),
    }
  )
);
