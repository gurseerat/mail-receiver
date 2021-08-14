import { MailService } from "../services/mail.service";
import { BaseController } from "./base.controller";

export class MailsController extends BaseController {
  async getAllMails() {
    try {
      const { data } = this;
      data.fetchOptions = 'HEADER';
      const mailService = await new MailService();
      mailService.connectToInbox(data).then((res: any) => {
        const emailStream = res;
        this.handleSuccess(200, { data: emailStream, message: 'Successfully fetched all emails'})
      }).catch((err) => {
        this.handleError(406, { message: err.message, error: err.stack })
      });
      
    } catch(error) {
      this.handleError(500, { message: error.message, error: error })
    }
  }

  getEmailById() {
    try {
      const { data } = this;
      data.fetchOptions = '';

      const mailService = new MailService();
      mailService.connectToInbox(data).then((res: any) => {
        const emailStream = res;
        this.handleSuccess(200, { data: emailStream, message: 'Successfully fetched all emails'})
      }).catch((err) => {
        this.handleError(406, { message: err.message, error: err.stack })
      });

    } catch(error) {
      console.log(error)
      this.handleError(500, { message: error.message, error: error })
    }
  }
}