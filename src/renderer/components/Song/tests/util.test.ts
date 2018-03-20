import { parseTime } from '../util';

describe('parseTime', () => {
  it('should parse seconds into formatted string', () => {
    const thirty_s = parseTime(30);
    expect(thirty_s).toBe('00:30');

    const five_m = parseTime(5 * 60);
    expect(five_m).toBe('05:00');

    const three_hr = parseTime(3 * 60 * 60);
    expect(three_hr).toBe('03:00:00');

    const twohr_25m_45s = parseTime((2 * 60 * 60) + (25 * 60) + 45);
    expect(twohr_25m_45s).toBe('02:25:45');
  });
});
