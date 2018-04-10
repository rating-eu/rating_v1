import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AssetMgm } from './asset-mgm.model';
import { AssetMgmService } from './asset-mgm.service';

@Injectable()
export class AssetMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private assetService: AssetMgmService

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
                this.assetService.find(id)
                    .subscribe((assetResponse: HttpResponse<AssetMgm>) => {
                        const asset: AssetMgm = assetResponse.body;
                        asset.created = this.datePipe
                            .transform(asset.created, 'yyyy-MM-ddTHH:mm:ss');
                        asset.modified = this.datePipe
                            .transform(asset.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.assetModalRef(component, asset);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.assetModalRef(component, new AssetMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    assetModalRef(component: Component, asset: AssetMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.asset = asset;
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
