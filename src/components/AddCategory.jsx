import { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { TasksContext } from '../contexts/TasksContext';
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';

const AddCategory = () => {
    
    const [newCategory, setNewCategory] = useState({ id: "", category: "" });
    const [error, setError] = useState("");
    const {
        apiUrl, theme, setList, categories, setCategories,
        showAddCategory, setShowAddCategory,
        toEditCategory, setToEditCategory
    } = useContext(TasksContext);

    useEffect(() => {
        if (toEditCategory) {
            setNewCategory({ id: toEditCategory.id, category: toEditCategory.category });
        } else {
            setNewCategory({ id: "", category: "" });
        }
    }, [toEditCategory]);

    const handleClose = () => {
        setNewCategory({ id: "", category: "" });
        setToEditCategory(null);
        setError("");
        setShowAddCategory(false);
    };

    const handleChange = (e) => {
        const { value } = e.target;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

        setNewCategory(prevCategory => ({
            ...prevCategory,
            id: prevCategory.id || uuidv4(),
            category: formattedValue
        }));

        setError("");
    };

    const handleAddCategory = async () => {
        const trimmedCategory = newCategory.category.trim();
    
        if (!trimmedCategory) {
            setError("El nombre de la categoría no puede estar vacío.");
            return;
        }
    
        const categoryAlreadyExists = categories.some(cat =>
            cat.category.toLowerCase() === newCategory.category.toLowerCase() &&
            cat.id !== newCategory.id
        );
    
        if (categoryAlreadyExists) {
            setError("Esta categoría ya existe.");
            return;
        }
    
        if (toEditCategory) {
            try {
                // Actualizar categoría en la lista de categorías
                const response = await axios.put(`${apiUrl}/categories/${newCategory.id}`, newCategory);
                const updatedCategories = categories.map(category =>
                    category.id === newCategory.id ? response.data : category
                );
                setCategories(updatedCategories);
    
                // Obtener tareas actuales
                const resTasks = await axios.get(`${apiUrl}/tasks`);
                const tasks = resTasks.data;
    
                // Reemplazar la categoría antigua por la nueva (insensible a mayúsculas)
                const updatedTasks = tasks.map(task =>
                    task.category.toLowerCase() === toEditCategory.category.toLowerCase()
                        ? { ...task, category: newCategory.category }
                        : task
                );
    
                // Guardar tareas modificadas
                await Promise.all(
                    updatedTasks.map(task =>
                        axios.put(`${apiUrl}/tasks/${task.id}`, task)
                    )
                );
    
                // Actualizar estado local
                setList(updatedTasks);
    
                handleClose();
            } catch (error) {
                console.error("Error al editar la categoría o actualizar tareas:", error);
            }
        } else {
            try {
                const response = await axios.post(`${apiUrl}/categories`, newCategory);
                setCategories([...categories, response.data]);
                handleClose();
            } catch (error) {
                console.error("Error al guardar la categoría:", error);
            };
        };
    };

    return (
        <Modal show={showAddCategory} onHide={handleClose} data-bs-theme={theme} className='addCategory'>
            <Modal.Header closeButton>
                <Modal.Title>{toEditCategory ? "Editar Categoría" : "Agregar Categoría"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Nueva categoría:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre"
                            value={newCategory.category}
                            onChange={handleChange}
                            autoFocus
                        />
                        {error && <p className="error text-danger">{error}</p>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    CANCELAR
                </Button>
                <Button variant="primary" onClick={handleAddCategory}>
                    {toEditCategory ? "GUARDAR" : "AGREGAR"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddCategory;
