import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { addEntity, Data, Entite, Lieu, MenuContextuel, ObjetInventaire, Position } from '../model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() data: Data;

  public focus: any;
  public changingTo: Lieu | undefined;
  public persoHovered: string[] = [];
  public menuContextuel: MenuContextuel | undefined;
  public audio: HTMLAudioElement;
  public mapHeight: number;
  public image: HTMLImageElement;

  constructor() { }

  @HostListener('window:keyup', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key == "F1") { this.data.admin = !this.data.admin; }
  }


  ngOnInit(): void {
    /*this.image = document.getElementById("map") as HTMLImageElement;
    this.image.onload = function() {
      this.mapHeight = this.image.height;
    }*/
  }

  musique(lieu: Lieu) {
    
    if (lieu.musique) {
      if (!this.audio || (this.audio && !this.audio.src.endsWith(lieu.musique + ".mp3"))) {
        if (this.audio) { this.audio.pause(); this.audio.currentTime = 0; }
        this.audio = new Audio;
        this.audio.src = "../assets/musiques/" + lieu.musique + ".mp3";
        this.audio.load();
        this.audio.play();
        this.audio.loop = true;
      }
    }
  }

  //GET=================================================================

  getPersonnagesDansLieu(lieu: Lieu) {
    return this.data.entites.filter((entite: Entite) => entite.lieu == lieu.id);
  }

  getJoueursDansLieu(lieu: Lieu) {
    return this.data.entites.filter((entite: Entite) => entite.lieu == lieu.id && (entite.joueur || this.data.admin));
  }

  getLieux(): Lieu[] {
    return this.data.lieux.filter(lieu => lieu.parent == this.data.lieuActuel.id);
  }

  getPersosSurMapActuelle() {
    return this.data.entites.filter((entite: Entite) => entite.lieu == this.data.lieuActuel.id && (entite.peutBouger == undefined || entite.peutBouger));
  }

  getEntitesPresentes(nb: number) {
    return this.getPersosSurMapActuelle().filter((entite: Entite) => entite.team == nb);
  }

  //CLICKS==================================================================

  clicMap(event: MouseEvent) {
    this.menuContextuel = undefined;
    this.changingTo = undefined;
    this.focus = undefined;
    if (this.data.admin) { console.log("MouseX : " + event.offsetX); }
    if (this.data.admin) { console.log("MouseY : " + event.offsetY); }
    if (!this.audio) { this.musique(this.data.lieuActuel); }
  }

  clickRetour() {
    this.menuContextuel = undefined;
    let lieutmp = this.data.lieux.find((lieu: Lieu) => lieu.id == this.data.lieuActuel.parent);
    if (lieutmp) { this.data.lieuActuel = lieutmp; this.musique(lieutmp); }
  }

  changeLieu(lieu: Lieu) {
    this.data.entites.forEach((entite: Entite) => entite.actif = false);
    this.menuContextuel = undefined;
    this.changingTo = undefined;
    this.data.lieuActuel = lieu;
    if (lieu.to) {
      let tmp = this.data.lieux.find((nouveauLieu: Lieu) => nouveauLieu.id == lieu.to);
      if (tmp) {
        this.data.lieuActuel = tmp;
      }
    }
    this.musique(lieu);
  }

  rentrerLieu(lieu: Lieu) {
    this.menuContextuel = undefined;
    let nb = this.getPersosSurMapActuelle().length;
    if (nb == 0 && (lieu.canEnter == undefined || lieu.canEnter)) {
      this.changeLieu(lieu);
    }
    else {
      this.focus == undefined ? this.changingTo = lieu : this.focus = undefined;
    }
  }

  rentrerEntite(lieu: Lieu, perso: Entite) {
    this.verifPositionDeDepart(lieu, perso);
    perso.lieu = lieu.id;
    if (lieu.to) {
      let tmp = this.data.lieux.find((nouveauLieu: Lieu) => nouveauLieu.id == lieu.to);
      if (tmp) {
        perso.lieu = tmp.id;
      }
    }
  }

  verifPositionDeDepart(lieu: Lieu, perso: Entite) {
    this.persoHovered = [];
    this.menuContextuel = undefined;
    if (lieu.position_start && lieu.position_start.length > 0) {
      let persosACheck = this.getPersonnagesDansLieu(lieu);
      let trouve = false;
      lieu.position_start.forEach((position: Position) => {
        if (!trouve) {
          let personnageSurLaPosition: Entite | undefined = undefined;
          persosACheck.forEach((persoDansLieu: Entite) => {
            if (persoDansLieu.xcombat == position.startX && persoDansLieu.ycombat == position.startY) {
              personnageSurLaPosition = persoDansLieu;
            }
          });
          if (!personnageSurLaPosition) {
            trouve = true;
            perso.xcombat = position.startX;
            perso.ycombat = position.startY;
            if (perso.statutFamilier == "affiche") {
              perso.familier.xcombat = position.startX + 20;
              perso.familier.ycombat = position.startY;
            }
          }
        }
      });
      if (!trouve) {
        perso.xcombat = lieu.position_start[0].startX;
        perso.ycombat = lieu.position_start[0].startY;
      }
    }
    else {
      perso.xcombat = 0;
      perso.ycombat = 0;
    }
  }

  sortirPerso(lieu: Lieu, perso: Entite) {
    this.menuContextuel = undefined;
    if (this.data.lieuActuel.parent == "") {
      perso.x = lieu.x;
      perso.y = lieu.y;
    }
    else {
      perso.xcombat = lieu.x;
      perso.ycombat = lieu.y;
    }
    perso.lieu = lieu.parent;
  }

  clicDroitMap(event: MouseEvent) {
    this.focus = undefined;
    this.changingTo = undefined;
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

  endDragLieu($event: CdkDragEnd, lieu: Lieu) {
    let tmp = $event.source.getFreeDragPosition();
    lieu.x = lieu.x + tmp.x;
    lieu.y = lieu.y + tmp.y;
    $event.source._dragRef.reset();
  }
}
