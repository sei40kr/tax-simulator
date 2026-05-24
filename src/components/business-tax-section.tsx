"use client";

import {
  Box,
  Button,
  Card,
  Collapsible,
  Field,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import {
  BRACKET_LABELS,
  BRACKET_ORDER,
  INDUSTRY_GROUPS,
} from "@/components/business-tax-industry-reference";
import { MoneyInput } from "@/components/ui/money-input";
import { PercentInput } from "@/components/ui/percent-input";
import type {
  BusinessTaxBracket,
  BusinessTaxSettings,
} from "@/lib/calculations/calculator";

interface Props {
  settings: BusinessTaxSettings;
  onChange: (patch: Partial<BusinessTaxSettings>) => void;
}

export function BusinessTaxSection({ settings, onChange }: Props) {
  const isExempt = settings.bracket === "exempt";
  const isCustom = settings.bracket === "custom";

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>個人事業税</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Field.Root>
            <Field.Label>税率区分</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={settings.bracket}
                onChange={(e) =>
                  onChange({
                    bracket: e.currentTarget.value as BusinessTaxBracket,
                  })
                }
              >
                {BRACKET_ORDER.map((bracket) => (
                  <option key={bracket} value={bracket}>
                    {BRACKET_LABELS[bracket]}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.HelperText>
              どの区分に該当するか分からない場合は、下の「業種別の税率一覧」を参照。
            </Field.HelperText>
          </Field.Root>

          {!isExempt && (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              {isCustom && (
                <GridItem>
                  <Field.Root>
                    <Field.Label>税率</Field.Label>
                    <PercentInput
                      value={settings.customRate}
                      onChange={(v) => onChange({ customRate: v })}
                      max={20}
                    />
                  </Field.Root>
                </GridItem>
              )}
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

          <Collapsible.Root>
            <Collapsible.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                w="full"
                justifyContent="space-between"
                fontWeight="medium"
                css={{
                  "&[data-state=open] .industry-ref-indicator": {
                    transform: "rotate(180deg)",
                  },
                }}
              >
                業種別の税率一覧
                <Icon
                  className="industry-ref-indicator"
                  transition="transform 0.2s"
                >
                  <LuChevronDown />
                </Icon>
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <VStack align="stretch" gap={3} pt={3}>
                {INDUSTRY_GROUPS.map((group) => (
                  <Box key={group.title}>
                    <Heading as="h4" size="sm" mb={1}>
                      {group.title}
                    </Heading>
                    <HStack align="start" wrap="wrap" gap={1}>
                      {group.industries.map((industry, i) => (
                        <Text key={industry} fontSize="sm" color="fg.muted">
                          {industry}
                          {i < group.industries.length - 1 && "・"}
                        </Text>
                      ))}
                    </HStack>
                  </Box>
                ))}
                <Text fontSize="xs" color="fg.muted">
                  出典: 地方税法72条の2。法定業種外の代表例は東京都・各道府県の運用に基づく一般的な扱い。
                </Text>
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
