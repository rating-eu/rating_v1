import {Component, OnInit, OnDestroy} from '@angular/core';
import {IdentifyAssetService} from '../identify-asset.service';
import {Asset} from '../models/Asset';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {Principal, LoginModalService} from '../../shared';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';

@Component({
    selector: 'jhi-identify-asset',
    templateUrl: './identify-asset.component.html',
    styles: [],
    providers: [IdentifyAssetService]
})
export class IdentifyAssetComponent implements OnInit, OnDestroy {
    account: Account;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    mySelf: SelfAssessmentMgm = {};
    assets: Asset[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private identifyAssetService: IdentifyAssetService) {
    }

    getAllAssets() {
        this.identifyAssetService.findAll().subscribe(
            (response) => {
                this.assets = response;

                console.log('Data: ' + JSON.stringify(this.assets));

                this.assets.forEach(function(asset) {
                    console.log('AssetMgm: ' + JSON.stringify(Asset));
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeIdentifyAssets();
        this.getAllAssets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackStrategyMgm) {
        return item.id;
    }

    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    previousState() {
        window.history.back();
    }
}
