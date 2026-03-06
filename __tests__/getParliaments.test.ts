import { getParliaments } from '../src/index';

describe('getParliaments', () => {
  it('should return parliaments for a valid state', () => {
    const parliaments = getParliaments('Kelantan');
    expect(Array.isArray(parliaments)).toBe(true);
    expect(parliaments.length).toBe(14);
  });

  it('should be case insensitive', () => {
    const parliaments = getParliaments('kelantan');
    expect(parliaments.length).toBe(14);
  });

  it('should return empty array for invalid state', () => {
    const parliaments = getParliaments('InvalidState');
    expect(parliaments).toEqual([]);
  });

  it('should return empty array for null input', () => {
    const parliaments = getParliaments(null);
    expect(parliaments).toEqual([]);
  });

  it('should return parliament with correct structure', () => {
    const parliaments = getParliaments('Perlis');
    expect(parliaments[0]).toHaveProperty('code');
    expect(parliaments[0]).toHaveProperty('name');
    expect(parliaments[0]).toHaveProperty('dun');
  });

  it('should return correct parliament for W.P. Kuala Lumpur with empty dun', () => {
    const parliaments = getParliaments('W.P. Kuala Lumpur');
    expect(parliaments.length).toBe(11);
    expect(parliaments[0].dun).toEqual([]);
  });
});
