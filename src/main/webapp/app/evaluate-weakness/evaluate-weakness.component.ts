import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {AttackStrategyMgm} from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {AttackStrategyMgmService} from '../entities/attack-strategy-mgm/attack-strategy-mgm.service';
import {Principal} from '../shared';
import {DatasharingService} from '../datasharing/datasharing.service';

@Component({
    selector: 'jhi-evaluate-weakness',
    templateUrl: './evaluate-weakness.component.html',
    styleUrls: [
        './evaluate-weakness.css'
    ]
})
export class EvaluateWeaknessComponent implements OnInit, OnDestroy {
    debug = false;

    attackStrategies: AttackStrategyMgm[];
    account: Account;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    selectedSelfAssessment: SelfAssessmentMgm = {};

    constructor(private attackStrategyService: AttackStrategyMgmService,
                private jhiAlertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private activatedRoute: ActivatedRoute,
                private principal: Principal,
                private mySelfAssessmentService: SelfAssessmentMgmService,
                private dataSharingService: DatasharingService,
                private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                console.log('ENTER EvaluateWeakness');
            }
        });
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.selectedSelfAssessment = this.mySelfAssessmentService.getSelfAssessment();
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        if (this.eventManager && this.eventSubscriber) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }
}
