import type { StrictBreakpoints } from './theme';
import type { Nullable } from './types/common';
import { useRef, useState } from 'react';
import { symmetricDifference } from './utils/collections';
import { Dimensions } from 'react-native';

/**
 * An optimized hook that returns the screens dimensions only when needed.
 * @returns - screenSize
 */
function useCachedScreenSize(
  mediaQueries: Set<symbol>,
  breakpoints: StrictBreakpoints | undefined
) {
  const [cachedScreenSize, setCachedScreenSize] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const matchingMediaQueries = useRef(new Set());

  Dimensions.addEventListener('change', ({ window }) => {
    const matchingQueries: Set<symbol> = new Set();
    const newSize = { width: window.width, height: window.height };

    mediaQueries.forEach((q) => {
      if (matchMediaQuery(q, newSize, breakpoints)) {
        matchingQueries.add(q);
      }
    });

    if (
      symmetricDifference(matchingQueries, matchingMediaQueries.current)
        .size === 0
    ) {
      return;
    }

    matchingMediaQueries.current = matchingQueries;
    setCachedScreenSize(newSize);
  });

  return cachedScreenSize;
}

type MediaValue = keyof StrictBreakpoints | number;

const getMediaValue = (value: Nullable<MediaValue>) => {
  if (typeof value === 'number') {
    return value;
  }

  if (value === null) {
    return 0;
  }

  return `:b[${value}]`;
};

/**
 * Utility to create cross-platform media queries
 * @returns - JavaScript symbol to be used in your stylesheet
 */
const media = {
  only: {
    width: (wMin: Nullable<MediaValue> = 0, wMax: MediaValue = Infinity) =>
      Symbol(`:m:w[${getMediaValue(wMin)}, ${getMediaValue(wMax)}]`),
    height: (hMin: Nullable<MediaValue> = 0, hMax: MediaValue = Infinity) =>
      Symbol(`:m:h[${getMediaValue(hMin)}, ${getMediaValue(hMax)}]`),
  },
  width: (wMin: Nullable<MediaValue> = 0, wMax: MediaValue = Infinity) => ({
    and: {
      height: (hMin: Nullable<MediaValue> = 0, hMax: MediaValue = Infinity) =>
        Symbol(
          `:m:w[${getMediaValue(wMin)}, ${getMediaValue(wMax)}]:h[${getMediaValue(hMin)}, ${getMediaValue(hMax)}]`
        ),
    },
  }),
  height: (hMin: Nullable<MediaValue> = 0, hMax: MediaValue = Infinity) => ({
    and: {
      width: (wMin: Nullable<MediaValue> = 0, wMax: MediaValue = Infinity) =>
        Symbol(
          `:m:w[${getMediaValue(wMin)}, ${getMediaValue(wMax)}]:h[${getMediaValue(hMin)}, ${getMediaValue(hMax)}]`
        ),
    },
  }),
};

const IS_MEDIA_REGEX =
  /:m:([hw])\[(\d+|:b\[[a-zA-Z]+\])(?:,\s*(\d+|:b\[[a-zA-Z]+\]|Infinity))?]/;
const WIDTH_REGEX =
  /:(w)\[(\d+|:b\[[a-zA-Z]+\])(?:,\s*(\d+|:b\[[a-zA-Z]+\]|Infinity))?]/;
const HEIGHT_REGEX =
  /:(h)\[(\d+|:b\[[a-zA-Z]+\])(?:,\s*(\d+|:b\[[a-zA-Z]+\]|Infinity))?]/;
const BREAKPOINT_REGEX = /:b\[([a-zA-Z]+)\]/;

type ParsedMqDimension = {
  from: number;
  to: number;
};

type ParsedMediaQuery = {
  width?: ParsedMqDimension;
  height?: ParsedMqDimension;
};

type ScreenSize = {
  width: number;
  height: number;
};

const parseBreakpoint = (
  mqDim: string | undefined,
  breakpoints: StrictBreakpoints | undefined
) => {
  if (!mqDim) {
    return Number(mqDim);
  }
  if (!BREAKPOINT_REGEX.test(mqDim)) {
    return Number(mqDim);
  }
  const [, breakpoint] = BREAKPOINT_REGEX.exec(mqDim) || [];
  if (!breakpoint) {
    return Number(mqDim);
  }
  return breakpoints?.[breakpoint as keyof StrictBreakpoints] ?? 0;
};

/**
 * @internal Exposed for testing
 */
export const parseMediaQuery = (
  mq: string,
  breakpoints: StrictBreakpoints | undefined
): ParsedMediaQuery => {
  const [, width, fromW, toW] = WIDTH_REGEX.exec(mq) || [];
  const [, height, fromH, toH] = HEIGHT_REGEX.exec(mq) || [];

  const parsedFromW = parseBreakpoint(fromW, breakpoints);
  const parsedFromH = parseBreakpoint(fromH, breakpoints);
  const parsedToW = parseBreakpoint(toW, breakpoints);
  const parsedToH = parseBreakpoint(toH, breakpoints);

  return {
    width: width
      ? {
          from: parsedFromW,
          to: parsedToW,
        }
      : undefined,
    height: height
      ? {
          from: parsedFromH,
          to: parsedToH,
        }
      : undefined,
  };
};

const isMediaQuery = (mq: string) => IS_MEDIA_REGEX.test(mq);

const isValidMediaQuery = (parsedMq: ParsedMediaQuery) => {
  const { width, height } = parsedMq;

  if (width && height) {
    return width.from <= width.to && height.from <= height.to;
  }

  if (width) {
    return width.from <= width.to;
  }

  if (height) {
    return height.from <= height.to;
  }

  return false;
};

const isWithinTheWidthAndHeight = (
  parsedMq: ParsedMediaQuery,
  screenSize: ScreenSize
): boolean => {
  const { width, height } = parsedMq;

  if (width && height) {
    return (
      isWithinTheWidth(width, screenSize.width) &&
      isWithinTheHeight(height, screenSize.height)
    );
  }

  if (width) {
    return isWithinTheWidth(width, screenSize.width);
  }

  if (height) {
    return isWithinTheHeight(height, screenSize.height);
  }

  return false;
};

const isWithinTheWidth = (
  width: Exclude<ParsedMediaQuery['width'], undefined>,
  screenWidth: number
): boolean => {
  const { from, to } = width;

  return screenWidth >= from && screenWidth <= to;
};

const isWithinTheHeight = (
  height: ParsedMediaQuery['height'],
  screenHeight: number
): boolean => {
  const { from, to } = height as ParsedMqDimension;

  return screenHeight >= from && screenHeight <= to;
};

const matchMediaQuery = (
  queryKey: symbol,
  screenSize: ScreenSize | undefined,
  breakpoints: StrictBreakpoints | undefined
): boolean => {
  const queryString = queryKey.description;
  if (!queryString || !screenSize) {
    return false;
  }

  if (!isMediaQuery(queryString)) {
    return false;
  }

  const parsedQuery = parseMediaQuery(queryString, breakpoints);

  if (!isValidMediaQuery(parsedQuery)) {
    return false;
  }

  if (!isValidMediaQuery(parsedQuery)) {
    return false;
  }

  return isWithinTheWidthAndHeight(parsedQuery, screenSize);
};

export {
  type ParsedMqDimension,
  type ScreenSize,
  isMediaQuery,
  isWithinTheWidth,
  matchMediaQuery,
  media,
  useCachedScreenSize,
};
