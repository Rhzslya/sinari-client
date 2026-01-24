import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/utils/navigationMenuTriggerStyle";
import { handleApiError } from "@/lib/utils";
import type { UserResponse } from "@/model/user-model";
import { AuthServices } from "@/services/user-services";
import {
  AlertCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
// 1. IMPORT useLocation
import { useNavigate, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  // 2. GUNAKAN useLocation untuk mengambil path saat ini
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  // Helper function untuk cek apakah link aktif (Opsional, biar kode lebih rapi)
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = useCallback(async () => {
    try {
      await AuthServices.logout();
    } catch {
      // Ignore error logout
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (hasFetched.current) return;
      if (!isLoggedIn) return;
      hasFetched.current = true;
      if (isLoggedIn) {
        setIsLoadingUser(true);
        try {
          const user = await AuthServices.get();
          setUser(user);
          setIsLoadingUser(false);
        } catch (error) {
          const message = handleApiError(error);
          setFetchError(message);
          if (
            message.toLowerCase().includes("unauthorized") ||
            message.toLowerCase().includes("session")
          ) {
            handleLogout();
          }
        } finally {
          setIsLoadingUser(false);
        }
      }
    };
    fetchUser();
  }, [isLoggedIn, handleLogout]);

  const getInitials = (name?: string) => {
    if (!name) return "SC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-linear-to-l from-primary from-30% to-(--gradient-primary)">
      {" "}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between ">
        <div
          className="font-bold text-xl text-foreground tracking-tight cursor-pointer"
          onClick={() => navigate("/")}
        >
          Sinari Cell
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={isActive("/")}
                onClick={() => navigate("/")}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={isActive("/products")}
                onClick={() => navigate("/products")}
              >
                Products
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={isActive("/dashboard")}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user?.role === "admin" && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  active={isActive("/services")}
                  onClick={() => navigate("/services")}
                >
                  Services
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            isLoadingUser ? (
              <Loader2 className="animate-spin text-muted-foreground size-10" />
            ) : fetchError ? (
              <div className="text-destructive" title={fetchError}>
                <AlertCircle className="size-6" />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full cursor-pointer bg-white focus-visible:ring-0 focus-visible:ring-offset-0 border-primary border-2"
                  >
                    <Avatar className="h-9 w-9 border-none transition-opacity hover:opacity-80">
                      <AvatarFallback className="bg-white/10 border-none text-primary text-xl font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email || "loading..."}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/login")}
                className="cursor-pointer bg-muted hover:bg-foreground hover:text-muted text-foreground"
              >
                Log in
              </Button>
              <Button
                className="cursor-pointer text-muted hover:text-foreground"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
