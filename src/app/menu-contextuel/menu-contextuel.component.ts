import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addEntity, Data, Entite, Etape, Lieu, MenuContextuel, ObjetInventaire, pnjQuete, Position, Quete } from '../model';
import { of } from 'rxjs';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { PersoService } from '../services/perso.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-menu-contextuel',
  templateUrl: './menu-contextuel.component.html',
  styleUrls: ['./menu-contextuel.component.scss']
})

export class MenuContextuelComponent implements OnInit {

  @Input() data: Data;
  @Input() menu: MenuContextuel;
  @Input() perso: Entite;

  private setting = { element: { dynamicDownload: null as unknown as HTMLElement } }
  public x: number;
  public y: number;
  public fenetre: string = "";
  public delete: string = "Supprimer";
  public quete: boolean = false;
  public nbrQuetes: number;
  public focusQuete: Quete | undefined;
  public queteAccepter: string;
  public quetes: Quete[];

  constructor(private appService: AppService, private persoService: PersoService) { }

  ngOnInit(): void {
    this.x = this.menu.x;
    this.y = this.menu.y;
  }

  peutDonnerQuetes() {
    let resultat = this.persoService.peutDonnerQuetes(this.data, this.perso);
    this.quetes = resultat;
    this.nbrQuetes = this.quetes.length;
    return this.nbrQuetes > 0;
  }

  cdkDragEnded($event: CdkDragEnd) {
    let tmp = $event.source.getFreeDragPosition();
    this.x = this.x + tmp.x;
    this.y = this.y + tmp.y;
    $event.source._dragRef.reset();
  }

  openWindow(fenetre: string) {
    this.fenetre = fenetre;
    this.x = 200;
    this.y = 200;
    if (this.menu.type == "entite") {
      this.x = this.x - this.perso.x;
      this.y = this.y - this.perso.y;
    }
  }

  deletion() {
    if (this.delete == "Supprimer") { this.delete = "Confirmer suppression"; }
    else { this.data.entites.splice(this.data.entites.indexOf(this.perso), 1); }
  }

  close() { this.appService.closeMenuContextuel(false); }

  clickLierFamilier() {
    if (this.perso.statutFamilier == 'lie') { this.perso.statutFamilier = '' }
    else {
      this.perso.statutFamilier = 'lie'
    }
    this.close();
  }

  clickAfficherFamilier() {
    if (this.perso.statutFamilier == 'affiche') { this.perso.statutFamilier = '' }
    else {
      this.perso.familier.x = this.perso.x + 50;
      this.perso.familier.y = this.perso.y;
      this.perso.statutFamilier = 'affiche'
    }
    this.close();
  }

  repos() {
    let persosTeam = this.data.entites.filter((entite: Entite) => entite.joueur);
    persosTeam.forEach((perso: Entite) => {
      perso.pdv = perso.pdvmax;
      perso.mana = perso.manamax
    });
    this.data.repos.lance = true;
    setTimeout(() => {
      this.data.repos.animation = true;
      setTimeout(() => {
        this.data.repos.stop = true;
        setTimeout(() => {
          this.data.repos.stop = false;
          this.data.repos.animation = false;
          this.data.repos.lance = false;
        }, 1000);
      }, 4000);
    }, 1000);
  }
  //SAUVEGARDE

  public sauvegarde() {
    this.fakeValidateUserData().subscribe((res: any) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'AlbionSave.json',
        text: JSON.stringify(res)
      });
    });
  }

  private fakeValidateUserData() {
    let sauvegarde = JSON.stringify(this.data);
    return of(sauvegarde);
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }
}