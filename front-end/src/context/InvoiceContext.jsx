import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import {
  getStoredCompanyDetails,
  saveStoredCompanyDetails
} from '../utils/invoiceStore';

const InvoiceContext = createContext({
  invoices: [],
  clients: [],
  companyDetails: {},
  addInvoice: async () => {},
  deleteInvoice: async () => {},
  updateInvoiceStatus: async () => {},
  getInvoiceById: () => {},
  addClient: async () => {},
  updateClient: async () => {},
  deleteClient: async () => {},
  saveCompanySettings: () => {}
});

export const useInvoices = () => useContext(InvoiceContext);

export default function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(getStoredCompanyDetails());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invoiceRes, clientRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/clients')
        ]);
        setInvoices(invoiceRes.data?.data || []);
        setClients(clientRes.data?.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const addInvoice = async (invoice) => {
    const response = await api.post('/invoices', invoice);
    const saved = response.data?.data;
    if (saved) {
      setInvoices((prev) => [saved, ...prev]);
    }
    return saved;
  };

  const deleteInvoice = async (id) => {
    await api.delete(`/invoices/${id}`);
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const updateInvoiceStatus = async (id, paymentStatus) => {
    const response = await api.patch(`/invoices/${id}/status`, { paymentStatus });
    const updated = response.data?.data;
    if (updated) {
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
    }
    return updated;
  };

  const getInvoiceById = (id) => invoices.find((inv) => inv.id === id);

  const addClient = async (client) => {
    const response = await api.post('/clients', client);
    const saved = response.data?.data;
    if (saved) {
      setClients((prev) => [saved, ...prev]);
    }
    return saved;
  };

  const updateClient = async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    const updated = response.data?.data;
    if (updated) {
      setClients((prev) => prev.map((client) => (client.id === id ? updated : client)));
    }
    return updated;
  };

  const deleteClient = async (id) => {
    await api.delete(`/clients/${id}`);
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const saveCompanySettings = (details) => {
    setCompanyDetails(details);
    saveStoredCompanyDetails(details);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        clients,
        companyDetails,
        addInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        getInvoiceById,
        addClient,
        updateClient,
        deleteClient,
        saveCompanySettings
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}
