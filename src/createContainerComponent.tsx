'use client';
import React, { useCallback, useRef } from 'react';

import type { View } from 'react-native';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import { ContainerContext } from './container-context';

/**
 * A function that wraps a component in a ContainerContext that automatically tracks the size of the provided components.
 * @param Component - React component to use as container (Must be based on View from react-native)
 * @returns - new component wrapped in container context
 */
const createContainerComponent = (
  Component: React.ComponentType<ViewProps & React.RefAttributes<View>>
) => {
  const ContainerComponent = React.forwardRef<View, ViewProps>(
    (props: ViewProps, ref) => {
      const { onLayout: onLayoutProp, ...restProps } = props;
      const prevBreakpoint = useRef(0);
      const breakpointCallbacks = useRef<Set<(width: number) => void>>(
        new Set()
      );
      const allBreakpoints = useRef<number[]>([]);

      const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
          const { width: containerWidth } = event.nativeEvent.layout;
          if (onLayoutProp) {
            onLayoutProp(event);
          }

          if (containerWidth === 0) {
            return;
          }

          if (allBreakpoints.current.length === 0) {
            return;
          }

          const deduppedBreakpoints = [...new Set(allBreakpoints.current)];

          const sortedBreakpoints = deduppedBreakpoints.sort((a, b) => a - b);

          const matchingBreakpoint = sortedBreakpoints.findLast(
            (b) => b <= containerWidth
          );

          if (!matchingBreakpoint) {
            if (prevBreakpoint.current === 0) {
              return;
            }

            prevBreakpoint.current = 0;
            return breakpointCallbacks.current.forEach((callback) =>
              callback(containerWidth)
            );
          }

          if (matchingBreakpoint === prevBreakpoint.current) {
            return;
          }

          prevBreakpoint.current = matchingBreakpoint;

          breakpointCallbacks.current.forEach((callback) =>
            callback(containerWidth)
          );
        },
        [onLayoutProp]
      );

      const registerBreakpointListener = useCallback(
        (breakpoints: Set<number>, callback: (width: number) => void) => {
          if (breakpoints.size > 0) {
            breakpointCallbacks.current.add(callback);
            allBreakpoints.current.push(...Array.from(breakpoints.values()));
          }
        },
        []
      );

      const removeBreakpointListener = useCallback(
        (breakpoints: Set<number>, callback: (width: number) => void) => {
          breakpoints.forEach((b) => {
            const firstMatch = allBreakpoints.current.findIndex((p) => b === p);
            allBreakpoints.current.splice(firstMatch, 1);
          });
          if (breakpointCallbacks.current.has(callback)) {
            breakpointCallbacks.current.delete(callback);
          }
        },
        []
      );

      return (
        <ContainerContext
          value={{
            registerBreakpointListener,
            removeBreakpointListener,
          }}
        >
          <Component ref={ref} onLayout={handleLayout} {...restProps} />
        </ContainerContext>
      );
    }
  );
  return ContainerComponent;
};

export { createContainerComponent };
