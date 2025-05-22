import { useEffect } from "react";
import useTaskStore from "../store/useTaskStore";
import faviconDark from "../assets/favicon/favicon-dark.ico";
import faviconLight from "../assets/favicon/favicon-light.ico";

const FaviconUpdater = () => {
  const theme = useTaskStore((state) => state.theme);

  useEffect(() => {
    const favicon = document.getElementById("favicon");
    if (favicon) {
      favicon.href = theme === "dark" ? faviconDark : faviconLight;
    }
  }, [theme]);

  return null;
};

export default FaviconUpdater;