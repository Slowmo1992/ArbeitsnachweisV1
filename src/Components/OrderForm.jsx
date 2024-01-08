import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderForm = ({ onSaveOrder, editOrder, availableEmployees }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [employees, setEmployees] = useState([]);
  const [workDetails, setWorkDetails] = useState({});
  const [workDescriptions, setWorkDescriptions] = useState('');
  const [materials, setMaterials] = useState('');
  const [employeeNames, setEmployeeNames] = useState([]);
  const signatureRef = useRef(null);

  useEffect(() => {
    setEmployeeNames(availableEmployees);
  }, [availableEmployees]);

  useEffect(() => {
    if (editOrder) {
      setOrderNumber(editOrder.orderNumber || '');
      setCustomerName(editOrder.customerName || '');
      setPurchaseOrderNumber(editOrder.purchaseOrderNumber || '');
      setEmployees(editOrder.employees || []);
      setWorkDetails(editOrder.workDetails || {});
      setWorkDescriptions(editOrder.workDescriptions || '');
      setMaterials(editOrder.materials || '');
    }
  }, [editOrder]);

  const handleAddEmployee = () => {
    const selectedEmployees = Array.from(document.getElementById("employeeSelect").selectedOptions).map(option => option.value);
    setEmployees(prevEmployees => [...prevEmployees, ...selectedEmployees]);
    setWorkDetails(prevDetails => {
      const updatedDetails = { ...prevDetails };
      selectedEmployees.forEach(employee => {
        if (!updatedDetails[employee]) {
          updatedDetails[employee] = {};
        }
      });
      return updatedDetails;
    });
    setEmployeeNames(prevNames => prevNames.filter(name => !selectedEmployees.includes(name)));
  };

  const handleDeleteEmployee = (employee) => {
    const isConfirmed = window.confirm(`Sind Sie sicher, dass Sie den Mitarbeiter "${employee}" löschen möchten?`);
    if (isConfirmed) {
      setEmployees(prevEmployees => prevEmployees.filter(e => e !== employee));
      setWorkDetails(prevDetails => {
        const updatedDetails = { ...prevDetails };
        delete updatedDetails[employee];
        return updatedDetails;
      });
      setEmployeeNames(prevNames => [...prevNames, employee]);
    }
  };

  const handleAddWorkDetail = (employee, date, hours) => {
    setWorkDetails(prevDetails => ({
      ...prevDetails,
      [employee]: {
        ...prevDetails[employee],
        [date]: hours
      }
    }));
  };

  const handleDeleteWorkDetail = (employee, date) => {
    setWorkDetails(prevDetails => {
      const updatedDetails = { ...prevDetails };
      if (updatedDetails[employee]) {
        delete updatedDetails[employee][date];
      }
      return updatedDetails;
    });
  };

  const handleSaveOrder = (e) => {
    e.preventDefault();
    const orderData = {
      orderNumber,
      customerName,
      purchaseOrderNumber,
      employees,
      workDetails,
      workDescriptions,
      materials
    };
    onSaveOrder(orderData);
  };

  const handleGeneratePDF = () => {
    html2canvas(signatureRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.text(`Auftragsnummer: ${orderNumber}`, 10, 10);
      pdf.text(`Kundenname: ${customerName}`, 10, 20);
      pdf.text(`Bestellnummer: ${purchaseOrderNumber}`, 10, 30);
      employees.forEach((employee, index) => {
        pdf.text(`Mitarbeiter ${index + 1}: ${employee}`, 10, 40 + index * 10);
        Object.entries(workDetails[employee] || {}).forEach(([date, hours], subIndex) => {
          pdf.text(`Datum: ${date}, Stunden: ${hours}`, 10, 50 + (index * 10) + (subIndex * 5));
        });
      });
      pdf.text(`Arbeitserledigung: ${workDescriptions}`, 10, 60 + employees.length * 10);
      pdf.text(`Material: ${materials}`, 10, 70 + employees.length * 10);
      pdf.addImage(imgData, 'PNG', 10, 80 + employees.length * 10, 100, 40);
      pdf.save('Auftrag_mit_Unterschrift.pdf');
    });
  };

  return (
    <div>
      <h2>Auftragsformular</h2>
      <form onSubmit={handleSaveOrder}>
        <label>
          Auftragsnummer:
          <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        </label>
        <br />
        <label>
          Kundenname:
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </label>
        <br />
        <label>
          Bestellnummer:
          <input type="text" value={purchaseOrderNumber} onChange={(e) => setPurchaseOrderNumber(e.target.value)} />
        </label>
        <br />
        <label>
          Mitarbeiter:
          <select id="employeeSelect" multiple>
            {employeeNames.map((employee, index) => (
              <option key={index} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleAddEmployee}>Mitarbeiter hinzufügen</button>

        {employees.map(employee => (
          <div key={employee}>
            <h3>{employee}</h3>
            {Object.entries(workDetails[employee] || {}).map(([date, hours], index) => (
              <div key={index}>
                <label>
                  Datum: {date}
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => handleAddWorkDetail(employee, date, e.target.value)}
                  />
                  Stunden
                </label>
                <button onClick={() => handleDeleteWorkDetail(employee, date)}>Löschen</button>
              </div>
            ))}
            <div>
              <label>
                Datum:
                <input
                  type="date"
                  onChange={(e) => {
                    const date = e.target.value;
                    if (!workDetails[employee]?.[date]) {
                      handleAddWorkDetail(employee, date, '');
                    }
                  }}
                />
              </label>
            </div>
            <button onClick={() => handleDeleteEmployee(employee)}>Mitarbeiter löschen</button>
          </div>
        ))}

        <label>
          Arbeitserledigung:
          <textarea value={workDescriptions} onChange={(e) => setWorkDescriptions(e.target.value)} />
        </label>
        <br />
        <label>
          Material:
          <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} />
        </label>
        <br />
        <div ref={signatureRef}>
          Unterschriftsfeld
        </div>
        <br />
        <button type="submit">Speichern</button>
        <button type="button" onClick={handleGeneratePDF}>PDF generieren</button>
      </form>
    </div>
  );
}

export default OrderForm;
