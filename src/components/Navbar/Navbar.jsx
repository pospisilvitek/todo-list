import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleList, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import AddListModal from "../AddListModal/AddListModal";

import "./Navbar.css";

export default function Navbar({
    addList,
    changeTheme,
    isListsPanelOpen,
    toggleListsPanel,
    isAddListModalOpen,
    setIsAddListModalOpen
}) {
    return (
        <nav className="navbar">
            <div
                className={`navbar__left-side ${
                    isListsPanelOpen ? "navbar__left-side--open" : ""
                }`}
            >
                <button
                    type="button"
                    className="navbar__brand"
                    onClick={changeTheme}
                    title="Change color theme"
                    aria-label="Change color theme"
                >
                    <FontAwesomeIcon 
                        icon={faRectangleList}
                        className="navbar__logo"
                    />
                    Todo List
                </button>
                {isListsPanelOpen && (
                    <button
                        type="button"
                        className="navbar__hide-lists-button"
                        onClick={toggleListsPanel}
                        title="Hide lists"
                        aria-label="Hide lists"
                    >
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                )}
            </div>
            <div
                className={`navbar__right-side ${
                    isListsPanelOpen ? "navbar__right-side--hidden" : ""
                }`}
            >
                {!isListsPanelOpen && (
                    <button
                        type="button"
                        className="navbar__show-lists-button"
                        onClick={toggleListsPanel}
                        title="Show lists"
                        aria-label="Show lists"
                    >
                        <FontAwesomeIcon icon={faBars}/>
                    </button>
                )}
                <button
                    type="button"
                    className="navbar__add-list-button"
                    onClick={() => setIsAddListModalOpen(true)}
                    title="Add list"
                    aria-label="Add list"
                >
                    <FontAwesomeIcon icon={faSquarePlus}/>
                </button>
            </div>
            {isAddListModalOpen && (
                <AddListModal 
                    addList={addList}
                    closeModal={() => setIsAddListModalOpen(false)}
                />
            )}
        </nav>
    );
}