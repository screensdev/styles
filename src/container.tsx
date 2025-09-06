'use client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Nullable } from './types/common';
import { isWithinTheWidth, type ParsedMqDimension } from './media';
import { ContainerContext } from './container-context';

const extractBreakpoints = (responsiveKeys: Set<symbol>) => {
  const breakpoints = new Set<number>();
  responsiveKeys.forEach((query) => {
    const queryString = query.description;
    if (!queryString) {
      return;
    }

    if (!isContainerQuery(queryString)) {
      return;
    }

    const parsedQuery = parseContainerQuery(queryString);

    if (!isValidContainerQuery(parsedQuery)) {
      return;
    }

    if (parsedQuery.width?.from && parsedQuery.width?.from > 0) {
      breakpoints.add(parsedQuery.width.from);
    }
    if (parsedQuery.width?.to && parsedQuery.width?.to !== Infinity) {
      breakpoints.add(parsedQuery.width.to);
    }
  });
  return breakpoints;
};

/**
 * An optimized hook that returns the closest container dimensions only when needed.
 * @returns - containerWidth
 */
function useCachedContainerWidth(containerQueries: Set<symbol>) {
  const { registerBreakpointListener, removeBreakpointListener } =
    useContext(ContainerContext);
  const [currentWidth, setCurrentWidth] = useState(0);

  const handleBreakpointUpdate = useCallback((width: number) => {
    setCurrentWidth(width);
  }, []);

  const breakpoints = useMemo(() => {
    return extractBreakpoints(containerQueries);
  }, [containerQueries]);

  useEffect(() => {
    registerBreakpointListener(breakpoints, handleBreakpointUpdate);

    return () => removeBreakpointListener(breakpoints, handleBreakpointUpdate);
  }, [
    breakpoints,
    handleBreakpointUpdate,
    registerBreakpointListener,
    removeBreakpointListener,
  ]);

  return currentWidth;
}

type ContainerValue = number;

type ContainerHandler = {
  width(wMin?: Nullable<ContainerValue>, wMax?: ContainerValue): symbol;
};

const CONTAINER_QUERY_REGEX = /:c:(w)\[(\d+)(?:,\s*(\d+|Infinity))?]/;
const isContainerQuery = (mq: string) => CONTAINER_QUERY_REGEX.test(mq);

const getContainerValue = (value: Nullable<ContainerValue>) => {
  if (typeof value === 'number') {
    return value;
  }

  if (value === null) {
    return 0;
  }

  return 0;
};

/**
 * Utility to create cross-platform container queries
 * @returns - JavaScript symbol to be used in your stylesheet
 */
const container: ContainerHandler = {
  width: (
    wMin: Nullable<ContainerValue> = 0,
    wMax: ContainerValue = Infinity
  ) => Symbol(`:c:w[${getContainerValue(wMin)}, ${getContainerValue(wMax)}]`),
};

type ParsedContainerQuery = {
  width?: ParsedMqDimension;
};

const isValidContainerQuery = (parsedContainerQuery: ParsedContainerQuery) => {
  const { width } = parsedContainerQuery;

  if (width) {
    return width.from <= width.to;
  }

  return false;
};

const parseContainerQuery = (mq: string): ParsedContainerQuery => {
  const [, width, fromW, toW] = CONTAINER_QUERY_REGEX.exec(mq) || [];

  return {
    width: width
      ? {
          from: Number(fromW),
          to: Number(toW),
        }
      : undefined,
  };
};

const matchContainerQuery = (
  queryKey: symbol,
  containerWidth: number
): boolean => {
  const queryString = queryKey.description;
  if (!queryString) {
    return false;
  }

  if (!isContainerQuery(queryString)) {
    return false;
  }

  const parsedQuery = parseContainerQuery(queryString);

  if (!isValidContainerQuery(parsedQuery)) {
    return false;
  }

  if (!parsedQuery?.width) {
    return false;
  }

  return isWithinTheWidth(parsedQuery.width, containerWidth);
};

export {
  container,
  isContainerQuery,
  isValidContainerQuery,
  matchContainerQuery,
  useCachedContainerWidth,
};
