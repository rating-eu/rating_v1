import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { AnswerWeightMgm } from './answer-weight-mgm.model';
import { AnswerWeightMgmService } from './answer-weight-mgm.service';

@Injectable()
export class AnswerWeightMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private answerWeightService: AnswerWeightMgmService

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
                this.answerWeightService.find(id)
                    .subscribe((answerWeightResponse: HttpResponse<AnswerWeightMgm>) => {
                        const answerWeight: AnswerWeightMgm = answerWeightResponse.body;
                        this.ngbModalRef = this.answerWeightModalRef(component, answerWeight);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.answerWeightModalRef(component, new AnswerWeightMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    answerWeightModalRef(component: Component, answerWeight: AnswerWeightMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.answerWeight = answerWeight;
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
