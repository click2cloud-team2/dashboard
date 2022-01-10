import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class UserInfo {
    public userData:any[];
  constructor(
  ){}

  getdata(): any{
    return this.userData;
  }

  setdata(val: any){
    this.userData = val;
    //console.log(this.userData);
  }
}