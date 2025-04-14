import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TasksContext } from "../contexts/TasksContext";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const TaskDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { list, formatDate, handleToggleCheck, editTask } = useContext(TasksContext);

  const taskIndex = list.findIndex(task => task.id === id);
  const task = list[taskIndex];
  const isFirst = taskIndex === 0;
  const isLast = taskIndex === list.length - 1;

  const handleClose = () => {
    navigate("/");
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevId = list[taskIndex - 1].id;
      navigate(`/task/${prevId}`);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      const nextId = list[taskIndex + 1].id;
      navigate(`/task/${nextId}`);
    }
  };

  const handleEdit = () => {
    handleClose();
    editTask(id);
  }

  if (!task) {
    return (
      <section className="task-details">
        <p>No se encontró la tarea con ID: {id}</p>
        <button className="btn btn-secondary" onClick={handleClose}>Volver al inicio</button>
      </section>
    );
  }

  return (
    <Modal show onHide={handleClose} centered backdrop="static" className="taskDetails-modal">
      <Modal.Header closeButton>
        <div className="task-header">
          <button
            className="nav-arrow"
            onClick={handlePrev}
            disabled={isFirst}
            title="Tarea anterior"
          >
            <svg className="arrow-svg" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
                fill="currentColor" />
            </svg>
          </button>
          <button
            className="nav-arrow"
            onClick={handleNext}
            disabled={isLast}
            title="Tarea siguiente"
          >
            <svg className="arrow-svg" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
                fill="currentColor" />
            </svg>
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="task-title">
          <h3>{task.name}</h3>
          <button id="task-details-edit" onClick={handleEdit}>EDITAR</button>
        </div>
        <div className="task-data">
          <p>Categoría: <strong>{task.category}</strong></p>
          <Form.Check
            type="switch"
            id={`custom-switch-${id}`}
            label={task.completed ? "Completado" : "Pendiente"}
            checked={task.completed}
            onChange={() => handleToggleCheck(task.id)}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.preventDefault()}
          />
        </div>
        <Form.Group>
          <Form.Control as="textarea" rows={4} readOnly value={task.description} />
        </Form.Group>

        <div className="mt-3 task-dates">
          <span>
            <div className="date-span">Inicio: <strong>{formatDate(task.inicio)}</strong></div>
          </span>
          <span>
            <div className="date-span">Fin: <strong>{formatDate(task.fin)}</strong></div>
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TaskDetails;
