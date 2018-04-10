import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { AssetCategoryMgm } from './asset-category-mgm.model';
import { AssetCategoryMgmService } from './asset-category-mgm.service';

@Injectable()
export class AssetCategoryMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private assetCategoryService: AssetCategoryMgmService

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
                this.assetCategoryService.find(id)
                    .subscribe((assetCategoryResponse: HttpResponse<AssetCategoryMgm>) => {
                        const assetCategory: AssetCategoryMgm = assetCategoryResponse.body;
                        this.ngbModalRef = this.assetCategoryModalRef(component, assetCategory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.assetCategoryModalRef(component, new AssetCategoryMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    assetCategoryModalRef(component: Component, assetCategory: AssetCategoryMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.assetCategory = assetCategory;
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
