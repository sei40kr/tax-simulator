"use client";

import { Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuJapaneseYen } from "react-icons/lu";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const format = (n: number) => Math.trunc(n).toLocaleString("ja-JP");
const parse = (s: string) => {
  const cleaned = s.replace(/[^\d-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export function MoneyInput({
  value,
  onChange,
  min = 0,
  max,
}: MoneyInputProps) {
  const [draft, setDraft] = useState<string>(format(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(format(value));
  }, [value, focused]);

  const clamp = (n: number) => {
    let v = n;
    if (typeof min === "number" && v < min) v = min;
    if (typeof max === "number" && v > max) v = max;
    return v;
  };

  return (
    <InputGroup startElement={<LuJapaneseYen />}>
      <Input
        inputMode="numeric"
        value={draft}
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          const parsed = clamp(parse(raw));
          if (parsed !== value) onChange(parsed);
        }}
        onFocus={(e) => {
          setFocused(true);
          setDraft(String(value));
          requestAnimationFrame(() => e.target.select());
        }}
        onBlur={() => {
          const parsed = clamp(parse(draft));
          if (parsed !== value) onChange(parsed);
          setFocused(false);
          setDraft(format(parsed));
        }}
      />
    </InputGroup>
  );
}
