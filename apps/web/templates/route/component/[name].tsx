// @ts-nocheck
import CodeTabs from "@/components/CodeTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import { createFileRoute } from "@tanstack/react-router";
import __EXAMPLE__ from "@/registry/components/__NAME__/__NAME__.example";

export const Route = createFileRoute("/component/__NAME__")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">__NAME__</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs type="Component" name="__NAME__" exampleComponent={<__EXAMPLE__ />} />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer name="__NAME__" />
      </div>
    </>
  );
}
