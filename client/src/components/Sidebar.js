/* eslint-disable react/prop-types */
import React from "react";
import EntryForm from "./EntryForm";

function Sidebar({
  openSidebar,
  handleSidebarClose,
  handleSubmit,
  error,
  validationError,
}) {
  return (
    <aside className={`${openSidebar ? "sidebar open" : "sidebar"}`}>
      <button
        onClick={handleSidebarClose}
        ariaLabel="close sidebar"
        className="close-btn"
      >
        &times;
      </button>
      <EntryForm
        handleSubmit={handleSubmit}
        error={error}
        validationError={validationError}
      />
    </aside>
  );
}

export default Sidebar;
