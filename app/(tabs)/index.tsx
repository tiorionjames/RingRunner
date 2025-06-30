import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PaintRoller, Trophy, Info, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useGameStore } from '@/store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const score = useGameStore(state => state.score);
  const level = useGameStore(state => state.level);
  const resetGame = useGameStore(state => state.resetGame);

  const handlePlayGame = () => {
    router.push('/game');
  };

  const handleNewGame = () => {
    resetGame();
    router.push('/game');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Ring Runner</Text>
        <Text style={styles.subtitle}>A Platformer Adventure</Text>
      </View>

      <View style={styles.heroContainer}>
        <LinearGradient
          colors={[Colors.background, 'rgba(26, 34, 56, 0.8)']}
          style={styles.heroGradient}
        />

        <View style={styles.characterPreview}>
          <View style={styles.characterCircle}>
            <View style={styles.character} />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Trophy size={20} color={Colors.secondary} />
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>

          <View style={styles.statItem}>
            <Star size={20} color={Colors.secondary} />
            <Text style={styles.statValue}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {score > 0 ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handlePlayGame}>
              <PaintRoller size={24} color={Colors.text} />
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleNewGame}>
              <PaintRoller size={24} color={Colors.text} />
              <Text style={styles.buttonText}>New Game</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handlePlayGame}>
            <PaintRoller size={24} color={Colors.text} />
            <Text style={styles.buttonText}>Play Game</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Info size={20} color={Colors.secondary} />
          <Text style={styles.infoTitle}>How to Play</Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoText}>• Use the left and right buttons to move</Text>
          <Text style={styles.infoText}>• Tap the jump button to jump</Text>
          <Text style={styles.infoText}>• Tap anywhere on the screen to shoot your grappling hook</Text>
          <Text style={styles.infoText}>• Collect all rings to advance to the next level</Text>
          <Text style={styles.infoText}>• Don't fall off the platforms!</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    marginTop: 5,
  },
  heroContainer: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 20,
    position: 'relative',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  characterPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.character,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.7,
  },
  buttonContainer: {
    marginVertical: 20,
    gap: 15,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: Colors.platformDark,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  infoContent: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.8,
    lineHeight: 20,
  },
});
