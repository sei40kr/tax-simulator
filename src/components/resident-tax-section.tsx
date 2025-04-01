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
import type { ResidentTaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: ResidentTaxSettings;
  onChange: (patch: Partial<ResidentTaxSettings>) => void;
}

interface RatePair {
  legend: string;
  rateKey: keyof ResidentTaxSettings;
  perCapitaKey: keyof ResidentTaxSettings;
}

const PAIRS: RatePair[] = [
  { legend: "市町村民税", rateKey: "cityIncomeRate", perCapitaKey: "cityPerCapita" },
  { legend: "都道府県民税", rateKey: "prefIncomeRate", perCapitaKey: "prefPerCapita" },
];

export function ResidentTaxSection({ settings, onChange }: Props) {
  return (
    <Accordion.Item value="residentTax">
      <Accordion.ItemTrigger>
        <Span flex="1">住民税</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent pb={4}>
        <VStack gap={6} align="stretch">
          {PAIRS.map(({ legend, rateKey, perCapitaKey }) => (
            <Fieldset.Root key={legend}>
              <Fieldset.Legend>{legend}</Fieldset.Legend>
              <Fieldset.Content>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
                  <GridItem>
                    <Field.Root>
                      <Field.Label>所得割率</Field.Label>
                      <PercentInput
                        value={settings[rateKey]}
                        onChange={(v) =>
                          onChange({ [rateKey]: v } as Partial<ResidentTaxSettings>)
                        }
                        max={20}
                      />
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root>
                      <Field.Label>均等割（年額）</Field.Label>
                      <MoneyInput
                        value={settings[perCapitaKey]}
                        onChange={(v) =>
                          onChange({ [perCapitaKey]: v } as Partial<ResidentTaxSettings>)
                        }
                      />
                    </Field.Root>
                  </GridItem>
                </Grid>
              </Fieldset.Content>
            </Fieldset.Root>
          ))}

          <Field.Root>
            <Field.Label>森林環境税（年額固定）</Field.Label>
            <MoneyInput
              value={settings.forestTax}
              onChange={(v) => onChange({ forestTax: v })}
            />
          </Field.Root>
        </VStack>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
