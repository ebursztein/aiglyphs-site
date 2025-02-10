export class ColorManager {
  private history: string[] = [];
  private currentIndex: number = -1;
  private maxHistory: number = 20;

  constructor() {
    this.history = ['#ffffff'];
    this.currentIndex = 0;
  }

  add(color: string) {
    // Remove any future history if we're not at the end
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(color);

    // Keep history within max size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): string | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  redo(): string | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  getCurrentColor(): string {
    return this.history[this.currentIndex];
  }
}
