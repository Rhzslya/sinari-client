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
import { UserRole } from "@/enum/product-enum";
import { useUserQueries } from "@/hooks/user-queries";
import { AuthServices } from "@/services/user-services";
import {
  AlertCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserIcon,
} from "lucide-react";
// import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // 1. Import Link

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasToken = !!localStorage.getItem("token");

  const { useProfile } = useUserQueries();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError,

    // refetch,
  } = useProfile();

  // Kick when User multiple login
  // useEffect(() => {
  //   if (hasToken) {
  //     refetch();
  //   }
  // }, [location.pathname, hasToken, refetch]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleManualLogout = async () => {
    try {
      await AuthServices.logout();
    } catch {
      // Ignore
    }
    localStorage.clear();
    window.location.href = "/login";
  };

  const getInitials = (name?: string) => {
    if (!name) return "SC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderProfileSection = () => {
    if (isLoadingUser) {
      return <Loader2 className="animate-spin text-muted-foreground size-6" />;
    }

    if (isError) {
      return (
        <div className="text-destructive" title="Failed to load profile">
          <AlertCircle className="size-6" />
        </div>
      );
    }

    if (!user) return null; // Should not happen if success

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full cursor-pointer bg-white focus-visible:ring-0 focus-visible:ring-offset-0 border-primary border-2"
          >
            <Avatar className="h-9 w-9 border-none transition-opacity hover:opacity-80">
              <AvatarFallback className="bg-white/10 border-none text-primary text-sm font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none truncate">
                {user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
              <span className="text-[10px] uppercase font-bold text-primary">
                {user.role}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {[UserRole.ADMIN, UserRole.OWNER].includes(user.role as UserRole) && (
            <DropdownMenuItem
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleManualLogout}
            className="text-destructive focus:text-destructive focus:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-linear-to-l from-primary from-30% to-(--gradient-primary)">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-xl text-foreground tracking-tight cursor-pointer"
        >
          Sinari Cell
        </Link>

        {/* NAVIGATION LINKS */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                active={isActive("/")}
              >
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                active={isActive("/products")}
              >
                <Link to="/products">Products</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user &&
              [UserRole.ADMIN, UserRole.OWNER].includes(
                user.role as UserRole,
              ) && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                    active={isActive("/dashboard")}
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* RIGHT SIDE (AUTH) */}
        <div className="flex items-center gap-4">
          {hasToken ? (
            renderProfileSection()
          ) : (
            <div className="flex gap-2">
              <Button
                asChild
                variant="ghost"
                className="cursor-pointer hover:bg-white/10"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="cursor-pointer bg-white text-primary hover:bg-white/90"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
