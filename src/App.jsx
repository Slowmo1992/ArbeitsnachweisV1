import React, { useState } from 'react';
import OrderForm from './Components/OrderForm';
import OrderManagementPage from './Components/OrderManagementPage';

function App() {
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleSaveOrder = (newOrder) => {
    if (editIndex !== null) {
      const updatedOrders = [...orders];
      updatedOrders[editIndex] = newOrder;
      setOrders(updatedOrders);
      setEditIndex(null);
    } else {
      setOrders([...orders, newOrder]);
    }
  };

  const handleEditOrder = (index) => {
    setEditIndex(index);
  };

  return (
    <div className="App">
      <h1>Auftragsverwaltung</h1>

      <OrderForm onSaveOrder={handleSaveOrder} editOrder={editIndex !== null ? orders[editIndex] : null} />

      <OrderManagementPage orders={orders} />
    </div>
  );
}

export default App;
