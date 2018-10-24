import { Component, OnInit } from '@angular/core';
import { AccountService, UserService, User } from '../../shared';
import { MyCompanyMgmService, MyCompanyMgm } from '../../entities/my-company-mgm';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-company-widget',
  templateUrl: './company-widget.component.html',
  styleUrls: ['company-widget.component.css']
})
export class CompanyWidgetComponent implements OnInit {
  private user: User;
  private myCompany: MyCompanyMgm;
  public companyName: string;
  public companySector: string;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private myCompanyService: MyCompanyMgmService,
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
  }

}
