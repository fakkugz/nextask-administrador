import { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ThemeToggle from '../components/ThemeToggle';
import { TasksContext } from '../contexts/TasksContext';
import NTLogo1 from '../assets/NexTaskLogo1.png';
import NTLogo2 from '../assets/NexTaskLogo2.png';
import { defaultTasks } from '../data/defaultTasks'
import { defaultCategories } from '../data/defaultCategories';
import axios from 'axios';
import { Link } from 'react-router-dom';


const NavBar = () => {
  const [pendientes, setPendientes] = useState(0);
  const { apiUrl, setList, list, theme, setTheme, categories, setCategories, setActiveFilters } = useContext(TasksContext);

  const [logoSrc, setLogoSrc] = useState(theme === 'dark' ? NTLogo2 : NTLogo1);
  const [isResetting, setIsResetting] = useState(false);


  useEffect(() => {
    setLogoSrc(theme === 'dark' ? NTLogo2 : NTLogo1);
  }, [theme]);

  useEffect(() => {
    const pendientes = list.filter(task => !task.completed);
    setPendientes(pendientes.length);
  }, [list]);

  const resetToDefaultTasks = async () => {
    setIsResetting(true);

    try {
      const [tasksRes, categoriesRes] = await Promise.all([
        axios.get(`${apiUrl}/tasks`),
        axios.get(`${apiUrl}/categories`)
      ]);

      await Promise.all([
        ...tasksRes.data.map(task => axios.delete(`${apiUrl}/tasks/${task.id}`)),
        ...categoriesRes.data.map(cat => axios.delete(`${apiUrl}/categories/${cat.id}`))
      ]);

      await Promise.all(
        defaultCategories.map(cat => axios.post(`${apiUrl}/categories`, cat))
      );

      const newTasks = await Promise.all(
        defaultTasks.map(task => axios.post(`${apiUrl}/tasks`, task))
      );

      const orderedIds = newTasks.map(res => res.data.id);
      localStorage.setItem("taskOrder", JSON.stringify(orderedIds));

      const [finalTasks, finalCategories] = await Promise.all([
        axios.get(`${apiUrl}/tasks`),
        axios.get(`${apiUrl}/categories`)
      ]);

      setList(finalTasks.data);
      if (typeof setCategories === 'function') {
        setCategories(finalCategories.data);
      }

    } catch (error) {
      console.error("Error al restablecer datos por defecto:", error);
    } finally {
      setIsResetting(false);
    }
  };




  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar" data-bs-theme={theme}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
          <img
            src={logoSrc}
            alt="NexTask Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-options">
            <Nav.Item className='rest-button d-flex justify-content-center me-4'>
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={resetToDefaultTasks}
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Restableciendo...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="me-1"
                    >
                      <path d="M12 6V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    Restablecer ejemplo
                  </>
                )}
              </button>
            </Nav.Item>
            <NavDropdown title="Categorias" id="basic-nav-dropdown">
              {categories && categories.map(category => (
                <NavDropdown.Item
                  key={category.id}
                  onClick={() => setActiveFilters(category.category)}
                >
                  {category.category}
                </NavDropdown.Item>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => setActiveFilters(null)}>
                Mostrar Todas
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/categories">Administrar</NavDropdown.Item>
            </NavDropdown>
            <Navbar.Text>
              Pendientes: <strong>{pendientes}</strong>
            </Navbar.Text>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
