export const rawCodesMap = {
  "SwitchCase.tsx": () => import("@/registry/components/SwitchCase/SwitchCase.example.tsx?raw"),
  "useMobile.ts": () => import("@/registry/hooks/useMobile/useMobile.example.tsx?raw"),
  "usePageLeave.ts": () => import("@/registry/hooks/usePageLeave/usePageLeave.example.tsx?raw"),
} as const;
