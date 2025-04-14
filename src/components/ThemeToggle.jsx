import { useEffect } from "react";

const ThemeToggle = ( {theme, setTheme}) => {

  useEffect(() => {
    
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");

    
    localStorage.setItem("theme", theme);
  }, [theme]);

  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
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
