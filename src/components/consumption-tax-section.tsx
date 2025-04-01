"use client";

import { Card, Checkbox, Field, VStack } from "@chakra-ui/react";
import { PercentInput } from "@/components/ui/percent-input";
import type { ConsumptionTaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: ConsumptionTaxSettings;
  onChange: (patch: Partial<ConsumptionTaxSettings>) => void;
}

export function ConsumptionTaxSection({ settings, onChange }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>消費税</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch">
          <Checkbox.Root
            checked={settings.isSubjectToTax}
            onCheckedChange={(d) => onChange({ isSubjectToTax: !!d.checked })}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>課税事業者</Checkbox.Label>
          </Checkbox.Root>

          {settings.isSubjectToTax && (
            <>
              <Field.Root>
                <Field.Label>税率</Field.Label>
                <PercentInput
                  value={settings.rate}
                  onChange={(v) => onChange({ rate: v })}
                  max={20}
                />
              </Field.Root>

              <Checkbox.Root
                checked={settings.useSimplifiedMethod}
                onCheckedChange={(d) =>
                  onChange({ useSimplifiedMethod: !!d.checked })
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>簡易課税方式を使用</Checkbox.Label>
              </Checkbox.Root>

              {settings.useSimplifiedMethod && (
                <Field.Root>
                  <Field.Label>みなし仕入率</Field.Label>
                  <PercentInput
                    value={settings.simplifiedRate}
                    onChange={(v) => onChange({ simplifiedRate: v })}
                    step={1}
                  />
                  <Field.HelperText>
                    事業区分により 40〜90% で設定（例: 卸売 90%、小売 80%、サービス 50%）
                  </Field.HelperText>
                </Field.Root>
              )}
            </>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
