import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hook/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/hook/"!</div>;
}
