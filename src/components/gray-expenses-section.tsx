"use client";

import {
  Alert,
  Button,
  Collapsible,
  Field,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import { MoneyInput } from "@/components/ui/money-input";
import type { TaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: TaxSettings;
  onChange: (patch: Partial<TaxSettings>) => void;
}

export function GrayExpensesSection({ settings, onChange }: Props) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          w="full"
          justifyContent="space-between"
          fontWeight="medium"
          css={{
            "&[data-state=open] .gray-expenses-indicator": {
              transform: "rotate(180deg)",
            },
          }}
        >
          グレー経費を試算する
          <Icon
            className="gray-expenses-indicator"
            transition="transform 0.2s"
          >
            <LuChevronDown />
          </Icon>
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack align="stretch" gap={3} pt={3}>
          <Field.Root>
            <Field.Label>
              私的支出を事業経費として計上する額（税込）
            </Field.Label>
            <MoneyInput
              value={settings.grayExpenses}
              onChange={(v) => onChange({ grayExpenses: v })}
              max={Math.max(0, settings.income - settings.expenses)}
            />
          </Field.Root>
          <Alert.Root status="warning" size="sm">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>注意</Alert.Title>
              <Alert.Description>
                この項目は、世の中で実際に行われている「私的支出の経費計上」がどの程度の税負担差を生むのかを、知的好奇心を満たす範囲で把握するためのものです。ユーザー自身に同じ申告を推奨するものではなく、当然ながらそうした行為は脱税にあたります。
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
