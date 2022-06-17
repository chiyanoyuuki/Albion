import { Injectable, OnInit } from '@angular/core';
import { PNJ, Familier, Personnage } from './model';
import * as DATA from '../assets/data.json';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit
{
  public static data = DATA;

  constructor() { }

  ngOnInit(): void {
  }

  public getData()                        {return DataService.data;}
  public getPersonnages():Personnage[]    {return DataService.data.personnages;}
  public getFamiliers()                   {return DataService.data.familiers;}
  public getAmisActuels()                 {return DataService.data.amisActuels;}

  public getFamilier(nom:string)          {return DataService.data.familiers.find(familier=>familier.nom===nom);}



}
