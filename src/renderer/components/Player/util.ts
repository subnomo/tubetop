import { shuffle, isEqual } from 'lodash';

export class Order {
  private array: number[];

  // Could just provide an accessor to array.length,
  // but that breaks React DevTools
  public length: number;

  constructor(order?: Order) {
    this.array = order ? order.array : [];
    this.length = order ? order.length : 0;
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

    for (let i = indices.length - 1; i >= 0; i--) {
      const remove = this.array.splice(indices[i], 1)[0];
      removed.push(remove);
    }

    for (let i = 0; i < indices.length; i++) {
      for (let j = 0; j < this.array.length; j++) {
        if (this.array[j] > removed[i]) {
          this.array[j]--;
        }
      }

      this.length--;
    }
  }

  public shuffle(first?: number): void {
    this.array = shuffle(this.array);

    if (first != null) {
      const firstIndex = this.array.indexOf(first);

      if (firstIndex !== -1) {
        this.array.splice(firstIndex, 1);
        this.array.unshift(first);
      }
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
