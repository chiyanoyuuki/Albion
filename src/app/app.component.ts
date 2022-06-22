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
  }

  majFromChild(newData:Data){
    this.data = newData;
  }
}