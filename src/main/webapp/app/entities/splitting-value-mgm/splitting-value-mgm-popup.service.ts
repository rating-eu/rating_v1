import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SplittingValueMgm } from './splitting-value-mgm.model';
import { SplittingValueMgmService } from './splitting-value-mgm.service';

@Injectable()
export class SplittingValueMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private splittingValueService: SplittingValueMgmService

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
                this.splittingValueService.find(id)
                    .subscribe((splittingValueResponse: HttpResponse<SplittingValueMgm>) => {
                        const splittingValue: SplittingValueMgm = splittingValueResponse.body;
                        this.ngbModalRef = this.splittingValueModalRef(component, splittingValue);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.splittingValueModalRef(component, new SplittingValueMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    splittingValueModalRef(component: Component, splittingValue: SplittingValueMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.splittingValue = splittingValue;
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
