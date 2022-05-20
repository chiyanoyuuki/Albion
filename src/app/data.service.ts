import { Injectable } from '@angular/core';
import { PNJ, Familier, Personnage } from './model';
import * as DATA from '../assets/data.json';


@Injectable({
  providedIn: 'root'
})
export class DataService 
{
  public data = DATA;

  constructor() { }

  public getData()                        {return this.data;}
  public getPersonnages():Personnage[]    {return this.data.personnages;}
  public getFamiliers()                   {return this.data.familiers;}
  public getAmisActuels()                 {return this.data.amisActuels;}

  public getFamilier(nom:string)          {return this.data.familiers.find(familier=>familier.nom===nom);}
}
