import { useEffect } from "react";
import useTaskStore from "../store/useTaskStore";

const ThemeToggle = () => {

  const theme = useTaskStore((state) => state.theme);
  const setTheme = useTaskStore((state) => state.setTheme);

  useEffect(() => {

    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");


    localStorage.setItem("theme", theme);
  }, [theme]);


  const toggleTheme = () => {
    const currentTheme = useTaskStore.getState().theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };


  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <span>
        {theme === "dark" ? "🌞" : "🌙"}
      </span>
    </button>
  );
};

export default ThemeToggle;
