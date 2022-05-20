import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Entite, Familier } from '../model';

@Component({
  selector: 'app-bande-unite',
  templateUrl: './bande-unite.component.html',
  styleUrls: ['./bande-unite.component.scss']
})
export class BandeUniteComponent implements OnInit {
  
  @Input() entity: Entite;
  public familier? : Familier;
  
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    const familier = this.entity.familier;
    if(familier!==undefined)
    {
      this.familier = this.dataService.getFamilier(familier);
    }
  }

}
