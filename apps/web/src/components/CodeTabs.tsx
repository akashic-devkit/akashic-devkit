import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import CodeViewer from "./CodeViewer";
import { Card, CardContent } from "./ui/card";
import { ReactNode } from "react";

interface Props {
  type: "Component" | "Hook";
  name: string;
  exampleComponent: ReactNode;
}

export default function CodeTabs({ type, name, exampleComponent }: Props) {
  const fileExtension = type === "Component" ? ".tsx" : ".ts";
  const fileName = name + fileExtension;

  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">preview</TabsTrigger>
        <TabsTrigger value="code">code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <Card>
          <CardContent>{exampleComponent}</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="code">
        <CodeViewer type="file" fileName={fileName} language="typescript" />
      </TabsContent>
    </Tabs>
  );
}
