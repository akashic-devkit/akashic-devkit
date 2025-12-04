export const rawCodesMap = {
  "SwitchCase.tsx": () => import("@/registry/components/SwitchCase/SwitchCase.example.tsx?raw"),
  "useMobile.ts": () => import("@/registry/hooks/useMobile/useMobile.example.tsx?raw"),
  "useSearchParamState.ts": () => import("@/registry/hooks/useSearchParamState/useSearchParamState.example.tsx?raw"),
} as const;
