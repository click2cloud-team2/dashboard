// Copyright 2020 Authors of Arktos - file modified.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TenantService} from "../../services/global/tenant";
import {NamespaceService} from "../../services/global/namespace";
import {AppDeploymentContentSpec} from "@api/backendapi";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder} from '@angular/forms';

import { FormGroup, FormControl } from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";

export interface UserToken {
  token: string;
}

export interface CreateTenantDialogMeta {
  tenants: string;
  storageclusterid: string;
  //storageclusterid: string[];
  //data : string[]
}
@Component({
  selector: 'kd-create-tenant-dialog',
  templateUrl: 'template.html',
})

export class CreateTenantDialog implements OnInit {
  form1: FormGroup;

  private responseData: any;
  public serviceAccountCreated:any[] = [];
  tokenResponse: any;

  private readonly config_ = CONFIG;

  /**
   * Max-length validation rule for tenant
   */
  tenantMaxLength = 24;
  tokenMaxLength = 2000;
  storageidMaxLength =10;
  /**
   * Pattern validation rule for tenant
   */
  tenantPattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  storageidPattern: RegExp = new RegExp('^[0-9]$');
  /**
   * Max-length validation rule for namespace
   */
  namespaceMaxLength = 63;
  /**
   * Pattern validation rule for namespace
   */
  namespacePattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');

  constructor(
    public dialogRef: MatDialogRef<CreateTenantDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTenantDialogMeta,
    private readonly http_: HttpClient,
    private readonly csrfToken_: CsrfTokenService,
    private readonly matDialog_: MatDialog,
    private readonly fb_: FormBuilder,

  ) {}

  ngOnInit(): void {
    this.form1 = this.fb_.group({
        usertoken: [
          '',
          Validators.compose([
            Validators.maxLength(this.tokenMaxLength),
          ]),
        ],
        usertype: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        tenant: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        username: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        storageclusterid :[
          '',
          Validators.compose([
            Validators.maxLength(this.storageidMaxLength),
            Validators.pattern(this.storageidPattern),
          ]),
        ],

      }
    );

  }

  get tenant(): AbstractControl {
    return this.form1.get('tenant');
  }
  get user(): AbstractControl {
    return this.form1.get('username');
  }
  get pass(): AbstractControl {
    return this.form1.get('password');
  }
  get usertoken(): AbstractControl {
    return this.form1.get('usertoken');
  }
  get usertype(): AbstractControl {
    return this.form1.get('usertype');
  }

  get storageclusterid(): AbstractControl {
    return this.form1.get('storageclusterid');
  }

  createUser(usertoken :string) {

    const userSpec= {id:1,username: this.user.value, password:this.pass.value, token:usertoken, type:this.usertype.value,tenantname:this.tenant.value};
    const userTokenPromise = this.csrfToken_.getTokenForAction('users');
    // const tokenPromisenamespace = this.csrfToken_.getTokenForAction('namespace');
    userTokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/users',
          {...userSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            // this.log_.info('Successfully created tenant:', savedConfig);
            this.dialogRef.close(this.user.value);
          },
          // error => {
          //   // this.log_.info('Error creating tenant:', err);
          //   this.dialogRef.close();
          //   const configData: AlertDialogConfig = {
          //     title: 'User Already Exists',
          //     message: error.data,
          //     confirmLabel: 'OK',
          //   };
          //   this.matDialog_.open(AlertDialog, {data: configData});
          // },
        );
    });
  }
  //serviceaccount api calling added
  createServiceAccount(): void{
    console.log("inside create service account api call...")
    const serviseaccountSpec= {name: this.user.value,namespace: "kube-system"};
    const tokenPromise = this.csrfToken_.getTokenForAction('serviceaccount');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/serviceaccount',
          {...serviseaccountSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            // this.log_.info('Successfully created tenant:', savedConfig);
            console.log("result of service account api call"+data)
            this.dialogRef.close(this.user.value);
            this.serviceAccountCreated.push(data)

            console.log("sa name"+this.serviceAccountCreated[0])
            console.log("sa namespace"+this.serviceAccountCreated[1])
          },
          // error => {
          //   // this.log_.info('Error creating tenant:', err);
          //   this.dialogRef.close();
          //   const configData: AlertDialogConfig = {
          //     title: 'Tenant Already Exists',
          //     message: error.data,
          //     confirmLabel: 'OK',
          //   };
          //   this.matDialog_.open(AlertDialog, {data: configData});
          // },
        );
    });

  }
// display token from secret
  // displayToken(): void{
  //   console.log("inside create secret api call...")
  //   const serviseaccountSpec= {name: this.user.value,namespace: "kube-system"};
  //   const tokenPromise = this.csrfToken_.getTokenForAction('serviceaccount');
  //   tokenPromise.subscribe(csrfToken => {
  //     return this.http_
  //       .post<{valid: boolean}>(
  //         'api/v1/serviceaccount',
  //         {...serviseaccountSpec},
  //         {
  //           headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
  //         },
  //       )
  //       .subscribe(
  //         (data) => {
  //           // this.log_.info('Successfully created tenant:', savedConfig);
  //           console.log("result of service account api call"+data)
  //           this.dialogRef.close(this.user.value);
  //         },
  //         // error => {
  //         //   // this.log_.info('Error creating tenant:', err);
  //         //   this.dialogRef.close();
  //         //   const configData: AlertDialogConfig = {
  //         //     title: 'Tenant Already Exists',
  //         //     message: error.data,
  //         //     confirmLabel: 'OK',
  //         //   };
  //         //   this.matDialog_.open(AlertDialog, {data: configData});
  //         // },
  //       );
  //   });

  // }
  //  Creates new tenant based on the state of the controller.
  createTenant(): void {
    // api approach for sa crb and token fetch
    this.createServiceAccount()

    //this.displayToken()

    if (!this.form1.valid) return;

    //const tenantSpec= {name: this.tenant.value,storageclusterid: this.storageclusterid.value};
    const tenantSpec= {name: this.user.value,storageclusterid: this.storageclusterid.value};
    // const namespaceSpec = {namespace: this.namespace.value};
    // console.log("ns",namespaceSpec)
    const tokenPromise = this.csrfToken_.getTokenForAction('tenant');
    // const tokenPromisenamespace = this.csrfToken_.getTokenForAction('namespace');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/tenant',
          {...tenantSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            // this.log_.info('Successfully created tenant:', savedConfig);
            this.dialogRef.close(this.tenant.value);
          },
          // error => {
          //   // this.log_.info('Error creating tenant:', err);
          //   this.dialogRef.close();
          //   const configData: AlertDialogConfig = {
          //     title: 'Tenant Already Exists',
          //     message: error.data,
          //     confirmLabel: 'OK',
          //   };
          //   this.matDialog_.open(AlertDialog, {data: configData});
          // },
        );
    });

    //for token
    // call create user func
    this.http_.get('/api/v1/token/'+this.user.value).subscribe(data=>{
      console.log("getData fun "+JSON.stringify(data))
      console.log("getData fun "+data)

      //this.createUser(JSON.stringify(data))
      //this.createUser(data.valueOf())
      this.createUser(data.toString().trim())

    })



  }
  /**
   * Returns true if new tenant name hasn't been filled by the user, i.e, is empty.
   */
  isDisabled(): boolean {
    return this.data.tenants.indexOf(this.tenant.value) >= 0;
  }

  /**
   * Cancels the new tenant form.
   */
  cancel(): void {
    this.dialogRef.close();
  }
  showContent1(){
    document.getElementById("first_tab_content").style.display = "block";
    document.getElementById("second_tab_content").style.display = "none";
  }
  showContent2(){
    document.getElementById("first_tab_content").style.display = "none";
    document.getElementById("second_tab_content").style.display = "block";
  }
}
