import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DomainOfInfluenceMgm } from './domain-of-influence-mgm.model';
import { DomainOfInfluenceMgmPopupService } from './domain-of-influence-mgm-popup.service';
import { DomainOfInfluenceMgmService } from './domain-of-influence-mgm.service';
import { ContainerMgm, ContainerMgmService } from '../container-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-domain-of-influence-mgm-dialog',
    templateUrl: './domain-of-influence-mgm-dialog.component.html'
})
export class DomainOfInfluenceMgmDialogComponent implements OnInit {

    domainOfInfluence: DomainOfInfluenceMgm;
    isSaving: boolean;

    containers: ContainerMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private domainOfInfluenceService: DomainOfInfluenceMgmService,
        private containerService: ContainerMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.containerService
            .query({ filter: 'domainofinfluence-is-null' })
            .subscribe((res: HttpResponse<ContainerMgm[]>) => {
                if (!this.domainOfInfluence.container || !this.domainOfInfluence.container.id) {
                    this.containers = res.body;
                } else {
                    this.containerService
                        .find(this.domainOfInfluence.container.id)
                        .subscribe((subRes: HttpResponse<ContainerMgm>) => {
                            this.containers = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.domainOfInfluence.id !== undefined) {
            this.subscribeToSaveResponse(
                this.domainOfInfluenceService.update(this.domainOfInfluence));
        } else {
            this.subscribeToSaveResponse(
                this.domainOfInfluenceService.create(this.domainOfInfluence));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DomainOfInfluenceMgm>>) {
        result.subscribe((res: HttpResponse<DomainOfInfluenceMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DomainOfInfluenceMgm) {
        this.eventManager.broadcast({ name: 'domainOfInfluenceListModification', content: 'OK' });
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
}

@Component({
    selector: 'jhi-domain-of-influence-mgm-popup',
    template: ''
})
export class DomainOfInfluenceMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private domainOfInfluencePopupService: DomainOfInfluenceMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.domainOfInfluencePopupService
                        .open(DomainOfInfluenceMgmDialogComponent as Component, params['id']);
                } else {
                    this.domainOfInfluencePopupService
                        .open(DomainOfInfluenceMgmDialogComponent as Component);
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
