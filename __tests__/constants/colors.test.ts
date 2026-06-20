import { COLORS } from '@/constants/colors';

describe('COLORS', () => {
  it('exports brand-300 as the primary starting hex', () => {
    expect(COLORS['brand-300']).toBe('#a2d2ff');
  });

  it('exports accent-300 as the periwinkle starting hex', () => {
    expect(COLORS['accent-300']).toBe('#b8b8ff');
  });

  it('exports all 10 neutral tokens', () => {
    const neutralKeys = Object.keys(COLORS).filter(k => k.startsWith('neutral-'));
    expect(neutralKeys).toHaveLength(10);
  });
});
