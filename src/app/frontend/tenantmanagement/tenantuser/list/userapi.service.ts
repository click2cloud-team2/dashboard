import { Injectable } from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { result } from 'lodash'
import {CsrfTokenService} from "../../../common/services/global/csrftoken";
import {CONFIG} from "../../../index.config";

export interface DashboardUser {
  id:number;
  username: string;
  password: string;
  token: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserApi {

  private readonly config_ = CONFIG;

  constructor(
    private http:HttpClient,
    private readonly csrfToken_: CsrfTokenService,
  ){}

  allUsers()
  {
    return this.http.get<DashboardUser[]>("/api/v1/users")
  }
  deleteUser(userID:string) {
    let url="/api/v1/users/"+userID
    return this.http.delete(url)
  }
  deleteTenant(tenantname:string) {
    let url="/api/v1/tenants/"+tenantname
    const tokenPromise = this.csrfToken_.getTokenForAction('tenants');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("deleted "+data)
          },
        );
    })
  }
}
