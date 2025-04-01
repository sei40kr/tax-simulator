"use client";

import { InputGroup, NumberInput } from "@chakra-ui/react";
import { LuPercent } from "react-icons/lu";

interface PercentInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PercentInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.1,
}: PercentInputProps) {
  return (
    <NumberInput.Root
      min={min}
      max={max}
      step={step}
      value={`${value}`}
      onValueChange={(details) => onChange(details.valueAsNumber)}
      width="full"
    >
      <InputGroup endElement={<LuPercent />}>
        <NumberInput.Input />
      </InputGroup>
    </NumberInput.Root>
  );
}
