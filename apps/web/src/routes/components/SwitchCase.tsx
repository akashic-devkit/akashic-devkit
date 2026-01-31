import CodeTabs from "@/components/CodeTabs";
import InstallationTabs from "@/components/InstallationTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import SwitchCaseExample from "@/registry/components/SwitchCase/SwitchCase.example";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/components/SwitchCase")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">SwitchCase</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs type="Component" name="SwitchCase" exampleComponent={<SwitchCaseExample />} />
      </div>
      {/* installation */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <InstallationTabs name="SwitchCase" />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer name="SwitchCase" />
      </div>
    </>
  );
}
