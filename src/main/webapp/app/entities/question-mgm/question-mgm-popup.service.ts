import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { QuestionMgm } from './question-mgm.model';
import { QuestionMgmService } from './question-mgm.service';

@Injectable()
export class QuestionMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private questionService: QuestionMgmService

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
                this.questionService.find(id)
                    .subscribe((questionResponse: HttpResponse<QuestionMgm>) => {
                        const question: QuestionMgm = questionResponse.body;
                        question.created = this.datePipe
                            .transform(question.created, 'yyyy-MM-ddTHH:mm:ss');
                        question.modified = this.datePipe
                            .transform(question.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.questionModalRef(component, question);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionModalRef(component, new QuestionMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionModalRef(component: Component, question: QuestionMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.question = question;
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
