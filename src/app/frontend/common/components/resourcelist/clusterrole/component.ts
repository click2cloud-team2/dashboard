// Copyright 2017 The Kubernetes Authors.
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

import {HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';
import {ClusterRole, ClusterRoleList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';

import {ResourceListBase} from '../../../resources/list';
import {NotificationsService} from '../../../services/global/notifications';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {ResourceService} from '../../../services/resource/resource';
import {MenuComponent} from '../../list/column/menu/component';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';
import {VerberService} from '../../../services/global/verber';

@Component({
  selector: 'kd-cluster-role-list',
  templateUrl: './template.html',
})
export class ClusterRoleListComponent extends ResourceListBase<ClusterRoleList, ClusterRole> {
  @Input() endpoint = EndpointManager.resource(Resource.clusterRole, false, true).list();
  typeMeta:any="";
  objectMeta:any;
  constructor(
    private readonly verber_: VerberService,
    private readonly clusterRole_: ResourceService<ClusterRoleList>,
    notifications: NotificationsService,
  ) {
    super('clusterrole', notifications);
    this.id = ListIdentifier.clusterRole;
    this.groupId = ListGroupIdentifier.cluster;

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);
  }

  getResourceObservable(params?: HttpParams): Observable<ClusterRoleList> {
    return this.clusterRole_.get(this.endpoint, undefined, params);
  }

  map(clusterRoleList: ClusterRoleList): ClusterRole[] {
    return clusterRoleList.items;
  }

  getDisplayColumns(): string[] {
    return ['name', 'age'];
  }
  onClick(): void { 
    this.verber_.showRoleCreateDialog('Role name',this.typeMeta,this.objectMeta);

  }
}
