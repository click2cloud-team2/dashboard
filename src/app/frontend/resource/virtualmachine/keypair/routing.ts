// Copyright 2017 The Kubernetes Authors.
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

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {TRIGGER_DEFAULT_ACTIONBAR} from '../../../common/components/actionbars/routing';

import {WORKLOADS_ROUTE} from '../routing';

import {KeypairListComponent} from './list/component';

const CRONJOB_LIST_ROUTE: Route = {
  path: '',
  component: KeypairListComponent,
  data: {
    breadcrumb: 'Key Pairs',
    parent: WORKLOADS_ROUTE,
  },
};

@NgModule({
  imports: [
    RouterModule.forChild([CRONJOB_LIST_ROUTE, TRIGGER_DEFAULT_ACTIONBAR]),
  ],
  exports: [RouterModule],
})
export class KeypairRoutingModule {
}
