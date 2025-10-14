import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppBreadcrumb from "./AppBreadcrumb";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen min-h-screen">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <AppBreadcrumb />
        </div>
        <div className="mx-auto px-12 my-20 min-w-xl max-w-3xl flex flex-col gap-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
