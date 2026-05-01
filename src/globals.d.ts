export {};

declare global {
  interface Window {
    isFragment: (item: unknown) => boolean;
  }
}

// react-is ships with React 19 but bundles types differently — declare manually
declare module 'react-is' {
  export function isFragment(object: unknown): boolean;
  export function isElement(object: unknown): boolean;
  export function isValidElementType(object: unknown): boolean;
}
