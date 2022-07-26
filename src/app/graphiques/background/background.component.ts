import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Data, Lieu } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() data: Data;

  public cataclysme: boolean;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
  }

  @HostListener('window:keyup', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key == "F8") {
      this.cataclysme = !this.cataclysme;
      let map = this.data.lieux.find((lieu: Lieu) => lieu.id == "map");
      if (map) {
        map.image = "map2";
        if (this.data.lieuActuel.id == "map") {
          this.data.lieuActuel.image = "map2";
        }
      }
      let campdesaventuriers = this.data.lieux.find((lieu: Lieu) => lieu.id == "campdesaventuriers");
      if (campdesaventuriers) {
        campdesaventuriers.parent = "map";
      }
    }
  }

  clickRetour() {
    this.appService.triggerFermetureFenetres();
    let lieutmp = this.data.lieux.find((lieu: Lieu) => lieu.id == this.data.lieuActuel.parent);
    if (lieutmp) { this.data.lieuActuel = lieutmp; }
  }

}
