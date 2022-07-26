import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  private subject = new Subject<void>();

  clickMap() { this.subject.next(); }
  listenClickMap() { return this.subject.asObservable(); }

  getPersonnages() {
    return this.http.get(this.rootURL + '/personnages');
  }


}