import { getStateByParliament } from '../src/index';

describe('getStateByParliament', () => {
  it('should return state for a valid parliament code', () => {
    expect(getStateByParliament('P023')).toBe('Kelantan');
  });

  it('should return state for a valid parliament name', () => {
    expect(getStateByParliament('Rantau Panjang')).toBe('Kelantan');
  });

  it('should be case insensitive', () => {
    expect(getStateByParliament('rantau panjang')).toBe('Kelantan');
    expect(getStateByParliament('p023')).toBe('Kelantan');
  });

  it('should return null for invalid parliament', () => {
    expect(getStateByParliament('InvalidParliament')).toBeNull();
  });

  it('should return null for null input', () => {
    expect(getStateByParliament(null)).toBeNull();
  });
});
