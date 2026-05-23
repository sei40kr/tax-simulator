"use client";

import { Accordion, Field, Grid, GridItem, Span, Text } from "@chakra-ui/react";
import { PercentInput } from "@/components/ui/percent-input";
import {
  PENSION_SCHEME_META,
  type PensionSchemeKey,
  type PensionSchemeMeta,
} from "@/lib/calculations/pension-accumulation";

interface Props {
  returnRates: Record<PensionSchemeKey, number>;
  onChange: (
    updater: (s: Record<PensionSchemeKey, number>) => Record<
      PensionSchemeKey,
      number
    >,
  ) => void;
  activeMeta: readonly PensionSchemeMeta[];
}

export function PensionReturnRateSection({
  returnRates,
  onChange,
  activeMeta,
}: Props) {
  const list = activeMeta.length > 0 ? activeMeta : PENSION_SCHEME_META;
  return (
    <Accordion.Item value="pensionReturnRate">
      <Accordion.ItemTrigger>
        <Span flex="1">積立運用利回り</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent pb={4}>
        {activeMeta.length === 0 ? (
          <Text color="fg.muted" fontSize="sm">
            「社会保険」セクションで対象の制度に加入すると、ここで運用利回りを調整できます。
          </Text>
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
            {list.map((m) => (
              <GridItem key={m.key}>
                <Field.Root>
                  <Field.Label>{m.label}</Field.Label>
                  <PercentInput
                    value={returnRates[m.key]}
                    onChange={(v) =>
                      onChange((s) => ({ ...s, [m.key]: v }))
                    }
                    min={0}
                    max={20}
                    step={0.1}
                  />
                </Field.Root>
              </GridItem>
            ))}
          </Grid>
        )}
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
