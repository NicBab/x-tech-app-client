"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsSidebarCollapsed } from "@/redux/slices/global/GlobalSlice";
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
  CalendarClock,
  ClipboardPenLine,
  ClipboardCheck,
  AlarmClockCheck,
  AlarmClockPlus,
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
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
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
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

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
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/employee/employee-layout"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/new-dlr"
          icon={Clipboard}
          label="New DLR"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/drafted-dlrs"
          icon={ClipboardPenLine}
          label="Drafted DLRs"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/submitted-dlrs"
          icon={ClipboardCheck}
          label="Submitted DLRs"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/time-entry"
          icon={CalendarClock}
          label="Clock In/Out"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/drafted-times"
          icon={AlarmClockPlus}
          label="Drafted Times"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/submitted-times"
          icon={AlarmClockCheck}
          label="Submitted Times"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/employee/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2025 XTech</p>
      </div>
    </div>
  );
};

export default Sidebar;
