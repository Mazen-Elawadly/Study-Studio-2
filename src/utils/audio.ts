import { NOISE_FACTORS } from '../constants/modes';
import { NoiseType } from '../types';

let actx: AudioContext | null = null;
const bufCache: Record<string, AudioBuffer> = {};
let currentNoise: {
  src: AudioBufferSourceNode;
  g: GainNode;
  c: AudioContext;
  type: NoiseType;
} | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!actx) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      actx = new AudioCtx();
    } catch {
      return null;
    }
  }
  if (actx && actx.state === 'suspended') {
    actx.resume().catch(() => {});
  }
  return actx;
}

export function getBufferFor(c: AudioContext, type: NoiseType): AudioBuffer {
  if (bufCache[type]) return bufCache[type];
  const len = c.sampleRate * 4;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);

  if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else if (type === 'brown') {
    let last = 0;
    for (let i = 0; i < len; i++) {
      const wb = Math.random() * 2 - 1;
      last = (last + 0.02 * wb) / 1.02;
      d[i] = last * 3.5;
    }
  } else {
    // white / rain baseline
    for (let i = 0; i < len; i++) {
      d[i] = Math.random() * 2 - 1;
    }
  }
  bufCache[type] = buf;
  return buf;
}

export function startNoise(type: NoiseType, vol: number): boolean {
  const c = getAudioContext();
  if (!c) return false;
  stopNoise(true);

  const src = c.createBufferSource();
  src.buffer = getBufferFor(c, type === 'rain' ? 'white' : type);
  src.loop = true;

  let node: AudioNode = src;
  if (type === 'rain') {
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 700;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 7500;
    src.connect(hp);
    hp.connect(lp);
    node = lp;
  }

  const g = c.createGain();
  g.gain.value = 0;
  node.connect(g);
  g.connect(c.destination);
  src.start();

  const targetVol = vol * (NOISE_FACTORS[type] || 0.5);
  g.gain.linearRampToValueAtTime(targetVol, c.currentTime + 0.4);

  currentNoise = { src, g, c, type };
  return true;
}

export function stopNoise(quick = false) {
  if (!currentNoise) return;
  const o = currentNoise;
  currentNoise = null;
  try {
    o.g.gain.cancelScheduledValues(o.c.currentTime);
    o.g.gain.setValueAtTime(o.g.gain.value, o.c.currentTime);
    o.g.gain.linearRampToValueAtTime(0, o.c.currentTime + (quick ? 0.05 : 0.4));
    o.src.stop(o.c.currentTime + (quick ? 0.08 : 0.45));
  } catch {
    // ignore AudioContext already closed
  }
}

export function updateNoiseVolume(vol: number) {
  if (!currentNoise) return;
  const target = vol * (NOISE_FACTORS[currentNoise.type] || 0.5);
  currentNoise.g.gain.setTargetAtTime(target, currentNoise.c.currentTime, 0.05);
}

export function isNoisePlaying(): boolean {
  return currentNoise !== null;
}

export function playBeep(n = 1, freq = 660) {
  const c = getAudioContext();
  if (!c) return;
  const t0 = c.currentTime;
  for (let i = 0; i < n; i++) {
    const o = c.createOscillator();
    const g = c.createGain();
    const t = t0 + i * 0.4;
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + 0.32);
  }
}
