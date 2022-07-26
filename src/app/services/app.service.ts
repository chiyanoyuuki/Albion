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

  triggerFermetureFenetres() { console.log("Clic map"); this.clickMapSubject.next(); }
  listenTriggerFermetureFenetres() { return this.clickMapSubject.asObservable(); }

  getPersonnages() {return this.http.get(this.rootURL + '/personnages');}
}