"use client";

import {
  Card,
  Checkbox,
  Field,
  HStack,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import type { TaxReturnType, TaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: TaxSettings;
  onChange: (patch: Partial<TaxSettings>) => void;
}

export function TaxReturnCard({ settings, onChange }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>申告方式</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Field.Root>
            <RadioGroup.Root
              value={settings.taxReturnType}
              onValueChange={(d) =>
                onChange({ taxReturnType: d.value as TaxReturnType })
              }
            >
              <HStack gap={6}>
                <RadioGroup.Item value="blue">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>青色申告</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="white">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>白色申告</RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>
          </Field.Root>

          {settings.taxReturnType === "blue" && (
            <Field.Root>
              <Checkbox.Root
                checked={settings.isFirstYear}
                onCheckedChange={(d) => onChange({ isFirstYear: !!d.checked })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>
                  電子申告・電子帳簿を利用しない（55万円控除）
                </Checkbox.Label>
              </Checkbox.Root>
              <Field.HelperText>
                e-Tax 申告かつ電子帳簿保存の場合は 65 万円控除（チェックなし）
              </Field.HelperText>
            </Field.Root>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
