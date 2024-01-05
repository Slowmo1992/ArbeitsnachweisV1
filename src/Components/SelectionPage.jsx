import React, { useState } from 'react';

const SelectionPage = ({ onNewOrder, onSearchOrders, onAddEmployee }) => {
  const [newEmployee, setNewEmployee] = useState("");

  const handleAddEmployee = () => {
    if (newEmployee.trim() !== "") {
      onAddEmployee(newEmployee.trim());
      setNewEmployee("");
    }
  };

  return (
    <div>
      <h1>Auswahlseite</h1>
      <button onClick={onNewOrder}>Neuer Auftrag</button>
      <button onClick={onSearchOrders} style={{ marginLeft: '10px' }}>Auftrag suchen</button>
      <div style={{ marginTop: '20px' }}>
        <h3>Neuen Mitarbeiter hinzufügen:</h3>
        <input 
          type="text" 
          value={newEmployee} 
          onChange={(e) => setNewEmployee(e.target.value)} 
          placeholder="Mitarbeitername" 
        />
        <button onClick={handleAddEmployee} style={{ marginLeft: '10px' }}>Hinzufügen</button>
      </div>
    </div>
  );
}

export default SelectionPage;
