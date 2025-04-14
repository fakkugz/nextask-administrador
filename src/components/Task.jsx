import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TasksContext } from "../contexts/TasksContext";
import Form from 'react-bootstrap/Form';

const Task = ({ id, index, name, category, inicio, fin, completed }) => {
    const { deleteTask, editTask, handleToggleCheck } = useContext(TasksContext);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const navigate = useNavigate();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "pointer"
    };

    const handleRowClick = (e) => {
        const isDragArea = e.target.closest('.drag-icon-container');
        const isButtonArea = e.target.closest('.taskButtons');
        const isToggle = e.target.closest('.form-check');

        if (isDragArea || isButtonArea || isToggle) return;

        navigate(`/task/${id}`);
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={isDragging ? "dragging" : ""}
            onClick={handleRowClick}
        >
            <td className="drag-icon-container">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    className="drag-icon"
                    {...attributes}
                    {...listeners}
                >
                    <path
                        d="M5 14H19M5 10H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </td>
            <td className="task-col-orden">{index + 1}</td>
            <td className="task-col-tarea">{name}</td>
            <td className="task-col-categoria">{category}</td>
            <td className="task-col-inicio fixed-w">{inicio}</td>
            <td className="task-col-fin fixed-w">{fin}</td>
            <td className="fixed-width task-col-estado" data-no-dnd="true">
                <Form.Check
                    type="switch"
                    id={`custom-switch-${id}`}
                    label={completed ? "Completado" : "Pendiente"}
                    checked={completed}
                    onChange={() => handleToggleCheck(id)}
                    onClick={(e) => e.stopPropagation()}                   
                    className="estado-switch"
                />
            </td>
            <td className="taskButtons task-col-edicion">
                <button className="btn-task" onClick={() => deleteTask(id)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-3 -2 24 24"
                        width="28"
                        className="trash-icon"
                    >
                        <path
                            d="M12 2h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1zm3.8 6l-.613 9.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.205 8H15.8zM7 9a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
                <button className="btn-task edit-btn" onClick={() => editTask(id)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-0.5 -0.5 24 24"
                        width="28"
                        className="edit-icon"
                    >
                        <path
                            d="M21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.928.928 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4h4z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default Task;
