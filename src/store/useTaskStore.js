import { create } from 'zustand';
import axios from "axios";

const useTaskStore = create((set, get) => ({
    apiUrl: "https://backend-list-qwjq.onrender.com",

    list: [],
    setList: (value) => set({ list: value }),
    deleteTask: (id) => {
        const { apiUrl, list } = get();
        axios
            .delete(`${apiUrl}/tasks/${id}`)
            .then(() => {
                const updatedList = list.filter((task) => task.id !== id);
                set({ list: updatedList });
            })
            .catch((error) => {
                console.error("Error al eliminar la tarea:", error);
            });
    },
    handleToggleCheck: (id) => {
        const { list, apiUrl } = get();
        const taskToToggle = list.find(task => task.id === id);

        if (taskToToggle) {
            const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

            axios.put(`${apiUrl}/tasks/${id}`, updatedTask)
                .then(response => {
                    const updatedList = list.map(task =>
                        task.id === id ? response.data : task
                    );
                    set({ list: updatedList });
                })
                .catch(error => {
                    console.error('Error al actualizar el estado de la tarea:', error);
                });
        }
    },

    isLoading: true,
    setIsLoading: (value) => set({ isLoading: value }),

    showModal: false,
    setShowModal: (value) => set({ showModal: value }),

    toEditTask: false,
    setToEditTask: (value) => set({ toEditTask: value }),
    editTask: (id) => {
        const { list } = get();
        const taskToEdit = list.find(task => task.id === id);
        set({
            toEditTask: taskToEdit,
            showModal: true
        })
    },

    categories: null,
    setCategories: (value) => set({ categories: value }),

    showAddCategory: false,
    setShowAddCategory: (value) => set({ showAddCategory: value }),

    toEditCategory: false,
    setToEditCategory: (value) => set({ toEditCategory: value }),

    activeFilters: null,
    setActiveFilters: (value) => set({ activeFilters: value }),

    theme: localStorage.getItem("theme") || "dark",
    setTheme: (value) => set({ theme: value }),

    formatDate: (date) => {
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
    }
}));

export default useTaskStore;