const canvas = document.getElementById('c');
let ringColors = ['#ffffffff'];
const ctx = canvas.getContext('2d', { alpha: false });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let steps = 100;
let baseRadius = 1;
let RADIUS_STEP = 5;
let radiusStep = RADIUS_STEP;
let noiseIntensity = 1;
let rings = 30;
let totalNoise = [];
for (let i = 0; i <= steps; i++) {
  totalNoise[i] = 0;
}
let bigI = 1;

window.noise.seed(new Date().getTime());
let thickRoot = Math.round(Math.random() * 20 + 5);
console.log('Thick root:', thickRoot);
// seed random
function sampleNoise(i) {
  //transform i so it is periodic
  const n = window.noise.simplex2(i / 10, bigI / 10) * noiseIntensity;
  totalNoise[i] += n + radiusStep;

  return totalNoise[i];
}

// Store the path points for the last ring
let lastRingPath = [];
function drawCircle(centerX, centerY, isLastRing = false) {
  ctx.strokeStyle = ringColors[bigI % ringColors.length];
  ctx.beginPath();
  let currentPath = [];
  if (bigI % thickRoot == 0) {
    radiusStep = 2 * RADIUS_STEP;
    thickRoot = Math.round(Math.random() * 20 + 5);
  } else {
    radiusStep = RADIUS_STEP;
  }
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const noiseRadius = baseRadius + sampleNoise(i);
    const localX = noiseRadius * Math.cos(angle);
    const localY = noiseRadius * Math.sin(angle);

    const x = centerX + localX;
    const y = centerY + localY;

    // Store path points if this is the last ring
    if (i == 0) {
      currentPath.push({ x, y });
    }

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(currentPath[0].x, currentPath[0].y);
  ctx.closePath();
  ctx.stroke();

  // Save the path for the last ring
  if (isLastRing) {
    lastRingPath = currentPath;
  }

  bigI++;
}

let c = canvas.width / 2;
let d = canvas.height / 2;

for (let i = 0; i < rings; i++) {}

let i = 0;
setInterval(() => {
  i++;
  drawCircle(c, d, i === rings - 1);
}, 100);

document.body.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  drawCircle(x, y, i === rings - 1);

  setInterval(() => {
    i++;
    drawCircle(x, y, i === rings - 1);
  }, 1000);
});
