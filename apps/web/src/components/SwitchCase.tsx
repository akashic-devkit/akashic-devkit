import React from "react";

type Primitive = string | number | symbol;

interface Props<T extends Primitive> {
  value: T;
  cases: Record<T, React.ReactNode> & { default: React.ReactNode };
}

export default function SwitchCase<T extends Primitive>({
  value,
  cases,
}: Props<T>) {
  const matchCase = value in cases ? cases[value] : cases.default;

  return matchCase;
}
