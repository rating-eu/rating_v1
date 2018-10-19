import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyAssetMgm } from './my-asset-mgm.model';
import { MyAssetMgmPopupService } from './my-asset-mgm-popup.service';
import { MyAssetMgmService } from './my-asset-mgm.service';
import { AssetMgm, AssetMgmService } from '../asset-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import { QuestionnaireMgm, QuestionnaireMgmService } from '../questionnaire-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-my-asset-mgm-dialog',
    templateUrl: './my-asset-mgm-dialog.component.html'
})
export class MyAssetMgmDialogComponent implements OnInit {

    myAsset: MyAssetMgm;
    isSaving: boolean;

    assets: AssetMgm[];

    selfassessments: SelfAssessmentMgm[];

    questionnaires: QuestionnaireMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private myAssetService: MyAssetMgmService,
        private assetService: AssetMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.assetService.query()
            .subscribe((res: HttpResponse<AssetMgm[]>) => { this.assets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService.query()
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => { this.questionnaires = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.myAsset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.myAssetService.update(this.myAsset));
        } else {
            this.subscribeToSaveResponse(
                this.myAssetService.create(this.myAsset));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyAssetMgm>>) {
        result.subscribe((res: HttpResponse<MyAssetMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyAssetMgm) {
        this.eventManager.broadcast({ name: 'myAssetListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackAssetById(index: number, item: AssetMgm) {
        return item.id;
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-my-asset-mgm-popup',
    template: ''
})
export class MyAssetMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myAssetPopupService: MyAssetMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.myAssetPopupService
                        .open(MyAssetMgmDialogComponent as Component, params['id']);
                } else {
                    this.myAssetPopupService
                        .open(MyAssetMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
