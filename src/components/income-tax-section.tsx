"use client";

import { Card, Field, VStack } from "@chakra-ui/react";
import { MoneyInput } from "@/components/ui/money-input";
import type { IncomeTaxSettings } from "@/lib/calculations/calculator";

interface Props {
  settings: IncomeTaxSettings;
  onChange: (patch: Partial<IncomeTaxSettings>) => void;
}

const FIELDS: { key: keyof IncomeTaxSettings; label: string; help?: string }[] = [
  { key: "lifeInsuranceDeduction", label: "生命保険料控除" },
  { key: "medicalExpenseDeduction", label: "医療費控除" },
  { key: "donationDeduction", label: "寄付金控除" },
  { key: "otherDeduction", label: "その他控除" },
];

export function IncomeTaxSection({ settings, onChange }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>所得税控除</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch">
          {FIELDS.map(({ key, label, help }) => (
            <Field.Root key={key}>
              <Field.Label>{label}</Field.Label>
              <MoneyInput
                value={settings[key]}
                onChange={(v) => onChange({ [key]: v } as Partial<IncomeTaxSettings>)}
              />
              {help && <Field.HelperText>{help}</Field.HelperText>}
            </Field.Root>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
