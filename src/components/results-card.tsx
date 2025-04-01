"use client";

import {
  Box,
  Card,
  FormatNumber,
  Grid,
  HStack,
  Stat,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormatYen } from "@/components/ui/format-yen";
import type { TaxResults } from "@/lib/calculations/calculator";

interface Props {
  income: number;
  expenses: number;
  age: number;
  results: TaxResults;
}

export function ResultsCard({ income, expenses, age, results }: Props) {
  const showCare = age >= 40 && age < 65;

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>計算結果</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap={5}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <Box>
              <Text fontSize="sm" color="fg.muted">
                収入
              </Text>
              <Text fontSize="lg">
                <FormatYen value={income} />
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="fg.muted">
                経費
              </Text>
              <Text fontSize="lg">
                <FormatYen value={expenses} />
              </Text>
            </Box>
          </Grid>

          <Table.Root size="sm" variant="line">
            <Table.Body>
              {results.consumptionTax > 0 && (
                <SectionRow
                  label="売上総利益（収入−経費）"
                  value={income - expenses}
                  muted
                />
              )}
              <SectionRow
                label={
                  results.consumptionTax > 0
                    ? "事業所得（消費税控除後）"
                    : "事業所得（収入−経費）"
                }
                value={results.netIncome}
              />
              <SectionRow label="総控除額" value={results.totalDeduction} muted />
              <SectionRow label="課税所得" value={results.taxableIncome} emphasis />
            </Table.Body>
          </Table.Root>

          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>税目・保険料</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">金額</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <SectionRow
                label="所得税（復興特別所得税含む）"
                value={results.incomeTax}
              />
              <SectionRow label="住民税" value={results.residentTax} />
              <SectionRow
                label="国民健康保険料（医療分・支援金分）"
                value={results.healthInsurance}
              />
              {showCare && (
                <SectionRow
                  label="国民健康保険料（介護分）"
                  value={results.careInsurance}
                />
              )}
              <SectionRow label="国民年金保険料" value={results.pension} />
              {results.additionalPension > 0 && (
                <SectionRow
                  label="付加年金保険料"
                  value={results.additionalPension}
                />
              )}
              {results.nationalPensionFund > 0 && (
                <SectionRow
                  label="国民年金基金掛金"
                  value={results.nationalPensionFund}
                />
              )}
              {results.ideco > 0 && (
                <SectionRow label="iDeCo掛金" value={results.ideco} />
              )}
              {results.smallBusinessMutualAid > 0 && (
                <SectionRow
                  label="小規模企業共済掛金"
                  value={results.smallBusinessMutualAid}
                />
              )}
              {results.businessTax > 0 && (
                <SectionRow label="個人事業税" value={results.businessTax} />
              )}
              {results.consumptionTax > 0 && (
                <SectionRow label="消費税" value={results.consumptionTax} />
              )}
              <Table.Row>
                <Table.Cell fontWeight="semibold">合計税・社会保険料</Table.Cell>
                <Table.Cell textAlign="end" fontWeight="semibold">
                  <FormatYen value={results.totalTax} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell color="fg.muted">実効税率</Table.Cell>
                <Table.Cell textAlign="end" color="fg.muted">
                  <FormatNumber
                    value={results.taxRate}
                    style="percent"
                    minimumFractionDigits={1}
                    maximumFractionDigits={1}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>

          <Box
            borderTopWidth="2px"
            borderColor="border.emphasized"
            pt={4}
            bg="bg.subtle"
            rounded="md"
            px={4}
            py={3}
          >
            <HStack justify="space-between" align="baseline">
              <Stat.Root>
                <Stat.Label>手取り金額（年額）</Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold">
                  <FormatYen value={results.takeHome} />
                </Stat.ValueText>
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>手取り金額（月額換算）</Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold">
                  <FormatYen value={Math.floor(results.takeHome / 12)} />
                </Stat.ValueText>
              </Stat.Root>
            </HStack>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function SectionRow({
  label,
  value,
  emphasis,
  muted,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
  muted?: boolean;
}) {
  const color = muted ? "fg.muted" : undefined;
  const fontWeight = emphasis ? "semibold" : undefined;
  return (
    <Table.Row>
      <Table.Cell color={color} fontWeight={fontWeight}>
        {label}
      </Table.Cell>
      <Table.Cell textAlign="end" color={color} fontWeight={fontWeight}>
        <FormatYen value={value} />
      </Table.Cell>
    </Table.Row>
  );
}
