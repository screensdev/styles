'use client';
import type { ThemableStyleSheet } from './types/input';

/**
 * Utility to create a stylesheet
 * Compatible with React Native StyleSheet.create
 * @param stylesheet - The stylesheet to be used
 */
export const createStyleSheet = <S extends ThemableStyleSheet>(stylesheet: S) =>
  stylesheet;
