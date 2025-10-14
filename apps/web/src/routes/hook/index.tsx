import ListOverview from "@/components/ListOverview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hook/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Hooks</h1>
      <ListOverview type="Hook" />
    </div>
  );
}
