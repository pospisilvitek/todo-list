import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../components/Navbar/Navbar";
import SelectedList from "../components/SelectedList/SelectedList";
import TaskItem from "../components/TaskItem/TaskItem";
import AddTaskForm from "../components/AddTaskForm/AddTaskForm";

import { useTodoList } from "../hooks/useTodoList";

import "./TodoList.css";

export default function TodoList() {
    const {
        themes,

        lists,
        selectedListId,
        showCompletedTasks,
        themeIndex,

        isAddListModalOpen,
        setIsAddListModalOpen,

        isListsPanelOpen,
        setIsListsPanelOpen,

        textareasVersion,

        selectedList,
        activeTasks,
        completedTasks,

        addList,
        renameList,
        removeList,
        selectList,

        addTask,
        renameTask,
        removeTask,
        toggleTaskCompletion,

        changeTheme,
        toggleCompletedTasks,
    } = useTodoList();
    
    return (
        <div
            className="todo-list"
            data-theme={themes[themeIndex]}
        >
            <div className="orientation-lock">
                <FontAwesomeIcon 
                    icon={faArrowsRotate}
                    className="orientation-lock__icon"
                />
                <p className="orientation-lock__text">Please rotate your device</p>
            </div>
            <Navbar
                addList={addList}
                changeTheme={changeTheme}
                isListsPanelOpen={isListsPanelOpen}
                toggleListsPanel={() => setIsListsPanelOpen(!isListsPanelOpen)}
                isAddListModalOpen={isAddListModalOpen}
                setIsAddListModalOpen={setIsAddListModalOpen}
            />
            <div className="todo-list__content">
                <div
                    className={`todo-list__lists ${
                        isListsPanelOpen ? "todo-list__lists--open" : ""
                    }`}
                >
                    <p className="todo-list__lists-info">Your lists:</p>
                    {lists.length === 0 ? (
                        <p className="todo-list__lists-empty-message">
                            <b>Hint: </b>Create a list to keep your tasks organized.
                        </p>
                    ) : (
                        lists.map((list) => (
                            <button
                                key={list.id}
                                type="button"
                                className={`todo-list__list-item ${
                                    list.id === selectedListId ? "todo-list__list-item--active" : ""
                                }`}
                                onClick={() => selectList(list.id)}
                                title={list.name}
                                aria-label={list.name}
                            >
                                {list.name}
                            </button>
                        ))
                    )}
                </div>
                <div
                    className={`todo-list__tasks ${
                        isListsPanelOpen ? "todo-list__tasks--hidden" : ""
                    }`}
                >
                    {lists.length === 0 && (
                        <div className="todo-list__tasks-empty-state">
                            <p className="todo-list__tasks-empty-state-message">There are no lists to show</p>
                            <button
                                type="button"
                                className="todo-list__tasks-empty-state-button"
                                onClick={() => setIsAddListModalOpen(true)}
                            >
                                Add new list
                            </button>
                        </div>
                    )}
                    {selectedList && (
                        <>
                            <SelectedList
                                key={selectedList.id}
                                selectedList={selectedList}
                                renameList={renameList}
                                removeList={removeList}
                            />
                            {activeTasks.length === 0 ? (
                                <p className="todo-list__active-tasks-empty-message">
                                    <b>Hint: </b>Add a task below to get started.
                                </p>
                            ) : (
                                <div className="todo-list__active-tasks">
                                    {activeTasks.map((task) => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            textareasVersion={textareasVersion}
                                            removeTask={removeTask}
                                            renameTask={renameTask}
                                            toggleTaskCompletion={toggleTaskCompletion}
                                        />
                                    ))}
                                </div>
                            )}
                            {completedTasks.length > 0 && (
                                <div className="todo-list__completed-tasks">
                                    <button
                                        type="button"
                                        className="todo-list__completed-tasks-toggle"
                                        onClick={toggleCompletedTasks}
                                        title={showCompletedTasks ? "Hide completed tasks" : "Show completed tasks"}
                                        aria-label={showCompletedTasks ? "Hide completed tasks" : "Show completed tasks"}
                                    >
                                        Completed tasks ({completedTasks.length})
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className={`todo-list__completed-tasks-icon ${
                                                showCompletedTasks ? "todo-list__completed-tasks-icon--open" : ""
                                            }`}
                                        />
                                    </button>
                                    {showCompletedTasks && completedTasks.map((task) => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            textareasVersion={textareasVersion}
                                            removeTask={removeTask}
                                            renameTask={renameTask}
                                            toggleTaskCompletion={toggleTaskCompletion}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="todo-list__add-task-form-wrapper">
                                <AddTaskForm
                                    key={selectedListId}
                                    addTask={addTask}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}