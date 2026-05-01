export {};

declare global {
  interface Window {
    isFragment: (item: unknown) => boolean;
  }
}
