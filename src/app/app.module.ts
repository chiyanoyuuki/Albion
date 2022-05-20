import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EquipeComponent } from './equipe/equipe.component';
import { BandeUniteComponent } from './bande-unite/bande-unite.component';

@NgModule({
  declarations: [
    AppComponent,
    EquipeComponent,
    BandeUniteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
