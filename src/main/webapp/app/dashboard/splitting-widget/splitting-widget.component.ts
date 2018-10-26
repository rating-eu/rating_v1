import { Component, OnInit } from '@angular/core';
import { User, AccountService, UserService } from '../../shared';
import { MyCompanyMgm, MyCompanyMgmService } from '../../entities/my-company-mgm';
import { HttpResponse } from '@angular/common/http';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import _ = require('lodash');
import { SectorType } from '../../entities/splitting-loss-mgm';
import { MyCategoryType } from '../../entities/enumerations/MyCategoryType.enum';
import { MySectorType } from '../../entities/enumerations/MySectorType.enum';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

@Component({
  selector: 'jhi-splitting-widget',
  templateUrl: './splitting-widget.component.html',
  styleUrls: ['splitting-widget.component.css']
})
export class SplittingWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;
  public companySector: string;
  public tableInfo: {
    splitting: string,
    value: number
  }[];

  private wp3Status: ImpactEvaluationStatus;
  private user: User;
  private myCompany: MyCompanyMgm;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private myCompanyService: MyCompanyMgmService,
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
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
              this.companySector = this.myCompany.companyProfile.type.toString();
            }
          );
        }
      });
    });
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    // Retrieve the wp3 status from server
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.tableInfo = [];
        for (const impact of this.wp3Status.splittingLosses) {
          switch (impact.categoryType.toString()) {
            case MyCategoryType.IP.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting : 'Intellectual Properties',
                  value : Math.round(impact.loss * 100) / 100
                });
              }
              break;
            }
            case MyCategoryType.KEY_COMP.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting : 'Key Competences',
                  value : Math.round(impact.loss * 100) / 100
                });
              }
              break;
            }
            case MyCategoryType.ORG_CAPITAL.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting : 'Organizational Capital (Reputation & Brand included )',
                  value : Math.round(impact.loss * 100) / 100
                });
              }
              break;
            }
            // TODO case with Data (calculated by D4.3 methodology)
          }
        }
      }
    });
  }

}
