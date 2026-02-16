export interface BeatDetectorOptions {
  sensitivity: number; // 0-1, higher = more sensitive
  frequencyRange: {
    start: number; // frequency band start (0-255)
    end: number;   // frequency band end (0-255)
  };
  debounceTime: number; // ms to ignore beats after one is detected
  adaptive?: boolean;   // NEW: adapt sensitivity based on recent energy
  multiBand?: boolean;  // NEW: detect beats in multiple bands
}

export class BeatDetector {
  private energyHistory: number[] = [];
  private lastBeatTime: number = 0;
  private readonly options: BeatDetectorOptions;
  private readonly historySize: number = 30;

  constructor(options: Partial<BeatDetectorOptions> = {}) {
    this.options = {
      sensitivity: options.sensitivity ?? 0.5,
      frequencyRange: options.frequencyRange ?? { start: 0, end: 20 },
      debounceTime: options.debounceTime ?? 100,
      adaptive: options.adaptive ?? false,
      multiBand: options.multiBand ?? false,
    };
  }

  detectBeat(dataArray: Uint8Array): boolean {
    const energy = this.calculateEnergy(dataArray);

    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    if (this.energyHistory.length < 10) {
      return false;
    }

    const now = Date.now();
    if (now - this.lastBeatTime < this.options.debounceTime) {
      return false;
    }

    // Adaptive sensitivity: increase threshold if too many beats recently
    let sensitivity = this.options.sensitivity;
    if (this.options.adaptive) {
      const recentBeats = this.energyHistory.slice(-5).filter(e => e > energy * 0.9).length;
      sensitivity = Math.max(0.2, sensitivity + recentBeats * 0.05);
    }

    const average = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const threshold = average * (1 + (1 - sensitivity) * 0.5);

    if (energy > threshold) {
      this.lastBeatTime = now;
      return true;
    }

    // Multi-band: detect beats in sub-bands (e.g., bass, mid, treble)
    if (this.options.multiBand) {
      const bands = [
        { start: 0, end: 20 },   // bass
        { start: 21, end: 80 },  // mid
        { start: 81, end: 255 }, // treble
      ];
      return bands.some(band => {
        const bandEnergy = this.calculateEnergy(dataArray, band.start, band.end);
        return bandEnergy > threshold;
      });
    }

    return false;
  }

  private calculateEnergy(dataArray: Uint8Array, start?: number, end?: number): number {
    const s = start ?? this.options.frequencyRange.start;
    const e = end ?? this.options.frequencyRange.end;
    let energy = 0;
    for (let i = s; i <= Math.min(e, dataArray.length - 1); i++) {
      energy += dataArray[i];
    }
    return energy / (e - s + 1);
  }

  getCurrentEnergy(dataArray: Uint8Array): number {
    return Math.min(1, this.calculateEnergy(dataArray) / 255);
  }

  reset(): void {
    this.energyHistory = [];
    this.lastBeatTime = 0;
  }
}
