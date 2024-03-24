import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  private clickMapSubject = new Subject<void>();
  private closeMenuContextuelSubject = new Subject<boolean>();

  triggerFermetureFenetres() {
    console.log("Fermeture des fenêtres");
    this.clickMapSubject.next();
    this.closeMenuContextuelSubject.next(false);
  }
  listenTriggerFermetureFenetres() { return this.clickMapSubject.asObservable(); }

  closeMenuContextuel(disableClickMap: boolean) {
    console.log("Fermeture du menu contextuel");
    this.closeMenuContextuelSubject.next(disableClickMap);
  }
  listenCloseMenuContextuel() { return this.closeMenuContextuelSubject.asObservable(); }

  //getPersonnages() {return this.http.get(this.rootURL + '/personnages');}
}