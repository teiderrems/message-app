import { Outlet } from "react-router";
import { Toaster } from "./components/ui/sonner";
export default function App() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Toaster />
      <Outlet />
    </div>
  );
}
