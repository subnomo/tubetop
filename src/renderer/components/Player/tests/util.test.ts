import { Order } from '../util';

describe('Order', () => {
  let order: Order;

  beforeEach(() => {
    order = new Order([1, 2, 3]);
  });

  describe('constructor', () => {
    it('should initialize a new Order', () => {
      expect(order).toBeInstanceOf(Order);
      expect(new Order(order)).toBeInstanceOf(Order);
      expect((order as any).array).toEqual([0, 1, 2]);
      expect(order.length).toBe(3);
    });
  });

  describe('get', () => {
    it('should return an item at index', () => {
      expect(order.get(0)).toBe(0);
      expect(order.get(1)).toBe(1);
      expect(order.get(2)).toBe(2);
    });
  });

  describe('add', () => {
    it('should add a number to end', () => {
      order.add(3);
      expect(order.get(3)).toBe(3);
    });

    it('should add an array of numbers to end', () => {
      order.add([3, 4, 5]);
      expect((order as any).array).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });

  describe('add', () => {
    it('should remove a number at index, and decrement right elements', () => {
      order.remove(1);
      expect((order as any).array).toEqual([0, 1]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle order', () => {
      order.shuffle();
      expect((order as any).array).not.toEqual([0, 1, 2]);
    });

    it('should shuffle order, moving the given number to front', () => {
      order.shuffle(2);
      expect(order.get(0)).toBe(2);
    });

    it('should shuffle order, ignoring invalid given number', () => {
      order.shuffle(6);
      expect((order as any).array).not.toContain(6);
    });

    it('should not shuffle order with only two items if number is given', () => {
      order.remove(2);
      order.shuffle(0);
      expect(order.get(0)).toBe(0);
    });
  });

  describe('sort', () => {
    it('should sort order', () => {
      order.shuffle();
      order.sort();
      expect((order as any).array).toEqual([0, 1, 2]);
    });
  });

  describe('equals', () => {
    it('should check equality with other Order objects', () => {
      expect(order.equals(new Order(order))).toBe(true);
      expect(order.equals(new Order())).toBe(false);
    });
  });
});
