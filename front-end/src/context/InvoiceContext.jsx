import React, { createContext, useContext, useState } from 'react';

const InvoiceContext = createContext();

export const useInvoices = () => useContext(InvoiceContext);

export default function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);

  const addInvoice = (invoice) => {
    const newInvoice = { ...invoice, id: Date.now(), number: `INV-${(invoices.length + 1).toString().padStart(3, '0')}` };
    setInvoices([...invoices, newInvoice]);
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const getInvoiceById = (id) => invoices.find(inv => inv.id === id);

  

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, deleteInvoice, getInvoiceById }}>
      {children}
    </InvoiceContext.Provider>
  );
}