import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, HostBinding } from '@angular/core';
import { addEntity, Data, Entite, Lieu, MenuContextuel, ObjetInventaire, Position, Animation, Quete, Etape } from '../model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('etat0', style({ opacity: 0 })),
      state('etat1', style({ opacity: 1 })),
      transition('etat0 => etat1', [animate('1s')]),
      transition('etat1 => etat0', [animate('1s')]),
    ]),
  ]
})
export class MapComponent implements OnInit {

  @Input() data: Data;

  public mapHeight: number;
  public image: HTMLImageElement;
  public oiseaux: boolean;
  public menuContextuel: MenuContextuel | undefined;

  public windowWidth: number = 1920;
  public windowHeight: number;
  public cataclysme: boolean;

  constructor(private appService: AppService) { }

  @HostListener('window:keyup', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key == "F1") { this.data.admin = !this.data.admin; }
  }


  ngOnInit(): void {
    /*this.image = document.getElementById("map") as HTMLImageElement;
    this.image.onload = function() {
      this.mapHeight = this.image.height;
    }*/
    //this.getAnimation();
  }

  getAnimation() {
    let nbrRandom = Math.ceil(Math.random() * 50000);

    this.oiseaux = false
    setTimeout(() => {
      this.oiseaux = true
      setTimeout(() => {
        this.oiseaux = false
        this.getAnimation();
      }, 6000);
    }, nbrRandom);
  }

  clicMap(event: MouseEvent) {
    this.appService.clickMap();
    this.menuContextuel = undefined;
    if (this.data.admin) { console.log("MouseX : " + event.offsetX); }
    if (this.data.admin) { console.log("MouseY : " + event.offsetY); }
  }



  clicDroitMap(event: MouseEvent) {
    this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "map" };
  }

  //AUTRE=========================================================================

  public dragEnd($event: CdkDragEnd, lieu: Lieu) {
    console.log("dragEnd Map");
    let tmp = $event.source.getFreeDragPosition();
    if (this.data.lieuActuel.parent == '') {
      lieu.x = lieu.x + tmp.x;
      lieu.y = lieu.y + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  public addEntity(addEntite: addEntity) {
    let test = false;
    this.menuContextuel = undefined;
    addEntite.entite.inventaire = [];
    addEntite.entite.x = addEntite.menuContextuel.x;
    addEntite.entite.y = addEntite.menuContextuel.y;
    addEntite.entite.lieu = this.data.lieuActuel.id;

    if (addEntite.team == "Ami") { addEntite.entite.team = 0; }
    else if (addEntite.team == "Neutre") { addEntite.entite.team = 1; }
    else { addEntite.entite.team = 2; }

    if (!addEntite.entite.solo) {
      const nomEntite = addEntite.entite.nom;
      let nb = 1;
      this.data.entites.forEach((entite: Entite) => {
        if (entite.nom.startsWith(nomEntite)) { nb += 1; }
      });
      addEntite.entite.nom = addEntite.entite.nom + ' ' + ('0' + nb).slice(-2);
    }

    if (addEntite.entite.loot) {
      addEntite.entite.loot.forEach((loot: ObjetInventaire) => {
        if (test) console.log(loot.nom)
        if (loot.nom == "Argent") {
          let qte = Math.ceil(Math.random() * loot.qte);
          addEntite.entite.inventaire.push({ nom: "Argent", image: "argent", qte: qte, emplacement: "", taux: 0, prix: 0 });
        }
        else {
          let objet = this.data.objets.find((item: ObjetInventaire) => item.nom == loot.nom);
          if (objet) {
            let inventaire = addEntite.entite.inventaire;
            if (!inventaire) { addEntite.entite.inventaire = []; inventaire = addEntite.entite.inventaire; }
            for (let i = 0; i < loot.qte; i++) {
              let objetPresent = inventaire.find((item: ObjetInventaire) => item.nom == loot.nom);
              let tmp = Math.random() * 100;
              if (test) console.log("Jet de D100", tmp);
              if (tmp <= loot.taux) {
                if (test) console.log(loot.nom + " ajouté !")
                if (objetPresent) {
                  if (test) console.log("Déjà présent");
                  objetPresent.qte += 1;
                }
                else {
                  if (test) console.log("Pas présent");
                  inventaire.push({ emplacement: objet.emplacement, image: objet.image, nom: objet.nom, qte: 1, taux: 0, prix: objet.prix });
                }
              }
            }
          }
        }
      });
    }

    if (test) console.log(addEntite.entite);
    this.data.entites.push(addEntite.entite);
  }



  getEtat() {
    if (this.data.repos.stop) { return "etat0"; }
    else if (this.data.repos.animation) { return "etat1"; }
    else if (this.data.repos.lance) { return "etat0"; }
    return "etat1";
  }
}
