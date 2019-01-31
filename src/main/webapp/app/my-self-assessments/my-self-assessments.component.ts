import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService, User, UserService} from '../shared';
import {MyCompanyMgm, MyCompanyMgmService} from '../entities/my-company-mgm';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';
import {MyAssetMgm, MyAssetMgmService} from '../entities/my-asset-mgm';
import {DatasharingService} from '../datasharing/datasharing.service';
import {SessionStorageService} from 'ngx-webstorage';
import {PopUpService} from '../shared/pop-up-services/pop-up.service';

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

    public mySelfAssessment = null;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private userService: UserService,
        private myCompanyService: MyCompanyMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager,
        private myAssetService: MyAssetMgmService,
        private dataSharingService: DatasharingService,
        private sessionStorage: SessionStorageService,
        public popUpService: PopUpService
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
        const link = ['/'];
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
