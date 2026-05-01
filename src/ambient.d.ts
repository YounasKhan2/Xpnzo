// Ambient module declarations for packages that ship without bundled type definitions.
// This file must NOT contain any import/export statements (it must remain a script file)
// so that 'declare module' creates true ambient module declarations.

declare module 'react-is' {
  export function isFragment(object: unknown): boolean;
  export function isElement(object: unknown): boolean;
  export function isValidElementType(object: unknown): boolean;
}
