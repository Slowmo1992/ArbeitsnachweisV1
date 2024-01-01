import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderForm = ({ onSaveOrder, editOrder }) => {
    const [orderNumber, setOrderNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
    const [employees, setEmployees] = useState([]);
    const [workDetails, setWorkDetails] = useState({});
    const signatureRef = useRef(null);

    useEffect(() => {
        if (editOrder) {
            setOrderNumber(editOrder.orderNumber || "");
            setCustomerName(editOrder.customerName || "");
            setPurchaseOrderNumber(editOrder.purchaseOrderNumber || "");
            setEmployees(editOrder.employees || []);
            setWorkDetails(editOrder.workDetails || {});
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
        const updatedOrder = { orderNumber, customerName, purchaseOrderNumber, employees, workDetails };
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
                    <select multiple value={employees} onChange={(e) => setEmployees(Array.from(e.target.selectedOptions, option => option.value))}>
                        <option value="Mitarbeiter 1">Mitarbeiter 1</option>
                        <option value="Mitarbeiter 2">Mitarbeiter 2</option>
                        <option value="Mitarbeiter 3">Mitarbeiter 3</option>
                        {/* Fügen Sie hier weitere Mitarbeiter hinzu, falls benötigt */}
                    </select>
                </label>
                <br />
                {employees.map((employee) => (
                    <div key={employee}>
                        <h3>{employee}</h3>
                        <label>
                            Datum:
                            <input 
                                type="date" 
                                value={workDetails[employee]?.date || ''} 
                                onChange={(e) => handleWorkDetailChange(employee, 'date', e.target.value)} 
                            />
                        </label>
                        <label>
                            Arbeitsstunden:
                            <input 
                                type="number" 
                                value={workDetails[employee]?.hours || ''} 
                                onChange={(e) => handleWorkDetailChange(employee, 'hours', e.target.value)} 
                            />
                        </label>
                    </div>
                ))}
                <br />
                <div ref={signatureRef} style={{ border: '1px solid black', width: '200px', height: '100px' }}>
                    Unterschriftsfeld
                </div>
                <br />
                <button type="submit">Auftrag speichern und PDF generieren</button>
            </form>
        </div>
    );
}

export default OrderForm;
