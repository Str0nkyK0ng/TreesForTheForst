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
tempTree.noise = badNoise;
tempTree.draw(ctx!, canvas.width / 2, canvas.height / 2);

document.addEventListener('click', (e) => {
  tempTree = new Tree();
  tempTree.noise = badNoise;
  let x = e.clientX;
  let y = e.clientY;
  tempTree.animatedDraw(ctx!, x, y);
});
