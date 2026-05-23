"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  Card,
  EmptyState,
  Field,
  Heading,
  HStack,
  InputGroup,
  NumberInput,
  Stack,
  Stat,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { LuPiggyBank } from "react-icons/lu";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FormatYen } from "@/components/ui/format-yen";
import {
  type AccumulationYearPoint,
  pickMilestonePoints,
} from "@/lib/calculations/pension-accumulation";

interface Props {
  points: readonly AccumulationYearPoint[];
  years: number;
  onYearsChange: (v: number) => void;
  hasActiveScheme: boolean;
}

const SERIES_COLORS = {
  contribution: "blue.solid",
  gain: "green.solid",
} as const;

const formatManYen = (v: number | string) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "";
  return `${Math.round(n / 10000).toLocaleString("ja-JP")}万`;
};

export function PensionAccumulationResultCard({
  points,
  years,
  onYearsChange,
  hasActiveScheme,
}: Props) {
  const chartData = useMemo(
    () =>
      points.map((p) => ({
        year: p.year,
        contribution: Math.round(p.contribution),
        gain: Math.round(p.gain),
      })),
    [points],
  );

  const chart = useChart<(typeof chartData)[number]>({
    data: chartData,
    series: [
      { name: "contribution", color: SERIES_COLORS.contribution, label: "積立額" },
      { name: "gain", color: SERIES_COLORS.gain, label: "運用益" },
    ],
  });

  const milestones = useMemo(() => pickMilestonePoints(points, 5), [points]);

  const finalPoint = points[points.length - 1];
  const totalAtEnd = finalPoint?.total ?? 0;
  const totalContribution = finalPoint?.contribution ?? 0;
  const totalGain = finalPoint?.gain ?? 0;

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>積立シミュレーション結果</Card.Title>
        <Card.Description>
          現在の月額拠出を続けた場合の、運用益を反映した将来の積立額です。
        </Card.Description>
      </Card.Header>
      <Card.Body>
        {!hasActiveScheme || !finalPoint || finalPoint.total === 0 ? (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuPiggyBank />
              </EmptyState.Indicator>
              <EmptyState.Title>シミュレーション対象がありません</EmptyState.Title>
              <EmptyState.Description>
                「社会保険」セクションでiDeCo・国民年金基金・付加年金・小規模企業共済のいずれかに加入し、月額を入力するとシミュレーション結果が表示されます。
              </EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        ) : (
          <VStack align="stretch" gap={6}>
            <Field.Root>
              <Field.Label>積立年数</Field.Label>
              <NumberInput.Root
                min={1}
                max={50}
                step={1}
                value={`${years}`}
                onValueChange={(d) => {
                  if (Number.isNaN(d.valueAsNumber)) return;
                  onYearsChange(d.valueAsNumber);
                }}
                width="full"
              >
                <InputGroup endElement={<Text color="fg.muted">年</Text>}>
                  <NumberInput.Input />
                </InputGroup>
              </NumberInput.Root>
              <Field.HelperText>
                運用利回りは「詳細設定」から制度ごとに変更できます。
              </Field.HelperText>
            </Field.Root>

            <HStack
                justify="space-between"
                wrap="wrap"
                gap={4}
                bg="bg.subtle"
                rounded="md"
                px={4}
                py={3}
              >
                <Stat.Root>
                  <Stat.Label>{finalPoint.year}年後の積立額</Stat.Label>
                  <Stat.ValueText fontSize="2xl" fontWeight="bold">
                    <FormatYen value={Math.round(totalAtEnd)} />
                  </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>累計拠出額</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    <FormatYen value={Math.round(totalContribution)} />
                  </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>運用益</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    <FormatYen value={Math.round(totalGain)} />
                  </Stat.ValueText>
                </Stat.Root>
              </HStack>

              <Stack gap={3}>
                <Heading size="sm">時系列の積立額（積立額・運用益の内訳）</Heading>
                <Chart.Root maxH="sm" chart={chart}>
                  <AreaChart data={chart.data}>
                    <CartesianGrid
                      stroke={chart.color("border")}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="year"
                      tickFormatter={(v) => `${v}年`}
                      stroke={chart.color("border")}
                    />
                    <YAxis
                      tickFormatter={formatManYen}
                      stroke={chart.color("border")}
                    />
                    <Tooltip
                      cursor={false}
                      animationDuration={100}
                      content={
                        <Chart.Tooltip
                          showTotal
                          labelFormatter={(v) => `${v}年後`}
                        />
                      }
                    />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((s) => (
                      <Area
                        key={String(s.name)}
                        type="monotone"
                        dataKey={String(s.name)}
                        name={String(s.label)}
                        stroke={chart.color(s.color)}
                        fill={chart.color(s.color)}
                        fillOpacity={0.4}
                        strokeWidth={2}
                        stackId="a"
                      />
                    ))}
                  </AreaChart>
                </Chart.Root>
              </Stack>

              <Stack gap={3}>
                <Heading size="sm">5年ごとの積立額</Heading>
                <Table.Root size="sm" variant="line">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>経過年数</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">
                        積立額
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">
                        運用益
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">
                        合計
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {milestones.map((p) => (
                      <Table.Row key={p.year}>
                        <Table.Cell>{p.year}年後</Table.Cell>
                        <Table.Cell textAlign="end">
                          <FormatYen value={Math.round(p.contribution)} />
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <FormatYen value={Math.round(p.gain)} />
                        </Table.Cell>
                        <Table.Cell textAlign="end" fontWeight="semibold">
                          <FormatYen value={Math.round(p.total)} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Stack>
          </VStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
