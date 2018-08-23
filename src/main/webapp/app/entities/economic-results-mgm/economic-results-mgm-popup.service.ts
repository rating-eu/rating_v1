import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { EconomicResultsMgm } from './economic-results-mgm.model';
import { EconomicResultsMgmService } from './economic-results-mgm.service';

@Injectable()
export class EconomicResultsMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private economicResultsService: EconomicResultsMgmService

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
                this.economicResultsService.find(id)
                    .subscribe((economicResultsResponse: HttpResponse<EconomicResultsMgm>) => {
                        const economicResults: EconomicResultsMgm = economicResultsResponse.body;
                        this.ngbModalRef = this.economicResultsModalRef(component, economicResults);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.economicResultsModalRef(component, new EconomicResultsMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    economicResultsModalRef(component: Component, economicResults: EconomicResultsMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.economicResults = economicResults;
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
