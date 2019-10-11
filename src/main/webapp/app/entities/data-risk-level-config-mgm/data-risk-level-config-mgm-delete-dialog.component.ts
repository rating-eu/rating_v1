import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DataRiskLevelConfigMgm } from './data-risk-level-config-mgm.model';
import { DataRiskLevelConfigMgmPopupService } from './data-risk-level-config-mgm-popup.service';
import { DataRiskLevelConfigMgmService } from './data-risk-level-config-mgm.service';

@Component({
    selector: 'jhi-data-risk-level-config-mgm-delete-dialog',
    templateUrl: './data-risk-level-config-mgm-delete-dialog.component.html'
})
export class DataRiskLevelConfigMgmDeleteDialogComponent {

    dataRiskLevelConfig: DataRiskLevelConfigMgm;

    constructor(
        private dataRiskLevelConfigService: DataRiskLevelConfigMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.dataRiskLevelConfigService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'dataRiskLevelConfigListModification',
                content: 'Deleted an dataRiskLevelConfig'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-data-risk-level-config-mgm-delete-popup',
    template: ''
})
export class DataRiskLevelConfigMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataRiskLevelConfigPopupService: DataRiskLevelConfigMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.dataRiskLevelConfigPopupService
                .open(DataRiskLevelConfigMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
