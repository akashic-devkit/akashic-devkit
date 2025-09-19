import CodeTabs from "@/components/CodeTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/switchCase")({
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
        <CodeTabs />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer />
      </div>
    </>
  );
}
