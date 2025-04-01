"use client";

import { NumberInput } from "@chakra-ui/react";

interface CountInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function CountInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}: CountInputProps) {
  return (
    <NumberInput.Root
      min={min}
      max={max}
      step={step}
      value={`${value}`}
      onValueChange={(details) => onChange(details.valueAsNumber)}
      width="full"
    >
      <NumberInput.Input />
    </NumberInput.Root>
  );
}
