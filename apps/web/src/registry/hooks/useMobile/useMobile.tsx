import * as React from "react";

const DEFAULT_MOBILE_BREAKPOINT = 768;

interface Props {
  breakpoint: number;
}

export function useMobile({ breakpoint }: Props = { breakpoint: DEFAULT_MOBILE_BREAKPOINT }) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return { isMobile: !!isMobile };
}
