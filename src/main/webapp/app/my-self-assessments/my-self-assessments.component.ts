import {Component, OnInit} from '@angular/core';
import {AccountService, User, UserService} from '../shared';
import {MyCompanyMgm, MyCompanyMgmService} from '../entities/my-company-mgm';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';
import {MyAssetMgm, MyAssetMgmService} from '../entities/my-asset-mgm';

@Component({
    selector: 'jhi-my-self-assessments',
    templateUrl: './my-self-assessments.component.html',
    styleUrls: ['./my-self-assessment.component.css'],
})
export class MySelfAssessmentsComponent implements OnInit {

    private static NOT_FOUND = 404;
    private user: User;
    private myCompany: MyCompanyMgm;
    public mySelfAssessments: SelfAssessmentMgm[];
    eventSubscriber: Subscription;

    public mySelfAssessment = null;

    constructor(private router: Router,
                private accountService: AccountService,
                private userService: UserService,
                private myCompanyService: MyCompanyMgmService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private eventManager: JhiEventManager,
                private myAssetService: MyAssetMgmService
    ) {
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
                            this.loadMySelfAssessments();
                        },
                        (error: any) => {

                            if (error.status === MySelfAssessmentsComponent.NOT_FOUND) {
                                console.log('MyCompany not found for the user: ' + this.user.login);
                            }
                        }
                    );
                }
            });
        });
        this.registerChangeInSelfAssessments();

        if (this.selfAssessmentService.isSelfAssessmentSelected()) {
            this.mySelfAssessment = this.selfAssessmentService.getSelfAssessment();
        } else {
            this.mySelfAssessment = null;
        }
    }

    private loadMySelfAssessments() {
        this.selfAssessmentService.getSelfAssessmentsByCompanyProfile(this.myCompany.companyProfile.id).subscribe(
            (response: SelfAssessmentMgm[]) => {
                this.mySelfAssessments = response;
            }
        );
    }

    selectSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.selfAssessmentService.setSelfAssessment(selfAssessment);
        const link = ['/'];
        // this.mySidemenuService.roomeMenu('collapsed');
        this.router.navigate(link);
    }

    trackId(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    registerChangeInSelfAssessments() {
        this.eventSubscriber = this.eventManager.subscribe('selfAssessmentListModification', (response) => {
            console.log('Changes in SelfAssessments: ' + JSON.stringify(response));
            // Show MySelfAssessments just created
            this.loadMySelfAssessments();
        });
    }

    updateMyAsset(asset: MyAssetMgm) {
        this.myAssetService.update(asset).toPromise();
    }
}
