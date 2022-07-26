import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, HostBinding } from '@angular/core';
import { addEntity, Data, Entite, Lieu, MenuContextuel, ObjetInventaire, Position, Animation, Quete, Etape } from '../model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppService } from '../app.service';

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

  // quete
  public queteAccepter: string;
  public focusQuete: Quete | undefined;

  public windowWidth: number;
  public windowHeight: number;
  public cataclysme: boolean;

  constructor(private appService:AppService) { }

  @HostListener('window:keyup', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key == "F1") { this.data.admin = !this.data.admin; }
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


  ngOnInit(): void {
    /*this.image = document.getElementById("map") as HTMLImageElement;
    this.image.onload = function() {
      this.mapHeight = this.image.height;
    }*/
    this.getAnimation();
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
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

  clickRetour() {
    this.menuContextuel = undefined;
    let lieutmp = this.data.lieux.find((lieu: Lieu) => lieu.id == this.data.lieuActuel.parent);
    if (lieutmp) { this.data.lieuActuel = lieutmp; }
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
    if (this.data.lieuActuel.id == 'map') {
      addEntite.entite.x = addEntite.menuContextuel.x;
      addEntite.entite.y = addEntite.menuContextuel.y;
    }
    else {
      addEntite.entite.xcombat = addEntite.menuContextuel.x;
      addEntite.entite.ycombat = addEntite.menuContextuel.y;
    }
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

  // tableau quete

  getQuetes() {
    return this.data.quetes.filter((quete: Quete) => quete.tableauQuetes && quete.tableauQuetes.affiche);
  }

  endDragQuete($event: CdkDragEnd, quete: Quete) {
    let tmp = $event.source.getFreeDragPosition();
    quete.tableauQuetes.x = quete.tableauQuetes.x + tmp.x;
    quete.tableauQuetes.y = quete.tableauQuetes.y + tmp.y;
    $event.source._dragRef.reset();
  }
  dragStart(quete: Quete) {
    let quetes = this.getQuetes();
    let taille = quetes.length;
    quetes.forEach((quete: Quete) => {
      quete.tableauQuetes.zIndex = quete.tableauQuetes.zIndex - 1;
      if (quete.tableauQuetes.zIndex < 0) {
        quete.tableauQuetes.zIndex = 0;
      }
    });
    quete.tableauQuetes.zIndex = taille;
  }
  voirQuete(quete: Quete) {
    this.focusQuete = quete;
  }
  close() {
    this.focusQuete = undefined;
  }
  prendrePapier() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    let emplacementVide = false;
    let stop = false;
    entitesJoueur.forEach((entite: Entite) => {
      emplacementVide = entite.inventaire.length < 18;
      if (emplacementVide) {
        if (this.focusQuete) {
          if (!stop) {
            entite.inventaire.push({ emplacement: "", image: "item_parchemin", nom: this.focusQuete.nom, qte: 1, taux: 0, prix: 1 });
            this.focusQuete.tableauQuetes.affiche = false;
            stop = true;
          }
        }
      }
    });
    this.focusQuete = undefined;
  }
  accepQuete() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    if (entitesJoueur.length > 0) {
      if (this.focusQuete) {
        if (this.queteAccepter != this.focusQuete.nom) {
          this.queteAccepter = this.focusQuete.nom;
        } else if (this.queteAccepter == this.focusQuete.nom) {
          this.queteAccepter = '';
          this.focusQuete.etatQuete = 1;
          this.focusQuete.accepte = true;
        }
      }
    }
  }
}
