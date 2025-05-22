import plus from "../assets/icons/plus.svg"
import close from "../assets/icons/clean.svg"
import TaskModal from "./TaskModal";
import { useState, useEffect } from "react";
import PopOver from "./Popover";
import axios from "axios";
import useTaskStore from "../store/useTaskStore";

const Buttons = ({ onAddTask }) => {

    const apiUrl = useTaskStore(state => state.apiUrl);
    const list = useTaskStore(state => state.list);
    const setList = useTaskStore(state => state.setList);
    const showModal = useTaskStore(state => state.showModal);
    const setShowModal = useTaskStore(state => state.setShowModal);
    const setToEditTask = useTaskStore(state => state.setToEditTask);


    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => { setToEditTask(false); setShowModal(true); };

    const [popOver, setPopOver] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 500);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const deleteCompleted = () => {
        const completedTasks = list.filter(task => task.completed);

        if (completedTasks.length === 0) {
            setPopOver(true);
            return;
        }

        const deletePromises = completedTasks.map(task =>
            axios.delete(`${apiUrl}/tasks/${task.id}`)
        );

        Promise.all(deletePromises)
            .then(() => {
                const updatedList = list.filter(task => !task.completed);
                setList(updatedList);
            })
            .catch(error => {
                console.error('Error al eliminar tareas completadas:', error);
                alert("Hubo un error al eliminar las tareas. Por favor, inténtalo nuevamente.");
            });
    };

    return (
        <section className="buttons">
            <button className="button" id="add-button" onClick={handleShowModal} aria-label="Agregar nueva tarea">
                <img src={plus} alt="icono agregar" /> AGREGAR
            </button>
            <button className="button" id="clean-button" onClick={deleteCompleted} aria-label="Eliminar tareas completadas">
                <img src={close} alt="icono cerrar" /> {isMobile ? "LIMPIAR" : "LIMPIAR COMPLETADAS"}
            </button>
            {popOver && <PopOver popOver={popOver} setPopOver={setPopOver} message="No hay tareas completadas para eliminar." />}
            {showModal && <TaskModal show={showModal} onClose={handleCloseModal} onSave={onAddTask} />}
        </section>
    );
};

export default Buttons;