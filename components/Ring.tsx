import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ring as RingType } from '@/types/game';
import Colors from '@/constants/colors';
import { RING_SIZE } from '@/constants/game';

interface RingProps {
  ring: RingType;
}

export const Ring: React.FC<RingProps> = ({ ring }) => {
  const { position, collected } = ring;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotate animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Collect animation
    if (collected) {
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [collected]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (collected) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.ringContainer,
        {
          left: position.x,
          top: position.y,
          transform: [{ rotate: spin }, { scale }],
        },
      ]}
    >
      <View style={styles.ring}>
        <View style={styles.innerRing} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ringContainer: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 5,
    borderColor: Colors.ring,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: RING_SIZE - 15,
    height: RING_SIZE - 15,
    borderRadius: (RING_SIZE - 15) / 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
});
