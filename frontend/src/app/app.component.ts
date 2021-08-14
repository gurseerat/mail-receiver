import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  public config: ToasterConfig =
    new ToasterConfig({
      positionClass: 'toast-top-center',
      tapToDismiss: false,
      limit: 1,
    })
}
