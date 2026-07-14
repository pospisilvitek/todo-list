import { useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-regular-svg-icons";

import "./AddItemForm.css";

export default function AddItemForm({
    addItem,
    afterSubmit,
    buttonText,
    placeholder,
    autoFocus = false,
    maxLength
}) {
    const [newItemName, setNewItemName] = useState("");
    const [isInputInvalid, setIsInputInvalid] = useState(false);

    const inputRef = useRef(null);

    const updateItemName = (event) => {
        setNewItemName(event.target.value);
        setIsInputInvalid(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (newItemName.trim().length === 0) {
            setIsInputInvalid(true);
            inputRef.current?.focus();
            return;
        }

        setIsInputInvalid(false);
        addItem(newItemName);
        setNewItemName("");
        afterSubmit?.();
    };

    return (
        <form 
            className="add-item-form"
            onSubmit={handleSubmit} 
        >
            <input
                ref={inputRef}
                type="text"
                className={`add-item-form__input ${
                    isInputInvalid ? "add-item-form__input--invalid" : ""
                }`}
                placeholder={placeholder}
                value={newItemName}
                onChange={updateItemName}
                autoFocus={autoFocus}
                onBlur={() => setIsInputInvalid(false)}
                maxLength={maxLength}
                autoComplete="off"
                spellCheck={true}
            />
            <button
                type="submit"
                className="add-item-form__button"
            >
                {buttonText}
                <FontAwesomeIcon icon={faCircleRight}/>
            </button>
        </form>
    );
}