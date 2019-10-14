import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { OverallDataThreatMgm } from './overall-data-threat-mgm.model';
import { OverallDataThreatMgmService } from './overall-data-threat-mgm.service';

@Injectable()
export class OverallDataThreatMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private overallDataThreatService: OverallDataThreatMgmService

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
                this.overallDataThreatService.find(id)
                    .subscribe((overallDataThreatResponse: HttpResponse<OverallDataThreatMgm>) => {
                        const overallDataThreat: OverallDataThreatMgm = overallDataThreatResponse.body;
                        this.ngbModalRef = this.overallDataThreatModalRef(component, overallDataThreat);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.overallDataThreatModalRef(component, new OverallDataThreatMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    overallDataThreatModalRef(component: Component, overallDataThreat: OverallDataThreatMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.overallDataThreat = overallDataThreat;
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
