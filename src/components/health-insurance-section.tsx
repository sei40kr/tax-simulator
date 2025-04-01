"use client";

import {
  Accordion,
  Field,
  Fieldset,
  Grid,
  GridItem,
  Span,
  VStack,
} from "@chakra-ui/react";
import { MoneyInput } from "@/components/ui/money-input";
import { PercentInput } from "@/components/ui/percent-input";
import type {
  HealthInsuranceSettings,
  InsuranceComponent,
} from "@/lib/calculations/calculator";

interface Props {
  settings: HealthInsuranceSettings;
  onChange: (patch: Partial<HealthInsuranceSettings>) => void;
  age: number;
}

interface ComponentBlockProps {
  legend: string;
  component: InsuranceComponent;
  onChange: (patch: Partial<InsuranceComponent>) => void;
  maxRate?: number;
}

function ComponentBlock({
  legend,
  component,
  onChange,
  maxRate = 20,
}: ComponentBlockProps) {
  return (
    <Fieldset.Root>
      <Fieldset.Legend>{legend}</Fieldset.Legend>
      <Fieldset.Content>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          <GridItem>
            <Field.Root>
              <Field.Label>所得割率</Field.Label>
              <PercentInput
                value={component.incomeRate}
                onChange={(v) => onChange({ incomeRate: v })}
                max={maxRate}
              />
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label>均等割（年額）</Field.Label>
              <MoneyInput
                value={component.perCapita}
                onChange={(v) => onChange({ perCapita: v })}
              />
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label>平等割（年額）</Field.Label>
              <MoneyInput
                value={component.household}
                onChange={(v) => onChange({ household: v })}
              />
              <Field.HelperText>世帯ごとに加算（自治体により有無あり）</Field.HelperText>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label>賦課限度額</Field.Label>
              <MoneyInput
                value={component.limit}
                onChange={(v) => onChange({ limit: v })}
              />
            </Field.Root>
          </GridItem>
        </Grid>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}

export function HealthInsuranceSection({ settings, onChange, age }: Props) {
  const updateSlice = (
    key: keyof HealthInsuranceSettings,
    patch: Partial<InsuranceComponent>,
  ) => onChange({ [key]: { ...settings[key], ...patch } });

  return (
    <Accordion.Item value="healthInsurance">
      <Accordion.ItemTrigger>
        <Span flex="1">国民健康保険</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent pb={4}>
        <VStack align="stretch" gap={6}>
          <ComponentBlock
            legend="医療分"
            component={settings.medical}
            onChange={(p) => updateSlice("medical", p)}
          />
          <ComponentBlock
            legend="支援金分"
            component={settings.support}
            onChange={(p) => updateSlice("support", p)}
          />
          {age >= 40 && age < 65 && (
            <ComponentBlock
              legend="介護分（40〜64歳）"
              component={settings.care}
              onChange={(p) => updateSlice("care", p)}
              maxRate={10}
            />
          )}
        </VStack>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
