import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TasksContext = createContext();

export const TaskProvider = ({ children }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toEditTask, setToEditTask] = useState(false);
  const [categories, setCategories] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [toEditCategory, setToEditCategory] = useState();
  const [activeFilters, setActiveFilters] = useState(null);

  // Tema desde localStorage
  const storedTheme = localStorage.getItem("theme") || "dark";
  const [theme, setTheme] = useState(storedTheme);
  

  useEffect(() => {
    const favicon = document.getElementById("favicon");
    if (favicon) {
      favicon.href = theme === "dark"
        ? "./src/assets/favicon/favicon-dark.ico"
        : "./src/assets/favicon/favicon-light.ico";
    }
  }, [theme]);

  
  const apiUrl = "https://backend-list-production.up.railway.app";


  const deleteTask = (id) => {
    axios
      .delete(`${apiUrl}/tasks/${id}`)
      .then(() => {
        const updatedList = list.filter((task) => task.id !== id);
        setList(updatedList);
      })
      .catch((error) => {
        console.error("Error al eliminar la tarea:", error);
      });
  };

  const editTask = (id) => {
    const taskToEdit = list.find(task => task.id === id);
    setToEditTask(taskToEdit);
    setShowModal(true);
  };

  const handleToggleCheck = (id) => {
    const taskToToggle = list.find(task => task.id === id);

    if (taskToToggle) {
        const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

        axios.put(`${apiUrl}/tasks/${id}`, updatedTask)
            .then(response => {
                const updatedList = list.map(task =>
                    task.id === id ? response.data : task
                );
                setList(updatedList);
            })
            .catch(error => {
                console.error('Error al actualizar el estado de la tarea:', error);
            });
    }
};

  const formatDate = (date) => {
    const dateToCompare = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateToCompare.getTime() === today.getTime()) {
      return "Hoy";
    } else if (dateToCompare.getTime() === tomorrow.getTime()) {
      return "Mañana";
    } else {
      const day = dateToCompare.getDate().toString().padStart(2, "0");
      const month = (dateToCompare.getMonth() + 1).toString().padStart(2, "0");
      return `${day}/${month}`;
    }
  };
  

  return (
    <TasksContext.Provider
      value={{
        apiUrl, handleToggleCheck, editTask,
        list, setList,
        showModal, setShowModal,
        toEditTask, setToEditTask,
        categories, setCategories,
        theme, setTheme,
        deleteTask, formatDate,
        showAddCategory, setShowAddCategory,
        toEditCategory, setToEditCategory,
        isLoading, setIsLoading,
        activeFilters, setActiveFilters
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
