import { Principal } from './../shared/auth/principal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, User, UserService } from '../shared';
import { MyCompanyMgm, MyCompanyMgmService } from '../entities/my-company-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../entities/self-assessment-mgm';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';
import { MyAssetMgm, MyAssetMgmService } from '../entities/my-asset-mgm';
import { DatasharingService } from '../datasharing/datasharing.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../shared/pop-up-services/pop-up.service';
import { MyRole } from '../entities/enumerations/MyRole.enum';

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
        this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_ADMIN]]).then((response: boolean) => {
            if (response) {
                this.isExternal = response;
            } else {
                this.isExternal = false;
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
        let link: string[];
        if (!this.isExternal) {
            link = ['/'];
        } else {
            link = ['/evaluate-weakness'];
        }
        this.router.navigate(link);
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
