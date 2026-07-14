import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

import {
    TODO_LIST_DATA_KEY,
    TODO_LIST_SELECTED_LIST_ID_KEY,
    TODO_LIST_SHOW_COMPLETED_TASKS_KEY,
    TODO_LIST_THEME_KEY,

    DEFAULT_THEME_INDEX,
    DEFAULT_SHOW_COMPLETED_TASKS
} from "../constants/todoListConstants";

const themes = ["magenta", "orange", "blue", "green"];

const createOnboarding = () => ({
    id: uuid(),
    name: "Onboarding",
    tasks: [
        {id: uuid(), name: "Welcome! This onboarding list shows you the basics.", isCompleted: false},
        {id: uuid(), name: "Click this task text to rename it. Use the checkbox to complete it or the trash icon to delete it.", isCompleted: false},
        {id: uuid(), name: "Use the + button in the top-right corner to create a new list. You can rename or delete lists too.", isCompleted: false},
        {id: uuid(), name: "This is your completed task.", isCompleted: true},
        {id: uuid(), name: "Click the Completed tasks header to show or hide completed tasks.", isCompleted: true},
        {id: uuid(), name: "Try clicking the Todo list logo. Something might change.", isCompleted: true},
    ]
});

const getInitialData = () => {
    try {
        const storedData = localStorage.getItem(TODO_LIST_DATA_KEY);

        if (storedData === null) {
            return [createOnboarding()];
        }

        const parsedData = JSON.parse(storedData);

        if (!Array.isArray(parsedData)) {
            return [];
        } 

        return parsedData;
    } catch {
        return [];
    }
};

const getInitialSelectedListId = (lists) => {
    const storedSelectedListId = localStorage.getItem(TODO_LIST_SELECTED_LIST_ID_KEY);

    const selectedListExists = lists.some((list) => list.id === storedSelectedListId);

    if (selectedListExists) {
        return storedSelectedListId;
    }

    return lists[0]?.id ?? null;
};

const getInitialShowCompletedTasks = () => {
    try {
        const storedShowCompletedTasks = localStorage.getItem(TODO_LIST_SHOW_COMPLETED_TASKS_KEY);

        if (storedShowCompletedTasks === null) {
            return DEFAULT_SHOW_COMPLETED_TASKS;
        }

        const parsedShowCompletedTasks = JSON.parse(storedShowCompletedTasks);

        if (typeof parsedShowCompletedTasks !== "boolean") {
            return DEFAULT_SHOW_COMPLETED_TASKS;
        }

        return parsedShowCompletedTasks;
    } catch {
        return DEFAULT_SHOW_COMPLETED_TASKS;
    }
};

const getInitialThemeIndex = () => {
    const storedTheme = localStorage.getItem(TODO_LIST_THEME_KEY);

    if (storedTheme === null) {
        return DEFAULT_THEME_INDEX;
    }

    const storedThemeIndex = themes.indexOf(storedTheme);

    if (storedThemeIndex === -1) {
        return DEFAULT_THEME_INDEX;
    }

    return storedThemeIndex;
};

export function useTodoList() {
    const [lists, setLists] = useState(getInitialData);
    const [selectedListId, setSelectedListId] = useState(() => getInitialSelectedListId(lists));
    const [showCompletedTasks, setShowCompletedTasks] = useState(getInitialShowCompletedTasks);
    const [themeIndex, setThemeIndex] = useState(getInitialThemeIndex);

    const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
    const [isListsPanelOpen, setIsListsPanelOpen] = useState(false);

    const [textareasVersion, setTextareasVersion] = useState(0);

    const selectedList = lists.find((list) => list.id === selectedListId);
    const activeTasks = selectedList?.tasks?.filter((task) => !task.isCompleted) ?? [];
    const completedTasks = selectedList?.tasks?.filter((task) => task.isCompleted) ?? [];

    useEffect(() => {
        localStorage.setItem(TODO_LIST_DATA_KEY, JSON.stringify(lists));
    }, [lists]);

    useEffect(() => {
        if (selectedListId === null) {
            localStorage.removeItem(TODO_LIST_SELECTED_LIST_ID_KEY);
            return;
        }

        localStorage.setItem(TODO_LIST_SELECTED_LIST_ID_KEY, selectedListId);
    }, [selectedListId]);

    useEffect(() => {
        localStorage.setItem(TODO_LIST_SHOW_COMPLETED_TASKS_KEY, JSON.stringify(showCompletedTasks));
    }, [showCompletedTasks]);

    useEffect(() => {
        localStorage.setItem(TODO_LIST_THEME_KEY, themes[themeIndex]);
    }, [themeIndex]);

    useEffect(() => {
        document.title = selectedList ? `${selectedList.name} | Todo List` : "Todo List";
    }, [selectedList]);

    useEffect(() => {
        const refreshLayout = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTextareasVersion((currentTextareasVersion) => currentTextareasVersion + 1);
                });
            });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refreshLayout();
            }
        };

        refreshLayout();
        document.fonts?.ready.then(refreshLayout);

        window.addEventListener("pageshow", refreshLayout);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pageshow", refreshLayout);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const addList = (listName) => {
        const newListId = uuid();
        setLists((currentLists) => [...currentLists, {id: newListId, name: listName, tasks: []}]);
        selectList(newListId);
    };

    const renameList = (listId, newListName) => {
        setLists((currentLists) => currentLists.map((list) => {
            if (list.id === listId) {
                return {...list, name: newListName};
            }
            return list;
        }));
    };

    const removeList = (listId) => {
        const currentListIndex = lists.findIndex((list) => list.id === listId);

        if (currentListIndex === -1) return;

        const updatedLists = lists.filter((list) => list.id !== listId);

        const nextSelectedListId = updatedLists[currentListIndex]?.id
            ?? updatedLists[currentListIndex - 1]?.id 
            ?? null;

        setLists(updatedLists);
        setSelectedListId(nextSelectedListId);
    };

    const selectList = (listId) => {
        if (listId !== selectedListId) {
            setSelectedListId(listId);
        }
        setIsListsPanelOpen(false);
    };

    const addTask = (taskName) => {
        setLists((currentLists) => currentLists.map((list) => {
            if (list.id === selectedListId) {
                return {...list, tasks: [...list.tasks, {id: uuid(), name: taskName, isCompleted: false}]};
            }
            return list;
        }));
    };

    const renameTask = (taskId, newTaskName) => {
        setLists((currentLists) => currentLists.map((list) => {
            if (list.id === selectedListId) {
                return {...list, tasks: list.tasks.map((task) => {
                    if (task.id === taskId) {
                        return {...task, name: newTaskName};
                    }
                    return task;
                })};
            }
            return list;
        }));
    };

    const removeTask = (taskId) => {
        setLists((currentLists) => currentLists.map((list) => {
            if (list.id === selectedListId) {
                return {...list, tasks: list.tasks.filter((task) => task.id !== taskId)};
            }
            return list;
        }));
    };

    const toggleTaskCompletion = (taskId) => {
        setLists((currentLists) => currentLists.map((list) => {
            if (list.id === selectedListId) {
                return {...list, tasks: list.tasks.map((task) => {
                    if (task.id === taskId) {
                        return {...task, isCompleted: !task.isCompleted};
                    }
                    return task;
                })};
            }
            return list;
        }));
    };

    const changeTheme = () => setThemeIndex((currentThemeIndex) => (currentThemeIndex + 1) % themes.length);

    const toggleCompletedTasks = () => setShowCompletedTasks(!showCompletedTasks);

    return {
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
    };
}