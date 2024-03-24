import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, HostBinding } from '@angular/core';
import { addEntity, Data, Entite, Lieu, MenuContextuel, ObjetInventaire, Position, Animation, Quete, Etape } from '../model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('etat0', style({ opacity: 0 })),
      state('etat1', style({ opacity: 1 })),
      transition('etat0 => etat1', [animate('1s')]),
      transition('etat1 => etat0', [animate('1s')]),
    ]),
  ]
})
export class MapComponent implements OnInit {

  @Input() data: Data;

  public mapHeight: number;
  public image: HTMLImageElement;
  public menuContextuel: MenuContextuel | undefined;
  public disableClickMap: boolean;

  public windowWidth: number = 1920;
  public windowHeight: number;
  public cataclysme: boolean;

  public listenCloseMenuContextuel: any;

  @HostListener('window:keyup', ['$event']) keyDownEvent(event: KeyboardEvent) { if (event.key == "F1") { this.data.admin = !this.data.admin; } }
  constructor(private appService: AppService) { }
  ngOnInit(): void {
    this.listenCloseMenuContextuel = this.appService.listenCloseMenuContextuel().subscribe((disableClick: boolean) => {
      this.menuContextuel = undefined;
      this.disableClickMap = disableClick;
    })
  }  

  clicDroitMap(event: MouseEvent) {
    if (!this.disableClickMap) {
      this.appService.closeMenuContextuel(false);
      this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "map" };
    }
  }

  getEtat() {
    if (this.data.repos.stop) { return "etat0"; }
    else if (this.data.repos.animation) { return "etat1"; }
    else if (this.data.repos.lance) { return "etat0"; }
    return "etat1";
  }

}
