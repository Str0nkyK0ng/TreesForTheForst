import { Tree } from './tree.js';
import { Noise } from './noise.js';
import { Player } from './player.js';
const canvas = document.getElementById('c');

let center = { x: 0, y: 0 };

function badNoise(i: number): number {
  return new Noise(Date.now()).noise2D(i, i);
}

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas element not found');
}
const ctx = canvas.getContext('2d', { alpha: false });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx!.fillStyle = '#B9889D';
ctx!.fillRect(0, 0, canvas.width, canvas.height);
let tempTree = new Tree(1, badNoise);

function betterRandom() {
  return Math.random() * 2 - 1;
}

//scatter some mobius marks on the ground (small circles and dashes)
function generateMobius(startX, endX, startY, endY, size) {
  let width = endX - startX;
  let wMidpoint = startX + width / 2;
  let height = endY - startY;
  let hMidpoint = startY + height / 2;
  let randomX = betterRandom() * width + wMidpoint;
  let randomY = betterRandom() * height + hMidpoint;
  let randomRad = Math.random() * size;
  let randomRad2 = Math.random() * size;

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(randomX, randomY, randomRad, randomRad2, 0, 360, 0);
  ctx.stroke();
}
for (let i = 0; i < 200; i++) {
  generateMobius(0, window.innerWidth, 0, window.innerHeight, 3);
}
tempTree.animatedDrawRing(
  ctx!,
  canvas.width / 2 - center.x,
  canvas.height / 2 - center.y
);

document.addEventListener('click', (e) => {
  let t = new Tree(1, badNoise);
  t.animatedDrawRing(ctx!, e.clientX - center.x, e.clientY - center.y);
});

const memory = navigator.hardwareConcurrency;
console.log(`This device has at least ${memory}GiB of RAM.`);
