import type { Theme } from '../theme';
import type { AllAvailableStyles, StylesValues } from './input';

type FlattenStyle<T> = T extends object
  ? {
      [K in keyof T]: K extends keyof AllAvailableStyles
        ? AllAvailableStyles[K]
        : T[K];
    }
  : never;

type FlattenVariants<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? {
            [key in keyof T[K]]: T[K][key] extends object
              ? ParseNestedObject<T[K][key]>
              : never;
          }
        : never;
    }
  : never;

type ParseVariants<T> = T extends object
  ? T[keyof T] extends object
    ? UnionToIntersection<ParseVariants<T[keyof T]>> extends never
      ? ParseVariants<T[keyof T]>
      : UnionToIntersection<ParseVariants<T[keyof T]>>
    : T
  : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ParseNestedObject<T> = T extends StylesValues
  ? T extends { variants: infer R }
    ? FlattenStyle<ParseVariants<FlattenVariants<R>> & Omit<T, 'variants'>>
    : {
        [K in keyof T]: K extends keyof AllAvailableStyles
          ? AllAvailableStyles[K]
          : T[K];
      }
  : T;

type ParseStyleKey<T> = T extends (theme: Theme | undefined) => infer R
  ? ParseNestedObject<R>
  : ParseNestedObject<T>;

type ParseStyleKeys<T> = T extends object
  ? { [K in keyof T]: ParseStyleKey<T[K]> }
  : never;

type ParsedStylesheet<ST extends AllAvailableStyles> = {
  theme: Theme | undefined;
  styles: ParseStyleKeys<ST>;
};

export type { ParseStyleKeys, ParsedStylesheet };
