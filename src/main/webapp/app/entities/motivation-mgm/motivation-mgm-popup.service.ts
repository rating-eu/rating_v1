import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MotivationMgm } from './motivation-mgm.model';
import { MotivationMgmService } from './motivation-mgm.service';

@Injectable()
export class MotivationMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private motivationService: MotivationMgmService

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
                this.motivationService.find(id)
                    .subscribe((motivationResponse: HttpResponse<MotivationMgm>) => {
                        const motivation: MotivationMgm = motivationResponse.body;
                        motivation.created = this.datePipe
                            .transform(motivation.created, 'yyyy-MM-ddTHH:mm:ss');
                        motivation.modified = this.datePipe
                            .transform(motivation.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.motivationModalRef(component, motivation);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.motivationModalRef(component, new MotivationMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    motivationModalRef(component: Component, motivation: MotivationMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.motivation = motivation;
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
