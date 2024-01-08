import React from 'react';
import jsPDF from 'jspdf';

const OrderManagementPage = ({ orders, onSaveOrder, onEditOrder }) => {

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

  const handleEdit = (index) => {
    onEditOrder(index);
  };

  return (
    <div className="OrderManagementPage">
      <h1>Auftragsverwaltung</h1>

      <button onClick={handleExportToPDF} style={{ marginBottom: '20px' }}>Aufträge als PDF exportieren</button>

      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>Auftragsnummer: {order.orderNumber}</h3>
            <p>Kundenname: {order.customerName}</p>
            <button onClick={() => handleEdit(index)}>Bearbeiten</button>
          </div>
        ))
      ) : (
        <p>Keine Aufträge gefunden.</p>
      )}
    </div>
  );
}

export default OrderManagementPage;
