import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Globals } from '../app.globals';
import { IResponse } from '../interfaces/response.interface';
import { MailService } from '../services/mail.service';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent implements OnInit {
  form: FormGroup;
  encryptions: any[] = [];
  submitted: boolean = false;
  mailData: any[] = [];
  @Input() isEdit$: boolean = false;
  @Output() newConnection = new EventEmitter<any>();
  servers: any[] = this._globals.SERVER_TYPES;

  constructor(
    private _fb: FormBuilder, 
    private _globals: Globals,
    private mailService: MailService,
    private toasterService: ToasterService,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) {
    this.form = this._fb.group({
      serverType: [null, [Validators.required]],
      server: [null, [Validators.required]],
      port: [null, [Validators.required]],
      encryption: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
   }

  ngOnInit(): void {
    if(this.isEdit$) {
      const mailConn = JSON.parse(localStorage.getItem('_mailForm') || '');
      this.form.patchValue(mailConn);
    }
  }

  get f() { 
    return this.form.controls; 
  }

  startReceivingMails() {
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }
    // start loader
    this.ngxService.start();
    let start: number = 1;
    let limit: number = 9;
  
    const params = { start, limit }
    this.mailService.login(this.form.value, params).subscribe(({data, success, message}: IResponse) => {
      if(success) {
        this.mailData = data;
        this.mailService.setMail(this.mailData);
        this.form.value.draw = 1;
        localStorage.setItem('_mailForm', JSON.stringify({ draw: this.form.value.draw }));
        this.newConnection.emit(true)
        this.ngxService.stop();
        this.router.navigate(['/inbox'])
      } else {
        this.toasterService.pop('error', 'Error', 'Failed to load emails');
      }
    }, (error: any) => {
      this.ngxService.stop();
      this.mailData = [];
      this.toasterService.pop('error', 'Error', error);
    })
  }

  onServerSelectedHandler(event: Event) {
    const server = (event?.target as HTMLInputElement)?.value;
    this.encryptions = this.servers.find(ele => ele.value === server)?.encryptions;
    this.form.patchValue({ port: null });
  }

  onEncryptionSelectedHandler(event: Event) {
    const encryption = (event?.target as HTMLInputElement)?.value;
    const port: Number = this.encryptions.find(ele => ele.value === encryption)?.port;
    this.form.patchValue({ port: port });
  }

}
