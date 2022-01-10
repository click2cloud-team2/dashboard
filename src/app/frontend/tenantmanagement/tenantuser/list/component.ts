// Copyright 2020 Authors of Arktos.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component,Input, OnInit,Inject, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserApi} from "./userapi.service"
import {VerberService} from "../../../../frontend/common/services/global/verber"
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import {UserInfo} from "../../../login/login.service"

export interface UserElement {
  ID      :number;
  Username :string ;
  Type     :string ;
}
const USER_DATA: UserElement[]=[];

@Component({
  selector: 'kd-tenantusers-list',
  templateUrl: './template.html',
})
export class TenantUsersListComponent implements OnInit{
  tempData:any[]=[];
  displayedColumns = ['username', 'type', 'tenantname', 'phase', 'age'];

  userArray: any[] = [];
  displayName: any;
  typeMeta: any;
  objectMeta: any;
  dataSource: MatTableDataSource<any>;
  totalUsers: number;
  userInfo:any[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
 
  constructor(
    public userinfo:UserInfo,
    private verber_: VerberService,
    private userAPI_:UserApi,
    private http: HttpClient){    
  }
  ngOnInit(): void {

    this.userInfo=this.userinfo.getdata();

    this.userAPI_.allUsers(this.userInfo).subscribe(data=>{
      for (let index = 0; index < data.length; index++) {
        const row = data[index];
         //console.log("data row",row)
            this.userArray.push(row);
          }
      this.dataSource = new MatTableDataSource(this.userArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalUsers = this.dataSource.data.length
    });
          }

  onClick(): void {
    this.verber_.showUserCreateDialog(this.displayName, this.typeMeta, this.objectMeta);  //changes needed
        }
  deleteUser(userID:string): void {
    this.userAPI_.deleteUser(userID).subscribe(result=>{
      console.log("result from delete"+result)
    });
  }
}
