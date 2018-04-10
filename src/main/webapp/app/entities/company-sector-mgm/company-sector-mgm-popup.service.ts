import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CompanySectorMgm } from './company-sector-mgm.model';
import { CompanySectorMgmService } from './company-sector-mgm.service';

@Injectable()
export class CompanySectorMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private companySectorService: CompanySectorMgmService

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
                this.companySectorService.find(id)
                    .subscribe((companySectorResponse: HttpResponse<CompanySectorMgm>) => {
                        const companySector: CompanySectorMgm = companySectorResponse.body;
                        companySector.created = this.datePipe
                            .transform(companySector.created, 'yyyy-MM-ddTHH:mm:ss');
                        companySector.modified = this.datePipe
                            .transform(companySector.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.companySectorModalRef(component, companySector);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.companySectorModalRef(component, new CompanySectorMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    companySectorModalRef(component: Component, companySector: CompanySectorMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.companySector = companySector;
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
