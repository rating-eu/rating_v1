import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LevelWrapperMgm } from './level-wrapper-mgm.model';
import { LevelWrapperMgmService } from './level-wrapper-mgm.service';

@Injectable()
export class LevelWrapperMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private levelWrapperService: LevelWrapperMgmService

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
                this.levelWrapperService.find(id)
                    .subscribe((levelWrapperResponse: HttpResponse<LevelWrapperMgm>) => {
                        const levelWrapper: LevelWrapperMgm = levelWrapperResponse.body;
                        this.ngbModalRef = this.levelWrapperModalRef(component, levelWrapper);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.levelWrapperModalRef(component, new LevelWrapperMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    levelWrapperModalRef(component: Component, levelWrapper: LevelWrapperMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.levelWrapper = levelWrapper;
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
