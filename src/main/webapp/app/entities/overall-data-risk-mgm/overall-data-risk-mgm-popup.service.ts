import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { OverallDataRiskMgm } from './overall-data-risk-mgm.model';
import { OverallDataRiskMgmService } from './overall-data-risk-mgm.service';

@Injectable()
export class OverallDataRiskMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private overallDataRiskService: OverallDataRiskMgmService

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
                this.overallDataRiskService.find(id)
                    .subscribe((overallDataRiskResponse: HttpResponse<OverallDataRiskMgm>) => {
                        const overallDataRisk: OverallDataRiskMgm = overallDataRiskResponse.body;
                        this.ngbModalRef = this.overallDataRiskModalRef(component, overallDataRisk);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.overallDataRiskModalRef(component, new OverallDataRiskMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    overallDataRiskModalRef(component: Component, overallDataRisk: OverallDataRiskMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.overallDataRisk = overallDataRisk;
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
