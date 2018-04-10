import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { AssetMgmPopupService } from './asset-mgm-popup.service';
import { AssetMgmService } from './asset-mgm.service';
import { ContainerMgm, ContainerMgmService } from '../container-mgm';
import { DomainOfInfluenceMgm, DomainOfInfluenceMgmService } from '../domain-of-influence-mgm';
import { AssetCategoryMgm, AssetCategoryMgmService } from '../asset-category-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-asset-mgm-dialog',
    templateUrl: './asset-mgm-dialog.component.html'
})
export class AssetMgmDialogComponent implements OnInit {

    asset: AssetMgm;
    isSaving: boolean;

    containers: ContainerMgm[];

    domainofinfluences: DomainOfInfluenceMgm[];

    assetcategories: AssetCategoryMgm[];

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private assetService: AssetMgmService,
        private containerService: ContainerMgmService,
        private domainOfInfluenceService: DomainOfInfluenceMgmService,
        private assetCategoryService: AssetCategoryMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.containerService.query()
            .subscribe((res: HttpResponse<ContainerMgm[]>) => { this.containers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.domainOfInfluenceService.query()
            .subscribe((res: HttpResponse<DomainOfInfluenceMgm[]>) => { this.domainofinfluences = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.assetCategoryService.query()
            .subscribe((res: HttpResponse<AssetCategoryMgm[]>) => { this.assetcategories = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.asset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.assetService.update(this.asset));
        } else {
            this.subscribeToSaveResponse(
                this.assetService.create(this.asset));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AssetMgm>>) {
        result.subscribe((res: HttpResponse<AssetMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AssetMgm) {
        this.eventManager.broadcast({ name: 'assetListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackContainerById(index: number, item: ContainerMgm) {
        return item.id;
    }

    trackDomainOfInfluenceById(index: number, item: DomainOfInfluenceMgm) {
        return item.id;
    }

    trackAssetCategoryById(index: number, item: AssetCategoryMgm) {
        return item.id;
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-asset-mgm-popup',
    template: ''
})
export class AssetMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetPopupService: AssetMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.assetPopupService
                    .open(AssetMgmDialogComponent as Component, params['id']);
            } else {
                this.assetPopupService
                    .open(AssetMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
