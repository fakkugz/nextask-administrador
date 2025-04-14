import './styles/App.css';
import List from './pages/List';
import Buttons from "./components/Buttons";
import NavBar from './components/NavBar';
import TaskDetails from './pages/TaskDetails';
import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { TasksContext } from './contexts/TasksContext';
import Categories from './pages/Categories';
import Background from './components/Background';
import { defaultTasks } from './data/defaultTasks';
import { defaultCategories } from './data/defaultCategories'; 


function App() {

  const { apiUrl, list, setList,
    setIsLoading, setCategories } = useContext(TasksContext);

    
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
    
          const [tasksRes, categoriesRes] = await Promise.all([
            axios.get(`${apiUrl}/tasks`),
            axios.get(`${apiUrl}/categories`)
          ]);
    
          const tasksAreEqual =
            tasksRes.data.length === defaultTasks.length &&
            tasksRes.data.every(task =>
              defaultTasks.some(def => def.id === task.id && def.name === task.name)
            );
    
          const categoriesAreEqual =
            categoriesRes.data.length === defaultCategories.length &&
            categoriesRes.data.every(cat =>
              defaultCategories.some(def => def.id === cat.id && def.category === cat.category)
            );
    
          if (!tasksAreEqual || !categoriesAreEqual) {
            // Borrar actuales
            await Promise.all([
              ...tasksRes.data.map(task => axios.delete(`${apiUrl}/tasks/${task.id}`)),
              ...categoriesRes.data.map(cat => axios.delete(`${apiUrl}/categories/${cat.id}`))
            ]);
    
            // Agregar predeterminadas
            await Promise.all([
              ...defaultTasks.map(task => axios.post(`${apiUrl}/tasks`, task)),
              ...defaultCategories.map(cat => axios.post(`${apiUrl}/categories`, cat))
            ]);
    
            // Recargar actualizados
            const [newTasksRes, newCategoriesRes] = await Promise.all([
              axios.get(`${apiUrl}/tasks`),
              axios.get(`${apiUrl}/categories`)
            ]);
    
            setList(newTasksRes.data);
            setCategories(newCategoriesRes.data);
          } else {
            setList(tasksRes.data);
            setCategories(categoriesRes.data);
          }
        } catch (error) {
          console.error('Error al validar o cargar tareas/categorías:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchData();
    }, []);
    
     


  const handleAddTask = (newTask) => {
    const taskToEdit = list.find(task => newTask.id === task.id);

    if (taskToEdit) {
      axios.put(`${apiUrl}/tasks/${newTask.id}`, newTask)
        .then(response => {
          const updatedList = list.map(task =>
            task.id === newTask.id ? response.data : task
          );
          setList(updatedList);
        })
        .catch(error => {
          console.error('Error al actualizar la tarea:', error);
        });
    } else {
      axios.post(`${apiUrl}/tasks`, newTask)
        .then(response => {
          setList([...list, response.data]);
        })
        .catch(error => {
          console.error('Error al agregar la tarea:', error);
        });
    }
  };
  

  return (
      <Router basename="/nextask-administrador">
        <Background />
        <NavBar />
        <Routes>
          <Route path='/' element={
            <>
              <Buttons
                onAddTask={handleAddTask}
              />
              <List/>
            </>
            } />
          <Route path='task/:id' element={<TaskDetails/>} />
          <Route path='categories' element={<Categories/>} />
        </Routes>
      </Router>
  )
}

export default App
