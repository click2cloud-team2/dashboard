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
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder} from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";

export interface CreateRoleDialogMeta {
  name: string;
  apiGroups: string []
  resources: string[]
  verbs: string[]
  namespace: string[]
}
@Component({
  selector: 'kd-create-role-dialog',
  templateUrl: 'template.html',
})

export class CreateRoleDialog implements OnInit {
  form1: FormGroup;
  private readonly config_ = CONFIG;
  RoleMaxLength = 63;
  RolePattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  apigroups1: string[]
  resources1: string[]
  verbs1 : string[]
  constructor(
    public dialogRef: MatDialogRef<CreateRoleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateRoleDialogMeta,
    private readonly http_: HttpClient,
    private readonly csrfToken_: CsrfTokenService,
    private readonly matDialog_: MatDialog,
    private readonly fb_: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form1 = this.fb_.group({
      role: [
        '',
        Validators.compose([
          Validators.maxLength(this.RoleMaxLength),
          Validators.pattern(this.RolePattern),
        ]),
      ],
      apigroups: [
        '',
        Validators.compose([
          Validators.maxLength(this.RoleMaxLength),
        ]),
      ],
      namespace: [
        '',
        Validators.compose([
          Validators.maxLength(this.RoleMaxLength),
        ]),
      ],
      resources: [
        '',
        Validators.compose([
          Validators.maxLength(this.RoleMaxLength),
        ]),
      ],
      verbs: [
        '',
        Validators.compose([
          Validators.maxLength(this.RoleMaxLength),
        ]),
      ],
    });
  }

  get role(): AbstractControl {
    return this.form1.get('role');
  }
  get namespace(): AbstractControl {
    return this.form1.get('namespace');
  }
  get apigroups(): AbstractControl {
    return this.form1.get('apigroups');
  }
  get verbs(): AbstractControl {
    return this.form1.get('verbs');
  }
  get resources(): AbstractControl {
    return this.form1.get('resources');
  }

  createrole(): void {
    if (!this.form1.valid) return;
    this.apigroups1 = this.apigroups.value.split(',')
    this.resources1 = this.resources.value.split(',')
    this.verbs1 = this.verbs.value.split(',')

    const roleSpec= {name: this.role.value, namespace: this.namespace.value, apiGroups: this.apigroups1,verbs: this.verbs1,resources: this.resources1};
    const tokenPromise = this.csrfToken_.getTokenForAction('role');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/role',
          {...roleSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.role.value);
          },
          error => {
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Error creating Role',
              message: error.data,
              confirmLabel: 'OK',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
        );
    });
  }

  isDisabled(): boolean {
    return this.data.name.indexOf(this.role.value) >= 0;
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
