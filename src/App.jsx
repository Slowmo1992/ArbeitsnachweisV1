import React, { useState } from 'react';
import './App.css';
import OrderForm from './Components/OrderForm';
import OrderSearchPage from './Components/OrderSearchPage';
import SelectionPage from './Components/SelectionPage';
import OrderManagementPage from './Components/OrderManagementPage';

function App() {
  const [orders, setOrders] = useState([]);
  const [editOrderIndex, setEditOrderIndex] = useState(null);
  const [showSelection, setShowSelection] = useState(true);
  const [showOrderSearch, setShowOrderSearch] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);

  const handleSaveOrder = (newOrder) => {
    if (editOrderIndex !== null) {
      const updatedOrders = [...orders];
      updatedOrders[editOrderIndex] = newOrder;
      setOrders(updatedOrders);
      setEditOrderIndex(null);
    } else {
      setOrders([...orders, newOrder]);
    }
  };

  const handleEditOrder = (index) => {
    setEditOrderIndex(index);
    setShowSelection(false);
    setShowOrderSearch(false);
  };

  const handleNewOrder = () => {
    setShowSelection(false);
    setShowOrderSearch(false);
  };

  const handleGoBack = () => {
    setShowSelection(true);
    setShowOrderSearch(false);
  };

  const handleSearchOrders = () => {
    setShowOrderSearch(true);
    setShowSelection(false);
  };

  const handleAddEmployee = (employeeName) => {
    setAvailableEmployees(prevEmployees => [...prevEmployees, employeeName]);
  };

  return (
    <div className="App">
      {showSelection ? (
        <SelectionPage onNewOrder={handleNewOrder} onSearchOrders={handleSearchOrders} onAddEmployee={handleAddEmployee} availableEmployees={availableEmployees} />
      ) : showOrderSearch ? (
        <>
          <button onClick={handleGoBack} style={{ marginBottom: '20px' }}>Zurück zur Auswahlseite</button>
          <OrderSearchPage orders={orders} onSaveOrder={handleSaveOrder} onEditOrder={handleEditOrder} />
        </>
      ) : (
        <>
          <button onClick={handleGoBack} style={{ marginBottom: '20px' }}>Zurück zur Auswahlseite</button>
          <OrderForm onSaveOrder={handleSaveOrder} editOrder={editOrderIndex !== null ? orders[editOrderIndex] : null} availableEmployees={availableEmployees} />
        </>
      )}
    </div>
  );
}

export default App;
