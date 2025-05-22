import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { v4 as uuidv4 } from "uuid";
import AddCategory from "./AddCategory";
import useTaskStore from '../store/useTaskStore';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const TaskModal = ({ show, onClose, onSave }) => {

    const toEditTask = useTaskStore(state => state.toEditTask);
    const categories = useTaskStore(state => state.categories);
    const setShowAddCategory = useTaskStore(state => state.setShowAddCategory);
    const theme = useTaskStore(state => state.theme);


    const inicialTask = () => (
        {
            id: uuidv4(),
            name: "",
            category: "",
            description: "",
            inicio: null,
            fin: null,
            completed: false,
        }
    );

    const [task, setTask] = useState(inicialTask);
    const [errors, setErrors] = useState({});

    const inputNombre = useRef();

    useEffect(() => {
        if (toEditTask) {
            setTask({
                ...toEditTask,
                inicio: toEditTask.inicio ? new Date(toEditTask.inicio) : null,
                fin: toEditTask.fin ? new Date(toEditTask.fin) : null
            });
            inputNombre.current.focus();
        } else {
            setTask(inicialTask());
        }
    }, [toEditTask]);


    const validate = () => {
        const newErrors = {};

        if (!task.name.trim()) newErrors.name = "El nombre es obligatorio";
        else if (task.name.length < 3) newErrors.name = "El nombre debe tener al menos 3 caracteres";

        if (!task.category) newErrors.category = "Debes seleccionar una categoria";

        if (!task.inicio) newErrors.inicio = "Debes seleccionar una fecha de inicio";

        if (!task.fin) newErrors.fin = "Debes seleccionar una fecha de finalizacion";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSave = () => {
        if (validate()) {
            onSave({
                ...task,
                inicio: formatDate(task.inicio),
                fin: formatDate(task.fin),
            });
            setTask(inicialTask());
            onClose();
        } else {
            alert("Corrige los errores antes de enviar");
        }
    };

    const handleChange = (e) => {
        if (e.__isNew__ || e.value === "Agregar") {
            setShowAddCategory(true);
        } else {
            setTask(prevTask => ({ ...prevTask, category: e.value }));
        }
    };

    const categoryOptions = [
        { value: '', label: 'Selecciona una categoria', isDisabled: true },
        ...categories.map(category => ({ value: category.category, label: category.category })),
        { value: 'Sin Categoria', label: 'Sin Categoria' },
        { value: 'Agregar', label: 'Agregar...' }
    ];

    const isDark = theme === 'dark';

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? '#212529' : '#fff',
            color: isDark ? '#f8f9fa' : '#000',
            border: `1px solid ${isDark ? '#495057' : 'var(--sand-800)'}`,
            borderRadius: '0.375rem',
            boxShadow: state.isFocused
                ? `0 0 0 0.25rem rgba(${isDark ? '13, 110, 253' : '207, 124, 0'}, 0.4)`
                : 'none',
            '&:hover': {
                borderColor: isDark ? '#adb5bd' : 'var(--sand-900)',
            },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDark ? '#313539' : '#fff',
            color: isDark ? '#fff' : '#000',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? (isDark ? 'var(--blue-700)' : 'var(--sand-700)') : 'transparent',
            color: state.isFocused ? '#fff' : (isDark ? '#fff' : '#000'),
            cursor: 'pointer',
        }),
        singleValue: (base) => ({
            ...base,
            color: isDark ? '#f8f9fa' : '#000'
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? '#adb5bd' : '#6c757d'
        })
    };

    return (
        <>
            <Modal show={show} onHide={onClose} data-bs-theme={theme} className='task-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>{toEditTask ? "Editar Tarea" : "Agregar Nueva Tarea"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="taskDescription">
                            <Form.Label>Tarea</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tarea"
                                name='name'
                                maxLength="30"
                                value={task.name}
                                onChange={e => setTask(prev => ({ ...prev, name: e.target.value }))}
                                ref={inputNombre}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="taskCategory">
                            <Form.Label>Categoria</Form.Label>
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(opt => opt.value === task.category)}
                                onChange={handleChange}
                                styles={customStyles}
                                isSearchable={false}
                                classNamePrefix="react-select"
                                placeholder="Selecciona una categoria"
                            />
                            {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Descripcion'
                                name='description'
                                value={task.description}
                                onChange={e => setTask(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </Form.Group>
                        <div className="date-inputs">
                            <Form.Group className="mb-3" controlId="taskStart">
                                <Form.Label>Inicio</Form.Label>
                                <DatePicker
                                    selected={task.inicio}
                                    onChange={date => setTask(prev => ({ ...prev, inicio: date }))}
                                    dateFormat="yyyy-MM-dd"
                                    className={`form-control datepicker-auto-width ${errors.inicio ? 'is-invalid' : ''} ${isDark ? 'datepicker-dark' : ''}`}
                                    placeholderText="Inicio"
                                    popperPlacement="bottom-start"
                                    portalId="root-portal"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.inicio}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="taskEnd">
                                <Form.Label>Fin</Form.Label>
                                <DatePicker
                                    selected={task.fin}
                                    onChange={date => setTask(prev => ({ ...prev, fin: date }))}
                                    dateFormat="yyyy-MM-dd"
                                    className={`form-control ${errors.fin ? 'is-invalid' : ''} ${isDark ? 'datepicker-dark' : ''}`}
                                    placeholderText="Fin"
                                    popperPlacement="bottom-start"
                                    portalId="root-portal"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fin}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={onClose}>
                                CANCELAR
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                GUARDAR
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
            <AddCategory />
        </>
    );
};

export default TaskModal;
