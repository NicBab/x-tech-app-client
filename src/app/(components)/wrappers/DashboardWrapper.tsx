"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import AdminSidebar from "@/app/(components)/Sidebar/AdminSidebar";
import EmployeeSidebar from "@/app/(components)/Sidebar/EmployeeSidebar";
import AdminNavbar from "@/app/(components)/Navbar/AdminNavbar";
import EmployeeNavbar from "@/app/(components)/Navbar/EmployeeNavbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const userRole = useAppSelector((state) => state.user.role); // "admin" | "employee"

  const Sidebar = userRole === "admin" ? AdminSidebar : EmployeeSidebar;
  const Navbar = userRole === "admin" ? AdminNavbar : EmployeeNavbar;

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 dark:bg-zinc-900 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

export default DashboardWrapper;




// "use client";
// import { useAppSelector } from "@/redux/hooks";
// import AdminSidebar from "@/app/(components)/Sidebar/AdminSidebar";
// import EmployeeSidebar from "@/app/(components)/Sidebar/EmployeeSidebar";
// import AdminNavbar from "@/app/(components)/Navbar/AdminNavbar";
// import EmployeeNavbar from "@/app/(components)/Navbar/EmployeeNavbar";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const role = useAppSelector((state) => state.user.role);
//   const isSidebarCollapsed = useAppSelector((s) => s.global.isSidebarCollapsed);
//   const isDark = useAppSelector((s) => s.global.isDarkMode);

//   const Sidebar = role === "admin" ? AdminSidebar : EmployeeSidebar;
//   const Navbar = role === "admin" ? AdminNavbar : EmployeeNavbar;

//   return (
//     <div className={`${isDark ? "dark" : "light"} flex w-full min-h-screen`}>
//       <Sidebar />
//       <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 dark:bg-zinc-900 ${isSidebarCollapsed ? "md:pl-24" : "md:pl-72"}`}>
//         <Navbar />
//         {children}
//       </main>
//     </div>
//   );
// }

// // "use client";

// // import React, { useEffect } from "react";
// // import { useAppSelector } from "@/redux/hooks";
// // import StoreProvider from "@/redux/provider";
// // import AdminSidebar from "@/app/(components)/Sidebar/AdminSidebar";
// // import EmployeeSidebar from "@/app/(components)/Sidebar/EmployeeSidebar";
// // import AdminNavbar from "@/app/(components)/Navbar/AdminNavbar";
// // import EmployeeNavbar from "@/app/(components)/Navbar/EmployeeNavbar";

// // const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
// //   const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
// //   const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
// //   const userRole = useAppSelector((state) => state.user.role); // "admin" | "employee"

// //   useEffect(() => {
// //     document.documentElement.classList.toggle("dark", isDarkMode);
// //   }, [isDarkMode]);

// //   const Sidebar = userRole === "admin" ? AdminSidebar : EmployeeSidebar;
// //   const Navbar = userRole === "admin" ? AdminNavbar : EmployeeNavbar;

// //   return (
// //     <div className={`flex w-full min-h-screen ${isDarkMode ? "dark" : "light"}`}>
// //       <Sidebar />
// //       <main
// //         className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 dark:bg-zinc-900 ${
// //           isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
// //         }`}
// //       >
// //         <Navbar />
// //         {children}
// //       </main>
// //     </div>
// //   );
// // };

// // const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
// //   <StoreProvider>
// //     <DashboardLayout>{children}</DashboardLayout>
// //   </StoreProvider>
// // );

// // export default DashboardWrapper;
