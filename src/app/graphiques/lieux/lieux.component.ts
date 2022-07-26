import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Data, Entite, Lieu, MenuContextuel, Position } from 'src/app/model';

@Component({
  selector: 'app-lieux',
  templateUrl: './lieux.component.html',
  styleUrls: ['./lieux.component.scss']
})
export class LieuxComponent implements OnInit {

  @Input() data: Data;

  public persoHovered: string[] = [];
  public focus: any;
  public changingTo: Lieu | undefined;
  public audio: HTMLAudioElement;
  public clickEventsubscription: any;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.clickEventsubscription = this.appService.listenClickMap().subscribe(() => {
      this.changingTo = undefined;
    })
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

  getPersonnagesDansLieu(lieu: Lieu) {
    return this.data.entites.filter((entite: Entite) => entite.lieu == lieu.id);
  }

  getJoueursDansLieu(lieu: Lieu) {
    return this.data.entites.filter((entite: Entite) => entite.lieu == lieu.id && (entite.joueur || this.data.admin));
  }

  changementDeMap(lieu: Lieu) {
    console.log(lieu);
    console.log(lieu.nbImage);
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

  changeLieu(lieu: Lieu) {
    this.data.entites.forEach((entite: Entite) => entite.actif = false);
    this.changingTo = undefined;
    this.data.lieuActuel = lieu;
    if (lieu.to) {
      let tmp = this.data.lieux.find((nouveauLieu: Lieu) => nouveauLieu.id == lieu.to);
      if (tmp) {
        this.data.lieuActuel = tmp;
      }
    }
    this.changementDeMap(lieu);
  }

  rentrerLieu(lieu: Lieu) {
    let nb = this.getPersosSurMapActuelle().length;
    if (nb == 0 && (lieu.canEnter == undefined || lieu.canEnter)) {
      this.changeLieu(lieu);
    }
    else {
      this.focus == undefined ? this.changingTo = lieu : this.focus = undefined;
    }
    if (lieu.nom == 'Panneau de Quêtes') {
      this.data.lieuActuel = lieu;
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

  sortirPerso(lieu: Lieu, perso: Entite) {
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

  verifPositionDeDepart(lieu: Lieu, perso: Entite) {
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

  endDragLieu($event: CdkDragEnd, lieu: Lieu) {
    let tmp = $event.source.getFreeDragPosition();
    lieu.x = lieu.x + tmp.x;
    lieu.y = lieu.y + tmp.y;
    $event.source._dragRef.reset();
  }

}