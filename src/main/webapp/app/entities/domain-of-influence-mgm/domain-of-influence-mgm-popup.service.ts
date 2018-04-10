import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DomainOfInfluenceMgm } from './domain-of-influence-mgm.model';
import { DomainOfInfluenceMgmService } from './domain-of-influence-mgm.service';

@Injectable()
export class DomainOfInfluenceMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private domainOfInfluenceService: DomainOfInfluenceMgmService

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
                this.domainOfInfluenceService.find(id)
                    .subscribe((domainOfInfluenceResponse: HttpResponse<DomainOfInfluenceMgm>) => {
                        const domainOfInfluence: DomainOfInfluenceMgm = domainOfInfluenceResponse.body;
                        this.ngbModalRef = this.domainOfInfluenceModalRef(component, domainOfInfluence);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.domainOfInfluenceModalRef(component, new DomainOfInfluenceMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    domainOfInfluenceModalRef(component: Component, domainOfInfluence: DomainOfInfluenceMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.domainOfInfluence = domainOfInfluence;
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
