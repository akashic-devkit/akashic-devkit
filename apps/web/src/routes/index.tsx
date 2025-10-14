import ListOverview from "@/components/ListOverview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Components & Hooks</h1>
      <ListOverview type="Component" collapsible className="mb-4" />
      <ListOverview type="Hook" collapsible />
    </div>
  );
}
