import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { QuestionRelevanceMgm } from './question-relevance-mgm.model';
import { QuestionRelevanceMgmService } from './question-relevance-mgm.service';

@Injectable()
export class QuestionRelevanceMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionRelevanceService: QuestionRelevanceMgmService

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
                this.questionRelevanceService.find(id)
                    .subscribe((questionRelevanceResponse: HttpResponse<QuestionRelevanceMgm>) => {
                        const questionRelevance: QuestionRelevanceMgm = questionRelevanceResponse.body;
                        this.ngbModalRef = this.questionRelevanceModalRef(component, questionRelevance);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionRelevanceModalRef(component, new QuestionRelevanceMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionRelevanceModalRef(component: Component, questionRelevance: QuestionRelevanceMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionRelevance = questionRelevance;
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
