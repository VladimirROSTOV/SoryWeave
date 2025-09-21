"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ждём монтирования — чтобы избежать гидрационных рассинхронизаций
  useEffect(() => setMounted(true), []);

  // Пока не смонтирован — ничего не показываем (избегаем mismatch)
  if (!mounted) return (
    // можно вернуть пустой placeholder того же размера, чтобы не дергать layout:
    <div className="w-10 h-10" aria-hidden />
  );

  // Используем resolvedTheme — фактическую тему (light|dark)
  const current = resolvedTheme || theme || "light";
  const isDark = current === "dark";

  function toggle() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      aria-label="Переключить тему"
      title="Переключить тему"
      onClick={toggle}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
    >
      {/* Слой для Sun */}
      <span
        className={`absolute transition-transform duration-300 ease-out ${
          !isDark ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-75"
        }`}
        style={{ transformOrigin: "center" }}
      >
        <Sun className="h-5 w-5 text-yellow-500" />
      </span>

      {/* Слой для Moon */}
      <span
        className={`absolute transition-transform duration-300 ease-out ${
          isDark ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-75"
        }`}
        style={{ transformOrigin: "center" }}
      >
        <Moon className="h-5 w-5 text-indigo-200" />
      </span>

      {/* Для доступности оставляем невидимый текст */}
      <span className="sr-only">Переключить тему</span>
    </button>
  );
}
