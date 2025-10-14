import { Link } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <div className="m-auto h-full flex flex-col items-center justify-center mt-[20vh]">
      <CircleAlert className="size-10" />
      <p className="text-2xl font-semibold mt-2">Page Not found!</p>
      <Button asChild className="mt-4">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
