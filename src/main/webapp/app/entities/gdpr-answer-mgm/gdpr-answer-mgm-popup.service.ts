import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { GDPRAnswerMgm } from './gdpr-answer-mgm.model';
import { GDPRAnswerMgmService } from './gdpr-answer-mgm.service';

@Injectable()
export class GDPRAnswerMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private gDPRAnswerService: GDPRAnswerMgmService

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
                this.gDPRAnswerService.find(id)
                    .subscribe((gDPRAnswerResponse: HttpResponse<GDPRAnswerMgm>) => {
                        const gDPRAnswer: GDPRAnswerMgm = gDPRAnswerResponse.body;
                        this.ngbModalRef = this.gDPRAnswerModalRef(component, gDPRAnswer);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.gDPRAnswerModalRef(component, new GDPRAnswerMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    gDPRAnswerModalRef(component: Component, gDPRAnswer: GDPRAnswerMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.gDPRAnswer = gDPRAnswer;
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
