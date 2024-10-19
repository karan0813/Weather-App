// AnimatedBackground.tsx
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedBackground: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => animate());
    };
    animate();
  }, [animatedValue]);

  const interpolateBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 0, 0, 1)', 'rgba(0, 0, 255, 1)'], // Change colors as needed
  });

  return (
    <Animated.View
      style={[styles.container, {backgroundColor: interpolateBackground}]}>
      <LinearGradient
        colors={['rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.5)']}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%', // Set height to 100%

    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default AnimatedBackground;
