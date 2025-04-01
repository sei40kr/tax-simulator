"use client";

import { FormatNumber } from "@chakra-ui/react";

interface FormatYenProps {
  value: number;
}

export function FormatYen({ value }: FormatYenProps) {
  return <FormatNumber value={value} style="currency" currency="JPY" />;
}
