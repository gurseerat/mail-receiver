import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebService } from './web.service';

interface IParams { 
  start: number, 
  limit: number 
}

@Injectable({
  providedIn: 'root'
})
export class MailService {

  getAllEmailsUrl = 'mail/getAll';
  getByMailIdUrl = 'mail/getById';
  private _mail$ = new BehaviorSubject<any>(undefined);

  constructor(
    private _webService: WebService
  ) { }

  getAllEmails(formData: any, params: IParams): any {
    return this._webService.post(formData, `${this.getAllEmailsUrl}?start=${params?.start}&limit=${params?.limit}`)
  }

  getMailById(formData: any, params: IParams): any {
    return this._webService.post(formData, `${this.getByMailIdUrl}?start=${params?.start}&limit=${params?.limit}`)
  }

  setMail(mail: any) {
    this._mail$.next(mail);
  }

  getMail() {
    return this._mail$.asObservable();
  }
}
