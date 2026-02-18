import CodeTabs from "@/components/CodeTabs";
import InstallationTabs from "@/components/InstallationTabs";
import MarkdownViewer from "@/components/MarkdownViewer";
import { componentsMenu } from "@/data/ComponentsMenu";
import { docsMap } from "@/data/docsMap";
import { rawCodesMap } from "@/data/rawCodesMap";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy } from "react";

export const Route = createFileRoute("/components/$componentName")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const match = componentsMenu.find((comp) => comp.title === params.componentName);
    if (!match) {
      throw notFound();
    }
  },
  loader: async ({ params }) => {
    const fileName = `${params.componentName}.tsx`;
    try {
      const module = await rawCodesMap[fileName as keyof typeof rawCodesMap]();
      const Component = lazy(
        () => import(`@/registry/components/${params.componentName}/${params.componentName}.example.tsx`)
      );
      const guideMarkdown = await docsMap[params.componentName as keyof typeof docsMap]();
      return {
        rawCode: module.default,
        Component,
        guideMarkdown: guideMarkdown.default,
      };
    } catch {
      throw new Error("Failed to load.");
    }
  },
});

function RouteComponent() {
  const { componentName } = Route.useParams();
  const { rawCode, Component, guideMarkdown } = Route.useLoaderData();

  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-bold">{componentName}</h1>
      {/* demo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Demo</h2>
        <CodeTabs rawCode={rawCode} exampleComponent={<Component />} />
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
