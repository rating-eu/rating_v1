import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CompanyProfileMgm } from './company-profile-mgm.model';
import { CompanyProfileMgmService } from './company-profile-mgm.service';

@Injectable()
export class CompanyProfileMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private companyProfileService: CompanyProfileMgmService

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
                this.companyProfileService.find(id)
                    .subscribe((companyProfileResponse: HttpResponse<CompanyProfileMgm>) => {
                        const companyProfile: CompanyProfileMgm = companyProfileResponse.body;
                        companyProfile.created = this.datePipe
                            .transform(companyProfile.created, 'yyyy-MM-ddTHH:mm:ss');
                        companyProfile.modified = this.datePipe
                            .transform(companyProfile.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.companyProfileModalRef(component, companyProfile);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.companyProfileModalRef(component, new CompanyProfileMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    companyProfileModalRef(component: Component, companyProfile: CompanyProfileMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.companyProfile = companyProfile;
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
