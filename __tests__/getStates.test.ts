import { getStates } from '../src/index';

describe('getStates', () => {
  it('should return an array of state names', () => {
    const states = getStates();
    expect(Array.isArray(states)).toBe(true);
    expect(states.length).toBeGreaterThan(0);
  });

  it('should return 16 states including federal territories', () => {
    const states = getStates();
    expect(states.length).toBe(16);
  });

  it('should include major states', () => {
    const states = getStates();
    expect(states).toContain('Selangor');
    expect(states).toContain('Johor');
    expect(states).toContain('Kelantan');
    expect(states).toContain('Sabah');
    expect(states).toContain('Sarawak');
  });

  it('should include federal territories', () => {
    const states = getStates();
    expect(states).toContain('W.P. Kuala Lumpur');
    expect(states).toContain('W.P. Putrajaya');
    expect(states).toContain('W.P. Labuan');
  });
});
