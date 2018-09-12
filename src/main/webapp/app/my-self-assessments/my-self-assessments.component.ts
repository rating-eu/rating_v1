import {Component, OnInit} from '@angular/core';
import {AccountService, User, UserService} from '../shared';
import {MyCompanyMgm, MyCompanyMgmService} from '../entities/my-company-mgm';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
    selector: 'jhi-my-self-assessments',
    templateUrl: './my-self-assessments.component.html',
    styles: []
})
export class MySelfAssessmentsComponent implements OnInit {

    private static NOT_FOUND = 404;
    private user: User;
    private myCompany: MyCompanyMgm;
    public mySelfAssessments: SelfAssessmentMgm[];


    constructor(private router: Router,
                private accountService: AccountService,
                private userService: UserService,
                private myCompanyService: MyCompanyMgmService,
                private selfAssessmentService: SelfAssessmentMgmService) {
    }

    ngOnInit() {
        this.accountService.get().subscribe((response1) => {
            const loggedAccount: Account = response1.body;
            this.userService.find(loggedAccount['login']).subscribe((response2) => {
                this.user = response2.body;

                if (this.user) {
                    this.myCompanyService.findByUser(this.user.id).subscribe(
                        (response3: HttpResponse<MyCompanyMgm>) => {
                            this.myCompany = response3.body;

                            this.selfAssessmentService.getSelfAssessmentsByCompanyProfile(this.myCompany.companyProfile.id).subscribe(
                                (response: SelfAssessmentMgm[]) => {
                                    this.mySelfAssessments = response;
                                }
                            );
                        },
                        (error: any) => {

                            if (error.status == MySelfAssessmentsComponent.NOT_FOUND) {
                                console.log('MyCompany not found for the user: ' + this.user.login);
                            }
                        }
                    );
                }
            });
        });
    }

    selectSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.selfAssessmentService.setSelfAssessment(selfAssessment);
        const link = ['/'];
        // this.mySidemenuService.roomeMenu('collapsed');
        this.router.navigate(link);
    }
}
