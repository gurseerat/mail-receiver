import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConnectionFormComponent } from '../connection-form/connection-form.component';
import { ConnectionComponent } from '../connection/connection.component';
import { IResponse } from '../interfaces/response.interface';
import { MailService } from '../services/mail.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
})
export class EmailListComponent implements OnInit, OnChanges {
  mailData: any;
  mailSelected: any;
  toggleSideBarActive: boolean = true;
  isMobile: boolean = false;
  connectionRef!: NgbModalRef;
  start: number = 1;
  limit: number = 9;
  mailConn: any;

  constructor(
    private observer: BreakpointObserver,
    private _modalService: NgbModal,
    private mailService: MailService,
    private toasterService: ToasterService,
    private ngxService: NgxUiLoaderService
  ) {
    // Responsive sidebar design
    this.observer.observe(['(max-width: 500px)']).subscribe((res: any) => {
      if (res.matches) {
        this.toggleSideBarActive = true;
        this.isMobile = true;
      } else {
        this.toggleSideBarActive = true;
        this.isMobile = false;
      }
    });
    this.mailConn = JSON.parse(localStorage.getItem('_mailForm') || '');

  }

  ngOnInit(): void {
    this.mailService.getMail().subscribe((res: any) => {
      if (res) {
        this.mailData = res;
      } else {
        this.start = (this.mailConn?.draw - 1) * 10 + 1 || 1;
        this.limit = 9;
        this.fetchEmails();
      }
    });
  }

  mailSelectedHandler(mail: any) {
    const params = {
      start: mail?.seqNo,
      limit: 0,
    };
    this.ngxService.start();

    this.mailService.getMailById(this.mailConn, params).subscribe(({data, success, message}: IResponse) => {
      if(success) {
        this.mailSelected = data?.messages[0];
        if(this.isMobile) {
          this.toggleSideBarActive = false;
        }
        this.ngxService.stop();

      } else {
        this.toasterService.pop('error', 'Error', 'Failed to load email');
      }
    },
    (error: any) => {
      this.ngxService.stop();
      this.mailSelected = null;
      this.toasterService.pop('error', 'Error', error);
    });
  }

  toggleSideBar() {
    this.toggleSideBarActive = !this.toggleSideBarActive;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mailSelected = null;
  }

  editConnectionHandler() {
    const options: NgbModalOptions = {
      centered: true,
      size: 'md',
    };

    this.connectionRef = this._modalService.open(
      ConnectionFormComponent,
      options
    );
    this.connectionRef.componentInstance.isEdit$ = true;
    this.connectionRef.componentInstance.newConnection.subscribe((res: boolean) => {
      if(res) {
        this.mailSelected = null;
        this.mailConn = JSON.parse(localStorage.getItem('_mailForm') || '');
        this._modalService.dismissAll();
      }
    })
  }

  drawHandler(newDraw: number) {
    this.start = (newDraw - 1)* 10 + 1;
    this.fetchEmails(newDraw);
  }

  fetchEmails(newDraw?: number) {
    this.ngxService.start();
    const params = {
      start: this.start,
      limit: this.limit,
    };
    this.mailService.getAllEmails(this.mailConn, params).subscribe(
      ({ data, success, message }: IResponse) => {
        if (success) {
          this.mailData = data;
          this.mailService.setMail(this.mailData);
          this.mailConn.draw = newDraw || 1;
          localStorage.setItem('_mailForm', JSON.stringify(this.mailConn))
          this.ngxService.stop();
        } else {
          this.toasterService.pop('error', 'Error', 'Failed to load emails');
        }
      },
      (error: any) => {
        this.ngxService.stop();
        this.mailData = [];
        this.toasterService.pop('error', 'Error', error);
      }
    );
  }

  createEndTemplate() {
    return (this.start + this.mailData?.count - 1) > this.mailData?.totalCount ? this.mailData?.totalCount : (this.start + this.mailData?.count - 1) || 0
  }
}
