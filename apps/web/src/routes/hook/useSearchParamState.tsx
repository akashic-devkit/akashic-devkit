import CodeTabs from "@/components/CodeTabs";
import InstallationTabs from "@/components/InstallationTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import UseSearchParamStateExample from "@/registry/hooks/useSearchParamState/useSearchParamState.example";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hook/useSearchParamState")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">useSearchParamState</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs type="Hook" name="useSearchParamState" exampleComponent={<UseSearchParamStateExample />} />
      </div>
      {/* installation */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <InstallationTabs name="useSearchParamState" />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer name="useSearchParamState" />
      </div>
    </>
  );
}
