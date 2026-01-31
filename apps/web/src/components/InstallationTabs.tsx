import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const PACKAGE_MANAGER_COMMANDS = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn",
  bun: "bunx --bun",
} as const;
type PackageManagerType = keyof typeof PACKAGE_MANAGER_COMMANDS;

const CLI_COMMAND = `${import.meta.env.VITE_CLI_NAME || "akashic"}@latest add`;

interface Props {
  name: string;
}

export default function InstallationTabs({ name }: Props) {
  const [copied, setCopied] = useState(false);
  const [tabValue, setTabValue] = useState<PackageManagerType>("npm");

  const handleCopy = async () => {
    if (copied) return;
    try {
      const packageCommand = PACKAGE_MANAGER_COMMANDS[tabValue];
      const copiedCommand = `${packageCommand} ${CLI_COMMAND} ${name}`;
      await navigator.clipboard.writeText(copiedCommand);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("copy error:", err);
    }
  };

  return (
    <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as PackageManagerType)}>
      <Card className="p-1 m-0 w-full gap-0.5">
        <CardHeader className="p-0 w-full flex items-center justify-between">
          <TabsList>
            {Object.keys(PACKAGE_MANAGER_COMMANDS).map((name) => (
              <TabsTrigger key={`tab-${name}`} value={name}>
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {!copied ? <Copy className="size-4" /> : <Check className="size-4" />}
          </Button>
        </CardHeader>
        <CardContent className="px-2 py-3">
          {(Object.entries(PACKAGE_MANAGER_COMMANDS) as [PackageManagerType, string][]).map(
            ([name, command]) => (
              <TabsContent key={`panel-${name}`} value={name}>
                {`${command} ${CLI_COMMAND} ${name}`}
              </TabsContent>
            )
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
}
