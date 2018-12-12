import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AttackCostMgm } from './attack-cost-mgm.model';
import { AttackCostMgmPopupService } from './attack-cost-mgm-popup.service';
import { AttackCostMgmService } from './attack-cost-mgm.service';
import { MyAssetMgm, MyAssetMgmService } from '../my-asset-mgm';
import { DirectAssetMgm, DirectAssetMgmService } from '../direct-asset-mgm';
import { IndirectAssetMgm, IndirectAssetMgmService } from '../indirect-asset-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-attack-cost-mgm-dialog',
    templateUrl: './attack-cost-mgm-dialog.component.html'
})
export class AttackCostMgmDialogComponent implements OnInit {

    attackCost: AttackCostMgm;
    isSaving: boolean;

    myassets: MyAssetMgm[];

    directassets: DirectAssetMgm[];

    indirectassets: IndirectAssetMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private attackCostService: AttackCostMgmService,
        private myAssetService: MyAssetMgmService,
        private directAssetService: DirectAssetMgmService,
        private indirectAssetService: IndirectAssetMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myAssetService.query()
            .subscribe((res: HttpResponse<MyAssetMgm[]>) => { this.myassets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.directAssetService.query()
            .subscribe((res: HttpResponse<DirectAssetMgm[]>) => { this.directassets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.indirectAssetService.query()
            .subscribe((res: HttpResponse<IndirectAssetMgm[]>) => { this.indirectassets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.attackCost.id !== undefined) {
            this.subscribeToSaveResponse(
                this.attackCostService.update(this.attackCost));
        } else {
            this.subscribeToSaveResponse(
                this.attackCostService.create(this.attackCost));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AttackCostMgm>>) {
        result.subscribe((res: HttpResponse<AttackCostMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AttackCostMgm) {
        this.eventManager.broadcast({ name: 'attackCostListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMyAssetById(index: number, item: MyAssetMgm) {
        return item.id;
    }

    trackDirectAssetById(index: number, item: DirectAssetMgm) {
        return item.id;
    }

    trackIndirectAssetById(index: number, item: IndirectAssetMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-attack-cost-mgm-popup',
    template: ''
})
export class AttackCostMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private attackCostPopupService: AttackCostMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.attackCostPopupService
                        .open(AttackCostMgmDialogComponent as Component, params['id']);
                } else {
                    this.attackCostPopupService
                        .open(AttackCostMgmDialogComponent as Component);
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
