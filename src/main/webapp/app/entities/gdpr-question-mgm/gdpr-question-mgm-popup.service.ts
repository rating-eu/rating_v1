import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { GDPRQuestionMgm } from './gdpr-question-mgm.model';
import { GDPRQuestionMgmService } from './gdpr-question-mgm.service';

@Injectable()
export class GDPRQuestionMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private gDPRQuestionService: GDPRQuestionMgmService

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
                this.gDPRQuestionService.find(id)
                    .subscribe((gDPRQuestionResponse: HttpResponse<GDPRQuestionMgm>) => {
                        const gDPRQuestion: GDPRQuestionMgm = gDPRQuestionResponse.body;
                        this.ngbModalRef = this.gDPRQuestionModalRef(component, gDPRQuestion);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.gDPRQuestionModalRef(component, new GDPRQuestionMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    gDPRQuestionModalRef(component: Component, gDPRQuestion: GDPRQuestionMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.gDPRQuestion = gDPRQuestion;
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
