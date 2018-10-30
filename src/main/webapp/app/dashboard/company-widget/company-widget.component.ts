import { Component, OnInit } from '@angular/core';
import { AccountService, UserService, User } from '../../shared';
import { MyCompanyMgmService, MyCompanyMgm } from '../../entities/my-company-mgm';
import { HttpResponse } from '@angular/common/http';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';

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
    public popUpService: PopUpService
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
              this.companyName = this.myCompany.companyProfile.name;
              this.companySector = this.myCompany.companyProfile.type.toString();
            }
          );
        }
      });
    });
    this.mySelf = this.selfAssessmentService.getSelfAssessment();
    if (this.mySelf) {
      this.selfAssessmentName = this.mySelf.name;
    }
  }

}
