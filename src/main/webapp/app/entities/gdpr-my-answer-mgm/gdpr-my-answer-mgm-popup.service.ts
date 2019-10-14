import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { GDPRMyAnswerMgm } from './gdpr-my-answer-mgm.model';
import { GDPRMyAnswerMgmService } from './gdpr-my-answer-mgm.service';

@Injectable()
export class GDPRMyAnswerMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private gDPRMyAnswerService: GDPRMyAnswerMgmService

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
                this.gDPRMyAnswerService.find(id)
                    .subscribe((gDPRMyAnswerResponse: HttpResponse<GDPRMyAnswerMgm>) => {
                        const gDPRMyAnswer: GDPRMyAnswerMgm = gDPRMyAnswerResponse.body;
                        this.ngbModalRef = this.gDPRMyAnswerModalRef(component, gDPRMyAnswer);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.gDPRMyAnswerModalRef(component, new GDPRMyAnswerMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    gDPRMyAnswerModalRef(component: Component, gDPRMyAnswer: GDPRMyAnswerMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.gDPRMyAnswer = gDPRMyAnswer;
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
