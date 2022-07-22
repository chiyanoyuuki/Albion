import { Component, OnInit } from '@angular/core';
import { Entite, Equipement, Lieu, ObjetInventaire } from './model';
import DATA from '../assets/data.json';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public data: any = DATA;

  constructor(private appService: AppService) {
    //this.appService.getPersonnages().subscribe(res => console.log(res));
  }

  ngOnInit() {
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
    document.oncontextmenu = function () {
      return false;
    }

    console.log(this.data);
    console.log("Verifications");
    console.log("Des objets ne sont pas définis dans le tableau global");
    this.data.entites.forEach((entite: Entite) => {
      if (entite.inventaire) {
        entite.inventaire.forEach((objet: ObjetInventaire) => {
          let objetDéfini = this.data.objets.find((item: ObjetInventaire) => objet.nom == item.nom && objet.image == item.image && objet.emplacement == item.emplacement);
          if (!objetDéfini) {
            console.log("{\"nom\": \"" + objet.nom + "\",\"image\": \"" + objet.image + "\"" + (objet.emplacement ? ",\"emplacement\": \"" + objet.emplacement + "\"}" : "}"));
          }
        });
      }
      if (entite.stuff) {
        entite.stuff.forEach((emplacement: Equipement) => {
          let objet = emplacement.objet;
          if (objet.nom != "") {
            let objetDéfini = this.data.objets.find((item: ObjetInventaire) => objet.nom == item.nom && objet.image == item.image && objet.emplacement == item.emplacement);
            if (!objetDéfini) {
              console.log("{\"nom\": \"" + objet.nom + "\",\"image\": \"" + objet.image + "\"" + (objet.emplacement ? ",\"emplacement\": \"" + objet.emplacement + "\"}" : "}"));
            }
          }
        });
      }
    });
    this.data.pnjs.forEach((entite: Entite) => {
      if (entite.loot) {
        entite.loot.forEach((objet: ObjetInventaire) => {
          let objetDéfini = this.data.objets.find((item: ObjetInventaire) => objet.nom == item.nom);
          if (!objetDéfini) {
            console.log("{\"nom\": \"" + objet.nom + "\",\"image\": \"" + objet.image + "\"" + (objet.emplacement ? ",\"emplacement\": \"" + objet.emplacement + "\"}" : "}"));
          }
        });
      }
    });
  }
}