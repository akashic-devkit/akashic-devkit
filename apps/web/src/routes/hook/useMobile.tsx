import CodeTabs from "@/components/CodeTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import UseMobileExample from "@/registry/hooks/useMobile/useMobile.example";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hook/useMobile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">useMobile</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs type="Hook" name="useMobile" exampleComponent={<UseMobileExample />} />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer name="useMobile" />
      </div>
    </>
  );
}
