import SwitchCaseExample from "@/registry/components/SwitchCase.example";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import CodeViewer from "./CodeViewer";
import { Card, CardContent } from "./ui/card";

const CODE_TAB_TYPES = ["preview", "code"];

export default function CodeTabs() {
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
              <CardContent>
                <SwitchCaseExample />
              </CardContent>
            </Card>
          ) : (
            <CodeViewer type="file" fileName="SwitchCase.tsx" language="typescript" />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
