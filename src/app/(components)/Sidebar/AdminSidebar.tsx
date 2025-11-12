"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setIsSidebarCollapsed } from "@/redux/slices/global/GlobalSlice"
import TimeEntryForm from "../Forms/TimeEntryForm";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
  ClockPlus,
  
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-3 transition-colors ${
          isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 text-sidebar-foreground" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-sidebar-foreground`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-sidebar text-sidebar-foreground transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="/X_icon.png"
          alt="X_icon"
          width={50}
          height={50}
          className="rounded w-8"
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          XTech
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-muted rounded-full hover:bg-sidebar-accent"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8 text-[14px]">
        <SidebarLink
          href="/admin/admin-layout"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
              <SidebarLink
          href="/admin/time-entry"
        icon={ClockPlus}
          label="Clock In/Out"
          isCollapsed={isSidebarCollapsed}
        />
            <SidebarLink
          href="/admin/drafted-times"
          icon={Archive}
          label="My Drafted Times"
          isCollapsed={isSidebarCollapsed}
        />
            <SidebarLink
          href="/admin/dlrs"
          icon={Clipboard}
          label="DLRs"
          isCollapsed={isSidebarCollapsed}
        />
            <SidebarLink
          href="/admin/employee-times"
          icon={Archive}
          label="Employee Times"
          isCollapsed={isSidebarCollapsed}
        />

        <SidebarLink
          href="/admin/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/products"
          icon={Archive}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-muted-foreground">&copy; 2024 XTech</p>
      </div>
    </div>
  );
};

export default Sidebar;
