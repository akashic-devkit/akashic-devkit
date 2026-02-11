import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { ReactNode } from "react";
import CopyButton from "./CopyButton";
import SyntaxHighlighter from "react-syntax-highlighter";
import vs from "react-syntax-highlighter/dist/cjs/styles/prism/vs";

interface Props {
  rawCode: string;
  exampleComponent: ReactNode;
}

export default function CodeTabs({ rawCode, exampleComponent }: Props) {
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
        <Card className="p-0 relative">
          <CopyButton className="absolute right-1 top-1" text={rawCode} />
          <CardContent className="p-2">
            <SyntaxHighlighter
              language="typescript"
              style={vs}
              showLineNumbers={true}
              wrapLines={true}
              customStyle={{
                padding: 0,
                border: "none",
              }}
            >
              {rawCode}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
