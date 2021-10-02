import { Router } from 'express';
import MailsRouter from './mails.route';

const routes = Router();

routes.use('/mail', MailsRouter);

export default routes;