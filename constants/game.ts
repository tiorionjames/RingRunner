import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GRAVITY = 0.7;
export const JUMP_FORCE = -16;
export const MOVEMENT_SPEED = 5;
export const CHARACTER_SIZE = 50;
export const PLATFORM_HEIGHT = 30;
export const RING_SIZE = 30;
export const GRAPPLE_SPEED = 15;
export const MAX_GRAPPLE_LENGTH = SCREEN_WIDTH * 0.7;
export const GRAPPLE_PULL_SPEED = 8;
export const SCREEN_DIMENSIONS = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };

export const INITIAL_LIVES = 3;
