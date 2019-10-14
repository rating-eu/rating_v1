import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DataRiskLevelConfigMgm } from './data-risk-level-config-mgm.model';
import { DataRiskLevelConfigMgmService } from './data-risk-level-config-mgm.service';

@Injectable()
export class DataRiskLevelConfigMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private dataRiskLevelConfigService: DataRiskLevelConfigMgmService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.dataRiskLevelConfigService.find(id)
                    .subscribe((dataRiskLevelConfigResponse: HttpResponse<DataRiskLevelConfigMgm>) => {
                        const dataRiskLevelConfig: DataRiskLevelConfigMgm = dataRiskLevelConfigResponse.body;
                        this.ngbModalRef = this.dataRiskLevelConfigModalRef(component, dataRiskLevelConfig);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.dataRiskLevelConfigModalRef(component, new DataRiskLevelConfigMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    dataRiskLevelConfigModalRef(component: Component, dataRiskLevelConfig: DataRiskLevelConfigMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.dataRiskLevelConfig = dataRiskLevelConfig;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
