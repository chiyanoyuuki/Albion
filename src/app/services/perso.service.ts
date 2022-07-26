import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersoService {

  constructor() {}
  private clickInfosPersosSubject = new Subject<void>();

  clickInfosPersos() { this.clickInfosPersosSubject.next(); }
  listenClickInfosPersos() { return this.clickInfosPersosSubject.asObservable(); }

}