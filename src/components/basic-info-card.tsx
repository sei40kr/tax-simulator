"use client";

import {
  Card,
  Checkbox,
  Field,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import { GrayExpensesSection } from "@/components/gray-expenses-section";
import { CountInput } from "@/components/ui/count-input";
import { MoneyInput } from "@/components/ui/money-input";
import type { TaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: TaxSettings;
  onChange: (patch: Partial<TaxSettings>) => void;
}

export function BasicInfoCard({ settings, onChange }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>基本情報</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch">
          <Field.Root>
            <Field.Label>年間売上（税込）</Field.Label>
            <MoneyInput
              value={settings.income}
              onChange={(v) => onChange({ income: v })}
              max={100_000_000}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>必要経費（税込）</Field.Label>
            <MoneyInput
              value={settings.expenses}
              onChange={(v) => onChange({ expenses: v })}
              max={settings.income}
            />
          </Field.Root>

          <GrayExpensesSection settings={settings} onChange={onChange} />

          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
            <GridItem>
              <Field.Root>
                <Field.Label>年齢</Field.Label>
                <CountInput
                  value={settings.age}
                  onChange={(v) => onChange({ age: v })}
                  min={18}
                  max={100}
                />
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root>
                <Field.Label>扶養家族人数</Field.Label>
                <CountInput
                  value={settings.dependents}
                  onChange={(v) => onChange({ dependents: v })}
                  max={10}
                />
              </Field.Root>
            </GridItem>
          </Grid>

          <Checkbox.Root
            checked={settings.hasSpouse}
            onCheckedChange={(d) => onChange({ hasSpouse: !!d.checked })}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>配偶者あり</Checkbox.Label>
          </Checkbox.Root>

          {settings.hasSpouse && (
            <Field.Root>
              <Field.Label>配偶者の年間所得</Field.Label>
              <MoneyInput
                value={settings.spouseIncome}
                onChange={(v) => onChange({ spouseIncome: v })}
                max={2_000_000}
              />
            </Field.Root>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
