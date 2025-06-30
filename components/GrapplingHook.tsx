import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GrapplingHook as GrapplingHookType } from '@/types/game';
import Colors from '@/constants/colors';

interface GrapplingHookProps {
  grapplingHook: GrapplingHookType;
}

export const GrapplingHook: React.FC<GrapplingHookProps> = ({ grapplingHook }) => {
  const { active, startPosition, endPosition } = grapplingHook;

  if (!active) return null;

  // Calculate line properties
  const dx = endPosition.x - startPosition.x;
  const dy = endPosition.y - startPosition.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <>
      {/* Grappling hook line */}
      <View
        style={[
          styles.line,
          {
            left: startPosition.x,
            top: startPosition.y,
            width: length,
            transform: [
              { translateX: 0 },
              { translateY: -1 },
              { rotate: `${angle}deg` },
              { translateX: 0 },
              { translateY: 0 },
            ],
          },
        ]}
      />

      {/* Grappling hook end point */}
      <View
        style={[
          styles.hookEnd,
          {
            left: endPosition.x - 5,
            top: endPosition.y - 5,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    height: 3,
    backgroundColor: Colors.grapple,
    transformOrigin: 'left',
  },
  hookEnd: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.grapple,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
});
