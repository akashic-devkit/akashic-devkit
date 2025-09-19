import MainLayout from "@/components/layout/MainLayout";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <MainLayout>
    <Outlet />
    <TanStackRouterDevtools />
  </MainLayout>
);

export const Route = createRootRoute({ component: RootLayout });
