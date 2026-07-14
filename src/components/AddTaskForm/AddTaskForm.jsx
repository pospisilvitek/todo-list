import AddItemForm from "../AddItemForm/AddItemForm";

import { MAX_TASK_NAME_LENGTH } from "../../constants/todoListConstants";

export default function AddTaskForm({ addTask }) {
    return (
        <AddItemForm
            addItem={addTask}
            buttonText="Add task"
            placeholder="Task name"
            maxLength={MAX_TASK_NAME_LENGTH}
        />
    );
}