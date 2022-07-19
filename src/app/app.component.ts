import { Component, OnInit } from '@angular/core';
import { Entite, Lieu } from './model';
import DATA from '../assets/data.json';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public data: any = DATA;

  constructor(private appService: AppService) {
    this.appService.getPersonnages().subscribe(res => console.log(res));
  }

  ngOnInit() {
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
    document.oncontextmenu = function () {
      return false;
    }

    console.log(this.data);
    //Verifications
  }
}