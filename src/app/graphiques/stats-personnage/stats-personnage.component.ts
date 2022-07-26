import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Boutique, Data, Entite, Equipement, Forme, ObjetInventaire, Quete, Sort } from 'src/app/model';

@Component({
  selector: 'app-stats-personnage',
  templateUrl: './stats-personnage.component.html',
  styleUrls: ['./stats-personnage.component.scss']
})
export class StatsPersonnageComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  public gain: string;
  public achat: string;
  public vente: string;
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
  public boutique: Boutique;
  public persoPresent: Entite;
  public focusPersoBoutique: Entite;
  public vendeur: Entite;
  public inventairesPersosPossibles: Entite[] = [];
  public keyPressed: string;
  public focusQuete: Quete;

  constructor() { }

  ngOnInit(): void {
    let boutiqueTmp = this.data.boutiques.find((boutique: Boutique) => boutique.nom == this.data.lieuActuel.id);
    if (boutiqueTmp) {
      this.boutique = boutiqueTmp;
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (this.keyPressed != event.key) { this.keyPressed = event.key; }
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (this.keyPressed != "") { this.keyPressed = ""; }
  }

  clickGain(perso: Entite, clicked: string) {
    console.log("dede");
    
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
        let parcheminDeQuete = this.data.quetes.find((quete: Quete) => quete.nom == clicked);
        if (parcheminDeQuete) {
          console.log("dede");
          this.focusQuete = parcheminDeQuete;
        }else{
          objetClique.qte -= 1;
          if (objetClique.qte == 0) {
            perso.inventaire.splice(perso.inventaire.indexOf(objetClique), 1);
          }
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
      objetClique.objet = { "emplacement": '', "nom": '', "image": '', qte: 0, taux: 0, prix: 0 };
      this.gain = "";
      this.objetActifInventaire = undefined;
      this.objetActifStuff = undefined;
    }
  }
  clickVendre(perso: Entite, clicked: ObjetInventaire) {
    if (this.vente != clicked.nom) {
      this.vente = clicked.nom;
    } else if (this.vente == clicked.nom) {
      if (this.vente == "") { return }
      let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked.nom);
      if (objetClique) {
        objetClique.qte -= 1;
        if (objetClique.qte == 0) {
          perso.inventaire.splice(perso.inventaire.indexOf(objetClique), 1);
        }
      }
      let objetPresentBoutique = this.boutique.objets.find((objet: ObjetInventaire) => objet.nom == clicked.nom);
      if (objetPresentBoutique) {
        objetPresentBoutique.qte += 1;
      } else {
        this.boutique.objets.push({ "emplacement": clicked.emplacement, "nom": clicked.nom, "image": clicked.image, qte: 1, prix: clicked.prix * 1.5, taux: 0 });
      }
      perso.argent += clicked.prix;
      this.vente = "";
    }
  }
  clickAcheter(focusPersoBoutique: Entite, clicked: ObjetInventaire) {
    if (this.achat != clicked.nom) {
      this.achat = clicked.nom;
    } else if (this.achat == clicked.nom) {
      if (this.achat == "") { return }
      if (focusPersoBoutique.argent < clicked.prix) { return }
      let objetPresentBoutique = this.boutique.objets.find((objet: ObjetInventaire) => objet.nom == clicked.nom);
      if (objetPresentBoutique) {
        objetPresentBoutique.qte -= 1;
        if (objetPresentBoutique.qte == 0) {
          this.boutique.objets.splice(this.boutique.objets.indexOf(objetPresentBoutique), 1);
        }
      }
      
      let objetPresentInventairePerso = focusPersoBoutique.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked.nom);
      if(objetPresentInventairePerso){
        objetPresentInventairePerso.qte += 1;
      }else if(focusPersoBoutique.inventaire.length == 18){
        return;
      }else{
        focusPersoBoutique.inventaire.push({ "emplacement": clicked.emplacement, "nom": clicked.nom, "image": clicked.image, qte: 1, prix: clicked.prix, taux:0 })
      }
      focusPersoBoutique.argent -= clicked.prix;
      this.achat = "";
    }
  }

  getQuetesPrincipales() {
    return this.data.quetes.filter((quete: Quete) =>
      quete.type == 'principale' && this.perso.nom == quete.perso || quete.perso == "Toute l'équipe" && quete.accepte == true
    );
  }

  getQuetesSecondaires() {
    return this.data.quetes.filter((quete: Quete) =>
      quete.type == 'secondaire' && quete.accepte == true
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
    let qte = 1;
    if (this.keyPressed == "Control") { qte = item.qte; }
    else if (this.keyPressed == "Shift") { qte = Math.ceil(item.qte / 2); }
    let test = false;
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
          if (test) console.log("objet fini dans stuff");

          if (stuffConcerne) {
            stuffConcerne.objet = { emplacement: item.emplacement, image: item.image, nom: item.nom, qte: 1, taux: 0, prix: item.prix };
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
                  persoFin.inventaire.push({ emplacement: ancienStuff.objet.emplacement, image: ancienStuff.objet.image, nom: ancienStuff.objet.nom, qte: 1, taux: 0, prix: ancienStuff.objet.prix });
                }
              }
            }
          }
        }
      }
      else if (finiDansInventaireAutrePerso) {
        let persoFin: Entite = finiDansInventaireAutrePerso;
        let persoDebut: Entite = this.data.itemDragged.perso;
        if (item.nom == "Argent") {
          persoFin.argent += qte;
          let objetDansInventaire = persoDebut.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
          if (objetDansInventaire) {
            if (test) console.log("Enlever 1 objet inventaire de base");
            objetDansInventaire.qte -= qte;
            if (objetDansInventaire.qte == 0) {
              if (test) console.log("Supprimer objet quantite 0 inventaire de base");
              persoDebut.inventaire.splice(persoDebut.inventaire.indexOf(objetDansInventaire), 1);
            }
          }
        }
        else {
          if (test) console.log("Fini dans inventaire");
          let objetDejaDansInventaireFin = persoFin.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
          let emplacementVideInventaireFin = persoFin.inventaire.length < 18;
          if (objetDejaDansInventaireFin) {
            if (test) console.log("Objet déjà dans inventaire");
            objetDejaDansInventaireFin.qte += qte;
            let objetDansInventaire = persoDebut.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
            if (objetDansInventaire) {
              if (test) console.log("Enlever 1 objet inventaire de base");
              objetDansInventaire.qte -= qte;
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
            persoFin.inventaire.push({ emplacement: item.emplacement, image: item.image, nom: item.nom, qte: qte, taux: 0, prix: item.prix });
            let objetDansInventaire = persoDebut.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
            if (objetDansInventaire) {
              objetDansInventaire.qte -= qte;
              if (objetDansInventaire.qte == 0) {
                persoDebut.inventaire.splice(persoDebut.inventaire.indexOf(objetDansInventaire), 1);
              }
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


  // Pour la boutique

  boutiquePerso(){
    if (this.perso.boutique == this.data.lieuActuel.id) {
      return true;
    }else{
      return false;
    }
  }
  
  persoPresentInLieu() {
    let persos = this.data.entites.filter((perso: Entite) => perso.team == 0 && perso.lieu == this.data.lieuActuel.id);
    if (persos.length > 0 && !this.focusPersoBoutique) {
      this.focusPersoBoutique = persos[0];
    }
    return persos;
  }

  public getInventairePersoBoutique(focusPersoBoutique: Entite){
    let retour: ObjetInventaire[] = [];
    let tailleInv = 0;
    if (focusPersoBoutique.inventaire) {
      focusPersoBoutique.inventaire.forEach((objet: ObjetInventaire) => retour.push(objet));
      tailleInv = focusPersoBoutique.inventaire.length;
      console.log(tailleInv);
    }
    for (let i = tailleInv; i < 18; i++) { retour.push({ emplacement: "", image: "", nom: "", qte: 0, taux:0, prix:0 }); }
    return retour;
  }

  public getInventaire() {
    let retour: ObjetInventaire[] = [];
    let tailleInv = 0;
    if (this.perso.inventaire) {
      this.perso.inventaire.forEach((objet: ObjetInventaire) => retour.push(objet));
      tailleInv = this.perso.inventaire.length;
    }
    for (let i = tailleInv; i < 18; i++) { retour.push({ emplacement: "", image: "", nom: "", qte: 0, taux: 0, prix: 0 }); }
    return retour;
  }

  public getSorts() {
    let retour: Sort[] = [];
    let tailleSorts = 0;
    if (this.perso.sorts) {
      this.perso.sorts.forEach((sort: Sort) => retour.push(sort));
      tailleSorts = this.perso.sorts.length;
    }
    for (let i = tailleSorts; i < 18; i++) { retour.push({ image: "", nom: "" }); }
    return retour;
  }

  public getContainerLeft() {
    let retour = -170;
    let x = this.perso.x;
    if (this.data.lieuActuel.id == "map") {
      x = this.perso.x;
    }
    if (x < 170) {
      retour += 170 - x;
    }
    return retour + "px";
  }

  public changeForme() {
    let formeActuelle = this.perso.formes.find((forme: Forme) => forme.nom == this.perso.forme.nom);
    if (formeActuelle) {
      let index = this.perso.formes.indexOf(formeActuelle);
      if (index < this.perso.formes.length - 1) { this.perso.forme = this.perso.formes[index + 1]; }
      else if (index != 0) { this.perso.forme = this.perso.formes[0]; }
    }

  }
}
