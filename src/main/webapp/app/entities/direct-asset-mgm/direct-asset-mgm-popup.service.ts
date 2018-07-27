import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DirectAssetMgm } from './direct-asset-mgm.model';
import { DirectAssetMgmService } from './direct-asset-mgm.service';

@Injectable()
export class DirectAssetMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private directAssetService: DirectAssetMgmService

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
                this.directAssetService.find(id)
                    .subscribe((directAssetResponse: HttpResponse<DirectAssetMgm>) => {
                        const directAsset: DirectAssetMgm = directAssetResponse.body;
                        this.ngbModalRef = this.directAssetModalRef(component, directAsset);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.directAssetModalRef(component, new DirectAssetMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    directAssetModalRef(component: Component, directAsset: DirectAssetMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.directAsset = directAsset;
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
