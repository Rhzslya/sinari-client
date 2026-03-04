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
import { LayoutDashboard, Loader2, LogOut, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const isId = i18n.language.startsWith("id");

  const { useProfile } = useUserQueries();
  const { data: user, isLoading: isLoadingUser } = useProfile();

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
      // Ignore error
    }
    localStorage.removeItem("role");
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

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("id") ? "en" : "id";
    i18n.changeLanguage(newLang);
  };

  const renderAuthSection = () => {
    if (isLoadingUser) {
      return <Loader2 className="animate-spin text-white/70 size-6" />;
    }

    if (user) {
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

            {[UserRole.ADMIN, UserRole.OWNER].includes(
              user.role as UserRole,
            ) && (
              <DropdownMenuItem
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{t("nav.dashboard")}</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{t("nav.profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleManualLogout}
              className="text-destructive focus:text-destructive focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("nav.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex gap-2">
        <Button
          asChild
          variant="ghost"
          className="cursor-pointer hover:bg-white/10 text-white"
        >
          <Link to="/login">{t("nav.login")}</Link>
        </Button>
        <Button
          asChild
          className="cursor-pointer bg-white text-primary hover:bg-white/90"
        >
          <Link to="/register">{t("nav.signup")}</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-linear-to-l from-primary from-30% to-(--gradient-primary)">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-xl text-white tracking-tight cursor-pointer"
        >
          Sinari Cell
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                active={isActive("/")}
              >
                <Link to="/">{t("nav.home")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                active={isActive("/products")}
              >
                <Link to="/products">{t("nav.products")}</Link>
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
                    <Link to="/dashboard">{t("nav.dashboard")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center p-0.5 rounded-full bg-black/15 border border-white/20 cursor-pointer transition-all hover:bg-black/25 shadow-inner"
          >
            <span
              className={`px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-full transition-colors duration-300 ${
                isId
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              ID
            </span>
            <span
              className={`px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-full transition-colors duration-300 ${
                !isId
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </span>
          </button>
          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
