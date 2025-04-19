import { Animated, Easing } from 'react-native';

/**
 * Creates a timing animation that properly handles cleanup
 * 
 * @param animatedValue The Animated.Value to animate
 * @param toValue Target value
 * @param duration Duration in milliseconds
 * @param easing Easing function
 * @param useNativeDriver Whether to use native driver
 * @returns Animation object that can be started, stopped, etc.
 */
export const createTimingAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 300,
  easing: (value: number) => number = Easing.inOut(Easing.ease),
  useNativeDriver: boolean = true
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver,
  });
};

/**
 * Creates a sequence of animations
 * 
 * @param animations Array of animations to run in sequence
 * @returns Composite animation that can be started, stopped, etc.
 */
export const createSequence = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};

/**
 * Creates a loop animation
 * 
 * @param animation Animation to loop
 * @param iterations Number of iterations (-1 for infinite)
 * @returns Composite animation that can be started, stopped, etc.
 */
export const createLoop = (
  animation: Animated.CompositeAnimation,
  iterations: number = -1
): Animated.CompositeAnimation => {
  return Animated.loop(animation, { iterations });
};

/**
 * Creates a pulse animation
 * 
 * @param animatedValue The Animated.Value to animate
 * @param minValue Minimum scale value
 * @param maxValue Maximum scale value
 * @param duration Duration for one complete pulse
 * @returns Animation object that can be started, stopped, etc.
 */
export const createPulseAnimation = (
  animatedValue: Animated.Value,
  minValue: number = 0.97,
  maxValue: number = 1.03,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return createLoop(
    createSequence([
      createTimingAnimation(
        animatedValue,
        maxValue,
        duration / 2
      ),
      createTimingAnimation(
        animatedValue,
        minValue,
        duration / 2
      )
    ])
  );
};

/**
 * Creates a fade animation
 * 
 * @param animatedValue The Animated.Value to animate
 * @param toValue Target opacity value
 * @param duration Duration in milliseconds
 * @returns Animation object that can be started, stopped, etc.
 */
export const createFadeAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 300
): Animated.CompositeAnimation => {
  return createTimingAnimation(animatedValue, toValue, duration);
};

/**
 * Creates a progress animation
 * 
 * @param animatedValue The Animated.Value to animate
 * @param toValue Target progress value (0-1)
 * @param duration Duration in milliseconds
 * @returns Animation object that can be started, stopped, etc.
 */
export const createProgressAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 600
): Animated.CompositeAnimation => {
  return createTimingAnimation(
    animatedValue,
    toValue,
    duration,
    Easing.inOut(Easing.ease),
    false
  );
}; 