import { Component, Input, OnInit } from '@angular/core';
import { Boutique, Data, Entite, ObjetInventaire } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';
import { FonctionsService } from 'src/app/services/fonctions.service';
import { PersoService } from 'src/app/services/perso.service';

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

  constructor(private fonctionsService: FonctionsService, private persoService: PersoService) { }

  ngOnInit(): void {
    let boutiqueTmp = this.data.boutiques.find((boutique: Boutique) => boutique.nom == this.data.lieuActuel.id);
    if (boutiqueTmp) { this.boutique = boutiqueTmp; }
  }

  clickGain(clicked: string) {
    this.achat = this.fonctionsService.clickGain(this.data, this.focusPersoBoutique, clicked, this.achat, "achat", this.boutique);
  }

  persoPresentInLieu() {
    let persos = this.persoService.joueursPresentsInLieu(this.data);
    if (persos.length > 0 && !this.focusPersoBoutique) { this.focusPersoBoutique = persos[0]; }
    return persos;
  }
}
