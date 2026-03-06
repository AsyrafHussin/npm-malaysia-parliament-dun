import { searchAll } from '../src/index';

describe('searchAll', () => {
  it('should find results across states, parliaments, and DUNs', () => {
    const result = searchAll('Kelantan');
    expect(result.found).toBe(true);
    expect(result.states).toContain('Kelantan');
  });

  it('should find parliament by partial name', () => {
    const result = searchAll('Rantau');
    expect(result.found).toBe(true);
    expect(result.parliaments.length).toBeGreaterThan(0);
  });

  it('should find DUN by partial name', () => {
    const result = searchAll('Apam');
    expect(result.found).toBe(true);
    expect(result.duns.length).toBeGreaterThan(0);
  });

  it('should return found: false for no matches', () => {
    const result = searchAll('XYZNoMatch');
    expect(result.found).toBe(false);
  });

  it('should return found: false for null or empty query', () => {
    expect(searchAll(null).found).toBe(false);
    expect(searchAll('').found).toBe(false);
    expect(searchAll('   ').found).toBe(false);
  });

  it('should find by parliament code', () => {
    const result = searchAll('P023');
    expect(result.found).toBe(true);
    expect(result.parliaments[0].code).toBe('P023');
  });
});
