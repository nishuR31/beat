export type VisualizationStyle = 'bars' | 'circle' | 'waveform' | 'phonk' | 'spiral';

export interface VisualizationContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  analyser: AnalyserNode;
  width: number;
  height: number;
  gradient: CanvasGradient;
  beatGlow: number;
  particles: Particle[];
  mirrorEffect: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// Bars Visualization
export function drawBars(context: VisualizationContext) {
  const { ctx, dataArray, width, height, gradient, beatGlow } = context;

  const barWidth = (width / dataArray.length) * 2.5;
  let barHeight: number;
  let x = 0;

  ctx.fillStyle = gradient;

  for (let i = 0; i < dataArray.length; i++) {
    barHeight = (dataArray[i] / 255) * height * 0.8;

    // Add glow effect
    const glowIntensity = beatGlow * (dataArray[i] / 255);
    ctx.shadowBlur = 20 + glowIntensity * 30;
    ctx.shadowColor = `rgba(100, 200, 255, ${0.5 + glowIntensity * 0.5})`;

    ctx.fillRect(x, height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }

  ctx.shadowBlur = 0;
}

// Circle/Radial Visualization
export function drawCircle(context: VisualizationContext) {
  const { ctx, dataArray, width, height, gradient, beatGlow } = context;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.7;

  ctx.fillStyle = gradient;
  ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 + beatGlow * 0.4})`;
  ctx.lineWidth = 2 + beatGlow * 3;

  for (let i = 0; i < dataArray.length; i++) {
    const angle = (i / dataArray.length) * Math.PI * 2;
    const value = dataArray[i] / 255;
    const radius = maxRadius * value;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// Waveform Visualization
export function drawWaveform(context: VisualizationContext) {
  const { ctx, dataArray, width, height, gradient, beatGlow } = context;

  const centerY = height / 2;
  const lineWidth = width / dataArray.length;

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3 + beatGlow * 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();

  for (let i = 0; i < dataArray.length; i++) {
    const value = (dataArray[i] - 128) / 128;
    const x = (i / dataArray.length) * width;
    const y = centerY + value * height * 0.4;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Add reflection effect
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  for (let i = dataArray.length - 1; i >= 0; i--) {
    const value = (dataArray[i] - 128) / 128;
    const x = (i / dataArray.length) * width;
    const y = centerY - value * height * 0.4;

    if (i === dataArray.length - 1) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Phonk Style Visualization (bouncy bars with bass emphasis)
export function drawPhonk(context: VisualizationContext) {
  const { ctx, dataArray, width, height, gradient, beatGlow } = context;

  // Focus on bass frequencies
  const bassCount = Math.floor(dataArray.length * 0.3);
  const barWidth = width / bassCount;

  ctx.fillStyle = gradient;

  for (let i = 0; i < bassCount; i++) {
    const value = dataArray[i] / 255;
    const barHeight = value * height * 0.9;

    // Bouncy effect
    const bounce = Math.sin(Date.now() * 0.01 + i * 0.5) * 0.1 + 0.9;
    const finalHeight = barHeight * bounce;

    // Add strong glow on bass
    const glowIntensity = beatGlow * value;
    ctx.shadowBlur = 30 + glowIntensity * 40;
    ctx.shadowColor = `rgba(255, 50, 100, ${0.6 + glowIntensity * 0.4})`;

    ctx.fillRect(i * barWidth, height - finalHeight, barWidth * 0.9, finalHeight);
  }

  ctx.shadowBlur = 0;
}

// Spiral/Tunnel Visualization
export function drawSpiral(context: VisualizationContext) {
  const { ctx, dataArray, width, height, gradient, beatGlow } = context;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.8;

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;

  // Draw spiral rings
  const rings = 20;
  for (let ring = 0; ring < rings; ring++) {
    const ringIndex = Math.floor((ring / rings) * (dataArray.length - 1));
    const value = dataArray[ringIndex] / 255;
    const radius = (ring / rings) * maxRadius * (0.5 + value * 0.5);

    const angle = (Date.now() * 0.0005 + ring * 0.3) % (Math.PI * 2);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw spiral lines
    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
      const segmentAngle = (i / dataArray.length) * Math.PI * 2 + angle;
      const segmentValue = dataArray[i] / 255;
      const segmentRadius = radius * (0.8 + segmentValue * 0.2);

      const x = centerX + Math.cos(segmentAngle) * segmentRadius;
      const y = centerY + Math.sin(segmentAngle) * segmentRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

// Particle effect drawing
export function updateAndDrawParticles(context: VisualizationContext) {
  const { ctx, particles, width, height } = context;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // gravity
    p.life -= 1;

    // Draw particle
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  ctx.globalAlpha = 1;
}

// Generate particles on beat
export function generateBeatParticles(
  context: VisualizationContext,
  count: number = 10
) {
  const { width, height, particles } = context;

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 2 + Math.random() * 3;

    particles.push({
      x: width / 2,
      y: height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 60,
      maxLife: 60,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`,
      size: 2 + Math.random() * 3,
    });
  }
}
