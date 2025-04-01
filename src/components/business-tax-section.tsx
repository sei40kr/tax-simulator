"use client";

import { Card, Checkbox, Field, Grid, GridItem, VStack } from "@chakra-ui/react";
import { MoneyInput } from "@/components/ui/money-input";
import { PercentInput } from "@/components/ui/percent-input";
import type { BusinessTaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: BusinessTaxSettings;
  onChange: (patch: Partial<BusinessTaxSettings>) => void;
}

export function BusinessTaxSection({ settings, onChange }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>個人事業税</Card.Title>
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
            <Checkbox.Label>事業税対象業種</Checkbox.Label>
          </Checkbox.Root>

          {settings.isSubjectToTax && (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem>
                <Field.Root>
                  <Field.Label>税率</Field.Label>
                  <PercentInput
                    value={settings.rate}
                    onChange={(v) => onChange({ rate: v })}
                    max={20}
                  />
                </Field.Root>
              </GridItem>
              <GridItem>
                <Field.Root>
                  <Field.Label>事業主控除（課税最低限）</Field.Label>
                  <MoneyInput
                    value={settings.minimumTaxableIncome}
                    onChange={(v) => onChange({ minimumTaxableIncome: v })}
                  />
                </Field.Root>
              </GridItem>
            </Grid>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
