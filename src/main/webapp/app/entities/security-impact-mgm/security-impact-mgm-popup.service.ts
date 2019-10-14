import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SecurityImpactMgm } from './security-impact-mgm.model';
import { SecurityImpactMgmService } from './security-impact-mgm.service';

@Injectable()
export class SecurityImpactMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private securityImpactService: SecurityImpactMgmService

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
                this.securityImpactService.find(id)
                    .subscribe((securityImpactResponse: HttpResponse<SecurityImpactMgm>) => {
                        const securityImpact: SecurityImpactMgm = securityImpactResponse.body;
                        this.ngbModalRef = this.securityImpactModalRef(component, securityImpact);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.securityImpactModalRef(component, new SecurityImpactMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    securityImpactModalRef(component: Component, securityImpact: SecurityImpactMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.securityImpact = securityImpact;
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
