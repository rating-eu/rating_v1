/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Component, OnInit } from '@angular/core';
import { AccountService, UserService, User } from '../../shared';
import { MyCompanyMgmService, MyCompanyMgm } from '../../entities/my-company-mgm';
import { HttpResponse } from '@angular/common/http';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {Account} from "../../shared";

@Component({
  selector: 'jhi-company-widget',
  templateUrl: './company-widget.component.html',
  styleUrls: ['company-widget.component.css']
})
export class CompanyWidgetComponent implements OnInit {
  private user: User;
  private mySelf: SelfAssessmentMgm;
  public myCompany: MyCompanyMgm;
  public companyName: string;
  public companySector: string;
  public selfAssessmentName: string;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private myCompanyService: MyCompanyMgmService,
    private selfAssessmentService: SelfAssessmentMgmService,
    public popUpService: PopUpService,
    private dataSharingService: DatasharingService
  ) { }

  ngOnInit() {
    this.accountService.get().subscribe((response1) => {
      const loggedAccount: Account = response1.body;
      this.userService.find(loggedAccount['login']).subscribe((response2) => {
        this.user = response2.body;

        if (this.user) {
          this.myCompanyService.findByUser(this.user.id).subscribe(
            (response3: HttpResponse<MyCompanyMgm>) => {
              this.myCompany = response3.body;
              this.dataSharingService.myCompany = this.myCompany;
              this.companyName = this.myCompany.companyProfile.name;
              this.companySector = this.myCompany.companyProfile.type.toString();
            }
          );
        }
      });
    });
    this.mySelf = this.dataSharingService.selfAssessment;
    if (this.mySelf) {
      this.selfAssessmentName = this.mySelf.name;
    }
  }

}
