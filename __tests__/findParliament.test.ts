import { findParliament } from '../src/index';

describe('findParliament', () => {
  it('should find parliament by exact name', () => {
    const result = findParliament('Rantau Panjang');
    expect(result.found).toBe(true);
    expect(result.name).toBe('Rantau Panjang');
    expect(result.code).toBe('P023');
    expect(result.state).toBe('Kelantan');
  });

  it('should find parliament by exact code', () => {
    const result = findParliament('P023');
    expect(result.found).toBe(true);
    expect(result.name).toBe('Rantau Panjang');
  });

  it('should be case insensitive', () => {
    const result = findParliament('rantau panjang');
    expect(result.found).toBe(true);
  });

  it('should return found: false for invalid query', () => {
    const result = findParliament('InvalidParliament');
    expect(result.found).toBe(false);
  });

  it('should return found: false for null', () => {
    const result = findParliament(null);
    expect(result.found).toBe(false);
  });

  it('should support partial match', () => {
    const result = findParliament('Rantau', false);
    expect(result.found).toBe(true);
    expect(result.results).toBeDefined();
  });

  it('should support array of queries', () => {
    const result = findParliament(['P023', 'P024']);
    expect(result.found).toBe(true);
    expect(result.results?.length).toBe(2);
  });
});
