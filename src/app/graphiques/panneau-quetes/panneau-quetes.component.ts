import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input } from '@angular/core';
import { Quete, Data, Entite } from 'src/app/model';

@Component({
  selector: 'app-panneau-quetes',
  templateUrl: './panneau-quetes.component.html',
  styleUrls: ['./panneau-quetes.component.scss']
})
export class PanneauQuetesComponent implements OnInit {

  @Input() data: Data;

  public queteAccepter: string;

  constructor() { }

  ngOnInit(): void {
  }

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
    this.data.focusQuete = quete;
  }
}
