import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e) => setValue(e.target.value);
  return {
    value,
    onChange: handleChange
  };
};

const OrderForm = ({ onSaveOrder, editOrder, availableEmployees }) => {
  const orderNumber = useFormInput("");
  const customerName = useFormInput("");
  const purchaseOrderNumber = useFormInput("");
  const [employees, setEmployees] = useState([]);
  const [workDetails, setWorkDetails] = useState({});
  const workDescriptions = useFormInput("");
  const materials = useFormInput("");
  const signatureRef = useRef(null);

  useEffect(() => {
    if (editOrder) {
      orderNumber.onChange({ target: { value: editOrder.orderNumber } });
      customerName.onChange({ target: { value: editOrder.customerName } });
      purchaseOrderNumber.onChange({ target: { value: editOrder.purchaseOrderNumber } });
      setEmployees(editOrder.employees || []);
      setWorkDetails(editOrder.workDetails || {});
      workDescriptions.onChange({ target: { value: editOrder.workDescriptions || "" } });
      materials.onChange({ target: { value: editOrder.materials || "" } });
    }
  }, [editOrder]);

  const handleAddWorkDay = (employee) => {
    setWorkDetails(prev => ({
      ...prev,
      [employee]: [
        ...(prev[employee] || []),
        { date: '', hours: '' }
      ]
    }));
  };

  const handleRemoveWorkDay = (employee, index) => {
    setWorkDetails(prev => {
      const updatedEmployeeDetails = [...prev[employee]];
      updatedEmployeeDetails.splice(index, 1);
      return {
        ...prev,
        [employee]: updatedEmployeeDetails
      };
    });
  };

  const handleWorkDetailChange = (employee, index, field, value) => {
    setWorkDetails(prev => {
      const updatedEmployeeDetails = [...prev[employee]];
      updatedEmployeeDetails[index] = {
        ...updatedEmployeeDetails[index],
        [field]: value
      };
      return {
        ...prev,
        [employee]: updatedEmployeeDetails
      };
    });
  };

  const handleSaveOrder = (e) => {
    e.preventDefault();
    const updatedOrder = {
      orderNumber: orderNumber.value,
      customerName: customerName.value,
      purchaseOrderNumber: purchaseOrderNumber.value,
      employees,
      workDetails,
      workDescriptions: workDescriptions.value,
      materials: materials.value
    };
    onSaveOrder(updatedOrder);
  };

  const handleGeneratePDF = () => {
    html2canvas(signatureRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      pdf.text(`Auftragsnummer: ${orderNumber.value}`, 10, 10);
      pdf.text(`Kundenname: ${customerName.value}`, 10, 20);
      pdf.text(`Bestellnummer: ${purchaseOrderNumber.value}`, 10, 30);

      employees.forEach((employee, index) => {
        pdf.text(`Mitarbeiter ${index + 1}: ${employee}`, 10, 40 + index * 10);
        pdf.text(`Datum: ${workDetails[employee]?.date || 'N/A'}, Arbeitsstunden: ${workDetails[employee]?.hours || 'N/A'}`, 10, 50 + index * 10);
      });

      pdf.text(`Arbeitserledigung: ${workDescriptions.value}`, 10, 60 + employees.length * 10);
      pdf.text(`Material: ${materials.value}`, 10, 70 + employees.length * 10);

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
          <input type="text" {...orderNumber} />
        </label>
        <br />
        <label>
          Kundenname:
          <input type="text" {...customerName} />
        </label>
        <br />
        <label>
          Bestellnummer:
          <input type="text" {...purchaseOrderNumber} />
        </label>
        <br />
        <label>
          Mitarbeiter:
          <select multiple value={employees} onChange={(e) => setEmployees(Array.from(e.target.selectedOptions, option => option.value))}>
            {availableEmployees.map((employee, index) => (
              <option key={index} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </label>
        <br />
        {employees.map((employee) => (
          <div key={employee}>
            <h3>{employee}</h3>
            {workDetails[employee]?.map((detail, index) => (
              <div key={index}>
                <label>
                  Datum:
                  <input type="date" value={detail.date || ''} onChange={(e) => handleWorkDetailChange(employee, index, 'date', e.target.value)} />
                </label>
                <label>
                  Arbeitsstunden:
                  <input type="number" value={detail.hours || ''} onChange={(e) => handleWorkDetailChange(employee, index, 'hours', e.target.value)} />
                </label>
                <button type="button" onClick={() => handleRemoveWorkDay(employee, index)}>Tag entfernen</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddWorkDay(employee)}>Weiteren Tag hinzufügen</button>
          </div>
        ))}
        <br />
        <div ref={signatureRef} style={{ border: '1px solid black', width: '120px', height: '50px' }}>
          Unterschriftsfeld
        </div>
        <br />
        <label>
          Arbeiten:
          <textarea {...workDescriptions} rows={4} cols={50} placeholder="Beschreibung der erledigten Arbeiten für den gesamten Auftrag" />
        </label>
        <br />
        <label>
          Material:
          <textarea {...materials} rows={4} cols={50} placeholder="Erfassung des verwendeten Materials" />
        </label>
        <br />
        <button type="submit">Speichern</button>
        <button type="button" onClick={handleGeneratePDF}>PDF generieren</button>
      </form>
    </div>
  );
}

export default OrderForm;
