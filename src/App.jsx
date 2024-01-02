import React, { useState } from 'react';
import OrderForm from './Components/OrderForm';
import OrderSearchPage from './Components/OrderSearchPage';
import SelectionPage from './Components/SelectionPage';

function App() {
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showSelection, setShowSelection] = useState(true);
  const [showOrderSearch, setShowOrderSearch] = useState(false);

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

  return (
    <div className="App">

      {showSelection ? (
        <SelectionPage onNewOrder={handleNewOrder} onSearchOrders={handleSearchOrders} />
      ) : showOrderSearch ? (
        <>
          <button onClick={handleGoBack} style={{ marginBottom: '20px' }}>Zurück zur Auswahlseite</button>
          <OrderSearchPage orders={orders} onSaveOrder={handleSaveOrder} onEditOrder={handleEditOrder} />
        </>
      ) : (
        <>
          <button onClick={handleGoBack} style={{ marginBottom: '20px' }}>Zurück zur Auswahlseite</button>
          <OrderForm onSaveOrder={handleSaveOrder} editOrder={editIndex !== null ? orders[editIndex] : null} />
        </>
      )}
    </div>
  );
}

export default App;
