
import { Router } from 'express';
import { MailsController } from '../controllers';

const MailsRouter = Router();

MailsRouter.post('/getAll', (req, res) => {
    const { body, query } = req;

    const mails = new MailsController({ ...body, query }, { res });
    return mails.getAllMails();
});

MailsRouter.post('/getById', (req, res) => {
    const { body, query } = req;

    const mails = new MailsController({ ...body, query }, { res });
    return mails.getEmailById();
});

export default MailsRouter;