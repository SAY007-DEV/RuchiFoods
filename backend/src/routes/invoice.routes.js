import { Router } from 'express';
import {
  createInvoice,
  getInvoices,
  deleteInvoice,
  updateStatus
} from '../controllers/invoice.controller.js';

const router = Router();

router.post('/', createInvoice);
router.get('/', getInvoices);
router.delete('/:id', deleteInvoice);
router.patch('/:id/status', updateStatus);

export default router;
