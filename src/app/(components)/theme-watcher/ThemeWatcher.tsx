"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

export default function ThemeWatcher() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return null;
}
