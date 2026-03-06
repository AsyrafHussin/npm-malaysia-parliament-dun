import { getDunsByState } from '../src/index';

describe('getDunsByState', () => {
  it('should return all DUNs for a valid state', () => {
    const result = getDunsByState('Kelantan');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should be case insensitive', () => {
    const result = getDunsByState('kelantan');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return DUNs with correct structure', () => {
    const result = getDunsByState('Kelantan');
    expect(result[0]).toHaveProperty('code');
    expect(result[0]).toHaveProperty('name');
  });

  it('should return empty array for invalid state', () => {
    expect(getDunsByState('InvalidState')).toEqual([]);
  });

  it('should return empty array for null input', () => {
    expect(getDunsByState(null)).toEqual([]);
  });

  it('should return empty array for federal territory with no DUN', () => {
    expect(getDunsByState('Wp Kuala Lumpur')).toEqual([]);
  });
});
