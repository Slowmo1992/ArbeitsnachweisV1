import React from 'react';

const SelectionPage = ({ onNewOrder, onSearchOrders }) => {
  return (
    <div>
      <h1>Auswahlseite</h1>
      <button onClick={onNewOrder}>Neuer Auftrag</button>
      <button onClick={onSearchOrders} style={{ marginLeft: '10px' }}>Auftrag suchen</button>
    </div>
  );
}

export default SelectionPage;
