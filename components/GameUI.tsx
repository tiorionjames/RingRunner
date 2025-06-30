import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import Colors from '@/constants/colors';
import { Pause, Play, RotateCcw } from 'lucide-react-native';

export const GameUI: React.FC = () => {
  const score = useGameStore(state => state.score);
  const lives = useGameStore(state => state.lives);
  const level = useGameStore(state => state.level);
  const paused = useGameStore(state => state.paused);
  const gameOver = useGameStore(state => state.gameOver);
  const togglePause = useGameStore(state => state.togglePause);
  const resetGame = useGameStore(state => state.resetGame);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Level: {level}</Text>
          <Text style={styles.statsText}>Score: {score}</Text>
          <Text style={styles.statsText}>Lives: {lives}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={togglePause}
        >
          {paused ? (
            <Play size={20} color={Colors.text} />
          ) : (
            <Pause size={20} color={Colors.text} />
          )}
        </TouchableOpacity>
      </View>

      {(paused || gameOver) && (
        <View style={styles.overlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>
              {gameOver ? 'Game Over' : 'Paused'}
            </Text>

            {gameOver && (
              <Text style={styles.scoreText}>Final Score: {score}</Text>
            )}

            <TouchableOpacity
              style={styles.menuButton}
              onPress={resetGame}
            >
              <RotateCcw size={20} color={Colors.text} />
              <Text style={styles.menuButtonText}>
                {gameOver ? 'Play Again' : 'Restart'}
              </Text>
            </TouchableOpacity>

            {!gameOver && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={togglePause}
              >
                <Play size={20} color={Colors.text} />
                <Text style={styles.menuButtonText}>Resume</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  statsText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 111, 165, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: Colors.ui.background,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: Colors.ui.button,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  menuButtonText: {
    color: Colors.ui.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
