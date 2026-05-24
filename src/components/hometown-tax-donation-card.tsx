"use client";

import {
  Box,
  Card,
  EmptyState,
  HStack,
  Stat,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuGift } from "react-icons/lu";
import { FormatYen } from "@/components/ui/format-yen";
import { HOMETOWN_TAX_SELF_BURDEN } from "@/lib/calculations/hometown-tax-donation";

interface Props {
  limit: number;
  residentIncomeRateTax: number;
}

export function HometownTaxDonationCard({
  limit,
  residentIncomeRateTax,
}: Props) {
  const deductedAmount = Math.max(0, limit - HOMETOWN_TAX_SELF_BURDEN);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>ふるさと納税の控除上限額</Card.Title>
        <Card.Description>
          自己負担2,000円で寄附できる上限の目安です（住民税所得割の20%が特例分の上限）。
        </Card.Description>
      </Card.Header>
      <Card.Body>
        {residentIncomeRateTax <= 0 ? (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuGift />
              </EmptyState.Indicator>
              <EmptyState.Title>控除対象の住民税所得割がありません</EmptyState.Title>
              <EmptyState.Description>
                所得や控除の入力を見直すと、控除上限額が算出されます。
              </EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        ) : (
          <VStack align="stretch" gap={5}>
            <Box bg="bg.subtle" rounded="md" px={4} py={3}>
              <HStack justify="space-between" align="baseline" wrap="wrap" gap={4}>
                <Stat.Root>
                  <Stat.Label>控除上限額（寄附額）</Stat.Label>
                  <Stat.ValueText fontSize="2xl" fontWeight="bold">
                    <FormatYen value={limit} />
                  </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>控除される額</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    <FormatYen value={deductedAmount} />
                  </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>自己負担額</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    <FormatYen value={HOMETOWN_TAX_SELF_BURDEN} />
                  </Stat.ValueText>
                </Stat.Root>
              </HStack>
            </Box>

            <Table.Root size="sm" variant="line">
              <Table.Body>
                <Table.Row>
                  <Table.Cell color="fg.muted">住民税所得割額</Table.Cell>
                  <Table.Cell textAlign="end">
                    <FormatYen value={residentIncomeRateTax} />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Text fontSize="xs" color="fg.muted">
              ※
              概算値です。住宅ローン控除や医療費控除など他の税額控除がある場合は実際の上限額が変動します。寄附金控除欄にふるさと納税予定額を入力していると上限額が小さく算出されるため、正確な値を見るには寄附金控除を0にしてください。寄附先のポータルサイト等で最新のシミュレーションも併せてご確認ください。
            </Text>
          </VStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
