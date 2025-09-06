'use client';
import { createContext } from 'react';

interface ContainerContextValue {
  registerBreakpointListener: (
    breakpoints: Set<number>,
    callback: (width: number) => void
  ) => void;
  removeBreakpointListener: (
    breakpoints: Set<number>,
    callback: (width: number) => void
  ) => void;
}

const defaultValue = {
  registerBreakpointListener: () => {},
  removeBreakpointListener: () => {},
};

const ContainerContext = createContext<ContainerContextValue>(defaultValue);

export { ContainerContext };
