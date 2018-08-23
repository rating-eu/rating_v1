import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SplittingLossMgm } from './splitting-loss-mgm.model';
import { SplittingLossMgmService } from './splitting-loss-mgm.service';

@Injectable()
export class SplittingLossMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private splittingLossService: SplittingLossMgmService

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
                this.splittingLossService.find(id)
                    .subscribe((splittingLossResponse: HttpResponse<SplittingLossMgm>) => {
                        const splittingLoss: SplittingLossMgm = splittingLossResponse.body;
                        this.ngbModalRef = this.splittingLossModalRef(component, splittingLoss);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.splittingLossModalRef(component, new SplittingLossMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    splittingLossModalRef(component: Component, splittingLoss: SplittingLossMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.splittingLoss = splittingLoss;
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
