// src/Noise.ts
export class Noise {
  private seed: number;

  constructor(seed = Math.random() * 1e9) {
    this.seed = seed;
  }

  private rand(x: number, y: number): number {
    // Simple deterministic hash → [-1, 1]
    const s = Math.sin(x * 127.1 + y * 311.7 + this.seed) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  }

  noise2D(x: number, y: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const n00 = this.rand(xi, yi);
    const n10 = this.rand(xi + 1, yi);
    const n01 = this.rand(xi, yi + 1);
    const n11 = this.rand(xi + 1, yi + 1);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    const nx0 = n00 + u * (n10 - n00);
    const nx1 = n01 + u * (n11 - n01);
    return nx0 + v * (nx1 - nx0);
  }
}
