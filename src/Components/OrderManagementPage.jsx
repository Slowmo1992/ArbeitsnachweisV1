import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';

const OrderManagementPage = ({ orders, onSaveOrder, onEditOrder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const pdfRef = useRef(null);

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Auftragsliste", 10, 10);
    let yPos = 20;

    orders.forEach((order, index) => {
      doc.text(`Auftragsnummer: ${order.orderNumber}`, 10, yPos);
      doc.text(`Kundenname: ${order.customerName}`, 10, yPos + 10);
      yPos += 20;
    });

    doc.save("Auftragsliste.pdf");
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.includes(searchTerm) || order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="OrderManagementPage">
      <h1>Auftragsverwaltung</h1>

      <input 
        type="text" 
        placeholder="Suche nach Auftragsnummer oder Kundenname..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: '20px' }}
      />

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>Auftragsnummer: {order.orderNumber}</h3>
            <p>Kundenname: {order.customerName}</p>
            <button onClick={() => onEditOrder(index)}>Bearbeiten</button>
          </div>
        ))
      ) : (
        <p>Keine Aufträge gefunden.</p>
      )}

      <button onClick={handleExportToPDF} style={{ marginTop: '20px' }}>Aufträge als PDF exportieren</button>
    </div>
  );
}

export default OrderManagementPage;
