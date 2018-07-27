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
        this.assetService
            .query({filter: 'myasset-is-null'})
            .subscribe((res: HttpResponse<AssetMgm[]>) => {
                if (!this.myAsset.asset || !this.myAsset.asset.id) {
                    this.assets = res.body;
                } else {
                    this.assetService
                        .find(this.myAsset.asset.id)
                        .subscribe((subRes: HttpResponse<AssetMgm>) => {
                            this.assets = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService
            .query({filter: 'myasset-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.myAsset.selfAssessment || !this.myAsset.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.myAsset.selfAssessment.id)
                        .subscribe((subRes: HttpResponse<SelfAssessmentMgm>) => {
                            this.selfassessments = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService
            .query({filter: 'myasset-is-null'})
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => {
                if (!this.myAsset.questionnaire || !this.myAsset.questionnaire.id) {
                    this.questionnaires = res.body;
                } else {
                    this.questionnaireService
                        .find(this.myAsset.questionnaire.id)
                        .subscribe((subRes: HttpResponse<QuestionnaireMgm>) => {
                            this.questionnaires = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
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
        this.eventManager.broadcast({ name: 'myAssetListModification', content: 'OK'});
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
        private myAssetPopupService: MyAssetMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.myAssetPopupService
                    .open(MyAssetMgmDialogComponent as Component, params['id']);
            } else {
                this.myAssetPopupService
                    .open(MyAssetMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
