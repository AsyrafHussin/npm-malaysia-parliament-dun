import { getParliamentByDun } from '../src/index';

describe('getParliamentByDun', () => {
  it('should return parliament for a valid DUN name', () => {
    const result = getParliamentByDun('Apam Putra');
    expect(result).not.toBeNull();
    expect(result?.code).toBe('P023');
    expect(result?.name).toBe('Rantau Panjang');
    expect(result?.state).toBe('Kelantan');
  });

  it('should return a result for a valid DUN code', () => {
    const result = getParliamentByDun('N01');
    expect(result).not.toBeNull();
    expect(result?.code).toBeDefined();
  });

  it('should be case insensitive', () => {
    const result = getParliamentByDun('apam putra');
    expect(result?.name).toBe('Rantau Panjang');
  });

  it('should return null for invalid DUN', () => {
    expect(getParliamentByDun('InvalidDun')).toBeNull();
  });

  it('should return null for null input', () => {
    expect(getParliamentByDun(null)).toBeNull();
  });

  it('should include dun array in result', () => {
    const result = getParliamentByDun('Apam Putra');
    expect(Array.isArray(result?.dun)).toBe(true);
    expect(result?.dun.length).toBe(3);
  });
});
