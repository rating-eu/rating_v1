import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DataImpactDescriptionMgm } from './data-impact-description-mgm.model';
import { DataImpactDescriptionMgmService } from './data-impact-description-mgm.service';

@Injectable()
export class DataImpactDescriptionMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private dataImpactDescriptionService: DataImpactDescriptionMgmService

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
                this.dataImpactDescriptionService.find(id)
                    .subscribe((dataImpactDescriptionResponse: HttpResponse<DataImpactDescriptionMgm>) => {
                        const dataImpactDescription: DataImpactDescriptionMgm = dataImpactDescriptionResponse.body;
                        this.ngbModalRef = this.dataImpactDescriptionModalRef(component, dataImpactDescription);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.dataImpactDescriptionModalRef(component, new DataImpactDescriptionMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    dataImpactDescriptionModalRef(component: Component, dataImpactDescription: DataImpactDescriptionMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.dataImpactDescription = dataImpactDescription;
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
