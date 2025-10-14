import { Monitor, Moon, Sun } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Theme, useTheme } from "../theme/ThemeProvider";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (value === "") return;
        setTheme(value as Theme);
      }}
    >
      <ToggleGroupItem value="system" aria-label="Toggle theme system">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Toggle theme light">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle theme dark">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
