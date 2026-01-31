import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useState } from "react";
import CopyButton from "./CopyButton";

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
  const [tabValue, setTabValue] = useState<PackageManagerType>("npm");

  const packageCommand = PACKAGE_MANAGER_COMMANDS[tabValue];
  const copiedCommand = `${packageCommand} ${CLI_COMMAND} ${name}`;

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
          <CopyButton text={copiedCommand} />
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
