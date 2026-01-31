import { Router } from 'express';
import { createInvoice, getInvoices } from '../controllers/invoice.controller.js';

const router = Router();

router.post('/', createInvoice);
router.get('/', getInvoices);

export default router;
