import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data, Entite, Equipement, ObjetInventaire, Quete, Sort } from 'src/app/model';

@Component({
  selector: 'app-stats-personnage',
  templateUrl: './stats-personnage.component.html',
  styleUrls: ['./stats-personnage.component.scss']
})
export class StatsPersonnageComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  public gain: string;
  public formulaire: string;
  public ongletActif: string = "inventaire";
  public objetActifInventaire: ObjetInventaire | undefined;
  public objetActifStuff: Equipement | undefined;
  public sortActif: { nom: string, image: string } | undefined;
  public quantite: string;
  public focus: boolean = false;
  public emplacementFocused: string;
  public itemDragged: string = '';
  public fenetreFocused: string = "";
  public inventairesPersosPossibles: Entite[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  clickGain(perso: Entite, clicked: string) {
    if (this.gain != clicked) {
      this.gain = clicked;
    } else if (this.gain == clicked) {
      if (this.gain == "") { return }
      if (clicked == 'Niveau') {
        perso.niveau += 1;
      }
      let statCliquee = perso.stats.find((stat: { nom: string, qte: number }) => stat.nom == clicked);
      if (statCliquee) {
        statCliquee.qte += 1;
      }
      let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
      if (objetClique) {
        objetClique.qte -= 1;
        if (objetClique.qte == 0) {
          perso.inventaire.splice(perso.inventaire.indexOf(objetClique), 1);
        }
      }
      this.gain = "";
      this.objetActifInventaire = undefined;
      this.objetActifStuff = undefined;
    }
  }

  clickGainStuff(perso: Entite, objetClique: Equipement) {
    if (this.gain != objetClique.objet.nom) {
      this.gain = objetClique.objet.nom;
    } else if (this.gain == objetClique.objet.nom) {
      if (this.gain == "") { return; }
      let objetDejaDansInventaire = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == objetClique.objet.nom);
      let emplacementLibre = this.perso.inventaire.length < 18;
      if (!objetDejaDansInventaire && !emplacementLibre) { return; }

      if (objetDejaDansInventaire) {
        objetDejaDansInventaire.qte += 1;
      }
      else {
        if (emplacementLibre) {
          objetClique.objet.qte = 1;
          perso.inventaire.push(objetClique.objet);
        }
      }
      objetClique.objet = { "emplacement": '', "nom": '', "image": '', qte: 0 };
      this.gain = "";
      this.objetActifInventaire = undefined;
      this.objetActifStuff = undefined;
    }
  }

  getQuetesPrincipales() {
    return this.data.quetesprincipales.filter((quete: Quete) =>
      quete.perso == this.perso.nom || quete.perso == "Toute l'équipe"
    );
  }

  close() {
    this.perso.actif = false;
  }

  getLeft(emplacement: Equipement) {
    let tmp = this.data.positionsStuff.find((position: { emplacement: string, x: number, y: number }) => position.emplacement == emplacement.emplacement);
    return tmp?.x + "px";
  }

  getTop(emplacement: Equipement) {
    let tmp = this.data.positionsStuff.find((position: { emplacement: string, x: number, y: number }) => position.emplacement == emplacement.emplacement);
    return tmp?.y + "px";
  }

  public dragEnd($event: CdkDragEnd, item: ObjetInventaire) {
    if (!this.data.itemDragged) { return; }
    let test = true;
    if (test) console.log("DragEnd");
    if (test) console.log(this.inventairesPersosPossibles);
    let tmp = $event.source.getFreeDragPosition();
    const zoneDepart = document.getElementById(this.data.itemDragged.perso.nom + this.data.itemDragged.item.nom)?.getBoundingClientRect();

    let emplacementStuff: DOMRect | undefined;
    let emplacementArme2: DOMRect | undefined;

    if (zoneDepart) {
      if (test) console.log("Correspond à un stuff ou un inventaire est ouvert");
      const endLeft = zoneDepart.left + tmp.x + 20;
      const endTop = zoneDepart.top + tmp.y + 20;

      let finiDansEmplacement1: boolean = false;
      let finiDansEmplacement2: boolean = false;
      let finiDansInventaireAutrePerso: Entite | undefined = undefined;
      let finiDansStuffAutrePerso: Entite | undefined = undefined;

      this.inventairesPersosPossibles.forEach((entite: Entite) => {
        if (test) console.log(entite.nom);
        let inventaire = document.getElementById("inventaire" + entite.nom)?.getBoundingClientRect();
        emplacementStuff = document.getElementById(entite.nom + this.emplacementFocused)?.getBoundingClientRect();
        if (this.emplacementFocused == "Arme") {
          emplacementStuff = document.getElementById(entite.nom + this.emplacementFocused + '1')?.getBoundingClientRect();
          emplacementArme2 = document.getElementById(entite.nom + this.emplacementFocused + '2')?.getBoundingClientRect();
        }
        if (inventaire) {
          const posInventaireX = inventaire.left;
          const posInventaireY = inventaire.top;
          let verif = endLeft >= posInventaireX && endLeft <= posInventaireX + 450 && endTop >= posInventaireY && endTop <= posInventaireY + 100;
          if (verif) { finiDansInventaireAutrePerso = entite; if (test) console.log(entite.nom + " inventaire ok ! "); }
        }

        if (emplacementStuff && !finiDansEmplacement1) {
          const posStartX = emplacementStuff.left;
          const posStartY = emplacementStuff.top;
          finiDansEmplacement1 = endLeft >= posStartX && endLeft <= posStartX + 50 && endTop >= posStartY && endTop <= posStartY + 50;
          if (finiDansEmplacement1) { finiDansStuffAutrePerso = entite; }
        }

        if (emplacementArme2 && !finiDansEmplacement2) {
          const posStartX2 = emplacementArme2.left;
          const posStartY2 = emplacementArme2.top;
          finiDansEmplacement2 = endLeft >= posStartX2 && endLeft <= posStartX2 + 50 && endTop >= posStartY2 && endTop <= posStartY2 + 50;
          if (finiDansEmplacement2) { finiDansStuffAutrePerso = entite; }
        }
      });

      if (finiDansStuffAutrePerso) {
        if (test) console.log("Fini dans stuff");
        console.log("this.emplacementFocused", this.emplacementFocused);
        console.log("finiDansEmplacement1", finiDansEmplacement1);
        console.log("finiDansEmplacement2", finiDansEmplacement2);
        let persoFin: Entite = finiDansStuffAutrePerso;
        let persoDebut: Entite = this.data.itemDragged.perso;
        let emplacementVide = persoFin.inventaire.length < 18;
        let stuffConcerne = persoFin.stuff.find((stuff: Equipement) =>
        (stuff.emplacement == this.emplacementFocused ||
          (stuff.emplacement == "Arme1" && this.emplacementFocused == "Arme" && finiDansEmplacement1) ||
          (stuff.emplacement == "Arme2" && this.emplacementFocused == "Arme" && finiDansEmplacement2)));
        let ancienStuff = Object.assign({}, stuffConcerne);
        let objetDansInventaireFin = persoFin.inventaire.find((objet: ObjetInventaire) => objet.nom == ancienStuff.objet.nom);

        if (emplacementVide || (!emplacementVide && item.qte == 1) || objetDansInventaireFin) {
          console.log("objet fini dans stuff");

          if (stuffConcerne) {
            console.log("StuffConcerne");
            stuffConcerne.objet = { emplacement: item.emplacement, image: item.image, nom: item.nom, qte: 1 };
            let objetDansInventaireDebut = persoDebut.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
            if (objetDansInventaireDebut) {
              objetDansInventaireDebut.qte -= 1;
              if (objetDansInventaireDebut.qte == 0) {
                persoDebut.inventaire.splice(persoDebut.inventaire.indexOf(objetDansInventaireDebut), 1);
              }
            }

            if (ancienStuff.objet.nom != "") {
              objetDansInventaireFin = persoFin.inventaire.find((objet: ObjetInventaire) => objet.nom == ancienStuff.objet.nom);
              if (objetDansInventaireFin) {
                objetDansInventaireFin.qte += 1;
              }
              else {
                if (emplacementVide) {
                  persoFin.inventaire.push({ emplacement: ancienStuff.objet.emplacement, image: ancienStuff.objet.image, nom: ancienStuff.objet.nom, qte: 1 });
                }
              }
            }
          }
        }
      }
      else if (finiDansInventaireAutrePerso) {
        if (test) console.log("Fini dans inventaire");
        let persoFin: Entite = finiDansInventaireAutrePerso;
        let persoDebut: Entite = this.data.itemDragged.perso;
        let objetDejaDansInventaireFin = persoFin.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
        let emplacementVideInventaireFin = persoFin.inventaire.length < 18;
        if (objetDejaDansInventaireFin) {
          if (test) console.log("Objet déjà dans inventaire");
          objetDejaDansInventaireFin.qte += 1;
          let objetDansInventaire = persoDebut.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
          if (objetDansInventaire) {
            if (test) console.log("Enlever 1 objet inventaire de base");
            objetDansInventaire.qte -= 1;
            if (objetDansInventaire.qte == 0) {
              if (test) console.log("Supprimer objet quantite 0 inventaire de base");
              persoDebut.inventaire.splice(persoDebut.inventaire.indexOf(objetDansInventaire), 1);
            }
          }
        }
        else if (emplacementVideInventaireFin) {
          if (test) console.log("Emplacement vide et objet pas dans inventaire");
          let persoFin: Entite = finiDansInventaireAutrePerso;
          let persoDebut: Entite = this.data.itemDragged.perso;
          persoFin.inventaire.push({ emplacement: item.emplacement, image: item.image, nom: item.nom, qte: 1 });
          let objetDansInventaire = persoDebut.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
          if (objetDansInventaire) {
            objetDansInventaire.qte -= 1;
            if (objetDansInventaire.qte == 0) {
              persoDebut.inventaire.splice(persoDebut.inventaire.indexOf(objetDansInventaire), 1);
            }
          }

        }
      }
    }


    $event.source._dragRef.reset();
    this.itemDragged = "";
    this.objetActifInventaire = undefined;
    this.objetActifStuff = undefined;
    this.emplacementFocused = "";
    this.data.itemDragged = undefined;
  }

  public dragStart(item: ObjetInventaire) {
    this.data.itemDragged = { perso: this.perso, item: item };
    this.emplacementFocused = item.emplacement;
    this.itemDragged = item.nom;
    this.inventairesPersosPossibles = [];
    this.data.entites.forEach((entite: Entite) => {
      let id = "inventaire" + entite.nom;
      let element = document.getElementById(id);
      if (element) { this.inventairesPersosPossibles.push(entite); }
    });
  }

  public isEmplacementFocused(emplacement: Equipement) {
    return this.emplacementFocused != "" && emplacement.emplacement.startsWith(this.emplacementFocused);
  }

  public getInventaire() {
    let retour: ObjetInventaire[] = [];
    this.perso.inventaire.forEach((objet: ObjetInventaire) => retour.push(objet));
    for (let i = this.perso.inventaire.length; i < 18; i++) { retour.push({ emplacement: "", image: "", nom: "", qte: 0 }); }
    return retour;
  }

  public getSorts() {
    let retour: Sort[] = [];
    this.perso.sorts.forEach((sort: Sort) => retour.push(sort));
    for (let i = this.perso.sorts.length; i < 18; i++) { retour.push({ image: "", nom: "" }); }
    return retour;
  }
}
