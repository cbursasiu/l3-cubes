export function hexToRgb(hex: string): number[] {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  // Parse the hex value to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

export function rgbToHex(rgb: number[]): string {
  const clamp = (value: number) => Math.min(255, Math.max(0, value));

  const rHex = clamp(rgb[0]).toString(16).padStart(2, '0');
  const gHex = clamp(rgb[1]).toString(16).padStart(2, '0');
  const bHex = clamp(rgb[2]).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

export function colorStringToNumber(color: string): number {
  const hex = color.replace(/^#/, '');
  return parseInt(hex, 16);
}

export function numberToColorString(num: number): string {
  const hexColor = num.toString(16).padStart(6, '0');
  return `#${hexColor}`;
}
