import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('src/data/invoices.json');

export const readData = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
};

export const writeData = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
