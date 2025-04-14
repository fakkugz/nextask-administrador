import { useContext, useEffect, useState } from "react";
import { TasksContext } from "../contexts/TasksContext";

const backgroundImages = {
  dark: "../assets/images/artistic-blurry-colorful-wallpaper-background1.png",
  light: "../assets/images/artistic-blurry-colorful-wallpaper-background2.webp",
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
