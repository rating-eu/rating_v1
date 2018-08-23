import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { ExternalAuditMgm } from './external-audit-mgm.model';
import { ExternalAuditMgmService } from './external-audit-mgm.service';

@Injectable()
export class ExternalAuditMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private externalAuditService: ExternalAuditMgmService

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
                this.externalAuditService.find(id)
                    .subscribe((externalAuditResponse: HttpResponse<ExternalAuditMgm>) => {
                        const externalAudit: ExternalAuditMgm = externalAuditResponse.body;
                        this.ngbModalRef = this.externalAuditModalRef(component, externalAudit);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.externalAuditModalRef(component, new ExternalAuditMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    externalAuditModalRef(component: Component, externalAudit: ExternalAuditMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.externalAudit = externalAudit;
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
