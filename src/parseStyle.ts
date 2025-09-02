import { Platform } from 'react-native';
import { matchContainerQuery } from './container';
import { matchMediaQuery, type ScreenSize } from './media';
import type {
  ResponsiveValue,
  StylesValues,
  VariantValues,
} from './types/input';
import type { StrictBreakpoints } from './theme';

const matchBreakpoint = (
  key: symbol,
  containerWidth: number,
  screenSize: ScreenSize | undefined,
  breakpoints: StrictBreakpoints | undefined
) => {
  const containerQueryMatches = matchContainerQuery(key, containerWidth);
  if (containerQueryMatches) {
    return true;
  }
  const mediaQueryMatches = matchMediaQuery(key, screenSize, breakpoints);
  if (mediaQueryMatches) {
    return true;
  }
  return false;
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const isPlatformColor = <T extends StylesValues[keyof StylesValues]>(
  value: T
): boolean => {
  if (!value) {
    return false;
  }

  if (isIOS) {
    return 'semantic' in value && typeof value.semantic === 'object';
  }

  return (
    isAndroid &&
    'resource_paths' in value &&
    typeof value.resource_paths === 'object'
  );
};

const parseVariantStyles = (
  variantOptions: VariantValues[keyof VariantValues] | undefined,
  variantSelection: ResponsiveValue<string | number | undefined> | undefined,
  containerWidth: number,
  screenSize: ScreenSize | undefined,
  breakpoints: StrictBreakpoints | undefined
) => {
  if (!variantOptions) {
    return {};
  }

  // Fallback to default if its there
  if (!variantSelection) {
    return variantOptions?.default
      ? parseStyle(variantOptions.default, containerWidth, screenSize)
      : {};
  }

  if (typeof variantSelection !== 'object') {
    const selection =
      variantOptions?.[variantSelection] ?? variantOptions?.default;
    return selection ? parseStyle(selection, containerWidth, screenSize) : {};
  }

  const breakpointKeys = Object.getOwnPropertySymbols(variantSelection);

  let selectedVariantKey: string | number | undefined;
  // Find the first breakpoint that matches
  for (let i = 0; i < breakpointKeys.length; i++) {
    const currentBreakpointKey = breakpointKeys[i];
    if (!currentBreakpointKey) {
      break;
    }
    if (
      matchBreakpoint(
        currentBreakpointKey,
        containerWidth,
        screenSize,
        breakpoints
      )
    ) {
      selectedVariantKey = variantSelection[currentBreakpointKey];
      break;
    }
  }

  const variantStyles = selectedVariantKey
    ? variantOptions[selectedVariantKey]
    : undefined;

  if (!variantStyles) {
    return variantOptions?.default
      ? parseStyle(variantOptions.default, containerWidth, screenSize)
      : {};
  }

  return parseStyle(variantStyles, containerWidth, screenSize);
};

export const parseStyle = <T extends StylesValues>(
  style: T,
  containerWidth: number,
  screenSize: ScreenSize | undefined,
  variantSelectionMap: Record<
    string,
    ResponsiveValue<string | number | undefined>
  > = {},
  breakpoints?: StrictBreakpoints | undefined
): T => {
  const nonResponsiveStyles = Object.entries(style || {}).reduce(
    (acc, [key, value]) => {
      if (!value) {
        return acc;
      }
      if (key === 'variants') {
        const variantStyleSheet = value as VariantValues;
        return {
          ...acc,
          ...Object.keys(variantStyleSheet).reduce(
            (allParsedVariantStyles, variantName) => ({
              ...allParsedVariantStyles,
              ...parseVariantStyles(
                variantStyleSheet?.[variantName],
                variantSelectionMap?.[variantName],
                containerWidth,
                screenSize,
                breakpoints
              ),
            }),
            {}
          ),
        };
      }
      return {
        ...acc,
        [key]: value,
      };
    },
    {} as T
  );

  const responsiveKeys = Object.getOwnPropertySymbols(style);
  if (!responsiveKeys.length) {
    return nonResponsiveStyles;
  }

  let responsiveStyles = {};
  responsiveKeys.forEach((query) => {
    if (matchBreakpoint(query, containerWidth, screenSize, breakpoints)) {
      const matchingStyles = style[query];
      if (matchingStyles) {
        responsiveStyles = {
          ...responsiveStyles,
          ...parseStyle(
            matchingStyles,
            containerWidth,
            screenSize,
            variantSelectionMap
          ),
        };
      }
    }
  });
  return {
    ...nonResponsiveStyles,
    ...responsiveStyles,
  };
};
