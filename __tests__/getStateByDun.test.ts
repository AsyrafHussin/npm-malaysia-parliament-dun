import { getStateByDun } from '../src/index';

describe('getStateByDun', () => {
  it('should return state and parliament for a valid DUN name', () => {
    const result = getStateByDun('Apam Putra');
    expect(result).not.toBeNull();
    expect(result?.state).toBe('Kelantan');
    expect(result?.parliament).toBe('Rantau Panjang');
    expect(result?.parliamentCode).toBe('P023');
  });

  it('should return a result for a valid DUN code', () => {
    const result = getStateByDun('N01');
    expect(result).not.toBeNull();
    expect(result?.state).toBeDefined();
  });

  it('should be case insensitive', () => {
    const result = getStateByDun('apam putra');
    expect(result?.state).toBe('Kelantan');
  });

  it('should return null for invalid DUN', () => {
    expect(getStateByDun('InvalidDun')).toBeNull();
  });

  it('should return null for null input', () => {
    expect(getStateByDun(null)).toBeNull();
  });
});
