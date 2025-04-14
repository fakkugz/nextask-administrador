import plus from "../assets/icons/plus.svg";
import { useContext } from "react";
import { TasksContext } from "../contexts/TasksContext";
import { Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import AddCategory from "../components/AddCategory";

const Categories = () => {
  const {
    apiUrl, categories, setCategories,
    list, setList,
    setShowAddCategory, setToEditCategory, theme
  } = useContext(TasksContext);

  const filterList = async (id) => {
    const categoryDeleted = categories.find(cat => cat.id === id);
    if (!categoryDeleted) return;

    const updatedTasks = list.map(task =>
      task.category === categoryDeleted.category
        ? { ...task, category: "Sin categoria" }
        : task
    );

    setList(updatedTasks);
    await handleCategoryUpdate(updatedTasks);
  };

  const handleCategoryUpdate = async (updatedTasks) => {
    try {
      await Promise.all(
        updatedTasks.map(task =>
          axios.put(`${apiUrl}/tasks/${task.id}`, task)
        )
      );
    } catch (error) {
      console.error("Error al actualizar las tareas:", error);
    }
  };

  const deleteCategory = (id) => {
    axios.delete(`${apiUrl}/categories/${id}`)
      .then(() => {
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
        filterList(id);
      })
      .catch(error => console.error("Error al eliminar la categoría:", error));
  };

  const editCategory = (id) => {
    const categoryToEdit = categories.find(category => category.id === id);
    setToEditCategory(categoryToEdit);
    setShowAddCategory(true);
  };

  return (
    <section className="categories">
      <h1>Categorías</h1>
      <button
        className="button"
        id="addcategory-button"
        aria-label="Agregar nueva categoría"
        onClick={() => setShowAddCategory(true)}
      >
        <img src={plus} alt="icono agregar" /> AGREGAR
      </button>

      <Row className="gy-4 cat-grid-container">
        {categories === null ? (
          <Col xs={12} className="text-center py-5">
            <div className="d-flex flex-column align-items-center gap-2">
                <Spinner animation="border" role="status" className="loading-spinner" />
            </div>
          </Col>
        ) : categories.length > 0 ? (
          categories.map(category => (
            <Col key={category.id} xs={12} sm={6} md={4}>
              <div className="category-item" data-bs-theme={theme}>
                {category.category}
                <div className="category-actions">
                  <button className="category-trash" onClick={() => deleteCategory(category.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 24 24" width="28" className="trash-icon">
                      <path d="M12 2h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1zm3.8 6l-.613 9.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.205 8H15.8zM7 9a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1z" fill="currentColor" />
                    </svg>
                  </button>
                  <button className="category-edit" onClick={() => editCategory(category.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 24 24" width="28" className="edit-icon">
                      <path d="M21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.928.928 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4h4z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="category-item" data-bs-theme={theme}>
              No se encuentran categorías.
            </div>
          </Col>
        )}
      </Row>

      <AddCategory />
    </section>
  );
};

export default Categories;
