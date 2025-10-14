import { useMobile } from "./useMobile";

export default function UseMobileExample() {
  const { isMobile } = useMobile();

  return (
    <div>
      isMobile?<strong style={{ marginLeft: "8px" }}>{String(isMobile)}</strong>
    </div>
  );
}
