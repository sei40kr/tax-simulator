"use client";

import {
  Accordion,
  Alert,
  Box,
  Card,
  Container,
  Grid,
  Heading,
  List,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BasicInfoCard } from "@/components/basic-info-card";
import { BusinessTaxSection } from "@/components/business-tax-section";
import { ConsumptionTaxSection } from "@/components/consumption-tax-section";
import { HealthInsuranceSection } from "@/components/health-insurance-section";
import { IncomeTaxSection } from "@/components/income-tax-section";
import { PensionAccumulationResultCard } from "@/components/pension-accumulation-result-card";
import { PensionReturnRateSection } from "@/components/pension-return-rate-section";
import { ResidentTaxSection } from "@/components/resident-tax-section";
import { ResultsCard } from "@/components/results-card";
import { SocialInsuranceCard } from "@/components/social-insurance-card";
import { TaxReturnCard } from "@/components/tax-return-card";
import {
  calculateTaxes,
  getDefaultTaxSettings,
  type TaxSettings,
} from "@/lib/calculations/calculator";
import { ADDITIONAL_PENSION_MONTHLY } from "@/lib/calculations/constants";
import {
  calculatePensionAccumulation,
  DEFAULT_PENSION_RETURN_RATES,
  PENSION_SCHEME_META,
  type PensionScheme,
  type PensionSchemeKey,
} from "@/lib/calculations/pension-accumulation";

export default function Home() {
  const [settings, setSettings] = useState<TaxSettings>(getDefaultTaxSettings);
  const [pensionYears, setPensionYears] = useState(30);
  const [returnRates, setReturnRates] = useState<
    Record<PensionSchemeKey, number>
  >(DEFAULT_PENSION_RETURN_RATES);

  const results = useMemo(() => calculateTaxes(settings), [settings]);

  const pensionSchemes = useMemo<PensionScheme[]>(() => {
    const list: PensionScheme[] = [];
    if (settings.ideco && settings.idecoMonthly > 0) {
      list.push({
        key: "ideco",
        label: "iDeCo",
        monthlyAmount: settings.idecoMonthly,
        annualReturnRate: returnRates.ideco,
      });
    }
    if (
      settings.nationalPensionFund &&
      settings.nationalPensionFundMonthly > 0
    ) {
      list.push({
        key: "nationalPensionFund",
        label: "国民年金基金",
        monthlyAmount: settings.nationalPensionFundMonthly,
        annualReturnRate: returnRates.nationalPensionFund,
      });
    }
    if (settings.additionalPension) {
      list.push({
        key: "additionalPension",
        label: "付加年金",
        monthlyAmount: ADDITIONAL_PENSION_MONTHLY,
        annualReturnRate: returnRates.additionalPension,
      });
    }
    if (
      settings.smallBusinessMutualAid &&
      settings.smallBusinessMutualAidMonthly > 0
    ) {
      list.push({
        key: "smallBusinessMutualAid",
        label: "小規模企業共済",
        monthlyAmount: settings.smallBusinessMutualAidMonthly,
        annualReturnRate: returnRates.smallBusinessMutualAid,
      });
    }
    return list;
  }, [settings, returnRates]);

  const activePensionMeta = useMemo(() => {
    const active = new Set(pensionSchemes.map((s) => s.key));
    return PENSION_SCHEME_META.filter((m) => active.has(m.key));
  }, [pensionSchemes]);

  const pensionPoints = useMemo(
    () => calculatePensionAccumulation(pensionSchemes, pensionYears),
    [pensionSchemes, pensionYears],
  );

  const patch = (p: Partial<TaxSettings>) =>
    setSettings((s) => ({ ...s, ...p }));
  type SliceKey = {
    [K in keyof TaxSettings]: TaxSettings[K] extends object ? K : never;
  }[keyof TaxSettings];
  const patchSlice =
    <K extends SliceKey>(key: K) =>
    (p: Partial<TaxSettings[K]>) =>
      setSettings((s) => ({
        ...s,
        [key]: { ...(s[key] as object), ...p },
      }));

  return (
    <Box bg="bg.subtle" minH="100dvh" colorPalette="blue">
      <Box
        as="nav"
        bg="blue.900"
        color="white"
        borderBottomWidth="1px"
        borderColor="blue.950"
        px={4}
        py={3}
        position="sticky"
        top={0}
        zIndex="docked"
      >
        <Container maxW="6xl">
          <Heading as="h1" size="xl" textAlign="center">
            個人事業主 税金・社会保険料控除シミュレーター
          </Heading>
        </Container>
      </Box>

      <Container maxW="6xl" py={8}>
        <VStack align="stretch" gap={6}>
          <Alert.Root status="info">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>注意事項</Alert.Title>
              <Alert.Description>
                <List.Root>
                  <List.Item>
                    このシミュレーションは概算計算です。実際の税額は税務署での確定申告結果に基づきます。
                  </List.Item>
                  <List.Item>
                    国民健康保険料は自治体によって計算方法が異なります。
                  </List.Item>
                  <List.Item>
                    個別の状況により、各種控除や税額は変動します。
                  </List.Item>
                  <List.Item>
                    専門的なアドバイスは税理士にご相談ください。
                  </List.Item>
                </List.Root>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
            <VStack gap={6} align="stretch">
              <BasicInfoCard settings={settings} onChange={patch} />
              <TaxReturnCard settings={settings} onChange={patch} />
              <SocialInsuranceCard settings={settings} onChange={patch} />
              <IncomeTaxSection
                settings={settings.incomeTaxSettings}
                onChange={patchSlice("incomeTaxSettings")}
              />
              <BusinessTaxSection
                settings={settings.businessTaxSettings}
                onChange={patchSlice("businessTaxSettings")}
              />
              <ConsumptionTaxSection
                settings={settings.consumptionTaxSettings}
                onChange={patchSlice("consumptionTaxSettings")}
              />
              <Card.Root>
                <Card.Header>
                  <Card.Title>詳細設定</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Accordion.Root multiple collapsible>
                    <ResidentTaxSection
                      settings={settings.residentTaxSettings}
                      onChange={patchSlice("residentTaxSettings")}
                    />
                    <HealthInsuranceSection
                      settings={settings.healthInsuranceSettings}
                      onChange={patchSlice("healthInsuranceSettings")}
                      age={settings.age}
                    />
                    <PensionReturnRateSection
                      returnRates={returnRates}
                      onChange={setReturnRates}
                      activeMeta={activePensionMeta}
                    />
                  </Accordion.Root>
                </Card.Body>
              </Card.Root>
            </VStack>

            <Box>
              <VStack align="stretch" gap={6}>
                <ResultsCard
                  income={settings.income}
                  expenses={settings.expenses}
                  age={settings.age}
                  results={results}
                />
                <PensionAccumulationResultCard
                  points={pensionPoints}
                  years={pensionYears}
                  onYearsChange={setPensionYears}
                  hasActiveScheme={pensionSchemes.length > 0}
                />
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
