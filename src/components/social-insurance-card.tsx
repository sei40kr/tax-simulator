"use client";

import { Alert, Card, Checkbox, Field, VStack } from "@chakra-ui/react";
import { MoneyInput } from "@/components/ui/money-input";
import type { TaxSettings } from "@/lib/calculations/calculator";
import {
  ADDITIONAL_PENSION_MONTHLY,
  IDECO_MONTHLY_STEP,
  PENSION_COMBINED_MONTHLY_LIMIT,
  SMALL_BUSINESS_MUTUAL_AID_MAX,
  SMALL_BUSINESS_MUTUAL_AID_MIN,
} from "@/lib/calculations/constants";

interface Props {
  settings: TaxSettings;
  onChange: (patch: Partial<TaxSettings>) => void;
}

export function SocialInsuranceCard({ settings, onChange }: Props) {
  const additionalPensionMonthly = settings.additionalPension
    ? ADDITIONAL_PENSION_MONTHLY
    : 0;
  const fundMonthly = settings.nationalPensionFund
    ? settings.nationalPensionFundMonthly
    : 0;
  const idecoMonthly = settings.ideco ? settings.idecoMonthly : 0;
  const consumedMonthly =
    additionalPensionMonthly + fundMonthly + idecoMonthly;
  const remainingMonthly = Math.max(
    0,
    PENSION_COMBINED_MONTHLY_LIMIT - consumedMonthly,
  );

  const fundMax = Math.max(
    0,
    PENSION_COMBINED_MONTHLY_LIMIT - additionalPensionMonthly - idecoMonthly,
  );
  const idecoMax =
    Math.floor(
      Math.max(
        0,
        PENSION_COMBINED_MONTHLY_LIMIT - additionalPensionMonthly - fundMonthly,
      ) / IDECO_MONTHLY_STEP,
    ) * IDECO_MONTHLY_STEP;

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>社会保険</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Alert.Root status="info" variant="subtle" size="sm">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                社会保険は国民健康保険・国民年金に自動加入として計算します。
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <Field.Root>
            <Checkbox.Root
              checked={settings.additionalPension}
              disabled={settings.nationalPensionFund}
              onCheckedChange={(d) => {
                const checked = !!d.checked;
                if (!checked) {
                  onChange({ additionalPension: false });
                  return;
                }
                const available =
                  PENSION_COMBINED_MONTHLY_LIMIT - ADDITIONAL_PENSION_MONTHLY;
                const newIdeco = settings.ideco
                  ? Math.min(
                      settings.idecoMonthly,
                      Math.floor(available / IDECO_MONTHLY_STEP) *
                        IDECO_MONTHLY_STEP,
                    )
                  : settings.idecoMonthly;
                onChange({
                  additionalPension: true,
                  idecoMonthly: newIdeco,
                });
              }}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>付加年金に加入（月額400円）</Checkbox.Label>
            </Checkbox.Root>
            <Field.HelperText>
              国民年金基金との併用はできません
            </Field.HelperText>
          </Field.Root>

          <Field.Root>
            <Checkbox.Root
              checked={settings.nationalPensionFund}
              disabled={settings.additionalPension}
              onCheckedChange={(d) =>
                onChange({ nationalPensionFund: !!d.checked })
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>国民年金基金に加入（任意）</Checkbox.Label>
            </Checkbox.Root>
          </Field.Root>

          {settings.nationalPensionFund && (
            <Field.Root>
              <Field.Label>国民年金基金 月額</Field.Label>
              <MoneyInput
                value={settings.nationalPensionFundMonthly}
                onChange={(v) => onChange({ nationalPensionFundMonthly: v })}
                max={fundMax}
              />
              <Field.HelperText>
                iDeCo・付加年金との合算で月額68,000円が上限
              </Field.HelperText>
            </Field.Root>
          )}

          <Field.Root>
            <Checkbox.Root
              checked={settings.ideco}
              onCheckedChange={(d) => onChange({ ideco: !!d.checked })}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>iDeCoに加入（任意）</Checkbox.Label>
            </Checkbox.Root>
          </Field.Root>

          {settings.ideco && (
            <Field.Root>
              <Field.Label>iDeCo 月額</Field.Label>
              <MoneyInput
                value={settings.idecoMonthly}
                onChange={(v) => onChange({ idecoMonthly: v })}
                max={idecoMax}
              />
              <Field.HelperText>
                1,000円単位／国民年金基金・付加年金との合算で月額68,000円が上限
              </Field.HelperText>
            </Field.Root>
          )}

          <Field.Root>
            <Field.HelperText>
              残り枠：月額{remainingMonthly.toLocaleString()}円（上限68,000円）
            </Field.HelperText>
          </Field.Root>

          <Field.Root>
            <Checkbox.Root
              checked={settings.smallBusinessMutualAid}
              onCheckedChange={(d) =>
                onChange({ smallBusinessMutualAid: !!d.checked })
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>小規模企業共済に加入（任意）</Checkbox.Label>
            </Checkbox.Root>
          </Field.Root>

          {settings.smallBusinessMutualAid && (
            <Field.Root>
              <Field.Label>小規模企業共済 月額</Field.Label>
              <MoneyInput
                value={settings.smallBusinessMutualAidMonthly}
                onChange={(v) =>
                  onChange({ smallBusinessMutualAidMonthly: v })
                }
                min={SMALL_BUSINESS_MUTUAL_AID_MIN}
                max={SMALL_BUSINESS_MUTUAL_AID_MAX}
              />
              <Field.HelperText>
                500円単位／月額1,000円〜70,000円。全額が所得控除（小規模企業共済等掛金控除）
              </Field.HelperText>
            </Field.Root>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
