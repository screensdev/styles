'use client';
import { useRef } from 'react';

export const useVariantMap = <T>(variantsMap?: T): T | undefined => {
  const variantsRef = useRef(variantsMap);

  variantsRef.current = variantsMap;

  return variantsRef.current;
};
