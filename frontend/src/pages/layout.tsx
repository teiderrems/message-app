import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export default function AppLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex h-screen w-screen flex-col">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {pathname === "/" ? (
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
