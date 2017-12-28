import { parseDuration } from '../util';

describe('parseDuration', () => {
  it('should parse an ISO 8601 duration into seconds', () => {
    const time_21m_3s = 'PT21M3S';
    const time_2hr_45m_23s = 'PT2H45M23S';

    expect(parseDuration(time_21m_3s)).toBe(1263);
    expect(parseDuration(time_2hr_45m_23s)).toBe(9923);
  });
});
