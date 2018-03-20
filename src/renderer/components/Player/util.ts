import { shuffle, isEqual } from 'lodash';

export class Order {
  private array: number[];

  // Could just provide an accessor to array.length,
  // but that breaks React DevTools
  public length: number;

  constructor(order?: Order | number[]) {
    if (!order) {
      this.array = [];
      this.length = 0;
    } else if (Array.isArray(order)) {
      this.array = order;
      this.length = order.length;
      // this.sort();
    } else {
      this.array = [...order.array];
      this.length = order.length;
    }
  }

  public get(index: number): number {
    return this.array[index];
  }

  public add(num: number | number[]): void {
    if (Array.isArray(num)) {
      this.array = this.array.concat(num);
      this.length += num.length;
    } else {
      this.array.push(num);
      this.length++;
    }
  }

  public remove(index: number | number[]): void {
    const indices = Array.isArray(index) ? index : [index];

    let removed: number[] = [];

    // Remove items from array
    for (let i = indices.length - 1; i >= 0; i--) {
      const remove = this.array.splice(indices[i], 1)[0];
      removed.push(remove);
    }

    // Decrement all items greater than removed numbers
    for (let i = 0; i < removed.length; i++) {
      for (let j = 0; j < this.array.length; j++) {
        if (this.array[j] > removed[i]) {
          this.array[j]--;
        }
      }

      this.length--;
    }
  }

  public shuffle(first?: number): void {
    if (this.length <= 1) return;

    // Backup array
    const backup = [...this.array];
    this.array = shuffle(this.array);
    let reshuffle = true;

    if (first != null) {
      const firstIndex = this.array.indexOf(first);

      if (firstIndex !== -1) {
        this.array.splice(firstIndex, 1);
        this.array.unshift(first);

        // If there are only two items, don't reshuffle
        if (this.length === 2) {
          reshuffle = false;
        }
      }
    }

    // If somehow the order hasn't changed, recurse
    if (reshuffle && isEqual(this.array, backup)) {
      this.shuffle(first);
    }
  }

  public sort(): void {
    for (let i = 0; i < this.array.length; i++) {
      this.array[i] = i;
    }
  }

  public equals(order: Order): boolean {
    return isEqual(this.array, order.array);
  }
}
