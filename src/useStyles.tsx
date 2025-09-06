'use client';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { isContainerQuery, useCachedContainerWidth } from './container';
import { useThemeContext } from './theme';
import type { ThemableStyleSheet, Variants } from './types/input';
import type { ParsedStylesheet, ParseStyleKeys } from './types/output';
import { parseStyle } from './parseStyle';
import { useVariantMap } from './useVariantMap';
import { isMediaQuery, useCachedScreenSize } from './media';

/**
 * Hook that creates dynamic styles
 * @param stylesheet - The stylesheet to use
 * @param variantsMap - The map of variants to use
 * @returns - RN compatible styles
 */
export const useStyles = <ST extends ThemableStyleSheet>(
  stylesheet?: ST,
  variantsMap?: Variants<typeof stylesheet>
): ParsedStylesheet<ST> => {
  const variants = useVariantMap(variantsMap);
  const { breakpoints, theme } = useThemeContext();

  const queryMap = useMemo(() => {
    return Object.entries({ ...stylesheet, ...variantsMap }).reduce(
      (acc, [_key, value]) => {
        if (!value || typeof value === 'string') {
          return acc;
        }
        const parsedValue = typeof value === 'function' ? value(theme) : value;
        const responsiveKeys = Object.getOwnPropertySymbols(parsedValue);
        if (!responsiveKeys.length) {
          return acc;
        }

        responsiveKeys.forEach((query) => {
          const queryString = query.description;
          if (!queryString) {
            return;
          }

          if (isContainerQuery(queryString)) {
            acc.containerQueries.add(query);
            return;
          }

          if (isMediaQuery(queryString)) {
            acc.mediaQueries.add(query);
            return;
          }
        });
        return acc;
      },
      { containerQueries: new Set<symbol>(), mediaQueries: new Set<symbol>() }
    );
  }, [stylesheet, theme, variantsMap]);

  const screenSize = useCachedScreenSize(queryMap.mediaQueries, breakpoints);
  const containerWidth = useCachedContainerWidth(queryMap.containerQueries);

  const dynamicStyleSheet = useMemo(
    () =>
      Object.entries(stylesheet || {}).reduce((acc, [key, value]) => {
        if (typeof value === 'function') {
          return {
            ...acc,
            [key]: parseStyle(
              value(theme),
              containerWidth,
              screenSize,
              variants,
              breakpoints
            ),
          };
        }

        return StyleSheet.create({
          ...acc,
          [key]: parseStyle(
            value,
            containerWidth,
            screenSize,
            variants,
            breakpoints
          ),
        });
      }, {}),
    [containerWidth, stylesheet, theme, variants, screenSize, breakpoints]
  );

  return {
    theme,
    styles: dynamicStyleSheet as ParseStyleKeys<ST>,
  };
};
