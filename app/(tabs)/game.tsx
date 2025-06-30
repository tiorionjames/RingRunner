import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '@/store/gameStore';
import { Character } from '@/components/Character';
import { Platform } from '@/components/Platform';
import { Ring } from '@/components/Ring';
import { GrapplingHook } from '@/components/GrapplingHook';
import { GameControls } from '@/components/GameControls';
import { GameUI } from '@/components/GameUI';
import { GameBackground } from '@/components/GameBackground';
import Colors from '@/constants/colors';

export default function GameScreen() {
  const gameLoop = useRef<NodeJS.Timeout | null>(null);
  const {
    character,
    platforms,
    rings,
    grapplingHook,
    paused,
    gameOver,
    initGame,
    updatePhysics,
    collectRing,
    shootGrapplingHook,
    releaseGrapplingHook,
  } = useGameStore();

  // Initialize game
  useEffect(() => {
    initGame();

    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }

    gameLoop.current = setInterval(() => {
      if (!paused && !gameOver) {
        updatePhysics();
      }
    }, 1000 / 60); // 60 FPS

    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, [paused, gameOver]);

  // Check for ring collection
  useEffect(() => {
    if (paused || gameOver) return;

    rings.forEach(ring => {
      if (!ring.collected) {
        const characterCenterX = character.position.x + character.size.width / 2;
        const characterCenterY = character.position.y + character.size.height / 2;
        const ringCenterX = ring.position.x + 15;
        const ringCenterY = ring.position.y + 15;

        const distance = Math.sqrt(
          Math.pow(characterCenterX - ringCenterX, 2) +
          Math.pow(characterCenterY - ringCenterY, 2)
        );

        if (distance < 30) {
          collectRing(ring.id);
        }
      }
    });
  }, [character.position, rings, paused, gameOver]);

  const handleScreenPress = (event: any) => {
    if (paused || gameOver) return;

    const { locationX, locationY } = event.nativeEvent;

    // Don't shoot if pressing in the control areas
    if (locationY > Dimensions.get('window').height - 150) {
      return;
    }

    if (grapplingHook.active) {
      releaseGrapplingHook();
    } else {
      shootGrapplingHook({ x: locationX, y: locationY });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <GameBackground />

      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <View style={styles.gameArea}>
          {/* Platforms */}
          {platforms.map(platform => (
            <Platform key={platform.id} platform={platform} />
          ))}

          {/* Rings */}
          {rings.map(ring => (
            <Ring key={ring.id} ring={ring} />
          ))}

          {/* Grappling Hook */}
          <GrapplingHook grapplingHook={grapplingHook} />

          {/* Character */}
          <Character character={character} />
        </View>
      </TouchableWithoutFeedback>

      {/* Game UI */}
      <GameUI />

      {/* Game Controls */}
      <GameControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gameArea: {
    flex: 1,
  },
});
