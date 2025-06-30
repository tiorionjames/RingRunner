import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Platform as PlatformType } from '@/types/game';
import Colors from '@/constants/colors';

interface PlatformProps {
  platform: PlatformType;
}

export const Platform: React.FC<PlatformProps> = ({ platform }) => {
  const { position, size, type, movingProps } = platform;
  const animatedX = useRef(new Animated.Value(position.x)).current;

  useEffect(() => {
    if (type === 'moving' && movingProps) {
      const { startX, endX, speed } = movingProps;

      const createAnimation = (toValue: number, duration: number) => {
        return Animated.timing(animatedX, {
          toValue,
          duration,
          useNativeDriver: false,
        });
      };

      const distance = Math.abs(endX - startX);
      const animationDuration = (distance / speed) * 100;

      Animated.loop(
        Animated.sequence([
          createAnimation(endX, animationDuration),
          createAnimation(startX, animationDuration),
        ])
      ).start();
    }
  }, []);

  const platformStyle = {
    left: type === 'moving' ? animatedX : position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    backgroundColor: type === 'moving' ? Colors.platformLight : Colors.platformDark,
  };

  return (
    <Animated.View style={[styles.platform, platformStyle]}>
      {type === 'moving' && (
        <View style={styles.movingIndicator} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  platform: {
    position: 'absolute',
    borderRadius: 5,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  movingIndicator: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 20,
    height: 3,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
});
