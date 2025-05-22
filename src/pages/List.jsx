import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Task from "../components/Task";
import useTaskStore from "../store/useTaskStore";
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import SortIcon from "../components/SortIcon";

const List = () => {

    const list = useTaskStore(state => state.list);
    const theme = useTaskStore(state => state.theme);
    const handleToggleCheck = useTaskStore(state => state.handleToggleCheck);
    const editTask = useTaskStore(state => state.editTask);
    const isLoading = useTaskStore(state => state.isLoading);
    const activeFilters = useTaskStore(state => state.activeFilters);

    const [orderedBaseList, setOrderedBaseList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const saveOrderToStorage = (ordered) => {
        localStorage.setItem("taskOrder", JSON.stringify(ordered.map(t => t.id)));
    };

    const loadOrderFromStorage = () => {
        const stored = localStorage.getItem("taskOrder");
        if (!stored) return null;
        const storedOrder = JSON.parse(stored);
        const taskMap = Object.fromEntries(list.map(t => [t.id, t]));
        return storedOrder.map(id => taskMap[id]).filter(Boolean);
    };


    useEffect(() => {
        if (!list || list.length === 0) return;

        const storedOrder = loadOrderFromStorage();
        if (storedOrder && storedOrder.length === list.length) {
            setOrderedBaseList(storedOrder);
        } else {
            const defaultSorted = [...list].sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                return new Date(a.fin) - new Date(b.fin);
            });
            setOrderedBaseList(defaultSorted);
            saveOrderToStorage(defaultSorted);
        }
    }, [list]);

    const formatDate = (date) => {
        const dateToCompare = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (dateToCompare.getTime() === today.getTime()) return "Hoy";
        if (dateToCompare.getTime() === tomorrow.getTime()) return "Mañana";

        const day = dateToCompare.getDate().toString().padStart(2, "0");
        const month = (dateToCompare.getMonth() + 1).toString().padStart(2, "0");
        return `${day}/${month}`;
    };

    const handleSort = (key) => {
        const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const dir = newDirection === 'asc' ? 1 : -1;

        const sorted = [...orderedBaseList].sort((a, b) => {
            switch (key) {
                case 'name':
                case 'category':
                    return a[key].localeCompare(b[key]) * dir;
                case 'inicio':
                case 'fin':
                    return (new Date(a[key]) - new Date(b[key])) * dir;
                case 'completed':
                    return ((a.completed === b.completed) ? 0 : a.completed ? 1 : -1) * dir;
                default:
                    return 0;
            }
        });

        setSortConfig({ key, direction: newDirection });
        setOrderedBaseList(sorted);
        saveOrderToStorage(sorted);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = orderedBaseList.findIndex((task) => task.id === active.id);
        const newIndex = orderedBaseList.findIndex((task) => task.id === over.id);

        const updatedTasks = [...orderedBaseList];
        const [movedTask] = updatedTasks.splice(oldIndex, 1);
        updatedTasks.splice(newIndex, 0, movedTask);

        setOrderedBaseList(updatedTasks);
        setSortConfig({ key: null, direction: "asc" });
        saveOrderToStorage(updatedTasks);
    };

    const filteredList = activeFilters
        ? orderedBaseList.filter(task => task.category === activeFilters)
        : orderedBaseList;

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table className="task-list" striped bordered data-bs-theme={theme}>
                <thead>
                    <tr>
                        <th className="col-icon"></th>
                        <th className="col-orden">ORDEN</th>
                        <th className="col-tarea" onClick={() => handleSort("name")}>
                            TAREA <SortIcon className="ms-1 align-middle" style={{ cursor: "pointer" }} />
                        </th>
                        <th className="col-categoria" onClick={() => handleSort("category")}>
                            CATEGORÍA <SortIcon className="ms-1 align-middle" style={{ cursor: "pointer" }} />
                        </th>
                        <th className="col-inicio" onClick={() => handleSort("inicio")}>
                            INICIO <SortIcon className="ms-1 align-middle" style={{ cursor: "pointer" }} />
                        </th>
                        <th className="col-fin" onClick={() => handleSort("fin")}>
                            FIN <SortIcon className="ms-1 align-middle" style={{ cursor: "pointer" }} />
                        </th>
                        <th className="col-estado" onClick={() => handleSort("completed")}>
                            ESTADO <SortIcon className="ms-1 align-middle" style={{ cursor: "pointer" }} />
                        </th>
                        <th className="col-edicion">EDICIÓN</th>
                    </tr>
                </thead>
                <SortableContext items={filteredList} strategy={verticalListSortingStrategy}>
                    <tbody className="tasks">
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-5">
                                    <Spinner animation="border" role="status" className="loading-spinner ">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </td>
                            </tr>
                        ) : filteredList.length > 0 ? (
                            filteredList.map((i, index) => (
                                <Task
                                    key={i.id}
                                    id={i.id}
                                    index={index}
                                    name={i.name}
                                    category={i.category}
                                    inicio={formatDate(i.inicio)}
                                    fin={formatDate(i.fin)}
                                    completed={i.completed}
                                    handleToggleCheck={handleToggleCheck}
                                    editTask={editTask}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No se encuentran tareas</td>
                            </tr>
                        )}
                    </tbody>
                </SortableContext>
            </Table>
        </DndContext>
    );
};

export default List;
