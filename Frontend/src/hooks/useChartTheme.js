import { useTheme } from "../context/ThemeContext";

export function useChartTheme() {
  const { isDark } = useTheme();

  return {
    grid: isDark ? "#262626" : "#f0f0f0",
    axis: isDark ? "#a3a3a3" : "#8c8c8c",
    bar: isDark ? "#e8e8e8" : "#141414",
    tooltipStyle: {
      background: isDark ? "#1a1a1a" : "#ffffff",
      border: `1px solid ${isDark ? "#333" : "#f0f0f0"}`,
      borderRadius: 8,
    },
  };
}
