import React, { useState, useRef } from 'react';
import OrderForm from './Components/OrderForm';
import jsPDF from 'jspdf';

function App() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);  // Speichert den Index des zu bearbeitenden Auftrags
  const pdfRef = useRef(null);

  const handleSaveOrder = (newOrder) => {
    if (editIndex !== null) {
      const updatedOrders = [...orders];
      updatedOrders[editIndex] = newOrder;
      setOrders(updatedOrders);
      setEditIndex(null);  // Zurücksetzen des Edit-Index nach der Bearbeitung
    } else {
      setOrders([...orders, newOrder]);
    }
  };

  const handleEditOrder = (index) => {
    setEditIndex(index);
  };

  const handleExportToPDF = () => {
    // ... (unverändert)
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.includes(searchTerm) || order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Auftragsverwaltung</h1>

      <input 
        type="text" 
        placeholder="Suche nach Auftragsnummer oder Kundenname..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: '20px' }}
      />

      <OrderForm onSaveOrder={handleSaveOrder} editOrder={editIndex !== null ? filteredOrders[editIndex] : null} />

      {/* Anzeigen der gefilterten Aufträge */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>Auftragsnummer: {order.orderNumber}</h3>
            <p>Kundenname: {order.customerName}</p>
            <button onClick={() => handleEditOrder(index)}>Bearbeiten</button> {/* Bearbeiten-Button */}
          </div>
        ))
      ) : (
        <p>Keine Aufträge gefunden.</p>
      )}

      {/* Button zum Exportieren der Aufträge als PDF */}
      <button onClick={handleExportToPDF} style={{ marginTop: '20px' }}>Aufträge als PDF exportieren</button>
    </div>
  );
}

export default App;
