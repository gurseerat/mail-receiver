import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ConnectionComponent } from './connection/connection.component';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailViewComponent } from './email-view/email-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Globals } from './app.globals';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ConnectionFormComponent } from './connection-form/connection-form.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { CredentialInterceptor } from './services/credential.interceptor';
 
const routes: Routes = [
  { path: '', component: ConnectionComponent },
  { path: 'inbox', component: EmailListComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    EmailListComponent,
    EmailViewComponent,
    ConnectionFormComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToasterModule.forRoot(),
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LayoutModule
  ],
  providers: [
    Globals,
    { provide: HTTP_INTERCEPTORS, useClass: CredentialInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
