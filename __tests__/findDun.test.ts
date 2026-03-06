import { findDun } from '../src/index';

describe('findDun', () => {
  it('should find DUN by exact name', () => {
    const result = findDun('Apam Putra');
    expect(result.found).toBe(true);
    expect(result.name).toBe('Apam Putra');
    expect(result.code).toBe('N16');
    expect(result.state).toBe('Kelantan');
    expect(result.parliament).toBe('Rantau Panjang');
  });

  it('should find DUN by exact code', () => {
    const result = findDun('N16');
    expect(result.found).toBe(true);
  });

  it('should be case insensitive', () => {
    const result = findDun('apam putra');
    expect(result.found).toBe(true);
  });

  it('should return found: false for invalid query', () => {
    const result = findDun('InvalidDun');
    expect(result.found).toBe(false);
  });

  it('should return found: false for null', () => {
    const result = findDun(null);
    expect(result.found).toBe(false);
  });

  it('should support partial match', () => {
    const result = findDun('Kota', false);
    expect(result.found).toBe(true);
    expect(result.results).toBeDefined();
    expect(result.results!.length).toBeGreaterThan(1);
  });

  it('should support array of queries', () => {
    const result = findDun(['Apam Putra', 'Gual Periok']);
    expect(result.found).toBe(true);
    expect(result.results?.length).toBe(2);
  });

  it('should include parliamentCode in result', () => {
    const result = findDun('Apam Putra');
    expect(result.parliamentCode).toBe('P023');
  });
});
