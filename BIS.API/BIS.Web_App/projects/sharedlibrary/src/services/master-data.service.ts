import { Injectable } from '@angular/core';
import { masterData } from '../model/masterdata.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  masterData:masterData;
  constructor() { }

  getMasterData(){
    return this.masterData;
  }
  setMasterData(data:masterData){
    this.masterData = data;
  }
}
