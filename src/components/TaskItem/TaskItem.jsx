import { useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import { MAX_TASK_NAME_LENGTH } from "../../constants/todoListConstants";

import "./TaskItem.css";

export default function TaskItem({ 
    task,
    textareasVersion,
    removeTask,
    renameTask,
    toggleTaskCompletion
}) {
    const [editedTaskName, setEditedTaskName] = useState(task.name);

    const handleTaskRename = (taskId) => {
        if (editedTaskName.trim().length !== 0) {
            if (task.name !== editedTaskName) {
                renameTask(taskId, editedTaskName);
            }
        } else {
            setEditedTaskName(task.name);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
        }
    };

    return (
        <div className="task-item">
            <label className="task-item__checkbox-wrapper">
                <input
                    type="checkbox"
                    className="task-item__checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTaskCompletion(task.id)}
                />
            </label>
            <TextAreaAutosize
                key={`${task.id}-${textareasVersion}`}
                className="task-item__textarea"
                value={editedTaskName}
                onChange={(event) => setEditedTaskName(event.target.value)}
                onBlur={() => handleTaskRename(task.id)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_TASK_NAME_LENGTH}
                minRows={1}
                autoComplete="off"
                spellCheck={true}
            />
            <button
                type="button"
                className="task-item__delete-button"
                onClick={() => removeTask(task.id)}
                title="Delete task"
                aria-label="Delete task"
            >
                <FontAwesomeIcon icon={faTrashCan}/>
            </button>
        </div>
    );
}