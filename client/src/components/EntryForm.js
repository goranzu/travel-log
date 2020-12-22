/* eslint-disable react/prop-types */
import React, { useState } from "react";

function EntryForm({ handleSubmit, error, validationError }) {
  const [title, setTitle] = useState("");
  const [visitDate, setVisitDate] = useState("");
  return (
    <form
      className="flow-content"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ title, visitDate });
        setTitle("");
        setVisitDate("");
      }}
    >
      <label htmlFor="title">Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        name="title"
        id="title"
        type="text"
        placeholder="title"
      />
      <label htmlFor="visitDate">Visit Date:</label>
      <input
        value={visitDate}
        onChange={(e) => setVisitDate(e.target.value)}
        type="date"
        name="visitDate"
        id="visitDate"
      />
      <button className="btn" type="submit">
        Send
      </button>
      {error && <p>{error}</p>}
      {validationError && <p>{validationError}</p>}
    </form>
  );
}

export default EntryForm;
