import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useLocalStorage from "@/hooks/use-local-storage";
import { trpc } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function AppLayout() {
  const { pathname } = useLocation();

  const { mutateAsync: changeOnlineStatus } = useMutation(
    trpc.user.changeOnlineStatus.mutationOptions()
  );
  const { getValue } = useLocalStorage();

  const changeStatus=async(isOnline:boolean)=> {
    if (getValue("user")) {
      await changeOnlineStatus({
        userId: getValue("user").id,
        isOnline
      });
    }
  };


  useEffect(() => {
    console.log(getValue("user"));

    if (getValue("user")) {
      changeStatus(true).catch(console.error);
      return () => {
        changeStatus(false).catch(console.error);
      };
    }
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-1 h-full flex-col min-h-0 max-h-full">
          <div className="@container/main flex flex-1 flex-col gap-2 overflow-y-auto">
            {pathname === "/chats" ? (
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
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
