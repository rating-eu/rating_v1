import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { EBITMgm } from './ebit-mgm.model';
import { EBITMgmService } from './ebit-mgm.service';

@Injectable()
export class EBITMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private eBITService: EBITMgmService

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
                this.eBITService.find(id)
                    .subscribe((eBITResponse: HttpResponse<EBITMgm>) => {
                        const eBIT: EBITMgm = eBITResponse.body;
                        eBIT.created = this.datePipe
                            .transform(eBIT.created, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.eBITModalRef(component, eBIT);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eBITModalRef(component, new EBITMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    eBITModalRef(component: Component, eBIT: EBITMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eBIT = eBIT;
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
