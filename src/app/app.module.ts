import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { JoueursComponent } from './joueurs/joueurs.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PnjsComponent } from './pnjs/pnjs.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    JoueursComponent,
    PnjsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
