import CodeTabs from "@/components/CodeTabs";
import InstallationTabs from "@/components/InstallationTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import QueryExample from "@/registry/components/Query/Query.example";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/component/Query")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">Query</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs type="Component" name="Query" exampleComponent={<QueryExample />} />
      </div>
      {/* installation */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <InstallationTabs name="Query" />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer name="Query" />
      </div>
    </>
  );
}
