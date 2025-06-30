import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Character as CharacterType } from '@/types/game';
import Colors from '@/constants/colors';

interface CharacterProps {
  character: CharacterType;
}

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const { position, size, direction } = character;

  return (
    <View
      style={[
        styles.character,
        {
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        },
      ]}
    >
      {/* Character body */}
      <View style={styles.body} />

      {/* Character face */}
      <View style={[
        styles.face,
        { left: direction === 'right' ? '60%' : '10%' }
      ]}>
        <View style={styles.eye} />
        <View style={styles.mouth} />
      </View>

      {/* Character arm */}
      <View style={[
        styles.arm,
        {
          left: direction === 'right' ? '70%' : '10%',
          transform: [{ rotate: direction === 'right' ? '45deg' : '-45deg' }]
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  character: {
    position: 'absolute',
    backgroundColor: Colors.character,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: Colors.character,
  },
  face: {
    position: 'absolute',
    top: '20%',
    width: '30%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background,
  },
  mouth: {
    marginTop: 2,
    width: 10,
    height: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.background,
  },
  arm: {
    position: 'absolute',
    top: '40%',
    width: '20%',
    height: 8,
    backgroundColor: Colors.character,
    borderRadius: 4,
  },
});
