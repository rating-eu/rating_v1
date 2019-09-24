import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DataRecipientMgm } from './data-recipient-mgm.model';
import { DataRecipientMgmService } from './data-recipient-mgm.service';

@Injectable()
export class DataRecipientMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private dataRecipientService: DataRecipientMgmService

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
                this.dataRecipientService.find(id)
                    .subscribe((dataRecipientResponse: HttpResponse<DataRecipientMgm>) => {
                        const dataRecipient: DataRecipientMgm = dataRecipientResponse.body;
                        this.ngbModalRef = this.dataRecipientModalRef(component, dataRecipient);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.dataRecipientModalRef(component, new DataRecipientMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    dataRecipientModalRef(component: Component, dataRecipient: DataRecipientMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.dataRecipient = dataRecipient;
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
