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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationMenuTriggerStyle } from "@/components/utils/navigationMenuTriggerStyle";
import { UserRole } from "@/enum/product-enum";
import { useUserQueries } from "@/hooks/user-queries";
import { AuthServices } from "@/services/user-services";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  UserIcon,
  Home,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const isId = i18n.language.startsWith("id");

  const { useProfile } = useUserQueries();
  const { data: user, isLoading: isLoadingUser } = useProfile();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleMobileNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isPrivilegedUser =
    user && [UserRole.ADMIN, UserRole.OWNER].includes(user.role as UserRole);

  const renderAuthSection = () => {
    if (isLoadingUser) {
      return (
        <Loader2 className="animate-spin text-white/70 size-5 md:size-6" />
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative p-0 h-8 w-8 md:h-10 md:w-10 rounded-full cursor-pointer bg-white focus-visible:ring-0 focus-visible:ring-offset-0 border-primary border-2 shrink-0 overflow-hidden"
            >
              <Avatar className="h-full w-full border-none transition-opacity hover:opacity-80">
                <AvatarFallback className="bg-white/10 border-none text-primary text-xs md:text-sm font-bold flex items-center justify-center">
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

            {isPrivilegedUser && (
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
      <div className="flex gap-1.5 md:gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="cursor-pointer hover:bg-white/10 text-white text-xs md:text-sm px-2 md:px-4"
        >
          <Link to="/login">{t("nav.login")}</Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="cursor-pointer bg-white text-primary hover:bg-white/90 text-xs md:text-sm px-3 md:px-4"
        >
          <Link to="/register">{t("nav.signup")}</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-linear-to-l from-primary from-30% to-(--gradient-primary) shadow-sm">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/20 shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[80vw] max-w-75 sm:max-w-sm flex flex-col p-0"
            >
              <SheetHeader className="p-6 text-left border-b bg-muted/20">
                <SheetTitle className="text-xl font-bold text-primary tracking-tight">
                  Sinari Cell
                </SheetTitle>
                <SheetDescription className="text-xs sr-only">
                  {t("home.hero.subtitle", {
                    defaultValue: "Professional Repair Service",
                  })}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col py-4 px-3 gap-2 flex-1">
                <Button
                  variant={isActive("/") ? "secondary" : "ghost"}
                  className={`justify-start w-full cursor-pointer ${isActive("/") ? "bg-primary/10 text-primary" : ""}`}
                  onClick={() => handleMobileNav("/")}
                >
                  <Home className="mr-3 h-4 w-4" /> {t("nav.home")}
                </Button>
                <Button
                  variant={isActive("/products") ? "secondary" : "ghost"}
                  className={`justify-start w-full cursor-pointer ${isActive("/products") ? "bg-primary/10 text-primary" : ""}`}
                  onClick={() => handleMobileNav("/products")}
                >
                  <Package className="mr-3 h-4 w-4" /> {t("nav.products")}
                </Button>

                {isPrivilegedUser && (
                  <Button
                    variant={isActive("/dashboard") ? "secondary" : "ghost"}
                    className={`justify-start w-full cursor-pointer ${isActive("/dashboard") ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => handleMobileNav("/dashboard")}
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />{" "}
                    {t("nav.dashboard")}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-extrabold text-lg md:text-xl text-white tracking-tight cursor-pointer whitespace-nowrap"
            >
              Sinari Cell
            </motion.span>
          </Link>
        </div>

        {/* TENGAH: Desktop Nav (Hidden on Mobile) */}
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

            {isPrivilegedUser && (
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

        {/* KANAN: Lang Toggle & Auth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 md:gap-4"
        >
          <button
            onClick={toggleLanguage}
            className="flex items-center p-0.5 rounded-full bg-black/15 border border-white/20 cursor-pointer transition-all hover:bg-black/25 shadow-inner shrink-0"
          >
            <span
              className={`px-2 md:px-2.5 py-1 text-[9px] md:text-xs font-bold rounded-full transition-colors duration-300 ${
                isId
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              ID
            </span>
            <span
              className={`px-2 md:px-2.5 py-1 text-[9px] md:text-xs font-bold rounded-full transition-colors duration-300 ${
                !isId
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </span>
          </button>
          {renderAuthSection()}
        </motion.div>
      </div>
    </header>
  );
};

export default NavigationBar;
