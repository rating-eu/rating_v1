import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { MyCompanyMgm } from './my-company-mgm.model';
import { MyCompanyMgmService } from './my-company-mgm.service';

@Injectable()
export class MyCompanyMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private myCompanyService: MyCompanyMgmService

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
                this.myCompanyService.find(id)
                    .subscribe((myCompanyResponse: HttpResponse<MyCompanyMgm>) => {
                        const myCompany: MyCompanyMgm = myCompanyResponse.body;
                        this.ngbModalRef = this.myCompanyModalRef(component, myCompany);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.myCompanyModalRef(component, new MyCompanyMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    myCompanyModalRef(component: Component, myCompany: MyCompanyMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.myCompany = myCompany;
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
