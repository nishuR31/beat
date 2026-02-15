export interface BeatDetectorOptions {
  sensitivity: number; // 0-1, higher = more sensitive
  frequencyRange: {
    start: number; // frequency band start (0-255)
    end: number;   // frequency band end (0-255)
  };
  debounceTime: number; // ms to ignore beats after one is detected
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
    };
  }

  /**
   * Check if a beat is detected based on frequency data
   */
  detectBeat(dataArray: Uint8Array): boolean {
    const energy = this.calculateEnergy(dataArray);

    // Build history
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    // Need history to detect beat
    if (this.energyHistory.length < 10) {
      return false;
    }

    // Check debounce
    const now = Date.now();
    if (now - this.lastBeatTime < this.options.debounceTime) {
      return false;
    }

    // Calculate average and threshold
    const average = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const threshold = average * (1 + (1 - this.options.sensitivity) * 0.5);

    // Check if current energy exceeds threshold
    if (energy > threshold) {
      this.lastBeatTime = now;
      return true;
    }

    return false;
  }

  /**
   * Calculate energy in frequency range
   */
  private calculateEnergy(dataArray: Uint8Array): number {
    const { start, end } = this.options.frequencyRange;
    let energy = 0;

    for (let i = start; i <= Math.min(end, dataArray.length - 1); i++) {
      energy += dataArray[i];
    }

    return energy / (end - start + 1);
  }

  /**
   * Get current energy level (0-1)
   */
  getCurrentEnergy(dataArray: Uint8Array): number {
    return Math.min(1, this.calculateEnergy(dataArray) / 255);
  }

  /**
   * Reset detector state
   */
  reset(): void {
    this.energyHistory = [];
    this.lastBeatTime = 0;
  }
}
