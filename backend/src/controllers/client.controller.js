import {
  createClient as createClientService,
  fetchClients,
  updateClientById,
  deleteClientById
} from '../services/client.service.js';

export const createClient = async (req, res) => {
  try {
    const client = await createClientService(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClients = async (_req, res) => {
  try {
    const clients = await fetchClients();
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const updated = await updateClientById(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const deleted = await deleteClientById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
