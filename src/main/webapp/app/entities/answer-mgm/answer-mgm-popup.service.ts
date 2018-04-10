import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AnswerMgm } from './answer-mgm.model';
import { AnswerMgmService } from './answer-mgm.service';

@Injectable()
export class AnswerMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private answerService: AnswerMgmService

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
                this.answerService.find(id)
                    .subscribe((answerResponse: HttpResponse<AnswerMgm>) => {
                        const answer: AnswerMgm = answerResponse.body;
                        answer.created = this.datePipe
                            .transform(answer.created, 'yyyy-MM-ddTHH:mm:ss');
                        answer.modified = this.datePipe
                            .transform(answer.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.answerModalRef(component, answer);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.answerModalRef(component, new AnswerMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    answerModalRef(component: Component, answer: AnswerMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.answer = answer;
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
