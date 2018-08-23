import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { LikelihoodScaleMgmService } from './likelihood-scale-mgm.service';

@Injectable()
export class LikelihoodScaleMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private likelihoodScaleService: LikelihoodScaleMgmService

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
                this.likelihoodScaleService.find(id)
                    .subscribe((likelihoodScaleResponse: HttpResponse<LikelihoodScaleMgm>) => {
                        const likelihoodScale: LikelihoodScaleMgm = likelihoodScaleResponse.body;
                        this.ngbModalRef = this.likelihoodScaleModalRef(component, likelihoodScale);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.likelihoodScaleModalRef(component, new LikelihoodScaleMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    likelihoodScaleModalRef(component: Component, likelihoodScale: LikelihoodScaleMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.likelihoodScale = likelihoodScale;
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
