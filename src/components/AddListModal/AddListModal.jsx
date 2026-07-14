import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import AddItemForm from "../AddItemForm/AddItemForm";
import { MAX_LIST_NAME_LENGTH } from "../../constants/todoListConstants";

import "./AddListModal.css";

export default function AddListModal({ closeModal, addList }) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [closeModal]);

    return (
        <div
            className="add-list-modal"
            onClick={closeModal}
        >
            <div 
                className="add-list-modal__content"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="add-list-modal__close-button"
                    onClick={closeModal}
                    title="Close modal"
                    aria-label="Close modal"
                >
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <h2 className="add-list-modal__title">New list</h2>
                <p className="add-list-modal__description">Give your list a name</p>
                <AddItemForm
                    addItem={addList}
                    afterSubmit={closeModal}
                    buttonText="Add list"
                    placeholder="List name"
                    autoFocus={true}
                    maxLength={MAX_LIST_NAME_LENGTH}
                />
            </div>
        </div>
    );
}