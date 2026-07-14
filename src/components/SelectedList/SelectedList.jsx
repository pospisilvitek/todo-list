import { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { MAX_LIST_NAME_LENGTH } from "../../constants/todoListConstants";

import "./SelectedList.css";

export default function SelectedList({ selectedList, renameList, removeList }) {
    const [editedListName, setEditedListName] = useState(selectedList.name);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const inputRef = useRef(null);
    const deleteActionsRef = useRef(null);

    const handleListRename = (listId) => {
        if (editedListName.trim().length !== 0) {
            if (selectedList.name !== editedListName) {
                renameList(listId, editedListName);
            }
        } else {
            setEditedListName(selectedList.name);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.currentTarget.blur();
        }
    };

    const handleBlur = (listId) => {
        handleListRename(listId);
        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.scrollLeft = 0;
            }
        });
    };

    useEffect(() => {
        if (!showDeleteButton) return;

        const handlePointerDown = (event) => {
            if (deleteActionsRef.current?.contains(event.target)) {
                return;
            }
            setShowDeleteButton(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [showDeleteButton]);

    return (
        <div className="selected-list">
            <input
                ref={inputRef}
                type="text"
                className="selected-list__input"
                value={editedListName}
                onChange={(event) => setEditedListName(event.target.value)}
                onBlur={() => handleBlur(selectedList.id)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_LIST_NAME_LENGTH}
                autoComplete="off"
            />
            {showDeleteButton ? (
                <div
                    ref={deleteActionsRef}
                    className="selected-list__delete-actions"
                >
                    <button
                        type="button"
                        className="selected-list__delete-confirm-button"
                        onClick={() => removeList(selectedList.id)}
                        title="Confirm delete list"
                        aria-label="Confirm delete list"
                    >
                        <FontAwesomeIcon icon={faTrashCan}/>
                    </button>
                    <button
                        type="button"
                        className="selected-list__delete-cancel-button"
                        onClick={() => setShowDeleteButton(false)}
                        title="Cancel delete list"
                        aria-label="Cancel delete list"
                    >
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="selected-list__delete-trigger"
                    onClick={() => setShowDeleteButton(true)}
                    title="Delete list"
                    aria-label="Delete list"
                >
                    <FontAwesomeIcon icon={faSquareMinus}/>
                </button>
            )}
        </div>
    );
}