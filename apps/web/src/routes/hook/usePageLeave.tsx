import CodeTabs from "@/components/CodeTabs";
import InstallationTabs from "@/components/InstallationTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import UsePageLeaveExample from "@/registry/hooks/usePageLeave/usePageLeave.example";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hook/usePageLeave")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">usePageLeave</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs type="Hook" name="usePageLeave" exampleComponent={<UsePageLeaveExample />} />
      </div>
      {/* installation */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <InstallationTabs name="usePageLeave" />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer name="usePageLeave" />
      </div>
    </>
  );
}
