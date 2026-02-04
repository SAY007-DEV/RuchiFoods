import Client from '../models/client.model.js';

export const createClient = async (clientData) => {
  return Client.create(clientData);
};

export const fetchClients = async () => {
  return Client.find().sort({ createdAt: -1 });
};

export const updateClientById = async (id, data) => {
  return Client.findByIdAndUpdate(id, data, { new: true });
};

export const deleteClientById = async (id) => {
  return Client.findByIdAndDelete(id);
};
