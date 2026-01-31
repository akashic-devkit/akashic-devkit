import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useState } from "react";
import CopyButton from "./CopyButton";

const PACKAGE_MANAGER_SUPPROTS = [
  {
    name: "npm",
    command: "npx",
  },
  {
    name: "pnpm",
    command: "pnpm dlx",
  },
  {
    name: "yarn",
    command: "yarn",
  },
  {
    name: "bun",
    command: "bunx --bun",
  },
] as const;
type PackageManagerType = (typeof PACKAGE_MANAGER_SUPPROTS)[number]["name"];

const CLI_COMMAND = `${import.meta.env.VITE_CLI_NAME || "akashic"}@latest add`;

interface Props {
  name: string;
}

export default function InstallationTabs({ name }: Props) {
  const [tabValue, setTabValue] = useState<PackageManagerType>("npm");

  const packageCommand = PACKAGE_MANAGER_SUPPROTS.find((item) => item.name === tabValue)?.command ?? "npm";
  const copiedCommand = `${packageCommand} ${CLI_COMMAND} ${name}`;

  return (
    <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as PackageManagerType)}>
      <Card className="p-1 m-0 w-full gap-0.5">
        <CardHeader className="p-0 w-full flex items-center justify-between">
          <TabsList>
            {PACKAGE_MANAGER_SUPPROTS.map((item) => (
              <TabsTrigger key={`tab-${item.name}`} value={item.name}>
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton copyText={copiedCommand} />
        </CardHeader>
        <CardContent className="px-2 py-3">
          {PACKAGE_MANAGER_SUPPROTS.map((item) => (
            <TabsContent key={`panel-${item.name}`} value={item.name}>
              {`${item.command} ${CLI_COMMAND} ${name}`}
            </TabsContent>
          ))}
        </CardContent>
      </Card>
    </Tabs>
  );
}
