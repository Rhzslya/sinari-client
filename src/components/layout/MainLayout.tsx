import NavigationBar from "@/features/components/fragments/NavigationBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    // 1. Pindahkan 'bg-background' kesini agar warnanya FULL SCREEN
    // 2. Tambahkan 'w-full' untuk memastikan lebar penuh
    <div className="dark min-h-screen flex flex-col w-full bg-background">
      <NavigationBar />

      <main className="relative container mx-auto py-10 px-4 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
