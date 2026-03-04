import {
  LayoutDashboard,
  Users,
  Package,
  Wrench,
  Settings,
  UserCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;

  const items = [
    {
      title: t("nav.sidebar.overview"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("nav.sidebar.users"),
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: t("nav.sidebar.technicians"),
      url: "/dashboard/technicians",
      icon: UserCog,
    },
    {
      title: t("nav.sidebar.products"),
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: t("nav.sidebar.services"),
      url: "/dashboard/services",
      icon: Wrench,
    },
    {
      title: t("nav.sidebar.settings"),
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.sidebar.label")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
