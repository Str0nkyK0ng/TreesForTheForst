const CIRCULAR_STEPS = 100;
const BASE_RADIUS = 1;
const RADIUS_STEP = 5;
const NOISE_INTENSITY = 2;
const LINE_THICKNESS = 1;
const RING_COLORS = ['#000000ff'];

class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Tree {
  totalNoise: number[];
  bigI: number;
  thickRoot: number;
  radiusStep: number;
  noise: any;
  size: number;

  //actual data about the rings
  ringData: Position[][];
  lineWidths: number[];

  constructor(scale: number = 1, n: any) {
    //seed random
    this.totalNoise = [];
    for (let i = 0; i <= CIRCULAR_STEPS; i++) {
      this.totalNoise[i] = 0;
    }
    this.bigI = 1;
    this.thickRoot = Math.round(Math.random() * 20 + 5);
    this.radiusStep = RADIUS_STEP;
    this.noise = n;
    this.size = Math.floor(Math.random() * 15 + 15) * scale;
    this.lineWidths = [];
    this.ringData = [];
    for (let i = 0; i < this.size; i++) {
      this.generateRing();
    }
  }

  // seed random
  sampleNoise(i: number): number {
    //transform i so it is periodic
    const n = this.noise(i / 10) * NOISE_INTENSITY;
    this.totalNoise[i] += n + this.radiusStep;
    return this.totalNoise[i];
  }

  generateRing() {
    let currentPath: Position[] = [];

    if (this.bigI % this.thickRoot == 0) {
      this.radiusStep = 2 * RADIUS_STEP;
      this.thickRoot = Math.round(Math.random() * 20 + 5);
    } else {
      this.radiusStep = RADIUS_STEP;
    }
    for (let i = 0; i <= CIRCULAR_STEPS; i++) {
      // base noise-influenced radius & line width
      this.lineWidths.push(
        Math.max(1, LINE_THICKNESS * (1 + this.noise(i / 10)))
      );

      const angle = (i / CIRCULAR_STEPS) * 2 * Math.PI;
      const noiseRadius = BASE_RADIUS * this.sampleNoise(i);
      const lerpFactor = 1 - i / CIRCULAR_STEPS; // more noise at the start
      const trueNoise =
        noiseRadius * lerpFactor + this.totalNoise[0] * (1 - lerpFactor);

      // 3D point before rotation: circle in X-Y plane
      const x = trueNoise * Math.cos(angle);
      const y = trueNoise * Math.sin(angle);
      // Store first point for closing the path (keeps original logic)
      currentPath.push({ x, y });
    }

    // close
    console.log(currentPath);
    currentPath.push(currentPath[0]);
    this.bigI++;
    // Store the ring data
    this.ringData.push(currentPath);
  }

  drawLines(ctx: CanvasRenderingContext2D, x: number, y: number) {
    for (let r = 0; r < 100; r += 1) {
      this.drawLine(ctx, x, y);
    }
  }
  drawLine(ctx: CanvasRenderingContext2D, x: number, y: number) {
    let lineIndex = Math.floor(Math.random() * CIRCULAR_STEPS);
    ctx.beginPath(); // Start a new path
    ctx.strokeStyle = 'black';
    let startRing = 1 + Math.floor(Math.random() * (this.ringData.length - 2));
    let endRing =
      startRing +
      Math.floor(Math.random() * (this.ringData.length - 2 - startRing));

    ctx.moveTo(
      x + this.ringData[startRing][lineIndex].x,
      y + this.ringData[startRing][lineIndex].y
    );
    ctx.lineWidth = 0.25;
    ctx.lineTo(
      x + this.ringData[endRing][lineIndex].x,
      y + this.ringData[endRing][lineIndex].y
    );
    ctx.stroke();
  }

  drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, i: number) {
    // Apply translate to position the ring, then shear in X
    ctx.save();
    ctx.translate(x, y);
    let scaleAmount = 1.1 * (i / this.size);
    ctx.scale(scaleAmount, scaleAmount);

    const lastRing = this.ringData[i];
    ctx.fillStyle = '#00000057';
    ctx.beginPath();
    for (let i = 0; i < lastRing.length; i++) {
      const pos = lastRing[i];
      if (i === 0) {
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  animatedDrawRing(ctx: CanvasRenderingContext2D, x: number, y: number) {
    let progress = 0;
    for (let r = 0; r < this.ringData.length; r++) {
      setTimeout(() => {
        this.drawShadow(ctx, x + 10, y + 10, r);
        this.fillRing(ctx, r, x, y);

        for (let i = 0; i < r; i++) {
          this.drawRing(ctx, i, x, y);
        }
        if (r == this.ringData.length - 1) {
          this.drawLines(ctx, x, y);
        }
      }, progress);
      progress += 1000;
    }
  }

  drawRing(
    ctx: CanvasRenderingContext2D,
    ringIndex: number,
    x: number,
    y: number
  ) {
    const ring = this.ringData[ringIndex];
    ctx.strokeStyle = RING_COLORS[ringIndex % RING_COLORS.length];
    ctx.lineWidth = this.lineWidths[ringIndex % this.lineWidths.length];

    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const pos = ring[i];
      if (i == 0) {
        ctx.moveTo(x + pos.x, y + pos.y);
      } else {
        ctx.lineTo(x + pos.x, y + pos.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  fillRing(
    ctx: CanvasRenderingContext2D,
    ringIndex: number,
    x: number,
    y: number
  ) {
    let lastRing = this.ringData[ringIndex];
    ctx.fillStyle = '#B96C86';
    ctx.beginPath();
    for (let i = 0; i < lastRing.length; i++) {
      const pos = lastRing[i];
      if (i == 0) {
        ctx.moveTo(x + pos.x, y + pos.y);
      } else {
        ctx.lineTo(x + pos.x, y + pos.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.drawShadow(ctx, x + 10, y + 10, this.ringData.length - 1);
    //draw the last ring as a bg
    let lastRing = this.ringData[this.ringData.length - 1];
    ctx.fillStyle = '#83607C';
    ctx.beginPath();
    for (let i = 0; i < lastRing.length; i++) {
      const pos = lastRing[i];
      if (i == 0) {
        ctx.moveTo(x + pos.x, y + pos.y);
      } else {
        ctx.lineTo(x + pos.x, y + pos.y);
      }
    }
    ctx.closePath();
    ctx.fill();
    lastRing = this.ringData[this.ringData.length - 1];

    for (let r = 0; r < this.ringData.length; r++) {
      this.drawRing(ctx, r, x, y);
    }
  }
}

export { Tree };
