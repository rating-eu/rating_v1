import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { ImpactLevelDescriptionMgm } from './impact-level-description-mgm.model';
import { ImpactLevelDescriptionMgmService } from './impact-level-description-mgm.service';

@Injectable()
export class ImpactLevelDescriptionMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private impactLevelDescriptionService: ImpactLevelDescriptionMgmService

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
                this.impactLevelDescriptionService.find(id)
                    .subscribe((impactLevelDescriptionResponse: HttpResponse<ImpactLevelDescriptionMgm>) => {
                        const impactLevelDescription: ImpactLevelDescriptionMgm = impactLevelDescriptionResponse.body;
                        this.ngbModalRef = this.impactLevelDescriptionModalRef(component, impactLevelDescription);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.impactLevelDescriptionModalRef(component, new ImpactLevelDescriptionMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    impactLevelDescriptionModalRef(component: Component, impactLevelDescription: ImpactLevelDescriptionMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.impactLevelDescription = impactLevelDescription;
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
