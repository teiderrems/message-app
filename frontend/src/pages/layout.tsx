import { AppSidebar } from "@/components/app-sidebar";
import HomeScreen from "@/components/home-screen";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useLocalStorage from "@/hooks/use-local-storage";
import socket from "@/util";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function AppLayout() {
  const { pathname } = useLocation();

  const { getValue } = useLocalStorage();

  useEffect(() => {
    if (getValue("user")) {
      socket.emit("user_online", {
        userId: getValue("user").id,
        isOnline: true,
      });
      return () => {
        socket.emit("user_online", {
          userId: getValue("user").id,
          isOnline: false,
        });
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
            {pathname === "/chats" ? <HomeScreen /> : <Outlet />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
