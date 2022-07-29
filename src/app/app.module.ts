import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { EntitesComponent } from './entites/entites.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MenuContextuelComponent } from './menu-contextuel/menu-contextuel.component';
import { IconePersonnageComponent } from './graphiques/icone-personnage/icone-personnage.component';
import { LevelComponent } from './graphiques/level/level.component';
import { InfosEntiteComponent } from './graphiques/infos-entite/infos-entite.component';
import { FormsModule } from '@angular/forms';
import { StatsPersonnageComponent } from './graphiques/stats-personnage/stats-personnage.component';
import { FormulaireComponent } from './graphiques/formulaire/formulaire.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanneauQuetesComponent } from './graphiques/panneau-quetes/panneau-quetes.component';
import { LieuxComponent } from './graphiques/lieux/lieux.component';
import { FeuilleQueteComponent } from './graphiques/feuille-quete/feuille-quete.component';
import { ImageShadowPersoComponent } from './graphiques/image-shadow-perso/image-shadow-perso.component';
import { BackgroundComponent } from './graphiques/background/background.component';
import { InventaireComponent } from './graphiques/inventaire/inventaire.component';
import { BoutiqueComponent } from './graphiques/boutique/boutique.component';
import { StuffComponent } from './graphiques/stuff/stuff.component';
import { AddEntiteComponent } from './graphiques/add-entite/add-entite.component';
import { AddItemLootComponent } from './graphiques/add-item-loot/add-item-loot.component';
import { ModifMapComponent } from './graphiques/modif-map/modif-map.component';
import { QueteComponent } from './graphiques/quete/quete.component';
import { EmbuscadeComponent } from './graphiques/embuscade/embuscade.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EntitesComponent,
    MenuContextuelComponent,
    IconePersonnageComponent,
    LevelComponent,
    InfosEntiteComponent,
    StatsPersonnageComponent,
    FormulaireComponent,
    PanneauQuetesComponent,
    LieuxComponent,
    FeuilleQueteComponent,
    ImageShadowPersoComponent,
    BackgroundComponent,
    InventaireComponent,
    BoutiqueComponent,
    StuffComponent,
    AddEntiteComponent,
    AddItemLootComponent,
    ModifMapComponent,
    QueteComponent,
    EmbuscadeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
