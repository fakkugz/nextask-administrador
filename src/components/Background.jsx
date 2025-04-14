import { useContext, useEffect, useState } from "react";
import { TasksContext } from "../contexts/TasksContext";
import darkBg from "../assets/images/artistic-blurry-colorful-wallpaper-background1.png";
import lightBg from "../assets/images/artistic-blurry-colorful-wallpaper-background2.webp";

const backgroundImages = {
  dark: darkBg,
  light: lightBg,
};

const Background = () => {
  const { theme } = useContext(TasksContext);
  const [currentBg, setCurrentBg] = useState(backgroundImages[theme]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (backgroundImages[theme] !== currentBg) {
      setFade(true);
      const timeout = setTimeout(() => {
        setCurrentBg(backgroundImages[theme]);
        setFade(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [theme]);

  return (
    <div
      className={`background ${fade ? "fade" : ""}`}
      style={{ backgroundImage: `url(${currentBg})` }}
    />
  );
};

export default Background;
