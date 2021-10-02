
import { Router } from 'express';
import { MailsController } from '../controllers';
import { authenticate } from '../middlewares/auth.middleware';

const MailsRouter = Router();

MailsRouter.post('/login', authenticate, (req, res) => {
    const { body, query } = req;

    const mails = new MailsController({ ...body, query }, { res });
    return mails.getAllMails();
});

MailsRouter.post('/getAll', (req, res) => {
    const { body, query, cookies: { secureCookie } } = req;
    const cookieData = JSON.parse(secureCookie);

    const mails = new MailsController({ ...body, query, ...cookieData }, { res });
    return mails.getAllMails();
});

MailsRouter.post('/getById', (req, res) => {
    const { body, query, cookies: { secureCookie } } = req;
    const cookieData = JSON.parse(secureCookie);

    const mails = new MailsController({ ...body, query, ...cookieData }, { res });
    return mails.getEmailById();
});

export default MailsRouter;