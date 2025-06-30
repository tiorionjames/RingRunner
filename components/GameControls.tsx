import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import Colors from '@/constants/colors';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react-native';

export const GameControls: React.FC = () => {
  const moveCharacter = useGameStore(state => state.moveCharacter);
  const jump = useGameStore(state => state.jump);

  const handleLeftPress = () => moveCharacter('left');
  const handleLeftRelease = () => moveCharacter('none');
  const handleRightPress = () => moveCharacter('right');
  const handleRightRelease = () => moveCharacter('none');

  return (
    <View style={styles.container}>
      <View style={styles.leftControls}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handleLeftPress}
          onPressOut={handleLeftRelease}
        >
          <ArrowLeft size={30} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPressIn={handleRightPress}
          onPressOut={handleRightRelease}
        >
          <ArrowRight size={30} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.rightControls}>
        <TouchableOpacity
          style={styles.jumpButton}
          onPress={jump}
        >
          <ArrowUp size={30} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftControls: {
    flexDirection: 'row',
    gap: 20,
  },
  rightControls: {
    flexDirection: 'row',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(74, 111, 165, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 179, 71, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
