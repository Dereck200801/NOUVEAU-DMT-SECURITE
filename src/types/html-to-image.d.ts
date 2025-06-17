declare module 'html-to-image' {
  export function toSvg(node: HTMLElement, options?: any): Promise<string>;
  export function toPng(node: HTMLElement, options?: any): Promise<string>;
} 