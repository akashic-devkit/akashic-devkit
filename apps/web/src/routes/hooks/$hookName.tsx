import CodeTabs from "@/components/CodeTabs";
import InstallationTabs from "@/components/InstallationTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import { docsMap } from "@/data/docsMap";
import { hooksMenu } from "@/data/hooksMenu";
import { rawCodesMap } from "@/data/rawCodesMap";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy } from "react";

export const Route = createFileRoute("/hooks/$hookName")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const match = hooksMenu.find((comp) => comp.title === params.hookName);
    if (!match) {
      throw notFound();
    }
  },
  loader: async ({ params }) => {
    const fileName = `${params.hookName}.ts`;
    try {
      const module = await rawCodesMap[fileName as keyof typeof rawCodesMap]();
      const ExampleComponent = lazy(
        () => import(`@/registry/hooks/${params.hookName}/${params.hookName}.example.tsx`)
      );
      const guideMarkdown = await docsMap[params.hookName as keyof typeof docsMap]();
      return {
        rawCode: module.default,
        ExampleComponent,
        guideMarkdown: guideMarkdown.default,
      };
    } catch {
      throw new Error("Failed to load.");
    }
  },
});

function RouteComponent() {
  const { hookName } = Route.useParams();
  const { rawCode, ExampleComponent, guideMarkdown } = Route.useLoaderData();

  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">{hookName}</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs rawCode={rawCode} exampleComponent={<ExampleComponent />} />
      </div>
      {/* installation */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <InstallationTabs moduleName="SwitchCase" />
      </div>
      {/* docs */}
      <div>
        <h2 className="text-lg font-bold mb-2">Guide</h2>
        <MarkdownViewer rawMarkdown={guideMarkdown} />
      </div>
    </>
  );
}
