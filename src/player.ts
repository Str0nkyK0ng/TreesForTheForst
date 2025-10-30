class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Player {
  size: number;
  position: Position;

  constructor(scale: number = 1) {
    this.size = Math.floor(Math.random() * 15 + 15) * scale;
    this.position = new Position(0, 0);
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#0000ffff';
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export { Player };
