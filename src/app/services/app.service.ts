import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  private clickMapSubject = new Subject<void>();

  clickMap() { this.clickMapSubject.next(); }
  listenClickMap() { return this.clickMapSubject.asObservable(); }

  getPersonnages() {
    return this.http.get(this.rootURL + '/personnages');
  }


}