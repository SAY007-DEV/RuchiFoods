import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredInvoices, saveStoredInvoices, getStoredCompanyDetails, saveStoredCompanyDetails } from '../utils/invoiceStore';

const InvoiceContext = createContext({
  invoices: [],
  companyDetails: {},
  addInvoice: () => {},
  deleteInvoice: () => {},
  getInvoiceById: () => {},
  saveCompanySettings: () => {},
});

export const useInvoices = () => useContext(InvoiceContext);

export default function InvoiceProvider({ children }) {
  // Initialize state from local storage
  const [invoices, setInvoices] = useState(getStoredInvoices());
  const [companyDetails, setCompanyDetails] = useState(getStoredCompanyDetails());

  // Save invoices to local storage whenever they change
  useEffect(() => {
    saveStoredInvoices(invoices);
  }, [invoices]);

  const addInvoice = (invoice) => {
    const newInvoice = { ...invoice, id: Date.now(), number: `INV-${(invoices.length + 1).toString().padStart(3, '0')}` };
    setInvoices([...invoices, newInvoice]);
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const getInvoiceById = (id) => invoices.find(inv => inv.id === id);

  const saveCompanySettings = (details) => {
    setCompanyDetails(details);
    saveStoredCompanyDetails(details);
  };

  return (
    <InvoiceContext.Provider value={{ invoices, companyDetails, addInvoice, deleteInvoice, getInvoiceById, saveCompanySettings }}>
      {children}
    </InvoiceContext.Provider>
  );
}