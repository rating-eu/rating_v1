import {Principal} from './../shared/auth/principal.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../shared';
import {MyCompanyMgm} from '../entities/my-company-mgm';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
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
    public isAdmin = false;
    public isCISO = false;
    public isExternal = false;
    public mySelfAssessment = null;

    constructor(
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService,
        private myAssetService: MyAssetMgmService,
        private dataSharingService: DatasharingService,
        public popUpService: PopUpService,
        private principal: Principal
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

        // Get notified each time authentication state changes.
        this.dataSharingService.observeRole().subscribe((role: MyRole) => {
            switch (role) {
                case MyRole.ROLE_ADMIN: {
                    this.isAdmin = true;
                    break;
                }
                case MyRole.ROLE_CISO: {
                    this.isCISO = true;
                    break;
                }
                case MyRole.ROLE_EXTERNAL_AUDIT: {
                    this.isExternal = true;
                    break;
                }
                case null: {
                    this.isAuthenticated = false;
                    this.isCISO = false;
                    this.isExternal = false;
                    this.isAdmin = false;
                }
            }
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

        if (this.isCISO) {
            this.router.navigate(['/']);
        }

        if (this.isExternal) {
            this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
        }
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
