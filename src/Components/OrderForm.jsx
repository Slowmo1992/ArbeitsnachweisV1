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

const OrderForm = ({ onSaveOrder, editOrder }) => {
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

    const handleWorkDetailChange = (employee, field, value) => {
        setWorkDetails(prev => ({
            ...prev,
            [employee]: {
                ...prev[employee],
                [field]: value
            }
        }));
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

        html2canvas(signatureRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 100, 40);
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
                        <option value="Mitarbeiter 1">Mitarbeiter 1</option>
                        <option value="Mitarbeiter 2">Mitarbeiter 2</option>
                        <option value="Mitarbeiter 3">Mitarbeiter 3</option>
                    </select>
                </label>
                <br />
                {employees.map((employee) => (
                    <div key={employee}>
                        <h3>{employee}</h3>
                        <label>
                            Datum:
                            <input type="date" value={workDetails[employee]?.date || ''} onChange={(e) => handleWorkDetailChange(employee, 'date', e.target.value)} />
                        </label>
                        <label>
                            Arbeitsstunden:
                            <input type="number" value={workDetails[employee]?.hours || ''} onChange={(e) => handleWorkDetailChange(employee, 'hours', e.target.value)} />
                        </label>
                    </div>
                ))}
                <br />
                <div ref={signatureRef} style={{ border: '1px solid black', width: '200px', height: '100px' }}>
                    Unterschriftsfeld
                </div>
                <br />
                <label>
                    Arbeitserledigung (für den gesamten Auftrag):
                    <textarea {...workDescriptions} rows={4} cols={50} placeholder="Beschreibung der erledigten Arbeiten für den gesamten Auftrag" />
                </label>
                <br />
                <label>
                    Material:
                    <textarea {...materials} rows={4} cols={50} placeholder="Erfassung des verwendeten Materials" />
                </label>
                <br />
                <button type="submit">Auftrag speichern und PDF generieren</button>
            </form>
        </div>
    );
}

export default OrderForm;
