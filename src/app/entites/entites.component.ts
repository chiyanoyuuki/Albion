import { Entite, Data, MenuContextuel, Lieu, ObjetInventaire, Position } from '../model';
import { Component, DoCheck, HostListener, Input, OnInit } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { PersoService } from '../services/perso.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-entites',
  templateUrl: './entites.component.html',
  styleUrls: ['./entites.component.scss']
})
export class EntitesComponent implements OnInit {

  @Input() data: Data;

  public menuContextuel: MenuContextuel | undefined;
  public persoMenuContextuel: Entite | undefined;
  public lastPersoClicked: Entite | undefined;
  public gain: string;
  public listenCloseMenuContextuel: any;

  constructor(private appService: AppService) { }
  ngOnInit(): void {
    this.listenCloseMenuContextuel = this.appService.listenCloseMenuContextuel().subscribe(() => {
      this.menuContextuel = undefined;
    })
  }

  public dragEnd($event: CdkDragEnd, perso: Entite) {
    let tmp = $event.source.getFreeDragPosition();
    perso.x = perso.x + tmp.x;
    perso.y = perso.y + tmp.y;
    $event.source._dragRef.reset();
  }

  public getEntitesPresentes() {
    let retour: Entite[] = this.data.entites.filter((entite: Entite) => entite.lieu == this.data.lieuActuel.id);
    let familiersactifs: Entite[] = retour.filter((entite: Entite) => entite.team == 0 && entite.statutFamilier == 'affiche');
    familiersactifs.forEach((entite: Entite) => retour.push(entite.familier));
    return retour;
  }

  clicDroit(event: MouseEvent, perso: Entite) {
    if (this.menuContextuel == undefined) {
      this.appService.closeMenuContextuel(true);
      this.persoMenuContextuel = perso;
      this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "entite" };
    }
    else {
      this.persoMenuContextuel = undefined;
      this.menuContextuel = undefined;
    }
  }
}
