import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen min-h-screen relative">
        <SidebarTrigger className="absolute top-0 left-0" />
        <div className="mx-auto px-12 my-20 min-w-xl max-w-3xl flex flex-col gap-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
