import { Tree } from './tree.js';
import { Noise } from './noise.js';
const canvas = document.getElementById('c');

function badNoise(i: number): number {
  return new Noise(Date.now()).noise2D(i, i);
}

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas element not found');
}
const ctx = canvas.getContext('2d', { alpha: false });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx!.fillStyle = '#102200ff';
ctx!.fillRect(0, 0, canvas.width, canvas.height);
let tempTree = new Tree();

document.addEventListener('click', (e) => {
  tempTree = new Tree();
  tempTree.noise = badNoise;
  let x = e.clientX;
  let y = e.clientY;
  tempTree.animatedDraw(ctx!, x, y);
});

//define 5 trees at random positions
let trees: Tree[] = [];
for (let i = 0; i < 5; i++) {
  let tree = new Tree();
  tree.noise = badNoise;
  trees.push(tree);
}

function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx!.fillStyle = '#102200ff';
  ctx!.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < trees.length; i++) {
    let x = (canvas.width / (trees.length + 1)) * (i + 1);
    let y = canvas.height / 2 + (Math.random() * 100 - 50);
    trees[i].drawRing(ctx!, x, y);
  }
}

draw(canvas, ctx!);
