import { getDuns } from '../src/index';

describe('getDuns', () => {
  it('should return DUNs for a valid state and parliament name', () => {
    const duns = getDuns('Kelantan', 'Rantau Panjang');
    expect(Array.isArray(duns)).toBe(true);
    expect(duns.length).toBe(3);
  });

  it('should return DUNs using parliament code', () => {
    const duns = getDuns('Kelantan', 'P023');
    expect(duns.length).toBe(3);
  });

  it('should be case insensitive', () => {
    const duns = getDuns('kelantan', 'rantau panjang');
    expect(duns.length).toBe(3);
  });

  it('should return empty array for invalid state', () => {
    expect(getDuns('InvalidState', 'Rantau Panjang')).toEqual([]);
  });

  it('should return empty array for invalid parliament', () => {
    expect(getDuns('Kelantan', 'InvalidParliament')).toEqual([]);
  });

  it('should return empty array for null inputs', () => {
    expect(getDuns(null, null)).toEqual([]);
    expect(getDuns('Kelantan', null)).toEqual([]);
    expect(getDuns(null, 'Rantau Panjang')).toEqual([]);
  });

  it('should return DUN with correct structure', () => {
    const duns = getDuns('Kelantan', 'Rantau Panjang');
    expect(duns[0]).toHaveProperty('code');
    expect(duns[0]).toHaveProperty('name');
  });

  it('should return empty dun array for federal territory', () => {
    const duns = getDuns('W.P. Kuala Lumpur', 'Segambut');
    expect(duns).toEqual([]);
  });
});
