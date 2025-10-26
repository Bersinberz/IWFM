// routes/alertRoutes.ts
import express from 'express';
import { getAlerts, sendAlertEmail } from '../controllers/alertController';

const router = express.Router();

router.get('/getall', getAlerts);
router.post('/:id/email', sendAlertEmail);

export default router;