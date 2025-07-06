import React, { useState } from 'react';
import './NewObjective.css';

const NewObjective = ({ onAddObjective }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    onAddObjective({ 
      name,
      start: new Date(startDate),
      end: new Date(endDate)
    });
    setName('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="new-objective-form">
      <input
        type="text"
        placeholder="New Objective Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <button type="submit">Add Objective</button>
    </form>
  );
};

export default NewObjective;