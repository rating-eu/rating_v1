import {Principal} from './../shared/auth/principal.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService, LoginService, User, UserService} from '../shared';
import {MyCompanyMgm, MyCompanyMgmService} from '../entities/my-company-mgm';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';
import {MyAssetMgm, MyAssetMgmService} from '../entities/my-asset-mgm';
import {DatasharingService} from '../datasharing/datasharing.service';
import {PopUpService} from '../shared/pop-up-services/pop-up.service';
import {MyRole} from '../entities/enumerations/MyRole.enum';

@Component({
    selector: 'jhi-my-self-assessments',
    templateUrl: './my-self-assessments.component.html',
    styleUrls: ['./my-self-assessment.component.css'],
})
export class MySelfAssessmentsComponent implements OnInit, OnDestroy {

    private static NOT_FOUND = 404;
    private user: User;
    private myCompany: MyCompanyMgm;
    public mySelfAssessments: SelfAssessmentMgm[];
    eventSubscriber: Subscription;
    private subscription: Subscription;
    public isAuthenticated = false;
    public isExternal = false;
    public isCISO = false;
    public mySelfAssessment = null;

    constructor(
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService,
        private myAssetService: MyAssetMgmService,
        private dataSharingService: DatasharingService,
        public popUpService: PopUpService,
        private principal: Principal,
        private loginService: LoginService
    ) {
    }

    ngOnInit() {
        this.loadMySelfAssessments();
        this.registerChangeInSelfAssessments();
        if (this.selfAssessmentService.isSelfAssessmentSelected()) {
            this.mySelfAssessment = this.selfAssessmentService.getSelfAssessment();
        } else {
            this.mySelfAssessment = null;
        }

        this.loginService.checkLogin().then((check: boolean) => {
            this.isAuthenticated = check;

            this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_EXTERNAL_AUDIT]]).then((response: boolean) => {
                if (response) {
                    this.isExternal = response;
                } else {
                    this.isExternal = false;
                }
            });
        });
    }

    private loadMySelfAssessments() {
        this.selfAssessmentService.getMySelfAssessments().toPromise().then(
            (response: SelfAssessmentMgm[]) => {
                this.mySelfAssessments = response;
            }
        );
    }

    selectSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.selfAssessmentService.setSelfAssessment(selfAssessment);
        this.dataSharingService.updateMySelfAssessment(selfAssessment);

        this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_CISO]]).then((response: boolean) => {
            this.isCISO = response;

            if (this.isCISO) {
                this.router.navigate(['/']);
            }
        });

        this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_EXTERNAL_AUDIT]]).then((response: boolean) => {
            this.isExternal = response;

            if (this.isExternal) {
                this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
            }
        });
    }

    trackId(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    registerChangeInSelfAssessments() {
        this.subscription = this.dataSharingService.observeMySelf().subscribe((value: SelfAssessmentMgm) => {
            this.loadMySelfAssessments();
        });
    }

    updateMyAsset(asset: MyAssetMgm) {
        this.myAssetService.update(asset).toPromise();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
