import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { ImpactLevelMgm } from './impact-level-mgm.model';
import { ImpactLevelMgmService } from './impact-level-mgm.service';

@Injectable()
export class ImpactLevelMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private impactLevelService: ImpactLevelMgmService

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
                this.impactLevelService.find(id)
                    .subscribe((impactLevelResponse: HttpResponse<ImpactLevelMgm>) => {
                        const impactLevel: ImpactLevelMgm = impactLevelResponse.body;
                        this.ngbModalRef = this.impactLevelModalRef(component, impactLevel);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.impactLevelModalRef(component, new ImpactLevelMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    impactLevelModalRef(component: Component, impactLevel: ImpactLevelMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.impactLevel = impactLevel;
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
