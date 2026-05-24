import {
  calcHometownTaxDonationLimit,
  HOMETOWN_TAX_SELF_BURDEN,
} from '../hometown-tax-donation';

describe('calcHometownTaxDonationLimit', () => {
  test('住民税所得割が0の場合は0', () => {
    expect(calcHometownTaxDonationLimit(0, 5_000_000)).toBe(0);
  });

  test('住民税所得割がマイナスの場合は0', () => {
    expect(calcHometownTaxDonationLimit(-1, 5_000_000)).toBe(0);
  });

  test('課税所得500万円（限界税率20%）の上限額', () => {
    // residentIncomeRateTax=200,000, denominator = 0.9 - 0.20 * 1.021 = 0.6958
    // floor(40000 / 0.6958 + 2000) = floor(57,487.78... + 2000) = 59,487
    const limit = calcHometownTaxDonationLimit(200_000, 5_000_000);
    expect(limit).toBe(59_487);
  });

  test('課税所得195万円以下（限界税率5%）の上限額', () => {
    // denominator = 0.9 - 0.05 * 1.021 = 0.84895
    // floor(50000 * 0.2 / 0.84895) + 2000 = floor(11,779.25...) + 2000 = 13,779
    const limit = calcHometownTaxDonationLimit(50_000, 1_500_000);
    expect(limit).toBe(13_779);
  });

  test('課税所得4000万円超（限界税率45%）でも denominator > 0 で計算できる', () => {
    // denominator = 0.9 - 0.45 * 1.021 = 0.44055
    const limit = calcHometownTaxDonationLimit(1_000_000, 50_000_000);
    expect(limit).toBeGreaterThan(HOMETOWN_TAX_SELF_BURDEN);
  });

  test('上限額には自己負担2,000円が含まれる', () => {
    const limit = calcHometownTaxDonationLimit(100_000, 3_000_000);
    expect(limit).toBeGreaterThanOrEqual(HOMETOWN_TAX_SELF_BURDEN);
  });
});
