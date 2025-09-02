import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { Theme } from '../theme';

/** StyleSheet input */

type AllAvailableStyles = ViewStyle & TextStyle & ImageStyle;
type AllAvailableKeys = keyof (ViewStyle & TextStyle & ImageStyle);

type VariantValues = {
  [variantName: string]: {
    [variant: string]: StyleObject;
  };
};

type StyleObject = {
  [propName in AllAvailableKeys]?: AllAvailableStyles[propName];
};
type StylesValues = StyleObject &
  ResponsiveObject<StyleObject> & {
    variants?: VariantValues;
  };

type ThemableStyleSheet = {
  [styleName: string]:
    | StylesValues
    | ((theme: Theme | undefined) => StylesValues);
};

type ResponsiveObject<V> = {
  [x: symbol]: V;
};

type ResponsiveValue<T> = T | ResponsiveObject<T> | undefined;

/** Variant Map Input */

type Variants<T> = T extends object ? ExtractVariant<T[keyof T]> : never;

type ExtractVariant<T> = T extends (theme: Theme | undefined) => infer R
  ? R extends { variants: infer V }
    ? { [key in keyof V]?: ResponsiveValue<ExtractSubVariantKeys<V[key]>> }
    : never
  : T extends { variants: infer V }
    ? { [key in keyof V]?: ResponsiveValue<ExtractSubVariantKeys<V[key]>> }
    : never;

type ExtractSubVariantKeys<T> = T extends object
  ? HasBooleanVariants<T> extends true
    ? keyof Omit<T, 'default'> | boolean | undefined
    : keyof Omit<T, 'default'> | undefined
  : never;

type HasBooleanVariants<T> =
  T extends Record<'true', any>
    ? true
    : T extends Record<'false', any>
      ? true
      : false;

export type {
  AllAvailableStyles,
  AllAvailableKeys,
  ResponsiveValue,
  StylesValues,
  ThemableStyleSheet,
  Variants,
  VariantValues,
};
