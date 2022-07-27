import { Component, Input, OnInit } from '@angular/core';
import { Boutique, Data, Entite, ObjetInventaire } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.scss']
})
export class BoutiqueComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  public boutique: Boutique;
  public vente: string;
  public achat: string;
  public focusPersoBoutique: Entite;
  public objetActifInventaire: ObjetInventaire | undefined;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    let boutiqueTmp = this.data.boutiques.find((boutique: Boutique) => boutique.nom == this.data.lieuActuel.id);
    if (boutiqueTmp) {
      this.boutique = boutiqueTmp;
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
      if (objetPresentInventairePerso) {
        objetPresentInventairePerso.qte += 1;
      } else if (focusPersoBoutique.inventaire.length == 18) {
        return;
      } else {
        focusPersoBoutique.inventaire.push({ "emplacement": clicked.emplacement, "nom": clicked.nom, "image": clicked.image, qte: 1, prix: clicked.prix, taux: 0 })
      }
      focusPersoBoutique.argent -= clicked.prix;
      this.achat = "";
    }
  }

  boutiquePerso() {
    if (this.perso.boutique == this.data.lieuActuel.id) {
      return true;
    } else {
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

  public getInventairePersoBoutique(focusPersoBoutique: Entite) {
    let retour: ObjetInventaire[] = [];
    let tailleInv = 0;
    if (focusPersoBoutique.inventaire) {
      focusPersoBoutique.inventaire.forEach((objet: ObjetInventaire) => retour.push(objet));
      tailleInv = focusPersoBoutique.inventaire.length;
      console.log(tailleInv);
    }
    for (let i = tailleInv; i < 18; i++) { retour.push({ emplacement: "", image: "", nom: "", qte: 0, taux: 0, prix: 0 }); }
    return retour;
  }

  close()
  {
    this.appService.closeMenuContextuel();
  }

}
