import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit, OnChanges {
  @Input() mailSelected: any;
  mailHtml: any;

  constructor(private sanitizer: DomSanitizer) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.sanitizeHTMLContent();
  }

  ngOnInit(): void {
  }

  sanitizeHTMLContent(){
    this.mailHtml = this.sanitizer.bypassSecurityTrustHtml(this.mailSelected?.html);           
  }

}
