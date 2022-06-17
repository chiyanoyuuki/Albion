import { Component, OnInit } from '@angular/core';
import { Data } from './model';
import * as DATA from '../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit
{
  public data : any = DATA;

  ngOnInit(){
    console.log(this.data);
    if(this.data.lieux.find((lieu:any)=>!lieu.parent))console.warn("ATTENTION");
  }

  maj(newData:Data){
    this.data = newData;
  }
}