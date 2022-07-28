import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addEntity, Data, Entite, Etape, Lieu, MenuContextuel, ObjetInventaire, Position, Quete } from '../model';
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

  public fenetre: string = "";
  public objetSelected: ObjetInventaire;
  public monsterLevelSelected: { niveau: number, pdvmax: number, manamax: number } | undefined = undefined;
  public delete: string = "Supprimer";

  public alphabet: string[];
  public focus: Entite | undefined;
  public objetFocus: ObjetInventaire | undefined;
  public add: boolean = false;

  //Inputs
  public input1: string = "1";
  public input2: string = "1";
  public input3: string = "1";

  //Admin add item / loot
  public choixTypeObjet = "Ajouter un loot";
  public addObjet: boolean = false;
  public emplacements: string[] = ["Tête", "Torse", "Gants", "Jambes", "Bottes", "Arme", "Utilitaire", "Collier", "Epaulieres", "Ceinture", "Anneau"];
  public emplacementSelected: string = "";
  public letterSelected: string = "";

  //Modifier Map
  public modifMap: boolean;

  // quetes
  public nbrQuetes: number;
  public quetesEnCours: Quete[];

  constructor(private persoService: PersoService, private appService: AppService) { }

  ngOnInit(): void {
    this.data.quetes.forEach((quete:Quete)=> {
      console.log(quete.etapeEnCours.pnj);
    });
    this.quetesEnCours = this.data.quetes.filter((quete: Quete) =>
      quete.etapeEnCours.pnj == this.perso.nom
    );
    this.nbrQuetes = this.quetesEnCours.length;
    console.log(this.quetesEnCours, this.perso.nom);
  }

  deletion() {
    if (this.delete == "Supprimer") { this.delete = "Confirmer suppression"; }
    else { this.data.entites.splice(this.data.entites.indexOf(this.perso), 1); }
  }

  close() { this.appService.closeMenuContextuel(); }

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
      if (this.data.lieuActuel.id == 'map') {
        this.perso.familier.x = this.perso.x + 50;
        this.perso.familier.y = this.perso.y;
      }
      else {
        this.perso.familier.x = this.perso.x + 50;
        this.perso.familier.y = this.perso.y;
      }
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