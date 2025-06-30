import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export const GameBackground: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={styles.background}
      />

      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <View
          key={`star-${i}`}
          style={[
            styles.star,
            {
              left: Math.random() * width,
              top: Math.random() * height * 0.7,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              opacity: Math.random() * 0.8 + 0.2,
            },
          ]}
        />
      ))}

      {/* Mountains */}
      <View style={styles.mountains}>
        <View style={[styles.mountain, { left: '10%', height: 100 }]} />
        <View style={[styles.mountain, { left: '30%', height: 150 }]} />
        <View style={[styles.mountain, { left: '60%', height: 120 }]} />
        <View style={[styles.mountain, { left: '80%', height: 180 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 1,
  },
  mountains: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 200,
  },
  mountain: {
    position: 'absolute',
    bottom: 0,
    width: 200,
    backgroundColor: 'transparent',
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 200,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(57, 72, 103, 0.5)',
  },
});
