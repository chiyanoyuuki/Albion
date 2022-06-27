import { Component, Input, OnInit } from '@angular/core';
import { Entite } from 'src/app/model';

@Component({
  selector: 'app-infos-entite',
  templateUrl: './infos-entite.component.html',
  styleUrls: ['./infos-entite.component.scss']
})
export class InfosEntiteComponent implements OnInit {
  @Input() perso: Entite;
  @Input() type: string;

  constructor() { }

  ngOnInit(): void {
  }

}
