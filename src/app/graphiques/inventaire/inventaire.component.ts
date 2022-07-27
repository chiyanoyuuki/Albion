import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Data, Entite, Equipement, ObjetInventaire, Sort, Tests } from 'src/app/model';
import { DragEndPositionsService } from 'src/app/services/dragEndPositions.service';
import { FonctionsService } from 'src/app/services/fonctions.service';
import { PersoService } from 'src/app/services/perso.service';

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.scss']
})
export class InventaireComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;
  @Input() type: string;

  public gain: string;
  public objetActif: ObjetInventaire | undefined;
  public inventairesPersosPossibles: Entite[];
  public keyPressed: string;
  public objetActifInventaire: ObjetInventaire | undefined;

  constructor(private persoService: PersoService, private fonctionsService: FonctionsService, private dragEndPositionsServices: DragEndPositionsService) { }

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event']) keyDownEvent(event: KeyboardEvent) { if (this.keyPressed != event.key) { this.keyPressed = event.key; } }
  @HostListener('window:keyup', ['$event']) keyUpEvent(event: KeyboardEvent) { if (this.keyPressed != "") { this.keyPressed = ""; } }

  public getInventaire() {
    let retour: any = [];
    let tailleInv = 0;
    if (this.type == "inventaire") {
      if (this.perso.inventaire) {
        this.perso.inventaire.forEach((objet: ObjetInventaire) => retour.push(objet));
        tailleInv = this.perso.inventaire.length;
      }
      for (let i = tailleInv; i < 18; i++) { retour.push({ emplacement: "", image: "", nom: "", qte: 0, taux: 0, prix: 0 }); }
    }
    if (this.type == "sorts") {
      if (this.perso.sorts) {
        this.perso.sorts.forEach((sort: Sort) => retour.push(sort));
        tailleInv = this.perso.sorts.length;
      }
      for (let i = tailleInv; i < 18; i++) { retour.push({ image: "", nom: "" }); }
    }

    return retour;
  }

  clickGain(perso: Entite, clicked: string, type: string) {
    if (this.type == "inventaire" && this.perso.joueur) { this.gain = this.fonctionsService.clickGain(perso, clicked, this.gain, type); }
  }

  public dragStart(item: ObjetInventaire) {
    this.data.itemDragged = { perso: this.perso, item: item };
    this.inventairesPersosPossibles = [];
    this.data.entites.forEach((entite: Entite) => {
      let id = "inventaire" + entite.nom;
      let element = document.getElementById(id);
      if (element) { this.inventairesPersosPossibles.push(entite); }
    });
  }

  public dragEnd($event: CdkDragEnd) {
    let itemDragged = this.data.itemDragged;
    if (itemDragged) {
      let emplacementFocused = itemDragged.item.emplacement;
      let item = itemDragged.item;
      let qte = 1;
      if (this.keyPressed == "Control") { qte = item.qte; }
      else if (this.keyPressed == "Shift") { qte = Math.ceil(item.qte / 2); }

      let tmp = $event.source.getFreeDragPosition();
      const zoneDepart = document.getElementById(itemDragged.perso.nom + itemDragged.item.nom)?.getBoundingClientRect();

      if (zoneDepart) {
        const xDragEnd = zoneDepart.left + tmp.x + 20;
        const yDragEnd = zoneDepart.top + tmp.y + 20;

        let tests: Tests
          = { finiDansInventaireAutrePerso: undefined, finiDansStuffAutrePerso: undefined, finiDansEmplacement1: false, finiDansEmplacement2: false };

        this.inventairesPersosPossibles.forEach((entite: Entite) => {
          if (!tests.finiDansInventaireAutrePerso && !tests.finiDansStuffAutrePerso) {
            tests = this.dragEndPositionsServices.finiChezPerso(entite, xDragEnd, yDragEnd, emplacementFocused);
          }
        });

        if (tests.finiDansStuffAutrePerso) {
          this.dragEndPositionsServices.dragFromPersoInvToPersoStuff(itemDragged.perso, tests.finiDansStuffAutrePerso, emplacementFocused, tests, item);
        }
        else if (tests.finiDansInventaireAutrePerso) {
          this.dragEndPositionsServices.dragFromPersoInvToPersoInv(itemDragged.perso, tests.finiDansInventaireAutrePerso, item, qte);
        }
      }
      $event.source._dragRef.reset();
      this.data.itemDragged = undefined;
    }
  }
}
