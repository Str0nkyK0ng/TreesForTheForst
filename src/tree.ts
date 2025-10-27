const CIRCULAR_STEPS = 100;
const BASE_RADIUS = 1;
const RADIUS_STEP = 5;
const NOISE_INTENSITY = 2;
const LINE_THICKNESS = 1;
const RING_COLORS = [
  '#614f52ff',
  '#614a4eff',
  '#5e3b40ff',
  '#7b5c5fff',
  '#8c6f6eff',
];

class Tree {
  totalNoise: number[];
  bigI: number;
  thickRoot: number;
  radiusStep: number;
  noise: any;
  size: number;
  constructor(scale: number = 1) {
    //seed random
    this.totalNoise = [];
    for (let i = 0; i <= CIRCULAR_STEPS; i++) {
      this.totalNoise[i] = 0;
    }
    this.bigI = 1;
    this.thickRoot = Math.round(Math.random() * 20 + 5);
    this.radiusStep = RADIUS_STEP;
    this.size = Math.floor(Math.random() * 15 + 15) * scale;
  }

  // seed random
  sampleNoise(i: number): number {
    //transform i so it is periodic
    const n = this.noise(i / 10) * NOISE_INTENSITY;
    this.totalNoise[i] += n + this.radiusStep;
    return this.totalNoise[i];
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    for (let r = 0; r < this.size; r++) {
      this.drawRing(ctx, centerX, centerY);
    }
  }
  animatedDraw(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number
  ) {
    let i = 0;
    this.drawRing(ctx, centerX, centerY);

    setInterval(() => {
      if (i < this.size) {
        this.drawRing(ctx, centerX, centerY);
        i++;
      }
    }, 1000);
  }

  drawRing(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    // tilt angle to make the ring look 3D (radians)
    ctx.beginPath();

    let currentPath: { x: number; y: number }[] = [];

    if (this.bigI % this.thickRoot == 0) {
      this.radiusStep = 2 * RADIUS_STEP;
      this.thickRoot = Math.round(Math.random() * 20 + 5);
    } else {
      this.radiusStep = RADIUS_STEP;
    }

    // compute expected max z-range for shading normalization (approx)
    const radius =
      BASE_RADIUS * (this.totalNoise[0] + this.radiusStep * this.size);

    for (let i = 0; i <= CIRCULAR_STEPS; i++) {
      // base noise-influenced radius & line width
      ctx.lineWidth = Math.max(1, LINE_THICKNESS * (1 + this.noise(i / 10)));

      const angle = (i / CIRCULAR_STEPS) * 2 * Math.PI;
      const noiseRadius = BASE_RADIUS * this.sampleNoise(i);
      const lerpFactor = 1 - i / CIRCULAR_STEPS; // more noise at the start
      const trueNoise =
        noiseRadius * lerpFactor + this.totalNoise[0] * (1 - lerpFactor);

      // 3D point before rotation: circle in X-Y plane
      const x = trueNoise * Math.cos(angle) + centerX;
      const y = trueNoise * Math.sin(angle) + centerY;

      // shading factor based on zR (closer -> brighter). clamp in [0.3,1]
      ctx.strokeStyle = RING_COLORS[this.bigI % RING_COLORS.length];

      // adjust lineWidth by perspective so nearer parts appear thicker
      ctx.lineWidth = Math.max(0.5, ctx.lineWidth * 1.5);

      // Store first point for closing the path (keeps original logic)
      if (i == 0) {
        currentPath.push({ x, y });
      }

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // close and stroke
    if (currentPath.length) {
      ctx.lineTo(currentPath[0].x, currentPath[0].y);
    }
    ctx.closePath();
    ctx.stroke();

    this.bigI++;
  }
}

export { Tree };
