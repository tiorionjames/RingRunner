import { Platform, Ring } from '@/types/game';
import { SCREEN_DIMENSIONS, PLATFORM_HEIGHT, RING_SIZE } from '@/constants/game';

export const generateLevel = (level: number) => {
  const platforms: Platform[] = [];
  const rings: Ring[] = [];

  // Difficulty increases with level
  const gapSize = Math.min(300 + level * 20, 500); // Larger gaps in higher levels
  const platformCount = Math.max(10, 15 - level); // Fewer platforms in higher levels

  // Always add a starting platform
  platforms.push({
    id: 'start',
    position: { x: 0, y: SCREEN_DIMENSIONS.height - 100 },
    size: { width: 200, height: PLATFORM_HEIGHT },
    type: 'normal',
  });

  let lastPlatformEnd = 200;

  for (let i = 0; i < platformCount; i++) {
    const platformWidth = Math.random() * 100 + 100;
    const platformX = lastPlatformEnd + Math.random() * 50 + gapSize;
    const platformY = SCREEN_DIMENSIONS.height - 100 - Math.random() * 150;

    // Add platform
    const platformId = `platform-${i}`;
    platforms.push({
      id: platformId,
      position: { x: platformX, y: platformY },
      size: { width: platformWidth, height: PLATFORM_HEIGHT },
      type: Math.random() > 0.7 ? 'moving' : 'normal',
      movingProps: Math.random() > 0.7 ? {
        startX: platformX,
        endX: platformX + 100 + Math.random() * 100,
        speed: 1 + Math.random() * 2,
        direction: 1,
      } : undefined,
    });

    // Add rings on platform
    const ringCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < ringCount; j++) {
      const ringX = platformX + (platformWidth / (ringCount + 1)) * (j + 1) - RING_SIZE / 2;
      const ringY = platformY - RING_SIZE - 10;

      rings.push({
        id: `ring-${i}-${j}`,
        position: { x: ringX, y: ringY },
        collected: false,
      });
    }

    lastPlatformEnd = platformX + platformWidth;
  }

  // Add final platform
  platforms.push({
    id: 'end',
    position: { x: lastPlatformEnd + gapSize, y: SCREEN_DIMENSIONS.height - 100 },
    size: { width: 200, height: PLATFORM_HEIGHT },
    type: 'normal',
  });

  // Add finish ring
  rings.push({
    id: 'finish-ring',
    position: {
      x: lastPlatformEnd + gapSize + 100 - RING_SIZE / 2,
      y: SCREEN_DIMENSIONS.height - 100 - RING_SIZE - 10
    },
    collected: false,
  });

  return {
    level,
    platforms,
    rings,
  };
};
