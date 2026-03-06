import { getRandomState, getRandomParliament, getRandomDun } from '../src/index';

describe('getRandomState', () => {
  it('should return a non-empty string', () => {
    const result = getRandomState();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return a valid state name', () => {
    const result = getRandomState();
    expect(['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
      'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
      'Terengganu', 'Wp Kuala Lumpur', 'Wp Labuan', 'Wp Putrajaya']).toContain(result);
  });
});

describe('getRandomParliament', () => {
  it('should return a parliament object', () => {
    const result = getRandomParliament();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('dun');
  });

  it('should return a parliament from a specific state', () => {
    const result = getRandomParliament('Kelantan');
    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/^P/);
  });

  it('should return null for invalid state', () => {
    expect(getRandomParliament('InvalidState')).toBeNull();
  });
});

describe('getRandomDun', () => {
  it('should return a DUN object', () => {
    const result = getRandomDun();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('name');
  });

  it('should return a DUN from a specific state', () => {
    const result = getRandomDun('Kelantan');
    expect(result).not.toBeNull();
  });

  it('should return a DUN from a specific state and parliament', () => {
    const result = getRandomDun('Kelantan', 'Rantau Panjang');
    expect(result).not.toBeNull();
  });

  it('should return null for invalid state', () => {
    expect(getRandomDun('InvalidState')).toBeNull();
  });

  it('should return null for invalid parliament', () => {
    expect(getRandomDun('Kelantan', 'InvalidParliament')).toBeNull();
  });
});
