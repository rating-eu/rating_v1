import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { PhaseWrapperMgm } from './phase-wrapper-mgm.model';
import { PhaseWrapperMgmService } from './phase-wrapper-mgm.service';

@Injectable()
export class PhaseWrapperMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private phaseWrapperService: PhaseWrapperMgmService

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
                this.phaseWrapperService.find(id)
                    .subscribe((phaseWrapperResponse: HttpResponse<PhaseWrapperMgm>) => {
                        const phaseWrapper: PhaseWrapperMgm = phaseWrapperResponse.body;
                        this.ngbModalRef = this.phaseWrapperModalRef(component, phaseWrapper);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.phaseWrapperModalRef(component, new PhaseWrapperMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    phaseWrapperModalRef(component: Component, phaseWrapper: PhaseWrapperMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.phaseWrapper = phaseWrapper;
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
