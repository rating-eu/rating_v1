import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CompanyGroupMgm } from './company-group-mgm.model';
import { CompanyGroupMgmService } from './company-group-mgm.service';

@Injectable()
export class CompanyGroupMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private companyGroupService: CompanyGroupMgmService

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
                this.companyGroupService.find(id)
                    .subscribe((companyGroupResponse: HttpResponse<CompanyGroupMgm>) => {
                        const companyGroup: CompanyGroupMgm = companyGroupResponse.body;
                        companyGroup.created = this.datePipe
                            .transform(companyGroup.created, 'yyyy-MM-ddTHH:mm:ss');
                        companyGroup.modified = this.datePipe
                            .transform(companyGroup.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.companyGroupModalRef(component, companyGroup);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.companyGroupModalRef(component, new CompanyGroupMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    companyGroupModalRef(component: Component, companyGroup: CompanyGroupMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.companyGroup = companyGroup;
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
