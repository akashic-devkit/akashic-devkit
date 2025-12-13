export const docsMap = {
  SwitchCase: () => import("../registry/components/SwitchCase/SwitchCase.guide.md?raw"),
  useMobile: () => import("../registry/hooks/useMobile/useMobile.guide.md?raw"),
  usePageLeave: () => import("../registry/hooks/usePageLeave/usePageLeave.guide.md?raw"),
} as const;
