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
    FormulaireComponent
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
