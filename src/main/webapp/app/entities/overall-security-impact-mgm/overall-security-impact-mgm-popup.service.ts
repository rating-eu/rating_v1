import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { OverallSecurityImpactMgm } from './overall-security-impact-mgm.model';
import { OverallSecurityImpactMgmService } from './overall-security-impact-mgm.service';

@Injectable()
export class OverallSecurityImpactMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private overallSecurityImpactService: OverallSecurityImpactMgmService

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
                this.overallSecurityImpactService.find(id)
                    .subscribe((overallSecurityImpactResponse: HttpResponse<OverallSecurityImpactMgm>) => {
                        const overallSecurityImpact: OverallSecurityImpactMgm = overallSecurityImpactResponse.body;
                        this.ngbModalRef = this.overallSecurityImpactModalRef(component, overallSecurityImpact);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.overallSecurityImpactModalRef(component, new OverallSecurityImpactMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    overallSecurityImpactModalRef(component: Component, overallSecurityImpact: OverallSecurityImpactMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.overallDataRisk = overallSecurityImpact;
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
