import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Entite, Data, Quete } from 'src/app/model';
import { PersoService } from 'src/app/services/perso.service';

@Component({
  selector: 'app-infos-entite',
  templateUrl: './infos-entite.component.html',
  styleUrls: ['./infos-entite.component.scss']
})
export class InfosEntiteComponent implements OnInit {
  @Input() perso: Entite;
  @Input() data: Data;
  @Input() creation: boolean;
  @Output() persoActuel = new EventEmitter<Entite>();

  public formulaire: string;
  public quantite: string;

  public atLeastOneQuestStarted: boolean;
  public nbrQuetes: number;

  constructor(private persoService: PersoService) { }
  ngOnInit(): void { }


  getNom() {
    let nom = this.perso.nom;
    if (!this.data.admin) { nom = nom.replace(/ *[0-9]+ *$/g, ""); }
    return nom;
  }

  ouvrirInventairePerso() {
    if (this.perso.joueur || (this.perso.team > 0 && this.perso.pdv == 0) || this.perso.boutique == this.data.lieuActuel.id || (this.perso.team > 0 && this.data.admin)) {
      this.perso.actif = !this.perso.actif;
    }
  }

  getEtat() {
    if (this.perso.pdv == 0 && this.perso.id != "coffre") { return 'Mort'; }
    if (this.perso.etat) { return this.perso.etat; }
    return 'Bonne santé';
  }

  peutDonnerQuetes() {
    let resultat = this.persoService.peutDonnerQuetes(this.data, this.perso);
    this.nbrQuetes = resultat.length;
    this.atLeastOneQuestStarted = false;
    resultat.forEach((quete: Quete) => {
      if (quete.etapeEnCours) { this.atLeastOneQuestStarted = true; }
    })
    return this.nbrQuetes > 0;
  }

}
