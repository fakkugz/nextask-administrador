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
    const { apiUrl, theme, categories, setCategories,
        showAddCategory, setShowAddCategory,
        toEditCategory, setToEditCategory } = useContext(TasksContext);

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

        if (categories.some(cat => cat.category === newCategory.category)) {
            setError("Esta categoría ya existe.");
            return;
        }

        if (toEditCategory) {
            try {
                const response = await axios.put(`${apiUrl}/categories/${newCategory.id}`, newCategory);
                const updatedCategories = categories.map(category =>
                    category.id === newCategory.id ? response.data : category
                );
                setCategories(updatedCategories);
                handleClose();
            } catch (error) {
                console.error("Error al editar la categoría:", error);
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
