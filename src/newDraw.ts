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

//scatter some mobius marks on the ground (small circles and dashes)
for (let i = 0; i < 200; i++) {
  let randomX = Math.random() * canvas.width;
  let randomY = Math.random() * canvas.height;
  let randomRad = Math.random() * 3;
  let randomRad2 = Math.random() * 3;

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(randomX, randomY, randomRad, randomRad2, 0, 360, 0);
  ctx.stroke();
}

//draw leafs
let leafColor = '#9F94D9';
for (let i = 0; i < 3; i++) {
  let randomX = Math.random() * canvas.width;
  let randomY = Math.random() * canvas.height;
  let randomRad = Math.random() * 5;
  let randomRad2 = Math.random() * 5;

  ctx.strokeStyle = leafColor;
  ctx.beginPath();
  ctx.ellipse(randomX, randomY, randomRad, randomRad2, 0, 360, 0);
  ctx.stroke();
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
