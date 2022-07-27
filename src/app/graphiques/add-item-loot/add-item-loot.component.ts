import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Entite, ObjetInventaire } from 'src/app/model';

@Component({
  selector: 'app-add-item-loot',
  templateUrl: './add-item-loot.component.html',
  styleUrls: ['./add-item-loot.component.scss']
})
export class AddItemLootComponent implements OnInit {
  @Input() data: Data;
  @Input() perso: Entite;
  
  public alphabet: string[];
  public letterSelected: string = "";
  public objetSelected: ObjetInventaire;
  public objetFocus: ObjetInventaire | undefined;
  public choixTypeObjet = "Ajouter un loot";
  public input1: string = "1";
  public input2: string = "1";
  public input3: string = "1";
  public emplacements: string[] = ["Tête", "Torse", "Gants", "Jambes", "Bottes", "Arme", "Utilitaire", "Collier", "Epaulieres", "Ceinture", "Anneau"];
  public emplacementSelected: string = "";

  constructor() {}

  ngOnInit(): void {
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
    this.objetSelected = this.getObjetsPossibles()[0];
  }

  getObjetsPossibles() {
    let objetsPossibles: ObjetInventaire[] = this.data.objets;

    if (this.letterSelected != "") { objetsPossibles = objetsPossibles.filter((objet: ObjetInventaire) => objet.nom.startsWith(this.letterSelected)); }
    if (this.emplacementSelected != "") { objetsPossibles = objetsPossibles.filter((objet: ObjetInventaire) => objet.emplacement == this.emplacementSelected); }

    objetsPossibles = objetsPossibles.sort((a: ObjetInventaire, b: ObjetInventaire) => {
      return a.nom > b.nom ? 1 : -1;
    });

    return objetsPossibles;
  }

  getLoot() {
    let loot: ObjetInventaire[] = [];
    let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
    if (pnj) {
      let lootactuel = pnj.loot;
      if (lootactuel) {
        lootactuel.forEach((item: ObjetInventaire) => {
          let objet = this.data.objets.find((obj: ObjetInventaire) => obj.nom == item.nom);
          if (objet) {
            objet.qte = item.qte;
            objet.taux = item.taux;
            loot.push(objet);
          }
        });
      }
    }
    return loot;
  }

  clickLoot(objet: ObjetInventaire) {
    this.objetSelected = objet;
    this.input1 = '' + objet.taux;
    this.input2 = '' + objet.qte
  }

  addItem() {
    let item = this.objetSelected;
    this.input1 = this.input1.replace(/[^0-9]*/g, "");
    let qte = Number(this.input1);
    if (this.choixTypeObjet == "Ajouter un objet") {
      let obj = { emplacement: item.emplacement, image: item.image, nom: item.nom, prix: item.prix, qte: qte, taux: item.taux };
      let inv = this.perso.inventaire;
      if (item.nom == "Argent") {
        this.perso.argent += qte;
      }
      else if (!inv) {
        this.perso.inventaire = [obj];
      }
      else {
        let objetDejaDansInventaire = this.perso.inventaire.find((obj: ObjetInventaire) => obj.nom == item.nom);
        if (objetDejaDansInventaire) {
          objetDejaDansInventaire.qte += qte;
        }
        else if (this.perso.inventaire.length < 18) {
          this.perso.inventaire.push(obj);
        }
      }

    }
    else {
      let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
      if (pnj) {
        let loot = pnj.loot;
        this.input2 = this.input2.replace(/[^0-9]*/g, "");
        let tx = Number(this.input2);
        let item = { emplacement: this.objetSelected.emplacement, image: this.objetSelected.image, nom: this.objetSelected.nom, prix: this.objetSelected.prix, qte: qte, taux: tx };
        if (!loot || (loot && loot.length == 0)) {
          pnj.loot = [item];
        }
        else {
          let objetDejaDansLoot = loot.find((obj: ObjetInventaire) => obj.nom == item.nom);
          if (objetDejaDansLoot) {
            objetDejaDansLoot.qte = qte;
            objetDejaDansLoot.taux = tx;
          }
          else {
            pnj.loot.push(item);
          }
        }
      }
      console.log(pnj);
    }
  }

  deleteLoot() {
    let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
    if (pnj) {
      if (pnj.loot) {
        let objetDejaDansLoot = pnj.loot.find((obj: ObjetInventaire) => obj.nom == this.objetSelected.nom);
        if (objetDejaDansLoot) {
          pnj.loot.splice(pnj.loot.indexOf(objetDejaDansLoot), 1);
        }
      }
    }
  }

}
