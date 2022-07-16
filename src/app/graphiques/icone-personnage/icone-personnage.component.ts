import { Component, Input, OnInit } from '@angular/core';
import { Entite } from '../../model';

@Component({
  selector: 'app-icone-personnage',
  templateUrl: './icone-personnage.component.html',
  styleUrls: ['./icone-personnage.component.scss']
})
export class IconePersonnageComponent implements OnInit {

  @Input() perso: Entite;
  @Input() selected: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
