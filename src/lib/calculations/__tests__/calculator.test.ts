import { calculateTaxes, getDefaultTaxSettings, type TaxSettings } from '../calculator';

describe('calculateTaxes', () => {
  let defaultSettings: TaxSettings;

  beforeEach(() => {
    defaultSettings = getDefaultTaxSettings();
  });

  test('基本的な税金計算が正常に動作すること', () => {
    const result = calculateTaxes(defaultSettings);

    // 基本的な結果の検証
    expect(result.netIncome).toBe(3500000); // 5,000,000 - 1,500,000
    expect(result.takeHome).toBeGreaterThan(0);
    expect(result.taxRate).toBeGreaterThan(0);
    expect(result.taxRate).toBeLessThan(1);
  });

  test('収入が0の場合、所得と税金は0になること', () => {
    const settings = {
      ...defaultSettings,
      income: 0,
    };

    const result = calculateTaxes(settings);

    expect(result.netIncome).toBe(0);
    expect(result.taxableIncome).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.residentTax).toBe(
      defaultSettings.residentTaxSettings.cityPerCapita +
      defaultSettings.residentTaxSettings.prefPerCapita +
      defaultSettings.residentTaxSettings.forestTax
    );
    expect(result.totalTax).toBeGreaterThan(0); // 住民税の均等割と社会保険料がある
    expect(result.takeHome).toBe(0);
  });

  test('経費が収入を上回る場合、純所得は0になること', () => {
    const settings = {
      ...defaultSettings,
      income: 1000000,
      expenses: 1500000,
    };

    const result = calculateTaxes(settings);

    expect(result.netIncome).toBe(0);
    expect(result.taxableIncome).toBe(0);
    expect(result.incomeTax).toBe(0);
  });

  test('配偶者控除が適用されること', () => {
    // 配偶者控除なしの場合
    const withoutSpouse = calculateTaxes(defaultSettings);

    // 配偶者控除ありの場合（103万円以下）
    const withSpouse = calculateTaxes({
      ...defaultSettings,
      hasSpouse: true,
      spouseIncome: 1000000,
    });

    // 配偶者がいる場合は控除が適用されて税金が少なくなるはず
    expect(withSpouse.taxableIncome).toBeLessThan(withoutSpouse.taxableIncome);
    expect(withSpouse.incomeTax).toBeLessThan(withoutSpouse.incomeTax);

    // 配偶者の所得が123万円を超える場合は控除が適用されない（令和7年度改正）
    const withHighIncomeSpouse = calculateTaxes({
      ...defaultSettings,
      hasSpouse: true,
      spouseIncome: 1_300_000,
    });

    expect(withHighIncomeSpouse.taxableIncome).toEqual(withoutSpouse.taxableIncome);
  });

  test('扶養控除が人数に応じて適用されること', () => {
    // 扶養なしの場合
    const withoutDependents = calculateTaxes(defaultSettings);

    // 扶養1人の場合
    const withOneDependant = calculateTaxes({
      ...defaultSettings,
      dependents: 1,
    });

    // 扶養2人の場合
    const withTwoDependants = calculateTaxes({
      ...defaultSettings,
      dependents: 2,
    });

    // 扶養家族が増えるほど控除額が増えて課税所得と税金が減るはず
    expect(withOneDependant.taxableIncome).toBeLessThan(withoutDependents.taxableIncome);
    expect(withTwoDependants.taxableIncome).toBeLessThan(withOneDependant.taxableIncome);
    
    // 控除差額を検証（1人あたり38万円）
    const diffOne = withoutDependents.taxableIncome - withOneDependant.taxableIncome;
    const diffTwo = withOneDependant.taxableIncome - withTwoDependants.taxableIncome;
    
    expect(diffOne).toBeCloseTo(380000, -1); // 誤差を許容
    expect(diffTwo).toBeCloseTo(380000, -1); // 誤差を許容
  });

  test('青色申告特別控除が正しく適用されること', () => {
    // 青色申告（2年目以降: 65万円控除）
    const blueReturn = calculateTaxes({
      ...defaultSettings,
      taxReturnType: 'blue',
      isFirstYear: false,
    });

    // 青色申告（初年度: 55万円控除）
    const blueReturnFirstYear = calculateTaxes({
      ...defaultSettings,
      taxReturnType: 'blue',
      isFirstYear: true,
    });

    // 白色申告（控除なし）
    const whiteReturn = calculateTaxes({
      ...defaultSettings,
      taxReturnType: 'white',
    });

    // 青色申告の方が控除が大きいので課税所得が少なくなる
    expect(blueReturn.taxableIncome).toBeLessThan(whiteReturn.taxableIncome);

    // 初年度（55万）より2年目以降（65万）の方が控除が大きく課税所得が少ない
    // 青色控除が事業所得段階で適用され国保算定基礎にも波及するため、
    // 課税所得差は青色控除差（10万）と完全一致しないことに注意
    expect(blueReturn.taxableIncome).toBeLessThan(blueReturnFirstYear.taxableIncome);
  });

  test('所得税の税率区分が正しく適用されること', () => {
    // 所得税率5%の範囲（課税所得195万円以下）
    const lowIncome = calculateTaxes({
      ...defaultSettings,
      income: 2500000,
      expenses: 500000,
    });

    // 所得税率10%の範囲（課税所得195万円超330万円以下）
    const mediumIncome = calculateTaxes({
      ...defaultSettings,
      income: 5000000,
      expenses: 1000000,
    });

    // 所得税率20%の範囲（課税所得330万円超695万円以下）
    const highIncome = calculateTaxes({
      ...defaultSettings,
      income: 10000000,
      expenses: 2000000,
    });

    // 所得が増えると税率が上がるので実効税率も上がるはず
    expect(lowIncome.taxRate).toBeLessThan(mediumIncome.taxRate);
    expect(mediumIncome.taxRate).toBeLessThan(highIncome.taxRate);
  });

  test('40-64歳の場合、介護保険料が計算されること', () => {
    // 40歳未満
    const under40 = calculateTaxes({
      ...defaultSettings,
      age: 35,
    });

    // 40-64歳
    const age40to64 = calculateTaxes({
      ...defaultSettings,
      age: 45,
    });

    // 65歳以上
    const over65 = calculateTaxes({
      ...defaultSettings,
      age: 70,
    });

    // 40-64歳の場合のみ介護保険料が発生
    expect(under40.careInsurance).toBe(0);
    expect(age40to64.careInsurance).toBeGreaterThan(0);
    expect(over65.careInsurance).toBe(0);
  });

  test('個人事業税が正しく計算されること', () => {
    // 事業税対象外
    const notSubject = calculateTaxes({
      ...defaultSettings,
      businessTaxSettings: {
        ...defaultSettings.businessTaxSettings,
        isSubjectToTax: false,
      },
    });

    // 事業税対象だが課税最低限以下
    const belowMinimum = calculateTaxes({
      ...defaultSettings,
      income: 4000000,
      expenses: 1500000, // 純所得250万円（課税最低限290万円以下）
      businessTaxSettings: {
        ...defaultSettings.businessTaxSettings,
        isSubjectToTax: true,
      },
    });

    // 事業税対象で課税最低限超え
    const aboveMinimum = calculateTaxes({
      ...defaultSettings,
      income: 6000000,
      expenses: 1500000, // 純所得450万円（課税最低限290万円超）
      businessTaxSettings: {
        ...defaultSettings.businessTaxSettings,
        isSubjectToTax: true,
      },
    });

    expect(notSubject.businessTax).toBe(0);
    expect(belowMinimum.businessTax).toBe(0);
    expect(aboveMinimum.businessTax).toBeGreaterThan(0);
  });

  test('消費税が正しく計算されること', () => {
    // 課税事業者でない場合
    const notSubject = calculateTaxes({
      ...defaultSettings,
      consumptionTaxSettings: {
        ...defaultSettings.consumptionTaxSettings,
        isSubjectToTax: false,
      },
    });

    // 課税事業者・簡易課税
    const simplified = calculateTaxes({
      ...defaultSettings,
      income: 12000000,
      consumptionTaxSettings: {
        ...defaultSettings.consumptionTaxSettings,
        isSubjectToTax: true,
        useSimplifiedMethod: true,
      },
    });

    // 課税事業者・原則課税
    const normal = calculateTaxes({
      ...defaultSettings,
      income: 12000000,
      expenses: 6000000,
      consumptionTaxSettings: {
        ...defaultSettings.consumptionTaxSettings,
        isSubjectToTax: true,
        useSimplifiedMethod: false,
      },
    });

    expect(notSubject.consumptionTax).toBe(0);
    expect(simplified.consumptionTax).toBeGreaterThan(0);
    expect(normal.consumptionTax).toBeGreaterThan(0);
  });

  test('税込入力から消費税が税抜換算で算出され、所得から租税公課として控除されること', () => {
    const settings: TaxSettings = {
      ...defaultSettings,
      income: 13_200_000, // 税込
      expenses: 6_600_000, // 税込
      consumptionTaxSettings: {
        ...defaultSettings.consumptionTaxSettings,
        isSubjectToTax: true,
        useSimplifiedMethod: false,
        rate: 10,
      },
    };

    const result = calculateTaxes(settings);

    // 消費税は税抜ベースで (12M - 6M) * 0.1 = 600,000
    expect(result.consumptionTax).toBeCloseTo(600_000, 2);

    // netIncome は税込売上 - 税込経費 - 納付消費税 = 6,600,000 - 600,000 = 6,000,000
    expect(result.netIncome).toBeCloseTo(6_000_000, 2);
  });

  test('小規模企業共済掛金が所得控除に含まれること', () => {
    const without = calculateTaxes(defaultSettings);
    const withAid = calculateTaxes({
      ...defaultSettings,
      smallBusinessMutualAid: true,
      smallBusinessMutualAidMonthly: 30_000,
    });

    expect(withAid.smallBusinessMutualAid).toBe(30_000 * 12);
    expect(withAid.totalDeduction).toBeGreaterThan(without.totalDeduction);
    expect(withAid.incomeTax).toBeLessThan(without.incomeTax);
  });

  test('社会保険料（国保・国民年金）が所得控除として課税所得を減らすこと', () => {
    const withSocial = calculateTaxes(defaultSettings);
    const withoutSocial = calculateTaxes({
      ...defaultSettings,
      nationalHealthInsurance: false,
      nationalPension: false,
    });

    // 国保・国民年金合計が totalDeduction に含まれる
    const socialAmount =
      withSocial.healthInsurance +
      withSocial.careInsurance +
      withSocial.pension;
    expect(socialAmount).toBeGreaterThan(0);

    const deductionDiff =
      withSocial.totalDeduction - withoutSocial.totalDeduction;
    expect(deductionDiff).toBeCloseTo(socialAmount, 2);

    // 課税所得・所得税が減る
    expect(withSocial.taxableIncome).toBeLessThan(withoutSocial.taxableIncome);
    expect(withSocial.incomeTax).toBeLessThan(withoutSocial.incomeTax);
  });
});