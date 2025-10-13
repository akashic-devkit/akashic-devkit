import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import CodeViewer from "./CodeViewer";
import { Card, CardContent } from "./ui/card";
import { ReactNode } from "react";

const CODE_TAB_TYPES = ["preview", "code"];

interface Props {
  type: "Component" | "Hook";
  name: string;
  exampleComponent: ReactNode;
}

export default function CodeTabs({ type, name, exampleComponent }: Props) {
  const fileExtension = type === "Component" ? ".tsx" : ".ts";
  const fileName = name + fileExtension;

  return (
    <Tabs defaultValue={CODE_TAB_TYPES[0]}>
      <TabsList>
        {CODE_TAB_TYPES.map((item) => (
          <TabsTrigger key={`tab-${item}`} value={item}>
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
      {CODE_TAB_TYPES.map((item) => (
        <TabsContent key={`panel-${item}`} value={item}>
          {item === "preview" ? (
            <Card>
              <CardContent>{exampleComponent}</CardContent>
            </Card>
          ) : (
            <CodeViewer type="file" fileName={fileName} language="typescript" />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
